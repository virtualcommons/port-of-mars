import { uuid } from 'uuidv4';
import {
  AccomplishmentData,
  ChatMessageData,
  InvestmentData,
  // MarsEventData,
  MarsLogMessageData,
  Phase,
  Role,
  ROLES,
  Resource,
  TradeData,
  CURATOR
} from 'shared/types';
import {
  Accomplishment,
  ChatMessage,
  GameState,
  MarsEvent,
  Player,
  Trade,
  MarsLogMessage
} from '@/rooms/game/state';
import { GameEvent } from '@/rooms/game/events/types';
import { getAccomplishmentByID } from '@/data/Accomplishment';

abstract class GameEventWithData implements GameEvent {
  abstract kind: string;
  abstract data: object;
  dateCreated: number;

  constructor() {
    this.dateCreated = new Date().getTime();
  }

  abstract apply(game: GameState): void;

  serialize() {
    return {
      kind: this.kind,
      data: this.data,
      dateCreated: this.dateCreated
    };
  }
}

export class SetPlayerReadiness extends GameEventWithData {
  kind = 'set-player-readiness';

  constructor(public data: { value: boolean; role: Role }) {
    super();
  }

  apply(game: GameState): void {
    game.players[this.data.role].updateReadiness(this.data.value);
  }
}

export class SentChatMessage extends GameEventWithData {
  kind = 'sent-chat-message';

  constructor(public data: ChatMessageData) {
    super();
  }

  apply(game: GameState) {
    game.messages.push(new ChatMessage(this.data));
  }
}

export class BoughtAccomplishment extends GameEventWithData {
  kind = 'bought-accomplishment';

  constructor(public data: { accomplishment: AccomplishmentData; role: Role }) {
    super();
  }

  apply(game: GameState): void {
    game.players[this.data.role].buyAccomplishment(this.data.accomplishment);
  }
}

export class DiscardedAccomplishment extends GameEventWithData {
  kind = 'dicarded-accomplishment';

  constructor(public data: { id: number; role: Role }) {
    super();
  }

  apply(game: GameState): void {
    const accomplishmentData = game.players[this.data.role].accomplishment;
    accomplishmentData.discard(this.data.id);
  }
}

export class TimeInvested extends GameEventWithData {
  kind = 'time-blocks-invested';

  constructor(public data: { investment: InvestmentData; role: Role }) {
    super();
  }

  apply(game: GameState): void {
    game.players[this.data.role].pendingInvestments.fromJSON(
      this.data.investment
    );
  }
}

export class AcceptTradeRequest extends GameEventWithData {
  kind = 'accept-trade-request';

  constructor(public data: { id: string }) {
    super();
    this.dateCreated = new Date().getTime();
  }

  apply(game: GameState): void {
    let toMsg: Array<string> = [];
    for (const [resource, amount] of Object.entries(
      game.tradeSet[this.data.id].to.resourceAmount
    ) as any) {
      if (amount > 0) {
        toMsg.push(`${amount} ${resource}`);
      }
    }

    let fromMsg: Array<string> = [];
    for (const [resource, amount] of Object.entries(
      game.tradeSet[this.data.id].from.resourceAmount
    ) as any) {
      if (amount > 0) {
        fromMsg.push(`${amount} ${resource}`);
      }
    }

    const log = new MarsLogMessage({
      performedBy: game.tradeSet[this.data.id].from.role,
      category: 'Trade',
      content: `The ${
        game.tradeSet[this.data.id].from.role
      } has traded ${fromMsg.join(', ')} in exchange for ${toMsg.join(
        ', '
      )} from the ${game.tradeSet[this.data.id].to.role}`,
      timestamp: this.dateCreated
    });

    const trade: Trade = game.tradeSet[this.data.id];
    trade.apply(game);
    delete game.tradeSet[this.data.id];
    game.logs.push(log);
  }
}

export class RejectTradeRequest extends GameEventWithData {
  kind = 'reject-trade-request';

  constructor(public data: { id: string }) {
    super();
  }

  apply(game: GameState): void {
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
    this.dateCreated = new Date().getTime();
  }

  abstract apply(game: GameState): void;

  serialize() {
    return { kind: this.kind, dateCreated: new Date().getTime() };
  }
}

export class EnteredMarsEventPhase extends KindOnlyGameEvent {
  kind = 'entered-mars-event-phase';

  apply(game: GameState): void {
    // console.log('EnteredMarsEventPhase');
    // const log = new MarsLogMessage({
    //   performedBy: CURATOR,
    //   category: 'upkeep',
    //   content: `upkeep decreased ${game.upkeep - game.nextRoundUpkeep()}`,
    //   timestamp: this.dateCreated
    // });

    game.resetPlayerReadiness();
    game.refreshPlayerPurchasableAccomplisments();

    game.phase = Phase.events;
    game.round += 1;
    game.upkeep = game.nextRoundUpkeep();

    const cards = game.marsEventDeck.peek(game.upkeep);
    const marsEvents = cards.map(e => new MarsEvent(e));

    game.phase = Phase.events;
    game.timeRemaining = GameState.DEFAULTS.timeRemaining;

    game.handleIncomplete();
    game.marsEvents.push(...marsEvents);

    game.updateMarsEventsElapsed();
    game.marsEventsProcessed = GameState.DEFAULTS.marsEventsProcessed;
    game.marsEventDeck.updatePosition(game.marsEvents.length);
    // game.logs.push(log);

    for (const player of game.players) {
      player.refreshPurchasableAccomplishments();
    }

    // TODO: HANDLE CURRENT EVENT USING MARSEVENTSPROCESSED
  }
}

