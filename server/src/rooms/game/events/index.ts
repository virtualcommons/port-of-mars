import {
  AccomplishmentData,
  ChatMessageData,
  InvestmentData,
  Phase,
  Role,
  TradeData,
  Resource,
  ResourceAmountData
} from '@port-of-mars/shared/types';
import {
  ChatMessage,
  GameState,
  Player,
  Trade,
  MarsLogMessage
} from '@port-of-mars/server/rooms/game/state';
import { GameEvent } from '@port-of-mars/server/rooms/game/events/types';
import { MarsEvent } from '@port-of-mars/server/rooms/game/state/marsEvents/MarsEvent';
import { CompulsivePhilanthropy, PersonalGain, 
        OutOfCommissionCurator, OutOfCommissionPolitician, 
        OutOfCommissionResearcher, OutOfCommissionPioneer,
        OutOfCommissionEntrepreneur, BondingThroughAdversity, BreakdownOfTrust
       } 
        from '@port-of-mars/server/rooms/game/state/marsEvents/state';
import * as entities from '@port-of-mars/server/entity/GameEvent';
import _ from "lodash";

class GameEventDeserializer {
  protected lookups: { [classname: string]: { new(timeRemaining: number, data?: any): GameEvent }} = {};

  register(event: { new (timeRemaining: number, data: any): GameEvent }) {
    this.lookups[_.kebabCase(event.name)] = event;
  }

  deserialize(ge: entities.GameEvent) {
    const constructor = this.lookups[ge.type];
    return new constructor(ge.timeRemaining, ge.payload);
  }
}
export const gameEventDeserializer = new GameEventDeserializer();

abstract class GameEventWithData implements GameEvent {
  abstract data: object;
  dateCreated: number;

  constructor(public timeRemaining: number) {
    this.dateCreated = new Date().getTime();
  }

  abstract apply(game: GameState): void;

  get kind() {
    return _.kebabCase(this.constructor.name);
  }

  serialize() {
    return {
      kind: this.kind,
      data: this.data,
      dateCreated: this.dateCreated,
      timeRemaining: this.timeRemaining
    };
  }
}

export class SetPlayerReadiness extends GameEventWithData {
  constructor(timeRemaining: number, public data: { value: boolean; role: Role }) {
    super(timeRemaining);
  }

  apply(game: GameState): void {
    game.setPlayerReadiness(this.data.role, this.data.value);
  }
}
gameEventDeserializer.register(SetPlayerReadiness);

export class SentChatMessage extends GameEventWithData {
  constructor(timeRemaining: number, public data: ChatMessageData) {
    super(timeRemaining);
  }

  apply(game: GameState) {
    game.addChat(this.data);
  }
}
gameEventDeserializer.register(SentChatMessage);

export class PurchasedAccomplishment extends GameEventWithData {
  constructor(timeRemaining: number, public data: { accomplishment: AccomplishmentData; role: Role }) {
    super(timeRemaining);
  }

  apply(game: GameState): void {
    game.purchaseAccomplishment(this.data.role, this.data.accomplishment);
  }
}
gameEventDeserializer.register(PurchasedAccomplishment);

export class DiscardedAccomplishment extends GameEventWithData {
  constructor(timeRemaining: number, public data: { id: number; role: Role }) {
    super(timeRemaining);
  }

  apply(game: GameState): void {
    game.discardAccomplishment(this.data.role, this.data.id);
  }
}
gameEventDeserializer.register(DiscardedAccomplishment);

export class TimeInvested extends GameEventWithData {
  constructor(timeRemaining: number, public data: { investment: InvestmentData; role: Role }) {
    super(timeRemaining);
  }

  apply(game: GameState): void {
    game.investTime(this.data.role, this.data.investment);
  }
}
gameEventDeserializer.register(TimeInvested);

export class AcceptTradeRequest extends GameEventWithData {
  constructor(timeRemaining: number, public data: { id: string }) {
    super(timeRemaining);
  }

  apply(game: GameState): void {
    game.acceptTrade(this.data.id);
  }
}
gameEventDeserializer.register(AcceptTradeRequest);

export class RejectTradeRequest extends GameEventWithData {
  constructor(timeRemaining: number, public data: { id: string }) {
    super(timeRemaining);
  }

  apply(game: GameState): void {
    game.removeTrade(this.data.id, 'reject-trade-request');
  }
}
gameEventDeserializer.register(RejectTradeRequest);

