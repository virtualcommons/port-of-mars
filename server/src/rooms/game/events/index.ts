import {
  AccomplishmentData,
  ChatMessageData,
  InvestmentData,
  Phase,
  Role,
  TradeData,
  Resource,
  ResourceAmountData, ROLES
} from '@port-of-mars/shared/types';
import {GameEvent as DBGameEvent} from '@port-of-mars/server/entity'
import {
  ChatMessage,
  GameState,
  Player,
  Trade,
  MarsLogMessage
} from '@port-of-mars/server/rooms/game/state';
import {GameEvent, Json} from '@port-of-mars/server/rooms/game/events/types';
import {MarsEvent} from '@port-of-mars/server/rooms/game/state/marsEvents/MarsEvent';
import {
  CompulsivePhilanthropy, PersonalGain,
  OutOfCommissionCurator, OutOfCommissionPolitician,
  OutOfCommissionResearcher, OutOfCommissionPioneer,
  OutOfCommissionEntrepreneur, BondingThroughAdversity, BreakdownOfTrust
}
  from '@port-of-mars/server/rooms/game/state/marsEvents/state';
import * as entities from '@port-of-mars/server/entity/GameEvent';
import _ from "lodash";
import {GameRoom} from "@port-of-mars/server/rooms/game";

class GameEventDeserializer {
  protected lookups: { [classname: string]: { new(data?: any): GameEvent } } = {};

  register(event: { new(data: any): GameEvent }) {
    this.lookups[_.kebabCase(event.name)] = event;
  }

  deserialize(ge: entities.GameEvent) {
    const constructor = this.lookups[ge.type];
    return new constructor(ge.payload);
  }
}
export const gameEventDeserializer = new GameEventDeserializer();

abstract class GameEventWithData implements GameEvent {
  abstract data: object;

  abstract apply(game: GameState): void;

  get kind() {
    return _.kebabCase(this.constructor.name);
  }

  serialize() {
    return {
      type: this.kind,
      payload: this.data,
    };
  }
}

export class SetPlayerReadiness extends GameEventWithData {
  constructor(public data: { value: boolean; role: Role }) {
    super();
  }

  apply(game: GameState): void {
    game.setPlayerReadiness(this.data.role, this.data.value);
  }
}
gameEventDeserializer.register(SetPlayerReadiness);

export class SentChatMessage extends GameEventWithData {
  constructor(public data: ChatMessageData) {
    super();
  }

  apply(game: GameState) {
    game.addChat(this.data);
  }
}
gameEventDeserializer.register(SentChatMessage);

export class PurchasedAccomplishment extends GameEventWithData {
  constructor(public data: { accomplishment: AccomplishmentData; role: Role }) {
    super();
  }

  apply(game: GameState): void {
    game.purchaseAccomplishment(this.data.role, this.data.accomplishment);
  }
}
gameEventDeserializer.register(PurchasedAccomplishment);

export class DiscardedAccomplishment extends GameEventWithData {
  constructor(public data: { id: number; role: Role }) {
    super();
  }

  apply(game: GameState): void {
    game.discardAccomplishment(this.data.role, this.data.id);
  }
}
gameEventDeserializer.register(DiscardedAccomplishment);

export class TimeInvested extends GameEventWithData {
  constructor(public data: { investment: InvestmentData; role: Role }) {
    super();
  }

  apply(game: GameState): void {
    game.investTime(this.data.role, this.data.investment);
  }
}
gameEventDeserializer.register(TimeInvested);

export class AcceptedTradeRequest extends GameEventWithData {
  constructor(public data: { id: string }) {
    super();
  }

  apply(game: GameState): void {
    game.acceptTrade(this.data.id);
  }
}
gameEventDeserializer.register(AcceptedTradeRequest);

export class RejectedTradeRequest extends GameEventWithData {
  constructor(public data: { id: string }) {
    super();
  }

  apply(game: GameState): void {
    game.removeTrade(this.data.id, 'reject-trade-request');
  }
}
gameEventDeserializer.register(RejectedTradeRequest);

export class CanceledTradeRequest extends GameEventWithData {
  constructor(public data: { id: string }) {
    super();
  }

  apply(game: GameState): void {
    game.removeTrade(this.data.id, 'cancel-trade-request');
  }
}
gameEventDeserializer.register(CanceledTradeRequest);

