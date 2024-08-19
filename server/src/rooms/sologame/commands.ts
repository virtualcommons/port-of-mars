import _ from "lodash";
import { Command } from "@colyseus/command";
import { User } from "@port-of-mars/server/entity";
import { SoloGameRoom } from "@port-of-mars/server/rooms/sologame";
import { getServices } from "@port-of-mars/server/services";
import { getRandomIntInclusive } from "@port-of-mars/server/util";
import { EventCard, TreatmentParams } from "./state";
import { SoloGameStatus } from "@port-of-mars/shared/sologame";

abstract class Cmd<Payload> extends Command<SoloGameRoom, Payload> {
  get defaultParams() {
    return this.state.defaultParams;
  }
}
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
    const cards = (await service.drawEventCardDeck(this.state.type)).map(
      data => new EventCard(data)
    );
    if (this.state.type === "prolific_variable") {
      // prolific configuration uses a fixed deck
      this.state.eventCardDeck.push(...cards);
    } else {
      const shuffledCards = _.shuffle(cards);
      this.state.eventCardDeck.push(...shuffledCards);
    }
  }
}

export class SetTreatmentParamsCmd extends Cmd<{ user: User }> {
  async execute({ user } = this.payload) {
    const { sologame: service } = getServices();
    if (this.state.type === "freeplay") {
      this.state.treatmentParams = new TreatmentParams(
        await service.getUserNextFreeplayTreatment(user.id)
      );
    } else {
      this.state.treatmentParams = new TreatmentParams(
        await service.getRandomTreatment(this.state.type)
      );
    }
  }
}

export class SetGameParamsCmd extends CmdWithoutPayload {
  execute() {
    const defaults = this.defaultParams;
    this.state.maxRound = getRandomIntInclusive(defaults.maxRound.min, defaults.maxRound.max);
    this.state.twoEventsThreshold = getRandomIntInclusive(
      defaults.twoEventsThreshold.min,
      defaults.twoEventsThreshold.max
    );
    // this formula may need tweaking
    const threeEventsThresholdMax = Math.min(
      defaults.threeEventsThreshold.max,
      this.state.twoEventsThreshold - 3
    );
    this.state.threeEventsThreshold = getRandomIntInclusive(
      defaults.threeEventsThreshold.min,
      threeEventsThresholdMax
    );
    this.state.updateVisibleCards();
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
    const defaults = this.defaultParams;
    this.state.round = 1;
    this.state.systemHealth = defaults.systemHealthMax - defaults.systemHealthWear;
    this.state.timeRemaining = defaults.timeRemaining;
    this.state.player.resources = defaults.resources;
    this.state.updateRoundInitialValues();
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
    if (this.state.treatmentParams.isNumberOfRoundsKnown) {
      data.maxRound = this.state.maxRound;
    }
    if (this.state.treatmentParams.thresholdInformation === "known") {
      data.twoEventsThreshold = this.state.twoEventsThreshold;
      data.threeEventsThreshold = this.state.threeEventsThreshold;
    } else if (this.state.treatmentParams.thresholdInformation === "range") {
      data.twoEventsThresholdRange = this.defaultParams.twoEventsThreshold;
      data.threeEventsThresholdRange = this.defaultParams.threeEventsThreshold;
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
      this.state.activeCardId >= 0 &&
      this.state.status === "incomplete" &&
      this.state.systemHealth > 0
    );
  }

  async execute({ playerSkipped } = this.payload) {
    if (!this.state.activeCard) return;

    if (playerSkipped) {
      this.room.eventTimeout?.clear();
    }

    if (this.state.player.points < -this.state.activeCard.pointsEffect) {
      this.state.player.points = 0; // prevent overflow
    } else {
      this.state.player.points += this.state.activeCard.pointsEffect;
    }

    if (this.state.player.resources < -this.state.activeCard.resourcesEffect) {
      this.state.player.resources = 0;
    } else {
      this.state.player.resources += this.state.activeCard.resourcesEffect;
    }
    // system health shouldn't go above the max or below 0
    this.state.systemHealth = Math.max(
      0,
      Math.min(
        this.defaultParams.systemHealthMax,
        this.state.systemHealth + this.state.activeCard.systemHealthEffect
      )
    );

    this.state.activeCard.expired = true; // expire the card
    this.state.updateVisibleCards();

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
    const nextRoundCard = this.state.nextRoundCard;
    if (nextRoundCard) {
      this.state.activeCardId = nextRoundCard.deckCardId;
      return new StartEventTimerCmd();
    } else {
      this.state.canInvest = true;
      this.state.activeCardId = -1;
    }
  }
}

