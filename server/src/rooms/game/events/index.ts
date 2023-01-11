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
  TradeData,
} from "@port-of-mars/shared/types";
import {
  GameSerialized,
  GameState,
  RoundSummary,
} from "@port-of-mars/server/rooms/game/state";
import { GameEvent } from "@port-of-mars/server/rooms/game/events/types";
import {
  BondingThroughAdversity,
  BreakdownOfTrust,
  CompulsivePhilanthropy,
  downCastEventState,
  EffortsWasted,
  HeroOrPariah,
  PersonalGain,
} from "@port-of-mars/server/rooms/game/state/marsevents/state";
import * as entities from "@port-of-mars/server/entity/GameEvent";
import { getLogger } from "@port-of-mars/server/settings";
import _ from "lodash";
import { getAccomplishmentByID } from "@port-of-mars/server/data/Accomplishment";
import { VoteHeroOrPariahData } from "@port-of-mars/shared/game";
import { Responses, Sfx } from "@port-of-mars/shared/game/responses";

const logger = getLogger(__filename);

class GameEventDeserializer {
  protected lookups: { [classname: string]: { new (data?: any): GameEvent } } =
    {};

  register(event: { new (data: any): GameEvent }) {
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

  abstract apply(game: GameState): void | Responses;

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

  apply(game: GameState): void | Responses {
    game.setPlayerReadiness(this.data.role, this.data.value);
    if (this.data.value) {
      return { kind: "set-sfx", sfx: Sfx.READY_TO_ADVANCE };
    } else {
      return { kind: "set-sfx", sfx: Sfx.CANCEL_READY_TO_ADVANCE };
    }
  }
}

gameEventDeserializer.register(SetPlayerReadiness);

export class SentChatMessage extends GameEventWithData {
  constructor(public data: ChatMessageData) {
    super();
  }

  apply(game: GameState): void | Responses {
    game.addChat(this.data);
    return { kind: "set-sfx", sfx: Sfx.CHAT_MESSAGE_NOTIFICATION };
  }
}

gameEventDeserializer.register(SentChatMessage);

export class PurchasedAccomplishment extends GameEventWithData {
  data: { accomplishment: AccomplishmentData; role: Role };

  constructor(data: {
    accomplishment: AccomplishmentData | { id: number };
    role: Role;
  }) {
    super();
    // to get around
    if (!this.isAccomplishmentData(data.accomplishment)) {
      this.data = {
        accomplishment: getAccomplishmentByID(
          data.role,
          data.accomplishment.id
        ),
        role: data.role,
      };
    } else {
      this.data = { accomplishment: data.accomplishment, role: data.role };
    }
  }

  isAccomplishmentData(
    ad: AccomplishmentData | { id: number }
  ): ad is AccomplishmentData {
    return (ad as AccomplishmentData).label !== undefined;
  }

  apply(game: GameState): void {
    logger.warn(
      "accomplishment: %o",
      _.fromPairs(_.toPairs(this.data.accomplishment))
    );
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
    if (game.marsEvents.filter((event) => event.id === "audit").length > 0) {
      const resources = Object.keys(this.data.investment)
        // get a player's investments for system health and resources
        .filter((investment) => {
          // return time block investments for system health and any resource where investments > 0
          return (
            investment === "systemHealth" ||
            this.data.investment[investment as Resource] > 0
          );
        })

        .map((investment) => {
          // format resource type string
          const pendingInvestment =
            this.data.investment[investment as Resource];
          const cost =
            game.players[this.data.role].costs[investment as Resource];
          // format time block investments string
          if (investment === "systemHealth") {
            return `and contributes ${pendingInvestment} to System Health (cost: ${
              pendingInvestment * cost
            } time blocks)`;
          } else {
            const capitalizedResource =
              investment.charAt(0).toUpperCase() + investment.slice(1);
            return `${pendingInvestment} ${capitalizedResource} (cost: ${
              pendingInvestment * cost
            } time blocks)`;
          }
        })
        .join(" ");

      const auditChatMessage: ChatMessageData = {
        message: `${this.data.role} earned ${resources}.`,
        role: this.data.role,
        dateCreated: new Date().getTime(),
        round: game.round,
      };

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
    return game.tradeSet.get(this.data.id)?.recipient?.role ?? SERVER;
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
    return game.tradeSet.get(this.data.id)?.recipient?.role ?? SERVER;
  }

  apply(game: GameState): void {
    game.rejectTrade(this.data.id);
  }
}

gameEventDeserializer.register(RejectedTradeRequest);

export class CanceledTradeRequest extends GameEventWithData {
  constructor(public data: { id: string }) {
    super();
  }