export class CancelTradeRequest extends GameEventWithData {
  constructor(timeRemaining: number, public data: { id: string }) {
    super(timeRemaining);
  }

  apply(game: GameState): void {
    game.removeTrade(this.data.id, 'cancel-trade-request');
  }
}
gameEventDeserializer.register(CancelTradeRequest);

export class SentTradeRequest extends GameEventWithData {
  constructor(timeRemaining: number, public data: TradeData) {
    super(timeRemaining);
  }

  apply(game: GameState): void {
    game.addTrade(this.data, 'sent-trade-request');
  }
}
gameEventDeserializer.register(SentTradeRequest);

/*
 Phase Events
 */

abstract class KindOnlyGameEvent implements GameEvent {
  dateCreated: number;

  constructor(public timeRemaining: number, data?: any) {
    this.dateCreated = new Date().getTime();
  }

  get kind(): string {
    return _.kebabCase(this.constructor.name);
  }

  abstract apply(game: GameState): void;

  serialize() {
    return { kind: this.kind, dateCreated: new Date().getTime(), timeRemaining: this.timeRemaining };
  }
}

export class MarsEventFinalized extends KindOnlyGameEvent {
  apply(game: GameState): void {
    game.currentEvent.state.finalize(game);
  }
}
gameEventDeserializer.register(MarsEventFinalized);

export class MarsEventInitialized extends KindOnlyGameEvent {
  apply(game: GameState): void {
    if(game.currentEvent.state.initialize){
      game.currentEvent.state.initialize(game);
    }
    
  }
}

export class EnteredMarsEventPhase extends KindOnlyGameEvent {

