import _ from "lodash";
import { Command } from "@colyseus/command";
import { LiteGameRoom } from "@port-of-mars/server/rooms/pomlite/multiplayer";
import { getServices } from "@port-of-mars/server/services";
import { getRandomIntInclusive } from "@port-of-mars/server/util";
import { EventCard, Player, TreatmentParams } from "./state";
import { LiteGameStatus } from "@port-of-mars/shared/lite";

abstract class Cmd<Payload> extends Command<LiteGameRoom, Payload> {
  get defaultParams() {
    return this.state.defaultParams;
  }
}
abstract class CmdWithoutPayload extends Cmd<Record<string, never>> {}

export class InitGameCmd extends CmdWithoutPayload {
  execute() {
    return [
      new CreateDeckCmd(),
      new SetTreatmentParamsCmd(),
      new SetGameParamsCmd(),
      new PersistGameCmd(),
      new WaitForPlayersCmd(),
      new StartGameLoopCmd(),
    ];
  }
}

export class StartGameLoopCmd extends CmdWithoutPayload {
  execute() {
    this.room.startGameLoop();
  }
}

export class CreateDeckCmd extends CmdWithoutPayload {
  async execute() {
    const { litegame } = getServices();
    const cards = (await litegame.drawEventCardDeck(this.state.type)).map(
      data => new EventCard(data)
    );
    if (this.state.type === "prolificVariable") {
      // prolific configuration uses a fixed deck
      this.state.eventCardDeck.push(...cards);
    } else {
      const shuffledCards = _.shuffle(cards);
      this.state.eventCardDeck.push(...shuffledCards);
    }
  }
}

export class SetTreatmentParamsCmd extends CmdWithoutPayload {
  async execute() {
    if (["prolificVariable", "prolificBaseline"].includes(this.state.type)) {
      this.state.treatmentParams = new TreatmentParams(
        await getServices().litegame.getRandomTreatmentFor(this.state.type)
      );
    } // freeplay currently isn't supported, add here if needed
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
    const { litegame, multiplayerStudy } = getServices();
    const game = await litegame.createGame(this.state);
    if (["prolificVariable", "prolificBaseline"].includes(this.state.type)) {
      await multiplayerStudy.setProlificParticipantPlayers(
        this.state.type,
        game.players,
        this.room.roomId
      );
    }
    this.state.gameId = game.id;
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

export class WaitForPlayersCmd extends CmdWithoutPayload {
  execute() {
    this.state.isWaitingToStart = true;
    this.state.timeRemaining = 45;
    this.state.players.forEach(p => (p.isReadyToStart = false));
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
      data.twoEventsThresholdRange =
        this.defaultParams.twoEventsThresholdDisplayRange || this.defaultParams.twoEventsThreshold;
      data.threeEventsThresholdRange =
        this.defaultParams.threeEventsThresholdDisplayRange ||
        this.defaultParams.threeEventsThreshold;
    }
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

    // scale system health effect by the number of players since it
    // is the shared resource
    const scaledSystemHealthEffect =
      this.state.numPlayers * this.state.activeCard.systemHealthEffect;
    // system health shouldn't go above the max or below 0
    this.state.systemHealth = Math.max(
      0,
      Math.min(
        this.defaultParams.systemHealthMax,
        this.state.systemHealth + scaledSystemHealthEffect
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
    player.hasInvested = !clockRanOut;
    player.pendingInvestment = systemHealthInvestment;
    // check if all players have a pending investment, if so, process the round
    if (Array.from(this.state.players.values()).every(p => p.pendingInvestment >= 0)) {
      this.state.canInvest = false;
      return [new ProcessRoundCmd()];
    }
  }
}

export class ProcessRoundCmd extends CmdWithoutPayload {
  async execute() {
    let totalSystemHealthInvestment = 0;
    this.state.players.forEach(player => {
      if (player.pendingInvestment >= 0) {
        // if the investment was caused by a timeout, the player invests nothing
        // and gets no points
        let surplus = 0;
        if (player.hasInvested) {
          surplus = player.resources - player.pendingInvestment;
        }
        totalSystemHealthInvestment += player.pendingInvestment;
        player.points += surplus;
        player.pointsEarned = surplus;
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
  async execute() {
    await getServices().litegame.createRound(this.state);
  }
}

export class SetNextRoundCmd extends CmdWithoutPayload {
  async execute() {
    this.state.canInvest = false; // disable investment until all cards are applied
    this.state.players.forEach(player => {
      // reset pending investment
      player.pendingInvestment = -1;
      player.hasInvested = false;
    });
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

export class EndGameCmd extends Cmd<{ status: LiteGameStatus; abandoned?: boolean }> {
  async execute({ status, abandoned } = this.payload) {
    this.clock.clear();

    if (!abandoned) {
      // wait for a few seconds so the client can see the final state
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    this.state.status = status;
    const players = Array.from(this.state.players.values()).map(player => ({
      userId: player.userId,
      points: player.points,
    }));
    const { litegame } = getServices();
    await litegame.updateGameStatus(this.state.gameId, status);
    await litegame.updatePlayerPoints(this.state.gameId, players, this.state.maxRound, status);

    if (abandoned) {
      this.room.disconnect();
    }

    // wait for the update to be sent to the client
    await new Promise(resolve => setTimeout(resolve, 5000));

    const nextGameType = this.defaultParams.nextGameType;
    if (nextGameType) {
      return new ResetGameStateCmd();
    } else {
      this.room.disconnect();
    }
  }
}

export class ResetGameStateCmd extends CmdWithoutPayload {
  execute() {
    const nextType = this.state.defaultParams.nextGameType;
    if (!nextType) return; // for safety

    this.state.gameId = 0;
    this.state.type = nextType;
    this.state.isWaitingToStart = true;
    this.state.timeRemaining = 45;

    this.state.eventCardDeck.length = 0;
    this.state.visibleEventCards.length = 0;
    this.state.activeCardId = -1;
    this.state.round = 1;
    this.state.status = "incomplete";
    this.state.systemHealth = 0;

    this.state.players.forEach(p => {
      p.resources = 0;
      p.points = 0;
      p.pendingInvestment = -1;
      p.pointsEarned = 0;
      p.hasInvested = false;
      p.isReadyToStart = false;
    });

    return new InitGameCmd();
  }
}