  getRole(game: GameState): Role | ServerRole {
    return game.tradeSet.get(this.data.id)?.sender?.role ?? SERVER;
  }

  apply(game: GameState): void {
    game.cancelTrade(this.data.id);
  }
}

gameEventDeserializer.register(CanceledTradeRequest);

export class SentTradeRequest extends GameEventWithData {
  constructor(public data: TradeData) {
    super();
  }

  getRole(): Role | ServerRole {
    return this.data.sender.role;
  }

  apply(game: GameState): void | Responses {
    game.addTrade(this.data, "sent-trade-request");
    return { kind: "set-sfx", sfx: Sfx.TRADE_REQUEST_NOTIFICATION };
  }
}

gameEventDeserializer.register(SentTradeRequest);

export class ServerCanceledTradeRequest extends GameEventWithData {
  constructor(public data: { id: string }) {
    super();
  }

  getRole(game: GameState): Role | ServerRole {
    return game.tradeSet.get(this.data.id)?.sender?.role ?? SERVER;
  }

  apply(game: GameState): void {
    game.cancelTrade(this.data.id, true);
  }
}

gameEventDeserializer.register(ServerCanceledTradeRequest);

/*
 Phase Events
 */

abstract class KindOnlyGameEvent implements GameEvent {
  constructor(data?: any) {}

  get kind(): string {
    return _.kebabCase(this.constructor.name);
  }

  abstract apply(game: GameState): void;

