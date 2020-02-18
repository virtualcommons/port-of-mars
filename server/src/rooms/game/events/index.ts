import { uuid } from 'uuidv4';
import {
  AccomplishmentData,
  ChatMessageData,
  InvestmentData,
  MarsLogMessageData,
  Phase,
  Role,
  ROLES,
  Resource,
  TradeData,
  CURATOR,
  ENTREPRENEUR,
  PIONEER,
  POLITICIAN,
  RESEARCHER
} from 'shared/types';
import {
  Accomplishment,
  ChatMessage,
  GameState,
  Player,
  Trade,
  MarsLogMessage
} from '@/rooms/game/state';
import { GameEvent } from '@/rooms/game/events/types';
import { MarsEvent } from '@/rooms/game/state/marsEvents/MarsEvent';
import { CompulsivePhilanthropy, PersonalGain, 
        OutOfCommissionCurator, OutOfCommissionPolitician, 
        OutOfCommissionResearcher, OutOfCommissionPioneer
       } 
        from '@/rooms/game/state/marsEvents/state';
import e = require('express');
import { Game } from '@/entity/Game';

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

export class MarsEventFinalized extends KindOnlyGameEvent {
  kind = 'mars-event-finalized';

  apply(game: GameState): void {
    game.currentEvent.state.finalize(game);
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

    // handle incomplete events
    game.handleIncomplete();
    game.marsEvents.push(...marsEvents);

    game.updateMarsEventsElapsed();
    game.marsEventsProcessed = GameState.DEFAULTS.marsEventsProcessed;
    game.marsEventDeck.updatePosition(game.marsEvents.length);
    // game.logs.push(log);

    for (const player of game.players) {
      player.refreshPurchasableAccomplishments();
      player.resetTimeBlocks();
    }

    // TODO: HANDLE CURRENT EVENT USING MARSEVENTSPROCESSED
  }
}

export class ReenteredMarsEventPhase extends KindOnlyGameEvent {
  kind = 'reentered-mars-event-phase';

  apply(game: GameState): void {
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

export class PersonalGainVoted extends GameEventWithData {
  kind = 'personal-gain-voted';

  constructor(public data: { role: Role; vote: boolean }) {
    super();
  }

  apply(game: GameState) {
    if (game.currentEvent.state instanceof PersonalGain) {
      const state = game.currentEvent.state;
      state.updateVotes(this.data.role, this.data.vote);
      game.players[this.data.role].updateReadiness(true);
    }
  }
}

export class VotedForPhilanthropist extends GameEventWithData {
  kind = 'voted-for-philanthropist';

  constructor(public data: { voter: Role, vote: Role }) {
    super();
  }

  apply(game: GameState): void {
    let state: CompulsivePhilanthropy;
    if (game.currentEvent.state instanceof CompulsivePhilanthropy) {
      state = game.currentEvent.state;
    } else {
      return;
    }

    state.voteForPlayer(this.data.voter, this.data.vote);
    game.players[this.data.voter].updateReadiness(true);
  }
}

export class CommissionCurator extends GameEventWithData {
  kind = 'commission-curator';

  constructor(public data: {role: Role}) {
    super();
  }

  apply(game: GameState): void {
    let state: OutOfCommissionCurator;
    if (game.currentEvent.state instanceof OutOfCommissionCurator) {
      state = game.currentEvent.state;
    } else {
      return;
    }

    state.playerOutOfCommission(this.data.role);
    game.players[this.data.role].updateReadiness(true);
  }
}

export class CommissionPolitician extends GameEventWithData {
  kind = 'commission-politician';

  constructor(public data: {role: Role}) {
    super();
  }

  apply(game: GameState): void {
    let state: OutOfCommissionPolitician;
    if (game.currentEvent.state instanceof OutOfCommissionPolitician) {
      state = game.currentEvent.state;
    } else {
      return;
    }

    state.playerOutOfCommission(this.data.role);
    game.players[this.data.role].updateReadiness(true);
  }
}

export class CommissionResearcher extends GameEventWithData {
  kind = 'commission-researcher';

  constructor(public data: {role: Role}) {
    super();
  }

  apply(game: GameState): void {
    let state: OutOfCommissionResearcher;
    if (game.currentEvent.state instanceof OutOfCommissionResearcher) {
      state = game.currentEvent.state;
    } else {
      return;
    }

    state.playerOutOfCommission(this.data.role);
    game.players[this.data.role].updateReadiness(true);
  }
}

export class CommissionPioneer extends GameEventWithData {
  kind = 'commission-pioneer';

  constructor(public data: {role: Role}) {
    super();
  }

  apply(game: GameState): void {
    let state: OutOfCommissionPioneer;
    if (game.currentEvent.state instanceof OutOfCommissionPioneer) {
      state = game.currentEvent.state;
    } else {
      return;
    }

    state.playerOutOfCommission(this.data.role);
    game.players[this.data.role].updateReadiness(true);
  }
}
