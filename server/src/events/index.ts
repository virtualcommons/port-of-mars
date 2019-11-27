import {ChatMessageData, InvestmentData, Phase, Role} from "shared/types";
import {ChatMessage, GameState, MarsEvent, Player} from "@/state";
import {GameEvent} from "@/events/types";
import {AccomplishmentData} from "@/repositories/Accomplishment";

export class PlayerJoined implements GameEvent {
  constructor(public sessionId: string, public role: Role) {}

  apply(game: GameState) {
    game.connections[this.sessionId] = this.role;
  }
}

export class SentChatMessage implements GameEvent {
  constructor(public data: ChatMessageData) {}

  apply(game: GameState) {
    game.messages.push(new ChatMessage(this.data));
  }
}

export class BoughtAccomplishment implements GameEvent {
  constructor(public accomplishment: AccomplishmentData, public player: Player) {}

  apply(game: GameState): void {
    // this.player.accomplishment.buy(this.accomplishment);
  }
}

export class TimeInvested implements GameEvent {
  constructor(public data: InvestmentData, public role: Role) {}

  apply(game: GameState): void {
    game.players[this.role].invest(this.data);
  }
}

/*
 Phase Events
 */

export class LeftPreGamePhase implements GameEvent {
  apply(game: GameState): void {
    game.phase = Phase.invest;
    game.round += 1;
  }
}

export class LeftMarsEventPhase implements GameEvent {
  apply(game: GameState): void {
    game.phase = Phase.invest;
  }
}

export class LeftInvestmentPhase implements GameEvent {
  apply(game: GameState) {
    game.phase = Phase.trade;
  }
}

export class LeftTradePhase implements GameEvent {
  apply(game: GameState): void {
    game.phase = Phase.purchase;
  }
}

export class LeftPurchasePhase implements GameEvent {
  apply(game: GameState): void {
    game.phase = Phase.discard;
  }
}

export class DrewMarsEvents implements GameEvent {
  constructor(public marsEvents: Array<MarsEvent>) {}

  apply(game: GameState): void {
    // game.marsEvents.splice(0, game.marsEvents.length, ...this.marsEvents);
  }
}

export class LeftDiscardPhase implements GameEvent {
  constructor(public marsEvents: Array<MarsEvent> = []) {}

  apply(game: GameState): void {
    game.upkeep = game.nextRoundUpkeep();
    game.round += 1;

    if (game.upkeep <= 0) {
      game.phase = Phase.defeat;
      return;
    }

    if (game.round >= game.maxRound) {
      game.phase = Phase.victory;
      return;
    }

    game.phase = Phase.events;
    game.marsEvents.splice(0, game.marsEvents.length, ...this.marsEvents);
    game.marsEventDeck.updatePosition(this.marsEvents.length);
  }
}