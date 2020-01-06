import { uuid } from 'uuidv4'
import {
  AccomplishmentData,
  ChatMessageData,
  InvestmentData,
  MarsEventData,
  MarsLogMessageData,
  Phase,
  Role,
  ROLES,
  TradeData,
  CURATOR
} from "shared/types";
import {Accomplishment, ChatMessage, GameState, MarsEvent, Player, Trade, MarsLogMessage} from "@/game/state";
import {GameEvent} from "@/game/events/types";
import {getAccomplishmentByID} from "@/repositories/Accomplishment";

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

export class DiscardedAccomplishment extends GameEventWithData {
  kind = 'dicarded-accomplishment';

  constructor(public data: {id: number, role: Role}) { super(); }

  apply(game: GameState): void {
    const accomplishmentData = game.players[this.data.role].accomplishment;
    const newId = accomplishmentData.peek();
    console.log(`replacing ${this.data.id} with ${newId}`);
    const purchasable = accomplishmentData.purchasable;
    const index = purchasable.findIndex(acc => acc.id === this.data.id);
    const accomplishment = new Accomplishment(getAccomplishmentByID(this.data.role, newId));
    accomplishmentData.update();
    purchasable.splice(index, 1, accomplishment);
  }
}

export class TimeInvested extends GameEventWithData {
  kind = 'time-blocks-invested';

  constructor(public data: {investment: InvestmentData, role: Role}) { super(); }

  apply(game: GameState): void {
    game.players[this.data.role].pendingInvestments.fromJSON(this.data.investment);
  }
}

export class AcceptTradeRequest extends GameEventWithData {
  kind = 'accept-trade-request';

  constructor(public data: { id: string }) { super(); }

  apply(game: GameState): void {
    const trade: Trade = game.tradeSet[this.data.id];
    trade.apply(game);
    delete game.tradeSet[this.data.id];
  }
}

export class RejectTradeRequest extends GameEventWithData {
  kind = 'reject-trade-request';

  constructor(public data: {id:string}) {super();}

  apply(game:GameState): void {
    delete game.tradeSet[this.data.id];
  }
}

export class SentTradeRequest extends GameEventWithData {
  kind = 'sent-trade-request';

  constructor(public data: TradeData) {
    super();
  }

  apply(game: GameState): void {
    const id = uuid();
    game.tradeSet[id] = new Trade(this.data.from, this.data.to);
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

export class EnteredMarsEventPhase extends KindOnlyGameEvent {
  kind = 'entered-mars-event-phase';

  apply(game: GameState): void {
    const log = new MarsLogMessage({
      performedBy: CURATOR,
      category: 'upkeep',
      content: `upkeep decreased ${game.upkeep - game.nextRoundUpkeep()}`,
      timestamp: this.dateCreated,
    });

    game.phase = Phase.events;
    game.round += 1;
    game.upkeep = game.nextRoundUpkeep();
    const cards = game.marsEventDeck.peek(game.upkeep);
    const marsEvents = cards.map(e => new MarsEvent(e));
    game.phase = Phase.events;
    game.timeRemaining = GameState.DEFAULTS.timeRemaining;
    game.marsEvents.splice(0, game.marsEvents.length, ...marsEvents);
    game.marsEventDeck.updatePosition(game.marsEvents.length);
    game.logs.push(log);
  }
}

export class EnteredInvestmentPhase extends KindOnlyGameEvent {
  kind = 'entered-investment-phase';

  apply(game: GameState): void {
    game.phase = Phase.invest;
    game.timeRemaining = GameState.DEFAULTS.timeRemaining;
  }
}

export class EnteredTradePhase extends KindOnlyGameEvent {
  kind = 'entered-trade-phase';

  apply(game: GameState) {
    game.phase = Phase.trade;
    game.timeRemaining = GameState.DEFAULTS.timeRemaining;
    for (const player of game.players) {
      player.invest();
      player.pendingInvestments.reset();
    }
  }
}

export class EnteredPurchasePhase extends KindOnlyGameEvent {
  kind = 'entered-purchase-phase';

  apply(game: GameState): void {
    game.phase = Phase.purchase;
    game.timeRemaining = GameState.DEFAULTS.timeRemaining;
  }
}

export class EnteredDiscardPhase extends KindOnlyGameEvent {
  kind = 'entered-discard-phase';

  apply(game: GameState): void {
    game.phase = Phase.discard;
    game.timeRemaining = GameState.DEFAULTS.timeRemaining;
  }
}

export class EnteredDefeatPhase extends KindOnlyGameEvent {
  kind = 'entered-defeat-phase';

  apply(game: GameState): void {
    game.phase = Phase.defeat;
  }
}

export class EnteredVictoryPhase extends KindOnlyGameEvent {
  kind = 'entered-victory-phase';

  apply(game: GameState): void {
    game.phase = Phase.victory;
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