export class SentTradeRequest extends GameEventWithData {
  constructor(public data: TradeData) {
    super();
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

  constructor(data?: any) {
  }

  get kind(): string {
    return _.kebabCase(this.constructor.name);
  }

  abstract apply(game: GameState): void;

  serialize() {
    return {type: this.kind, dateCreated: new Date().getTime(), payload: {}};
  }
}

export class FinalizedMarsEvent extends KindOnlyGameEvent {
  apply(game: GameState): void {
    game.currentEvent.state.finalize(game);
  }
}
gameEventDeserializer.register(FinalizedMarsEvent);

/**
 * Event to apply at the beginning of a round at which a mars event takes place
 */
export class InitializedMarsEvent extends KindOnlyGameEvent {
  apply(game: GameState): void {
    if (game.currentEvent.state.initialize) {
      game.currentEvent.state.initialize(game);
    }

  }
}
gameEventDeserializer.register(InitializedMarsEvent);

export class EnteredMarsEventPhase extends KindOnlyGameEvent {

  apply(game: GameState): void {
    game.phase = Phase.events;
    game.round += 1;

    const oldUpkeep = game.upkeep;
    const contributedUpkeep = game.nextRoundUpkeep() + 25 - oldUpkeep;

    game.upkeep = game.nextRoundUpkeep();

    // system health - contributed upkeep
    game.log(`Your group invested a total of ${contributedUpkeep} into System Health during the last round.`,`SYSTEM HEALTH`);

    // system health - wear and tear
    game.log(`Standard wear and tear reduced System Health by 25.`, `SYSTEM HEALTH`);

    // current system health
    game.log(`System Health is currently ${game.upkeep}.`,
    `SYSTEM HEALTH- ${oldUpkeep < game.upkeep ? 'GAIN' : 'DROP'}`);

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

export class EnteredDefeatPhase extends GameEventWithData {
  constructor(public data: { [r in Role]: number }) {
    super();
  }

  apply(game: GameState): void {
    game.phase = Phase.defeat;
    game.timeRemaining = 9999999;         // set timeRemaining = infinite to prevent phase transitioning after game is over
    game.log(`System Health has reached zero.`, 'System Health', 'Server');
  }
}
gameEventDeserializer.register(EnteredDefeatPhase);

export class EnteredVictoryPhase extends GameEventWithData {
  constructor(public data: { [r in Role]: number }) {
    super();
  }

  apply(game: GameState): void {
    game.phase = Phase.victory;
    game.timeRemaining = 9999999;         // set timeRemaining = infinite to prevent phase transitioning after game is over
    game.evaluateGameWinners();
  }
}
gameEventDeserializer.register(EnteredVictoryPhase);

export class TakenStateSnapshot implements GameEvent {
  kind = 'taken-state-snapshot';

  constructor(public data: object) {
  }

  apply(game: GameState): void {
  }

  serialize() {
    return {
      type: this.kind,
      payload: this.data
    };
  }
}
gameEventDeserializer.register(TakenStateSnapshot);

export class VotedForPersonalGain extends GameEventWithData {
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
gameEventDeserializer.register(VotedForPersonalGain);

export class VotedForPhilanthropist extends GameEventWithData {
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
gameEventDeserializer.register(VotedForPhilanthropist);

export class OutOfCommissionedCurator extends GameEventWithData {
  constructor(public data: { role: Role }) {
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
gameEventDeserializer.register(OutOfCommissionedCurator);

export class OutOfCommissionedPoliician extends GameEventWithData {
  constructor(public data: { role: Role }) {
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

gameEventDeserializer.register(OutOfCommissionedPoliician);

export class OutOfComissionedResearcher extends GameEventWithData {
  constructor(public data: { role: Role }) {
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
gameEventDeserializer.register(OutOfComissionedResearcher);

export class OutOfCommissionedPioneer extends GameEventWithData {
  constructor(public data: { role: Role }) {
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
gameEventDeserializer.register(OutOfCommissionedPioneer);

export class OutOfCommissionedEntrepreneur extends GameEventWithData {
  constructor(public data: { role: Role }) {
    super();
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
gameEventDeserializer.register(OutOfCommissionedEntrepreneur);

export class SelectedInfluence extends GameEventWithData {
  constructor(public data: { role: Role, influence: Resource }) {
    super();
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

export class KeptResources extends GameEventWithData {
  constructor(public data: { role: Role, savedResources: InvestmentData }) {
    super();
  }

  apply(game: GameState): void {
    let state: BreakdownOfTrust;
    if (game.currentEvent.state instanceof BreakdownOfTrust) {
      state = game.currentEvent.state;
    } else {
      return;
    }
    state.updateSavedResources(this.data.role, game, this.data.savedResources);
    game.players[this.data.role].updateReadiness(true);
  }
}
gameEventDeserializer.register(KeptResources);