  serialize() {
    return { type: this.kind, dateCreated: new Date().getTime(), payload: {} };
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
  // TODO: add sfx
  apply(game: GameState): void | Responses {
    game.phase = Phase.events;
    logger.debug("phase: %s", Phase[game.phase]);

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
  apply(game: GameState): void | Responses {
    game.resetPlayerReadiness();
    game.marsEventsProcessed += 1;
    logger.warn(
      "new mars event %d of %d: %o",
      game.marsEventsProcessed,
      game.marsEvents.length,
      game.marsEvents
    );
    game.timeRemaining = game.currentEvent.timeDuration;
  }
}

gameEventDeserializer.register(ReenteredMarsEventPhase);

export class EnteredInvestmentPhase extends KindOnlyGameEvent {
  apply(game: GameState): void {
    game.resetPlayerReadiness();
    game.phase = Phase.invest;
    logger.debug("phase: %s", Phase[game.phase]);
    game.timeRemaining = GameState.DEFAULT_PHASE_DURATION[game.phase];
  }
}

gameEventDeserializer.register(EnteredInvestmentPhase);

export class ExitedInvestmentPhase extends KindOnlyGameEvent {
  apply(game: GameState): void {
    for (const player of game.players) {
      player.invest();
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
    logger.debug("phase: %s", Phase[game.phase]);
    game.timeRemaining = GameState.DEFAULT_PHASE_DURATION[game.phase];
  }
}
gameEventDeserializer.register(EnteredTradePhase);

export class ExitedTradePhase extends KindOnlyGameEvent {
  apply(game: GameState): void {
    game.clearTrades();
  }
}
gameEventDeserializer.register(ExitedTradePhase);

export class EnteredPurchasePhase extends KindOnlyGameEvent {
  apply(game: GameState): void {
    game.resetPlayerReadiness();
    game.phase = Phase.purchase;
    logger.debug("phase: %s", Phase[game.phase]);
    game.timeRemaining = GameState.DEFAULT_PHASE_DURATION[game.phase];
    game.clearTrades();
    // for (const player of game.players) {
    //   player.pendingInvestments.reset();
    // }
  }
}
gameEventDeserializer.register(EnteredPurchasePhase);

// ? Should we remove this? Doesn't seem to be used.
export class ExitedPurchasePhase extends KindOnlyGameEvent {
  apply(game: GameState): void {}
}

gameEventDeserializer.register(ExitedPurchasePhase);

export class EnteredDiscardPhase extends KindOnlyGameEvent {
  apply(game: GameState): void {
    game.resetPlayerReadiness();
    game.phase = Phase.discard;
    logger.debug("phase: %s", Phase[game.phase]);
    game.timeRemaining = GameState.DEFAULT_PHASE_DURATION[game.phase];
  }
}
gameEventDeserializer.register(EnteredDiscardPhase);

export class EnteredDefeatPhase extends GameEventWithData {
  constructor(public data: { [r in Role]: number }) {
    super();
  }

  apply(game: GameState): void {
    game.phase = Phase.defeat;
    logger.debug("phase: %s", Phase[game.phase]);
    game.timeRemaining = GameState.DEFAULT_PHASE_DURATION[game.phase]; // set timeRemaining = infinite to prevent phase transitioning after game is over
    game.log(
      `System Health has reached zero.`,
      MarsLogCategory.systemHealth,
      "Server"
    );
  }
}
gameEventDeserializer.register(EnteredDefeatPhase);

export class EnteredVictoryPhase extends GameEventWithData {
  constructor(public data: { [r in Role]: number }) {
    super();
  }

  apply(game: GameState): void {
    game.phase = Phase.victory;
    logger.debug("phase: %s", Phase[game.phase]);
    game.timeRemaining = GameState.DEFAULT_PHASE_DURATION[game.phase]; // set timeRemaining = infinite to prevent phase transitioning after game is over
    game.evaluateGameWinners();
  }
}

gameEventDeserializer.register(EnteredVictoryPhase);

export class EnteredNewRoundPhase extends KindOnlyGameEvent {
  apply(game: GameState): void {
    game.setUpNewRound();
  }
}

gameEventDeserializer.register(EnteredNewRoundPhase);

export class AddedSystemHealthContributions extends KindOnlyGameEvent {
  apply(game: GameState): void {
    const prevSystemHealth = game.systemHealth;
    game.setNextRoundSystemHealth();

    // system health - last round
    game.log(
      `At the beginning of Round ${game.round}, System Health started at ${prevSystemHealth}.`,
      MarsLogCategory.systemHealth
    );
    game.log(
      `Collectively, players contributed +${game.totalSystemHealthContributions()} System Health.`,
      MarsLogCategory.systemHealthContributions
    );
    if (game.systemHealthTaken() < 0) {
      game.log(
        `${game.systemHealthTaken()} System Health was subtracted because players purchased Accomplishments that cost System Health.`,
        MarsLogCategory.systemHealthContributions
      );
    }
    game.log(
      `At the end of Round ${game.round}, System Health is ${game.systemHealth} after accounting for 
    contributions and purchased Accomplishments that decrease System Health.`,
      MarsLogCategory.systemHealth
    );
  }
}

gameEventDeserializer.register(AddedSystemHealthContributions);

export class SubtractedSystemHealthWearAndTear extends KindOnlyGameEvent {
  apply(game: GameState): void {
    // apply system health - wear and tear
    game.subtractSystemHealthWearAndTear();
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
  kind = "taken-state-snapshot";

  constructor(public data: GameSerialized) {}

  apply(game: GameState): void {}

  serialize(): { type: string; payload: GameSerialized} {
    return {
      type: this.kind,
      payload: this.data,
    };
  }
}

gameEventDeserializer.register(TakenStateSnapshot);

export class TakenRoundSnapshot implements GameEvent {
  kind = "taken-round-snapshot";

  constructor(public data: RoundSummary) {}

  apply(game: GameState): void {}

  serialize(): { type: string; payload: RoundSummary} {
    return {
      type: this.kind,
      payload: this.data,
    };
  }
}

gameEventDeserializer.register(TakenRoundSnapshot);

export class VotedForPersonalGain extends GameEventWithData {
  constructor(public data: { role: Role; vote: boolean }) {
    super();
  }

  apply(game: GameState): void {
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
    let eventState: CompulsivePhilanthropy;
    if (game.currentEvent.state instanceof CompulsivePhilanthropy) {
      eventState = game.currentEvent.state;
    } else {
      return;
    }

    eventState.voteForPlayer(this.data.voter, this.data.vote);
    game.players[this.data.voter].updateReadiness(true);
  }
}

gameEventDeserializer.register(VotedForPhilanthropist);

export class OutOfCommissionedCurator extends GameEventWithData {
  constructor(public data: { role: Role }) {
    super();
  }

  apply(game: GameState): void {
    game.players[this.data.role].updateReadiness(true);
  }
}

gameEventDeserializer.register(OutOfCommissionedCurator);

export class OutOfCommissionedPolitician extends GameEventWithData {
  constructor(public data: { role: Role }) {
    super();
  }

  apply(game: GameState): void {
    game.players[this.data.role].updateReadiness(true);
  }
}

gameEventDeserializer.register(OutOfCommissionedPolitician);

export class OutOfCommissionedResearcher extends GameEventWithData {
  constructor(public data: { role: Role }) {
    super();
  }

  apply(game: GameState): void {
    game.players[this.data.role].updateReadiness(true);
  }
}

gameEventDeserializer.register(OutOfCommissionedResearcher);

export class OutOfCommissionedPioneer extends GameEventWithData {
  constructor(public data: { role: Role }) {
    super();
  }

  apply(game: GameState): void {
    game.players[this.data.role].updateReadiness(true);
  }
}

gameEventDeserializer.register(OutOfCommissionedPioneer);

export class OutOfCommissionedEntrepreneur extends GameEventWithData {
  constructor(public data: { role: Role }) {
    super();
  }

  apply(game: GameState): void {
    game.players[this.data.role].updateReadiness(true);
  }
}

gameEventDeserializer.register(OutOfCommissionedEntrepreneur);

export class SelectedInfluence extends GameEventWithData {
  constructor(public data: { role: Role; influence: Resource }) {
    super();
  }

  apply(game: GameState): void {
    logger.warn(
      "bonding through adversity %o %o",
      this,
      game.currentEvent.state
    );
    let eventState: BondingThroughAdversity;
    if (game.currentEvent.state instanceof BondingThroughAdversity) {
      eventState = game.currentEvent.state;
      eventState.updateVotes(this.data.role, this.data.influence);
      game.players[this.data.role].updateReadiness(true);
      logger.warn("done bonding");
    }
  }
}

gameEventDeserializer.register(SelectedInfluence);

export class BreakdownOfTrustOccurred extends GameEventWithData {
  constructor(public data: { role: Role; savedResources: InvestmentData }) {
    super();
  }

  apply(game: GameState): void {
    let eventState: BreakdownOfTrust;
    if (game.currentEvent.state instanceof BreakdownOfTrust) {
      eventState = game.currentEvent.state;
    } else {
      return;
    }
    logger.debug("saved resources: %o", { role: this.data.role, savedResources: this.data.savedResources });
    eventState.setInventory(this.data.role, game, this.data.savedResources);
    game.players[this.data.role].updateReadiness(true);
  }
}

gameEventDeserializer.register(BreakdownOfTrustOccurred);

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
      logger.warn(
        "Event Mismatch: got %s expected %s",
        game.currentEvent.name,
        "effortsWasted"
      );
    }
  }
}

gameEventDeserializer.register(StagedDiscardOfPurchasedAccomplishment);

// Hero or Pariah event - select Hero or Pariah (1/2)
export class VoteHeroOrPariah extends GameEventWithData {
  constructor(
    public data: {
      role: Role;
      heroOrPariah: VoteHeroOrPariahData["heroOrPariah"];
    }
  ) {
    super();
  }

