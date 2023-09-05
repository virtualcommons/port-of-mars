import _ from "lodash";
import { Command } from "@colyseus/command";
import { User } from "@port-of-mars/server/entity";
import { SoloGameRoom } from "@port-of-mars/server/rooms/sologame";
import { getServices } from "@port-of-mars/server/services";
import { getRandomIntInclusive } from "@port-of-mars/server/util";
import { EventCard, SoloGameState, TreatmentParams } from "./state";
import { SoloGameStatus } from "@port-of-mars/shared/sologame";

abstract class Cmd<Payload> extends Command<SoloGameRoom, Payload> {}
abstract class CmdWithoutPayload extends Cmd<Record<string, never>> {}

export class InitGameCmd extends Cmd<{ user: User }> {
  execute({ user } = this.payload) {
    return [
      new SetPlayerCmd().setPayload({ user }),
      new CreateDeckCmd(),
      new SetTreatmentParamsCmd().setPayload({ user }),
      new SetGameParamsCmd(),
      new PersistGameCmd(),
      new SetFirstRoundCmd(),
    ];
  }
}

export class SetPlayerCmd extends Cmd<{ user: User }> {
  execute({ user } = this.payload) {
    this.state.player.assign({
      userId: user.id,
      username: user.username,
      points: 0,
    });
  }
}

export class CreateDeckCmd extends CmdWithoutPayload {
  async execute() {
    const { sologame: service } = getServices();
    const cards = _.shuffle(await service.drawEventCardDeck()).map(data => new EventCard(data));
    this.state.eventCardDeck.push(...cards);
  }
}

export class SetTreatmentParamsCmd extends Cmd<{ user: User }> {
  async execute({ user } = this.payload) {
    const { sologame: service } = getServices();
    // pick a random (unseen, if user hasn't been through them all) treatment configuration
    const treatmentIds = await service.getUserRemainingTreatments(user.id);
    if (treatmentIds.length > 0) {
      const treatmentId = treatmentIds[Math.floor(Math.random() * treatmentIds.length)];
      this.state.treatmentParams = new TreatmentParams(await service.getTreatmentById(treatmentId));
    }
  }
}

export class SetGameParamsCmd extends CmdWithoutPayload {
  execute() {
    const defaults = SoloGameState.DEFAULTS;
    this.state.maxRound = getRandomIntInclusive(defaults.maxRound.min, defaults.maxRound.max);
    this.state.twoCardThreshold = getRandomIntInclusive(
      defaults.twoCardThreshold.min,
      defaults.twoCardThreshold.max
    );
    // this formula may need tweaking
    const threeCardThresholdMax = Math.min(
      defaults.threeCardThreshold.max,
      this.state.twoCardThreshold - 3
    );
    this.state.threeCardThreshold = getRandomIntInclusive(
      defaults.threeCardThreshold.min,
      threeCardThresholdMax
    );
  }
}

export class PersistGameCmd extends CmdWithoutPayload {
  async execute() {
    const { sologame: service } = getServices();
    const game = await service.createGame(this.state);
    this.state.gameId = game.id;
    // keep track of deck card db ids after persisting the deck
    this.state.eventCardDeck.forEach((card, index) => {
      card.deckCardId = game.deck.cards[index].id;
    });
  }
}

export class SetFirstRoundCmd extends CmdWithoutPayload {
  execute() {
    const defaults = SoloGameState.DEFAULTS;
    this.state.round = 1;
    this.state.systemHealth = defaults.systemHealthMax - defaults.systemHealthWear;
    this.state.timeRemaining = defaults.timeRemaining;
    this.state.player.resources = defaults.resources;
    this.state.isRoundTransitioning = false;

    return [new SendHiddenParamsCmd()];
  }
}

export class SendHiddenParamsCmd extends CmdWithoutPayload {
  execute() {
    const data: any = {};
    if (this.state.treatmentParams.isEventDeckKnown) {
      data.eventCardDeck = this.state.eventCardDeck.map(card => card.toJSON());
    }
    if (this.state.treatmentParams.isKnownNumberOfRounds) {
      data.maxRound = this.state.maxRound;
    }
    if (this.state.treatmentParams.thresholdInformation === "known") {
      data.twoCardThreshold = this.state.twoCardThreshold;
      data.threeCardThreshold = this.state.threeCardThreshold;
    } else if (this.state.treatmentParams.thresholdInformation === "range") {
      data.twoCardThresholdRange = SoloGameState.DEFAULTS.twoCardThreshold;
      data.threeCardThresholdRange = SoloGameState.DEFAULTS.threeCardThreshold;
    }
    this.room.client.send("set-hidden-params", {
      kind: "set-hidden-params",
      data,
    });
  }
}
export class ApplyCardCmd extends Cmd<{ playerSkipped: boolean }> {
  validate() {
    return (
      this.state.activeRoundCardIndex >= 0 &&
      this.state.activeRoundCardIndex < this.state.roundEventCards.length &&
      this.state.status === "incomplete"
    );
  }

