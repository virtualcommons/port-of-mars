import _ from "lodash";
import { Command } from "@colyseus/command";
import { User } from "@port-of-mars/server/entity";
import { MultiplayerGameRoom } from "@port-of-mars/server/rooms/pomlite/multiplayer";
import { getServices } from "@port-of-mars/server/services";
import { getRandomIntInclusive } from "@port-of-mars/server/util";
import { EventCard, Player } from "./state";
import { LiteGameStatus } from "@port-of-mars/shared/lite";
import { Role } from "@port-of-mars/shared/types";

abstract class Cmd<Payload> extends Command<MultiplayerGameRoom, Payload> {
  get defaultParams() {
    return this.state.defaultParams;
  }
}
abstract class CmdWithoutPayload extends Cmd<Record<string, never>> {}

export class InitGameCmd extends CmdWithoutPayload {
  execute() {
    return [
      new CreateDeckCmd(),
      new SetGameParamsCmd(),
      new PersistGameCmd(),
      new SetFirstRoundCmd(),
      new BroadcastReadyCmd(),
    ];
  }
}

export class CreateDeckCmd extends CmdWithoutPayload {
  async execute() {
    const { sologame: service } = getServices();
    // FIXME: temporary, replace with the multiplayer draw
    const cards = (await service.drawEventCardDeck("prolificBaseline")).map(
      data => new EventCard(data)
    );
    if (this.state.type === "prolific") {
      // prolific configuration uses a fixed deck
      this.state.eventCardDeck.push(...cards);
    } else {
      const shuffledCards = _.shuffle(cards);
      this.state.eventCardDeck.push(...shuffledCards);
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
  // TODO: db is not finalized
  async execute() {
    // const { triogame, study } = getServices();
    // const game = await triogame.createGame(this.state);
    // if (this.state.type === "prolificVariable" || this.state.type === "prolificBaseline") {
    //   await study.setProlificParticipantPlayer(this.state.type, game.player);
    // }
    // this.state.gameId = game.id;
    // // keep track of deck card db ids after persisting the deck
    // this.state.eventCardDeck.forEach((card, index) => {
    //   card.deckCardId = game.deck.cards[index].id;
    // });
  }
}

export class SetFirstRoundCmd extends CmdWithoutPayload {
  execute() {
    const defaults = this.defaultParams;
    this.state.round = 1;
    this.state.systemHealth = defaults.startingSystemHealth;
    this.state.timeRemaining = defaults.timeRemaining;
    this.state.players.forEach(player => {
      player.resources = defaults.resources;
    });
    this.state.updateRoundInitialValues();
    this.state.isRoundTransitioning = false;
    this.state.canInvest = true;

    return [new SendHiddenParamsCmd()];
  }
}

export class BroadcastReadyCmd extends CmdWithoutPayload {
  execute() {
    this.room.broadcast("ready", { kind: "ready" });
  }
}

export class SendHiddenParamsCmd extends CmdWithoutPayload {
  // these aren't really hidden in this version
  execute() {
    const data: any = {};
    data.eventCardDeck = this.state.eventCardDeck.map(card => card.toJSON());
    data.maxRound = this.state.maxRound;
    data.twoEventsThreshold = this.state.twoEventsThreshold;
    data.threeEventsThreshold = this.state.threeEventsThreshold;
    this.room.clients.forEach(client => {
      client.send("set-hidden-params", {
        kind: "set-hidden-params",
        data,
      });
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

  // FIXME: there needs to be a lot more special-case handling here
  // for the cards that affect only certain players, require voting, etc.
  async execute({ playerSkipped } = this.payload) {
    if (!this.state.activeCard) return;

    if (playerSkipped) {
      this.room.eventTimeout?.clear();
    }

    this.state.players.forEach(player => {
      if (this.state.activeCard) {
        if (player.points < -this.state.activeCard.pointsEffect) {
          player.points = 0; // prevent overflow
        } else {
          player.points += this.state.activeCard.pointsEffect;
        }

        if (player.resources < -this.state.activeCard.resourcesEffect) {
          player.resources = 0;
        } else {
          player.resources += this.state.activeCard.resourcesEffect;
        }
      }
    });

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
      this.state.players.forEach(player => {
        (player.pendingInvestment = 0), (player.pointsEarned = 0);
      });
      return [new PersistRoundCmd(), new EndGameCmd().setPayload({ status: "defeat" })];
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
    if (this.state.systemHealth >= this.state.twoEventsThreshold) return 1;
    if (this.state.systemHealth >= this.state.threeEventsThreshold) return 2;
    return 3;
  }
}

export class PlayerInvestCmd extends Cmd<{
  systemHealthInvestment: number;
  clockRanOut?: boolean;
  player: Player;
}> {
  validate({ systemHealthInvestment, player } = this.payload) {
    return this.state.canInvest && systemHealthInvestment <= player.resources;
  }
  async execute({ systemHealthInvestment, clockRanOut, player } = this.payload) {
    player.pendingInvestment = systemHealthInvestment;
    // check if all players have a pending investment, if so, process the round
    if (Array.from(this.state.players.values()).every(p => p.pendingInvestment != null)) {
      this.state.canInvest = false;
      return [new ProcessRoundCmd()];
    }
  }
}

export class ProcessRoundCmd extends CmdWithoutPayload {
  async execute() {
    let totalSystemHealthInvestment = 0;
    this.state.players.forEach(player => {
      if (player.pendingInvestment != null) {
        totalSystemHealthInvestment += player.pendingInvestment;
        const surplus = player.resources - player.pendingInvestment;
        player.points += surplus;
        player.pointsEarned = surplus;
        // reset pending investment
        player.pendingInvestment = null;
      }
    });
    this.state.systemHealth = Math.min(
      this.defaultParams.systemHealthMax,
      this.state.systemHealth + totalSystemHealthInvestment
    );

    // wait a bit for the round transition so we can see the investment before deducting wear+tear
    this.state.timeRemaining = this.defaultParams.roundTransitionDuration;
    this.state.isRoundTransitioning = true;
    this.state.canInvest = false;
    await new Promise(resolve =>
      setTimeout(resolve, this.defaultParams.roundTransitionDuration * 1000)
    );
    this.state.systemHealth = Math.max(
      0,
      this.state.systemHealth - this.defaultParams.systemHealthWear
    );

    if (this.state.systemHealth <= 0) {
      return [new PersistRoundCmd(), new EndGameCmd().setPayload({ status: "defeat" })];
    }
    return [new PersistRoundCmd(), new SetNextRoundCmd()];
  }
}

export class PersistRoundCmd extends CmdWithoutPayload {
  // TODO: db is not finalized
  async execute() {
    // const { triogame: service } = getServices();
    // await service.createRound(this.state, systemHealthInvestment, pointsInvestment);
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
    this.state.updateRoundInitialValues();

    this.state.players.forEach(player => {
      player.resources = defaults.resources;
    });

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

export class EndGameCmd extends Cmd<{ status: LiteGameStatus }> {
  //FIXME: change the game type status
  async execute({ status } = this.payload) {
    this.clock.clear();
    // wait for a few seconds so the client can see the final state
    await new Promise(resolve => setTimeout(resolve, 3000));

    this.state.status = status;
    // TODO: db is not finalized
    // const { triogame: service } = getServices();
    // await service.updateGameStatus(this.state.gameId, status);
    this.state.players.forEach(async player => {
      // await service.updatePlayerPoints(
      //   this.state.gameId,
      //   player.points,
      //   this.state.maxRound,
      //   status
      // );
    });

    // wait for the update to be sent to the client
    await new Promise(resolve => setTimeout(resolve, 5000));
    this.room.disconnect();
  }
}
