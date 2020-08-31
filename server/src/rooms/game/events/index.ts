import {
  AccomplishmentData,
  ChatMessageData,
  InvestmentData,
  MarsLogCategory,
  Phase,
  Resource,
  Role,
  SERVER,
  ServerRole,
  TradeData
} from '@port-of-mars/shared/types';
import {GameSerialized, GameState} from '@port-of-mars/server/rooms/game/state';
import {GameEvent} from '@port-of-mars/server/rooms/game/events/types';
import {
  BondingThroughAdversity,
  BreakdownOfTrust,
  CompulsivePhilanthropy,
  downCastEventState,
  EffortsWasted,
  HeroOrPariah,
  OutOfCommissionCurator,
  OutOfCommissionEntrepreneur,
  OutOfCommissionPioneer,
  OutOfCommissionPolitician,
  OutOfCommissionResearcher,
  PersonalGain
} from '@port-of-mars/server/rooms/game/state/marsevents/state';
import * as entities from '@port-of-mars/server/entity/GameEvent';
import {getLogger} from "@port-of-mars/server/settings";
import _ from "lodash";
import {getAccomplishmentByID} from "@port-of-mars/server/data/Accomplishment";
import {VoteHeroOrPariahData} from "@port-of-mars/shared/game";

const logger = getLogger(__filename);

class GameEventDeserializer {
  protected lookups: { [classname: string]: { new(data?: any): GameEvent } } = {};

  register(event: { new(data: any): GameEvent }) {
    this.lookups[_.kebabCase(event.name)] = event;
  }

  deserialize(ge: entities.GameEvent) {
    const constructor = this.lookups[ge.type];
    if (!constructor) {
      throw new Error(`${ge.type} not found. Cannot deserialize event`);
    }
    return new constructor(ge.payload);
  }
}

export const gameEventDeserializer = new GameEventDeserializer();

abstract class GameEventWithData implements GameEvent {
  abstract data: object;

  get kind() {
    return _.kebabCase(this.constructor.name);
  }

  abstract apply(game: GameState): void;

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
  data: { accomplishment: AccomplishmentData; role: Role }

  constructor(data: { accomplishment: AccomplishmentData | { id: number }; role: Role }) {
    super();
    // to get around
    if (!this.isAccomplishmentData(data.accomplishment)) {
      this.data = {accomplishment: getAccomplishmentByID(data.role, data.accomplishment.id), role: data.role};
    } else {
      this.data = {accomplishment: data.accomplishment, role: data.role};
    }
  }

  isAccomplishmentData(ad: AccomplishmentData | { id: number }): ad is AccomplishmentData {
    return (ad as AccomplishmentData).label !== undefined;
  }

  apply(game: GameState): void {
    logger.warn('accomplishment: %o', _.fromPairs(_.toPairs(this.data.accomplishment)));
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

    // if Audit event is in effect
    if (game.marsEvents.filter(event => event.id == 'audit').length > 0) {
      const influenceType = Object.keys(this.data.investment)
          .filter((investment) => {
            return investment == 'systemHealth' || this.data.investment[investment as Resource] != 0;
          })

          .map((investment) => {
            const formattedInvestmentLabel = investment == 'systemHealth' ? 'System Health' :
                investment.charAt(0).toUpperCase() + investment.slice(1);
            const timeBlockString = this.data.investment[investment as Resource] > 1 ? 'time blocks' : 'time block';

            return `${this.data.investment[investment as Resource]} ${timeBlockString} in ${formattedInvestmentLabel}`;
          })

          .join('; ');

      const auditChatMessage: ChatMessageData = {
        message: `${this.data.role} has invested ${influenceType}.`,
        role: this.data.role,
        dateCreated: new Date().getDate(),
        round: game.round
      }

      game.addChat(auditChatMessage);

    }

  }
}

gameEventDeserializer.register(TimeInvested);

export class AcceptedTradeRequest extends GameEventWithData {
  constructor(public data: { id: string }) {
    super();
  }