  apply(game: GameState): void {
    downCastEventState(HeroOrPariah, game, (eventState) => {
      eventState.voteHeroOrPariah(this.data.role, this.data.heroOrPariah, game);
    });
  }
}

gameEventDeserializer.register(VoteHeroOrPariah);

// Hero or Pariah event - select player as Hero or Pariah (2/2)
export class VoteHeroOrPariahRole extends GameEventWithData {
  constructor(public data: { role: Role; vote: Role }) {
    super();
  }

  apply(game: GameState): void {
    downCastEventState(HeroOrPariah, game, (eventState) => {
      eventState.voteForPlayer(this.data.role, this.data.vote);
      game.players[this.data.role].updateReadiness(true);
    });
  }
}

gameEventDeserializer.register(VoteHeroOrPariahRole);

////////////////////////// Bot Related //////////////////////////

export class BotControlTaken extends GameEventWithData {
  constructor(public data: { role: Role }) {
    super();
  }

  apply(game: GameState): void {
    game.players[this.data.role].activateBot();
  }
}

gameEventDeserializer.register(BotControlTaken);

export class BotControlRelinquished extends GameEventWithData {
  constructor(public data: { role: Role }) {
    super();
  }

  apply(game: GameState): void {
    game.players[this.data.role].deactivateBot();
  }
}

gameEventDeserializer.register(BotControlRelinquished);

export class BotWarningAcknowledged extends GameEventWithData {
  constructor(public data: { role: Role }) {
    super();
  }

  apply(game: GameState): void {
    game.players[this.data.role].bot.resetElapsed();
  }
}

gameEventDeserializer.register(BotWarningAcknowledged);