export class StartEventTimerCmd extends CmdWithoutPayload {
  execute() {
    this.room.eventTimeout = this.clock.setTimeout(() => {
      this.room.dispatcher.dispatch(new ApplyCardCmd().setPayload({ playerSkipped: true }));
    }, this.defaultParams.eventTimeout * 1000);
  }
}

export class DrawCardsCmd extends CmdWithoutPayload {
  execute() {
    let drawCount = this.getDrawCount();
    this.drawRoundCards(drawCount);
    // draw 2 more if murphy's law is in play
    if (this.state.roundEventCards.some(card => card.isMurphysLaw)) {
      drawCount += 2;
      this.drawRoundCards(2);
    }
    this.state.timeRemaining += this.defaultParams.eventTimeout * drawCount;
    const nextRoundCard = this.state.nextRoundCard;
    if (nextRoundCard) {
      this.state.activeCardId = nextRoundCard.deckCardId;
    } else {
      this.state.activeCardId = -1;
    }
    this.state.updateVisibleCards();
    return new StartEventTimerCmd();
  }

  drawRoundCards(count: number) {
    let drawn = 0;
    for (const card of this.state.upcomingEventCards) {
      if (drawn === count) {
        break;
      }
      card.inPlay = true;
      drawn++;
    }
  }

  getDrawCount() {
    if (this.state.systemHealth > this.state.twoEventsThreshold) return 1;
    if (this.state.systemHealth > this.state.threeEventsThreshold) return 2;
    return 3;
  }
}

export class InvestCmd extends Cmd<{ systemHealthInvestment: number }> {
  validate({ systemHealthInvestment } = this.payload) {
    return this.state.canInvest && systemHealthInvestment <= this.state.resources;
  }

  async execute({ systemHealthInvestment } = this.payload) {
    const surplus = this.state.resources - systemHealthInvestment;
    this.state.systemHealth = Math.min(
      this.defaultParams.systemHealthMax,
      this.state.systemHealth + systemHealthInvestment
    );
    this.state.player.points += surplus;
    // wait a bit for the round transition so we can see the investment before deducting wear+tear
    this.state.timeRemaining = this.defaultParams.roundTransitionDuration;
    this.state.isRoundTransitioning = true;
    this.state.canInvest = false;
    await new Promise(resolve =>
      setTimeout(resolve, this.defaultParams.roundTransitionDuration * 1000)
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

    const defaults = this.defaultParams;

    if (this.state.round + 1 > this.state.maxRound) {
      return new EndGameCmd().setPayload({ status: "victory" });
    }

    this.state.round += 1;
    this.state.systemHealth = Math.max(0, this.state.systemHealth - defaults.systemHealthWear);
    this.state.updateRoundInitialValues();

    if (this.state.systemHealth <= 0) {
      return new EndGameCmd().setPayload({ status: "defeat" });
    }

    this.state.player.resources = defaults.resources;
    this.state.timeRemaining = defaults.timeRemaining;

    this.state.eventCardDeck.forEach(card => {
      card.inPlay = false;
    });
    this.state.updateVisibleCards();
    if (this.state.upcomingEventCards.length > 0) {
      return new DrawCardsCmd();
    } else {
      this.state.canInvest = true;
      this.state.activeCardId = -1;
    }
  }
}

export class EndGameCmd extends Cmd<{ status: SoloGameStatus }> {
  async execute({ status } = this.payload) {
    this.clock.clear();
    // wait for a few seconds so the client can see the final state
    await new Promise(resolve => setTimeout(resolve, 3000));

    this.state.status = status;
    const { sologame: service } = getServices();
    await service.updateGameStatus(this.state.gameId, status);
    await service.updatePlayerPoints(
      this.state.gameId,
      this.state.player.points,
      this.state.maxRound,
      this.state.status
    );

    // wait for the update to be sent to the client
    await new Promise(resolve => setTimeout(resolve, 5000));
    this.room.disconnect();
  }
}