  async execute({ playerSkipped } = this.payload) {
    if (playerSkipped) {
      this.room.eventTimeout?.clear();
    }

    if (this.state.player.points < -this.state.activeRoundCard!.pointsEffect) {
      this.state.player.points = 0; // prevent overflow
    } else {
      this.state.player.points += this.state.activeRoundCard!.pointsEffect;
    }

    if (this.state.player.resources < -this.state.activeRoundCard!.resourcesEffect) {
      this.state.player.resources = 0;
    } else {
      this.state.player.resources += this.state.activeRoundCard!.resourcesEffect;
    }
    // system health shouldn't go above the max or below 0
    this.state.systemHealth = Math.max(
      0,
      Math.min(
        SoloGameState.DEFAULTS.systemHealthMax,
        this.state.systemHealth + this.state.activeRoundCard!.systemHealthEffect
      )
    );

    if (this.state.systemHealth <= 0) {
      return [
        new PersistRoundCmd().setPayload({
          systemHealthInvestment: 0,
          pointsInvestment: 0,
        }),
        new EndGameCmd().setPayload({ status: "defeat" }),
      ];
    }

    // if we still have cards left, prepare the next one
    if (this.state.activeRoundCardIndex < this.state.roundEventCards.length - 1) {
      this.state.activeRoundCardIndex += 1;
      return new StartEventTimerCmd();
    } else {
      this.state.canInvest = true;
      this.state.activeRoundCardIndex = -1;
    }
  }
}

export class StartEventTimerCmd extends CmdWithoutPayload {
  execute() {
    this.room.eventTimeout = this.clock.setTimeout(() => {
      this.room.dispatcher.dispatch(new ApplyCardCmd().setPayload({ playerSkipped: true }));
    }, SoloGameState.DEFAULTS.eventTimeout * 1000);
  }
}

export class DrawCardsCmd extends CmdWithoutPayload {
  execute() {
    let drawCount = 1;
    if (this.state.systemHealth > this.state.twoCardThreshold) {
      drawCount = 1;
    } else if (this.state.systemHealth > this.state.threeCardThreshold) {
      drawCount = 2;
    } else {
      drawCount = 3;
    }
    // FIXME:
    // this crashes if we run out of cards, should find a way to handle that (rare) case
    // min of 30 cards max of 14 rounds, max of ~35 cards encountered though very unlikely
    this.state.roundEventCards.push(...this.state.eventCardDeck.splice(0, drawCount));
    // draw 2 more if murphy's law is in play
    if (this.state.roundEventCards.some(card => card.isMurphysLaw)) {
      drawCount += 2;
      this.state.roundEventCards.push(...this.state.eventCardDeck.splice(0, 2));
    }
    this.state.timeRemaining += SoloGameState.DEFAULTS.eventTimeout * drawCount;
    this.state.activeRoundCardIndex = 0;
    return new StartEventTimerCmd();
  }
}

export class InvestCmd extends Cmd<{ systemHealthInvestment: number }> {
  validate({ systemHealthInvestment } = this.payload) {
    return this.state.canInvest && systemHealthInvestment <= this.state.resources;
  }

  async execute({ systemHealthInvestment } = this.payload) {
    const surplus = this.state.resources - systemHealthInvestment;
    this.state.systemHealth = Math.min(
      SoloGameState.DEFAULTS.systemHealthMax,
      this.state.systemHealth + systemHealthInvestment
    );
    this.state.player.points += surplus;
    // wait a bit for the round transition so we can see the investment before deducting wear+tear
    this.state.timeRemaining = SoloGameState.DEFAULTS.roundTransitionDuration;
    this.state.isRoundTransitioning = true;
    this.state.canInvest = false;
    await new Promise(resolve =>
      setTimeout(resolve, SoloGameState.DEFAULTS.roundTransitionDuration * 1000)
    );
    return [
      new PersistRoundCmd().setPayload({
        systemHealthInvestment,
        pointsInvestment: surplus,
      }),
      new SetNextRoundCmd(),
    ];
  }
}

export class PersistRoundCmd extends Cmd<{
  systemHealthInvestment: number;
  pointsInvestment: number;
}> {
  async execute({ systemHealthInvestment, pointsInvestment } = this.payload) {
    const { sologame: service } = getServices();
    await service.createRound(this.state, systemHealthInvestment, pointsInvestment);
  }
}

export class SetNextRoundCmd extends CmdWithoutPayload {
  async execute() {
    this.state.canInvest = false; // disable investment until all cards are applied
    this.state.isRoundTransitioning = false;

    const defaults = SoloGameState.DEFAULTS;

    if (this.state.round + 1 > this.state.maxRound) {
      return new EndGameCmd().setPayload({ status: "victory" });
    }

    this.state.round += 1;
    this.state.systemHealth -= Math.max(defaults.systemHealthWear, 0);

    if (this.state.systemHealth <= 0) {
      return new EndGameCmd().setPayload({ status: "defeat" });
    }

    this.state.player.resources = defaults.resources;
    this.state.timeRemaining = defaults.timeRemaining;
    this.state.roundEventCards.splice(0, this.state.roundEventCards.length);
    return new DrawCardsCmd();
  }
}

export class EndGameCmd extends Cmd<{ status: SoloGameStatus }> {
  async execute({ status } = this.payload) {
    this.clock.clear();
    // wait for a few seconds so the client can see the final state
    await new Promise(resolve => setTimeout(resolve, 3000));

    const { sologame: service } = getServices();
    this.state.status = status;
    await service.updateGameStatus(this.state.gameId, status);
    await service.updatePlayerPoints(this.state.gameId, this.state.player.points);

    // wait for the update to be sent to the client
    await new Promise(resolve => setTimeout(resolve, 5000));
    this.room.disconnect();
  }
}