  apply(game: GameState): void {
    game.phase = Phase.events;
    game.round += 1;

    const oldUpkeep = game.upkeep;
    const contributedUpkeep = game.nextRoundUpkeep() + 25 - oldUpkeep;
    
    game.upkeep = game.nextRoundUpkeep();

    // system health - contributed upkeep
    game.log(`Your group invested a total of ${contributedUpkeep} into System Health during the last round.`, `SYSTEM HEALTH`);

    // system health - wear and tear
    game.log(`Standard wear and tear reduced System Health by 25.`, `SYSTEM HEALTH`);

    // current system health
    game.log(`System Health is currently ~${game.upkeep}`,`SYSTEM HEALTH`);

    game.resetPlayerReadiness();
    game.resetPlayerContributedUpkeep();
    game.refreshPlayerPurchasableAccomplisments();

    const cards = game.marsEventDeck.peek(game.upkeep);
    const marsEvents = cards.map(e => new MarsEvent(e));

    game.phase = Phase.events;
    
    game.timeRemaining = marsEvents[0].timeDuration;

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
gameEventDeserializer.register(EnteredMarsEventPhase);

export class ReenteredMarsEventPhase extends KindOnlyGameEvent {
  apply(game: GameState): void {
    game.resetPlayerReadiness();
    game.marsEventsProcessed += 1;
    game.timeRemaining = game.marsEvents[game.marsEventsProcessed].timeDuration;
  }
}
gameEventDeserializer.register(ReenteredMarsEventPhase);

export class EnteredInvestmentPhase extends KindOnlyGameEvent {
  apply(game: GameState): void {
    game.resetPlayerReadiness();
    game.phase = Phase.invest;
    game.timeRemaining = GameState.DEFAULTS.timeRemaining;
  }
}
gameEventDeserializer.register(EnteredInvestmentPhase);

export class EnteredTradePhase extends KindOnlyGameEvent {
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
gameEventDeserializer.register(EnteredTradePhase);

export class EnteredPurchasePhase extends KindOnlyGameEvent {
  apply(game: GameState): void {
    game.resetPlayerReadiness();
    game.phase = Phase.purchase;
    game.timeRemaining = GameState.DEFAULTS.timeRemaining;
    game.clearTrades();
    for (const player of game.players) {
      player.pendingInvestments.reset();
    }
  }
}
gameEventDeserializer.register(EnteredPurchasePhase);

export class EnteredDiscardPhase extends KindOnlyGameEvent {
  apply(game: GameState): void {
    game.resetPlayerReadiness();
    game.phase = Phase.discard;
    game.timeRemaining = GameState.DEFAULTS.timeRemaining;
  }
}
gameEventDeserializer.register(EnteredDiscardPhase);

export class EnteredDefeatPhase extends KindOnlyGameEvent {
  apply(game: GameState): void {
    if(game.upkeep <= 0){
      game.phase = Phase.defeat;
      
      game.log(`System Health has reached zero.`, 'System Health', 'Server');
    }

  }
}
gameEventDeserializer.register(EnteredDefeatPhase);

export class EnteredVictoryPhase extends KindOnlyGameEvent {
  apply(game: GameState): void {
    game.phase = Phase.victory;
    game.evaluateGameWinners();
  }
}
gameEventDeserializer.register(EnteredVictoryPhase);

export class StateSnapshotTaken implements GameEvent {
  kind = 'state-snapshot-taken';
  dateCreated: number;

  constructor(public timeRemaining: number, public data: object) {
    this.dateCreated = new Date().getTime();
  }

  apply(game: GameState): void {}

  serialize() {
    return {
      kind: this.kind,
      data: this.data,
      dateCreated: new Date().getTime(),
      timeRemaining: this.timeRemaining
    };
  }
}
gameEventDeserializer.register(StateSnapshotTaken);

export class PersonalGainVoted extends GameEventWithData {
  constructor(timeRemaining: number, public data: { role: Role; vote: boolean }) {
    super(timeRemaining);
  }

  apply(game: GameState) {
    if (game.currentEvent.state instanceof PersonalGain) {
      const state = game.currentEvent.state;
      state.updateVotes(this.data.role, this.data.vote);
      game.players[this.data.role].updateReadiness(true);
    }
  }
}
gameEventDeserializer.register(PersonalGainVoted);

export class VotedForPhilanthropist extends GameEventWithData {
  constructor(timeRemaining: number, public data: { voter: Role, vote: Role }) {
    super(timeRemaining);
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
gameEventDeserializer.register(VotedForPhilanthropist);

export class CommissionCurator extends GameEventWithData {
  constructor(timeRemaining: number, public data: {role: Role}) {
    super(timeRemaining);
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
gameEventDeserializer.register(CommissionCurator);

export class CommissionPolitician extends GameEventWithData {
  constructor(timeRemaining: number, public data: {role: Role}) {
    super(timeRemaining);
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
gameEventDeserializer.register(CommissionPolitician);

export class CommissionResearcher extends GameEventWithData {
  constructor(timeRemaining: number, public data: {role: Role}) {
    super(timeRemaining);
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
gameEventDeserializer.register(CommissionResearcher);

export class CommissionPioneer extends GameEventWithData {
  constructor(timeRemaining: number, public data: {role: Role}) {
    super(timeRemaining);
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
gameEventDeserializer.register(CommissionPioneer);

export class CommissionEntrepreneur extends GameEventWithData {
  constructor(timeRemaining: number, public data: {role: Role}) {
    super(timeRemaining);
  }

  apply(game: GameState): void {
    let state: OutOfCommissionEntrepreneur;
    if (game.currentEvent.state instanceof OutOfCommissionEntrepreneur) {
      state = game.currentEvent.state;
    } else {
      return;
    }

    state.playerOutOfCommission(this.data.role);
    game.players[this.data.role].updateReadiness(true);
  }
}
gameEventDeserializer.register(CommissionEntrepreneur);

export class SelectedInfluence extends GameEventWithData {
  constructor(timeRemaining: number, public data: {role: Role, influence: Resource}) {
    super(timeRemaining);
  }

  apply(game: GameState): void {
    let state: BondingThroughAdversity;
    if (game.currentEvent.state instanceof BondingThroughAdversity) {
      state = game.currentEvent.state;
      state.updateVotes(this.data.role, this.data.influence);
      game.players[this.data.role].updateReadiness(true);
    }
  }
}

gameEventDeserializer.register(SelectedInfluence);

export class SaveResources extends GameEventWithData {
  constructor(timeRemaining: number, public data: {role: Role, savedResources: InvestmentData}){
    super(timeRemaining);
  }

  apply(game: GameState): void {
    let state: BreakdownOfTrust;
    if(game.currentEvent.state instanceof BreakdownOfTrust){
      state= game.currentEvent.state;
    } else{
      return;
    }
    state.updateSavedResources(this.data.role, game, this.data.savedResources);
    game.players[this.data.role].updateReadiness(true);
  }
}

gameEventDeserializer.register(SaveResources);

