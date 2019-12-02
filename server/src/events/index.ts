import {AccomplishmentData, ChatMessageData, InvestmentData, MarsEventData, Phase, Role} from "shared/types";
import {ChatMessage, GameState, MarsEvent, Player} from "@/state";
import {GameEvent} from "@/events/types";

abstract class GameEventWithData implements GameEvent {
  abstract kind: string;
  abstract data: object;
  dateCreated: number;

  constructor() {
    this.dateCreated = (new Date()).getTime();
  }

  abstract apply(game: GameState): void

  serialize() {
    return {
      kind: this.kind,
      data: this.data,
      dateCreated: this.dateCreated
    }
  }
}

export class PlayerJoined extends GameEventWithData {
  kind = 'player-joined';

  constructor(public sessionId: string, public role: Role) { super() }

  get data() {
    return {
      sessionId: this.sessionId,
      role: this.role
    }
  }

  apply(game: GameState) {
    game.connections[this.sessionId] = this.role;
  }
}

export class SentChatMessage extends GameEventWithData {
  kind = 'sent-chat-message';

  constructor(public data: ChatMessageData) { super(); }

  apply(game: GameState) {
    game.messages.push(new ChatMessage(this.data));
  }
}

export class BoughtAccomplishment extends GameEventWithData {
  kind = 'bought-accomplishment';

  constructor(public data: {accomplishment: AccomplishmentData, role: Role}) { super(); }

  apply(game: GameState): void {
    game.players[this.data.role].buyAccomplishment(this.data.accomplishment);
  }
}

export class TimeInvested extends GameEventWithData {
  kind = 'time-blocks-invested';

  constructor(public data: {investment: InvestmentData, role: Role}) { super(); }

  apply(game: GameState): void {
<<<<<<< HEAD
    game.players[this.data.role].invest(this.data.investment);
=======
    console.log(JSON.stringify(game.players[this.role].inventory));
    game.players[this.role].invest(this.data);
    console.log(JSON.stringify(game.players[this.role].inventory));
>>>>>>> [refactor]Investments sent to server
  }
}

/*
 Phase Events
 */

abstract class KindOnlyGameEvent implements GameEvent {
  abstract kind: string;
  dateCreated: number;

  constructor() {
    this.dateCreated = (new Date()).getTime()
  }

  abstract apply(game: GameState): void

  serialize() {
    return { kind: this.kind, dateCreated: (new Date()).getTime() }
  }
}

export class LeftPreGamePhase extends KindOnlyGameEvent {
  kind = 'left-pre-game-phase';

  apply(game: GameState): void {
    game.phase = Phase.invest;
    game.round += 1;
  }
}

export class LeftMarsEventPhase extends KindOnlyGameEvent {
  kind = 'left-mars-event-phase';

  apply(game: GameState): void {
    game.phase = Phase.invest;
  }
}

export class LeftInvestmentPhase extends KindOnlyGameEvent {
  kind = 'left-investment-phase';

  apply(game: GameState) {
    game.phase = Phase.trade;
  }
}

export class LeftTradePhase extends KindOnlyGameEvent {
  kind = 'left-trade-phase';

  apply(game: GameState): void {
    game.phase = Phase.purchase;
  }
}

export class LeftPurchasePhase extends KindOnlyGameEvent {
  kind = 'left-purchase-phase';

  apply(game: GameState): void {
    game.phase = Phase.discard;
  }
}

export class LeftDiscardPhase extends GameEventWithData {
  kind = 'left-discard-phase';

  constructor(public marsEvents: Array<MarsEventData> = []) { super(); }

  get data() {
    return this.marsEvents;
  }

  apply(game: GameState): void {
    console.log('leaving discard');
    game.upkeep = game.nextRoundUpkeep();
    game.round += 1;

    if (game.upkeep <= 0) {
      console.debug('entering defeat phase');
      game.phase = Phase.defeat;
      return;
    }

    if (game.round >= game.maxRound) {
      console.debug('entering victory phase');
      game.phase = Phase.victory;
      return;
    }

    console.debug('entering mars event phase');
    const marsEvents = this.marsEvents.map(e => new MarsEvent(e));
    game.phase = Phase.events;
    game.marsEvents.splice(0, game.marsEvents.length, ...marsEvents);
    game.marsEventDeck.updatePosition(this.marsEvents.length);
  }
}

export class StateSnapshotTaken implements GameEvent {
  kind = 'state-snapshot-taken';
  dateCreated: number;

  constructor(public data: object) {
    this.dateCreated = (new Date()).getTime()
  }

  apply(game: GameState): void {}

  serialize(): { kind: string; data?: object, dateCreated: number } {
    return {
      kind: this.kind,
      data: this.data,
      dateCreated: (new Date()).getTime()
    }
  }
}