  getRole(game: GameState): Role | ServerRole {
    return game.tradeSet[this.data.id]?.to?.role ?? SERVER;
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

  getRole(game: GameState): Role | ServerRole {
    return game.tradeSet[this.data.id]?.to?.role ?? SERVER;
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

  getRole(game: GameState): Role | ServerRole {
    return game.tradeSet[this.data.id]?.from?.role ?? SERVER;
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

  getRole(game: GameState): Role | ServerRole {
    return this.data.sender.role;
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
    logger.debug('phase: %s', Phase[game.phase]);

    // handle incomplete events
    game.handleIncomplete();

    // process mars events
    const nCards = game.systemHealth < 35 ? 3 : game.systemHealth < 65 ? 2 : 1;
    game.updateMarsEventsElapsed();
    game.marsEventsProcessed = GameState.DEFAULTS.marsEventsProcessed;
    game.drawMarsEvents(nCards);

    game.resetPlayerReadiness();

    // TODO: HANDLE CURRENT EVENT USING MARSEVENTSPROCESSED
  }
}

gameEventDeserializer.register(EnteredMarsEventPhase);

export class ReenteredMarsEventPhase extends KindOnlyGameEvent {
  apply(game: GameState): void {
    game.resetPlayerReadiness();
    game.marsEventsProcessed += 1;
    logger.warn('new mars event %d of %d: %o', game.marsEventsProcessed, game.marsEvents.length, game.marsEvents);
    game.timeRemaining = game.currentEvent.timeDuration;
  }
}

gameEventDeserializer.register(ReenteredMarsEventPhase);

export class EnteredInvestmentPhase extends KindOnlyGameEvent {
  apply(game: GameState): void {
    game.resetPlayerReadiness();
    game.phase = Phase.invest;
    logger.debug('phase: %s', Phase[game.phase]);
    game.timeRemaining = GameState.DEFAULTS.timeRemaining;
  }
}

gameEventDeserializer.register(EnteredInvestmentPhase);

export class ExitedInvestmentPhase extends KindOnlyGameEvent {
  apply(game: GameState): void {
    for (const player of game.players) {
      player.invest();
      player.pendingInvestments.reset();
    }
  }
}

gameEventDeserializer.register(ExitedInvestmentPhase);

export class ExitedMarsEventPhase extends KindOnlyGameEvent {
  apply(state: GameState): void {
    state.applyPendingActions();
  }
}

gameEventDeserializer.register(ExitedMarsEventPhase);

export class EnteredTradePhase extends KindOnlyGameEvent {
  apply(game: GameState): void {
    game.resetPlayerReadiness();
    game.phase = Phase.trade;
    logger.debug('phase: %s', Phase[game.phase]);
    game.timeRemaining = GameState.DEFAULTS.timeRemaining;
  }
}

gameEventDeserializer.register(EnteredTradePhase);

export class EnteredPurchasePhase extends KindOnlyGameEvent {
  apply(game: GameState): void {
    game.resetPlayerReadiness();
    game.phase = Phase.purchase;
    logger.debug('phase: %s', Phase[game.phase]);
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
    logger.debug('phase: %s', Phase[game.phase]);
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
    logger.debug('phase: %s', Phase[game.phase]);
    game.timeRemaining = 10000; // set timeRemaining = infinite to prevent phase transitioning after game is over
    game.log(`System Health has reached zero.`, MarsLogCategory.systemHealth, 'Server');
  }
}

gameEventDeserializer.register(EnteredDefeatPhase);

export class EnteredVictoryPhase extends GameEventWithData {
  constructor(public data: { [r in Role]: number }) {
    super();
  }

  apply(game: GameState): void {
    game.phase = Phase.victory;
    logger.debug('phase: %s', Phase[game.phase]);
    game.timeRemaining = 10000; // set timeRemaining = infinite to prevent phase transitioning after game is over
    game.evaluateGameWinners();
  }
}

gameEventDeserializer.register(EnteredVictoryPhase);

export class EnteredNewRoundPhase extends KindOnlyGameEvent {
  apply(game: GameState): void {
    game.phase = Phase.newRound;
    game.timeRemaining = 60;
    game.round += 1;
    game.roundIntroduction.addContribution(game.systemHealthContributed());
    game.roundIntroduction.addTaken(game.systemHealthTaken());
    game.log(`Round ${game.round} begins.`, MarsLogCategory.newRound);

    game.resetRound();
  }
}

gameEventDeserializer.register(EnteredNewRoundPhase);

export class AddedSystemHealthContributions extends KindOnlyGameEvent {
  apply(game: GameState): void {
    const prevSystemHealth = game.systemHealth;
    game.updateSystemHealth();

    // system health - last round
    game.log(
        `At the beginning of Round ${game.round}, System Health started at ${prevSystemHealth}.`,
        MarsLogCategory.systemHealth);

    game.log(`Collectively, players contributed +${game.systemHealthContributed()} System Health.`,
        MarsLogCategory.systemHealthContributions);

    if (game.systemHealthTaken() < 0) {
      game.log(`${game.systemHealthTaken()} System Health was subtracted because players purchased screw 
      Accomplishments.`, MarsLogCategory.systemHealthScrew);
    } else {
      game.log(`Players did not purchase any screw Accomplishments.`, MarsLogCategory.systemHealthScrew);
    }

    game.log(`At the end of Round ${game.round}, System Health is ${game.systemHealth} after accounting for 
    contributions and purchased screw Accomplishments.`, MarsLogCategory.systemHealth);
  }
}

gameEventDeserializer.register(AddedSystemHealthContributions);

export class SubtractedSystemHealthWearAndTear extends KindOnlyGameEvent {
  apply(game: GameState): void {
    // apply system health - wear and tear
    game.decreaseSystemHealth(25);
    game.resetPlayerContributions();
    game.roundIntroduction.reset();
    game.log(
        `Standard wear and tear reduces System Health by 25.
        At the beginning of this round, System Health = ${game.systemHealth}.`,
        MarsLogCategory.systemHealth);
  }
}

gameEventDeserializer.register(SubtractedSystemHealthWearAndTear);

// apply system health updates from previous round
export class BeganNewRound extends KindOnlyGameEvent {
  apply(game: GameState): void {
    // round message
    game.round += 1;
    game.log(`Round ${game.round} begins.`, MarsLogCategory.newRound);
  }
}

gameEventDeserializer.register(BeganNewRound);

export class TakenStateSnapshot implements GameEvent {
  kind = 'taken-state-snapshot';

  constructor(public data: GameSerialized) {
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
  constructor(public data: { voter: Role; vote: Role }) {
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

export class OutOfCommissionedPolitician extends GameEventWithData {
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

gameEventDeserializer.register(OutOfCommissionedPolitician);

export class OutOfCommissionedResearcher extends GameEventWithData {
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

gameEventDeserializer.register(OutOfCommissionedResearcher);

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
  constructor(public data: { role: Role; influence: Resource }) {
    super();
  }

  apply(game: GameState): void {
    logger.warn('bonding through adversity %o %o', this, game.currentEvent.state);
    let state: BondingThroughAdversity;
    if (game.currentEvent.state instanceof BondingThroughAdversity) {
      state = game.currentEvent.state;
      state.updateVotes(this.data.role, this.data.influence);
      game.players[this.data.role].updateReadiness(true);
      logger.warn('done bonding')
    }
  }
}

gameEventDeserializer.register(SelectedInfluence);

export class KeptResources extends GameEventWithData {
  constructor(public data: { role: Role; savedResources: InvestmentData }) {
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

export class StagedDiscardOfPurchasedAccomplishment extends GameEventWithData {
  constructor(public data: { id: number; role: Role }) {
    super();
  }

  apply(game: GameState): void {
    if (game.currentEvent.state instanceof EffortsWasted) {
      const state = game.currentEvent.state;
      state.discardAccomplishment(this.data.role, this.data.id);
      game.setPlayerReadiness(this.data.role, true);
    } else {
      logger.warn('Event Mismatch: got %s expected %s', game.currentEvent.name, 'effortsWasted')
    }
  }
}

gameEventDeserializer.register(StagedDiscardOfPurchasedAccomplishment);

// Hero or Pariah event - select Hero or Pariah (1/2)
export class VoteHeroOrPariah extends GameEventWithData {
  constructor(public data: { role: Role, heroOrPariah: VoteHeroOrPariahData["heroOrPariah"] }) {
    super();
  }

  apply(game: GameState) {
    downCastEventState(HeroOrPariah, game, (eventState) => {
      eventState.voteHeroOrPariah(this.data.role, this.data.heroOrPariah, game);

    })
  }
}

gameEventDeserializer.register(VoteHeroOrPariah);

// Hero or Pariah event - select player as Hero or Pariah (2/2)
export class VoteHeroOrPariahRole extends GameEventWithData {
  constructor(public data: { role: Role, vote: Role }) {
    super();
  }

  apply(game: GameState) {
    downCastEventState(HeroOrPariah, game, (eventState) => {
      eventState.voteForPlayer(this.data.role, this.data.vote);
      game.players[this.data.role].updateReadiness(true);
    })
  }
}

gameEventDeserializer.register(VoteHeroOrPariahRole);

////////////////////////// Bot Related //////////////////////////

export class BotControlTaken extends GameEventWithData {
  constructor(public data: { role: Role }) {
    super();
  }

  apply(game: GameState): void {
    game.players[this.data.role].bot.active = true;
  }
}

gameEventDeserializer.register(BotControlTaken);

export class BotControlRelinquished extends GameEventWithData {
  constructor(public data: { role: Role }) {
    super();
  }

  apply(game: GameState): void {
    game.players[this.data.role].bot.active = false;
  }
}

gameEventDeserializer.register(BotControlRelinquished);

export class BotWarningAcknowledged extends GameEventWithData {
  constructor(public data: { role: Role }) {
    super();
  }

  apply(game: GameState) {
    game.players[this.data.role].bot.resetElapsed();
  }
}

gameEventDeserializer.register(BotWarningAcknowledged);