export class ReenteredMarsEventPhase extends KindOnlyGameEvent {
  kind = 'reentered-mars-event-phase';

  apply(game: GameState): void {
    // console.log('ReenteredMarsEventPhase');
    game.resetPlayerReadiness();
    game.marsEventsProcessed += 1;
  }
}

export class EnteredInvestmentPhase extends KindOnlyGameEvent {
  kind = 'entered-investment-phase';

  apply(game: GameState): void {
    game.resetPlayerReadiness();
    game.phase = Phase.invest;
    game.timeRemaining = GameState.DEFAULTS.timeRemaining;
  }
}

export class EnteredTradePhase extends KindOnlyGameEvent {
  kind = 'entered-trade-phase';

  apply(game: GameState) {
    game.resetPlayerReadiness();
    game.phase = Phase.trade;
    game.timeRemaining = GameState.DEFAULTS.timeRemaining;
    for (const player of game.players) {
      //if you want the default action:
      //player.invest(undefined,player.getLeftOverInvestments());

      player.invest();
      player.pendingInvestments.reset();
    }
  }
}

export class EnteredPurchasePhase extends KindOnlyGameEvent {
  kind = 'entered-purchase-phase';

  apply(game: GameState): void {
    game.resetPlayerReadiness();
    game.phase = Phase.purchase;
    game.timeRemaining = GameState.DEFAULTS.timeRemaining;
  }
}

export class EnteredDiscardPhase extends KindOnlyGameEvent {
  kind = 'entered-discard-phase';

  apply(game: GameState): void {
    game.resetPlayerReadiness();
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
    this.dateCreated = new Date().getTime();
  }

  apply(game: GameState): void {}

  serialize(): { kind: string; data?: object; dateCreated: number } {
    return {
      kind: this.kind,
      data: this.data,
      dateCreated: new Date().getTime()
    };
  }
}

// EVENT REQUESTS :: START
export class EventSendPollResults extends GameEventWithData {
  kind = 'event-send-poll-results';

  constructor(public data: { results: object }) {
    super();
  }

  apply(game: GameState): void {
    console.log('EventSendPollResults: ', this.data.results);
  }
}

export class EventModifyInfluences extends GameEventWithData {
  kind = 'event-modify-influences';

  constructor(public data: { results: object }) {
    super();
  }

  apply(game: GameState): void {
    console.log('EventModifyInfluences: ', this.data.results);
  }
}

export class EventModifyAccomplishments extends GameEventWithData {
  kind = 'event-modify-accomplishments';

  constructor(public data: { results: object }) {
    super();
  }

  apply(game: GameState): void {
    console.log('EventModifyAccomplishments: ', this.data.results);
  }
}
// EVENT REQUESTS :: END

// handleEvent(marsEvent: any): void {
//   if(this.allPlayersAreReady) {
//     switch(marsEvent.kind) {
//       case 'event-event-add-two': return; // DONE
//       case 'event-poll-yes-no': return;
//       case 'event-poll-single': return;
//       case 'event-poll-hero-pariah': return;
//       case 'event-phase-skip-trading': return;
//       case 'event-upkeep-minus-five': return; // DONE
//       case 'event-upkeep-minus-seven': return; // DONE
//       case 'event-upkeep-minus-ten': return; // DONE
//       case 'event-upkeep-minus-twenty': return; // DONE
//       case 'event-player-investments-specialty-block': return; // DONE
//       case 'event-player-investments-disabled-three': return; // IN-PROGRESS
//       case 'event-player-timeblocks-minus-five': return;
//       case 'event-player-timeblocks-equals-three': return;
//     }
//   }
// }

export class EventEventAddTwo extends KindOnlyGameEvent {
  kind = 'event-event-add-two';

  apply(game: GameState): void {
    const cards = game.marsEventDeck.drawAmount(2);
    const marsEvents = cards.map(e => new MarsEvent(e));
    game.marsEvents.push(...marsEvents);
    game.marsEventDeck.updatePosition(game.marsEvents.length);
  }
}

// TODO: REFACTOR EventUpkeepMinus* INTO ONE
export class EventUpkeepMinusFive extends KindOnlyGameEvent {
  kind = 'event-upkeep-minus-five';

  apply(game: GameState): void {
    game.subtractUpkeep(5);
  }
}

export class EventUpkeepMinusSeven extends KindOnlyGameEvent {
  kind = 'event-upkeep-minus-seven';

  apply(game: GameState): void {
    game.subtractUpkeep(7);
  }
}

export class EventUpkeepMinusTen extends KindOnlyGameEvent {
  kind = 'event-upkeep-minus-ten';

  apply(game: GameState): void {
    game.subtractUpkeep(10);
  }
}

export class EventUpkeepMinusTwenty extends KindOnlyGameEvent {
  kind = 'event-upkeep-minus-twenty';

  apply(game: GameState): void {
    game.subtractUpkeep(20);
  }
}

export class EventPlayerInvestmentsSpecialtyBlock extends GameEventWithData {
  kind = 'event-player-investments-specialty-block';

  constructor(public data: { role: Role }) {
    super();
  }

  apply(game: GameState) {
    const specialty: Resource = game.players[this.data.role].specialty;
    game.players[this.data.role].costs[specialty] = Infinity;
  }
}

export class EventPlayerInvestmentsDisabledThree extends GameEventWithData {
  kind = 'event-player-investments-disabled-three';

  constructor(public data: any) {
    super();
  }

  apply(game: GameState) {}
}

export class PersonalGainVoted extends GameEventWithData {
  kind = 'personal-gain-voted';

  constructor(public data: any) {
    super();
  }

  apply(game: GameState) {
    game.currentEvent.finalize(game);
  }
}
