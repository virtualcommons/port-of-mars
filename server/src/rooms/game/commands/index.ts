import * as req from "@port-of-mars/shared/game/requests";
import { InvestmentData, Phase, TradeData } from "@port-of-mars/shared/types";
import {
  GameState,
  Player,
  Trade,
} from "@port-of-mars/server/rooms/game/state";
import {
  AcceptedTradeRequest,
  AddedSystemHealthContributions,
  BotWarningAcknowledged,
  CanceledTradeRequest,
  VoteHeroOrPariahRole,
  DiscardedAccomplishment,
  EnteredDefeatPhase,
  EnteredDiscardPhase,
  EnteredInvestmentPhase,
  EnteredMarsEventPhase,
  EnteredNewRoundPhase,
  EnteredPurchasePhase,
  EnteredTradePhase,
  EnteredVictoryPhase,
  ExitedInvestmentPhase,
  ExitedMarsEventPhase,
  FinalizedMarsEvent,
  InitializedMarsEvent,
  BreakdownOfTrustOccured,
  OutOfCommissionedCurator,
  OutOfCommissionedEntrepreneur,
  OutOfCommissionedPioneer,
  OutOfCommissionedPolitician,
  OutOfCommissionedResearcher,
  PurchasedAccomplishment,
  ReenteredMarsEventPhase,
  RejectedTradeRequest,
  SelectedInfluence,
  SubtractedSystemHealthWearAndTear,
  StagedDiscardOfPurchasedAccomplishment,
  SentChatMessage,
  SentTradeRequest,
  SetPlayerReadiness,
  TimeInvested,
  VotedForPersonalGain,
  VotedForPhilanthropist,
  VoteHeroOrPariah,
  ExitedTradePhase,
  ExitedPurchasePhase,
  ServerCanceledTradeRequest,
} from "@port-of-mars/server/rooms/game/events";
import { getAccomplishmentByID } from "@port-of-mars/server/data/Accomplishment";
import { Command } from "@port-of-mars/server/rooms/game/commands/types";
import { GameEvent } from "@port-of-mars/server/rooms/game/events/types";
import { settings } from "@port-of-mars/server/settings";
import { v4 as uuidv4 } from "uuid";
import { VoteHeroOrPariahRoleData } from "@port-of-mars/shared/game/requests";

const logger = settings.logging.getLogger(__filename);

export class SendChatMessageCmd implements Command {
  constructor(
    private message: string,
    private state: GameState,
    private player: Player
  ) {}

  static fromReq(
    r: req.SendChatMessageData,
    state: GameState,
    player: Player
  ): SendChatMessageCmd {
    return new SendChatMessageCmd(r.message, state, player);
  }

  execute(): Array<SentChatMessage> {
    // FIXME: add game ID to log messages, need to thread from the Game DB entity into GameState
    logger.debug(
      "[CHAT game %d] %s: %s",
      this.state.gameId,
      this.player.role,
      this.message
    );
    return [
      new SentChatMessage({
        message: this.message,
        dateCreated: new Date().getTime(),
        role: this.player.role,
        round: this.state.round,
      }),
    ];
  }
}

export class PurchaseAccomplishmentCmd implements Command {
  constructor(private id: number, private player: Player) {}

  static fromReq(
    r: req.PurchaseAccomplishmentCardData,
    player: Player
  ): PurchaseAccomplishmentCmd {
    return new PurchaseAccomplishmentCmd(r.id, player);
  }

  execute(): Array<PurchasedAccomplishment> {
    const role = this.player.role;
    const accomplishment = getAccomplishmentByID(role, this.id);
    if (this.player.isAccomplishmentPurchaseFeasible(accomplishment)) {
      return [new PurchasedAccomplishment({ accomplishment, role })];
    }
    return [];
  }
}

export class DiscardAccomplishmentCmd implements Command {
  constructor(private id: number, private player: Player) {}

  static fromReq(
    r: req.DiscardAccomplishmentCardData,
    player: Player
  ): DiscardAccomplishmentCmd {
    return new DiscardAccomplishmentCmd(r.id, player);
  }

  execute(): Array<GameEvent> {
    const role = this.player.role;
    return [new DiscardedAccomplishment({ id: this.id, role })];
  }
}

export class StageDiscardOfPurchasedAccomplishmentCmd implements Command {
  constructor(private id: number, private player: Player) {}

  static fromReq(
    r: req.StageDiscardOfPurchasedAccomplishmentCardData,
    player: Player
  ): StageDiscardOfPurchasedAccomplishmentCmd {
    return new StageDiscardOfPurchasedAccomplishmentCmd(r.id, player);
  }

  execute(): Array<GameEvent> {
    const role = this.player.role;
    return [new StagedDiscardOfPurchasedAccomplishment({ id: this.id, role })];
  }
}

export class TimeInvestmentCmd implements Command {
  constructor(private data: InvestmentData, private player: Player) {}

  static fromReq(r: req.SetTimeInvestmentData, player: Player) {
    // FIXME: why is this delete here?
    delete (r as any).kind;
    return new TimeInvestmentCmd(r, player);
  }

  execute(): Array<GameEvent> {
    const role = this.player.role;
    return [new TimeInvested({ investment: this.data, role })];
  }
}

export class SetPlayerReadinessCmd implements Command {
  constructor(private ready: boolean, private player: Player) {}

  static fromReq(
    r: req.SetPlayerReadinessData,
    player: Player
  ): SetPlayerReadinessCmd {
    return new SetPlayerReadinessCmd(r.value, player);
  }

  execute(): Array<GameEvent> {
    const role = this.player.role;
    return [new SetPlayerReadiness({ value: this.ready, role: role })];
  }
}

/*
 When a client clicks OK to the bot warning modal it issues this command
 */
export class ResetBotWarningCmd implements Command {
  constructor(private player: Player) {}

  static fromReq(player: Player): ResetBotWarningCmd {
    return new ResetBotWarningCmd(player);
  }

  execute(): Array<GameEvent> {
    const role = this.player.role;
    return [new BotWarningAcknowledged({ role })];
  }
}

export class AcceptTradeRequestCmd implements Command {
  constructor(private state: GameState, private id: string) {}

  static fromReq(
    r: req.AcceptTradeRequestData,
    state: GameState
  ): AcceptTradeRequestCmd {
    return new AcceptTradeRequestCmd(state, r.id);
  }

  execute(): Array<GameEvent> {
    const trade: Trade | undefined = this.state.tradeSet.get(this.id);
    if (!trade) {
      logger.info(
        "[GAME %d]: attempted to accept non-existent trade %s",
        this.state.gameId,
        this.id
      );
      return [];
    }
    const sender = this.state.players[trade.sender.role];
    const recipient = this.state.players[trade.recipient.role];
    if (this.state.canCompleteTrade(sender, recipient, trade)) {
      return [new AcceptedTradeRequest({ id: this.id })];
    } else {
      return [new ServerCanceledTradeRequest({ id: this.id })];
    }
  }
}

export class RejectTradeRequestCmd implements Command {
  constructor(private id: string) {}

  static fromReq(r: req.RejectTradeRequestData): RejectTradeRequestCmd {
    return new RejectTradeRequestCmd(r.id);
  }

  execute(): Array<GameEvent> {
    return [new RejectedTradeRequest({ id: this.id })];
  }
}

export class CancelTradeRequestCmd implements Command {
  constructor(private id: string, private player: Player) {}

  static fromReq(
    r: req.CancelTradeRequestData,
    player: Player
  ): CancelTradeRequestCmd {
    return new CancelTradeRequestCmd(r.id, player);
  }

  execute(): Array<GameEvent> {
    return [new CanceledTradeRequest({ id: this.id })];
  }
}

export class SendTradeRequestCmd implements Command {
  constructor(private trade: Omit<TradeData, "id">, private player: Player) {}

  static fromReq(
    r: req.SendTradeRequestData,
    player: Player
  ): SendTradeRequestCmd {
    return new SendTradeRequestCmd(r.trade, player);
  }

  execute(): Array<GameEvent> {
    if (this.player.canSendTradeRequest(this.trade.sender.resourceAmount)) {
      return [new SentTradeRequest({ ...this.trade, id: uuidv4() })];
    } else {
      return [];
    }
  }
}

export class SetNextPhaseCmd implements Command {
  constructor(private state: GameState) {}

  static fromReq(state: GameState): SetNextPhaseCmd {
    return new SetNextPhaseCmd(state);
  }

  execute(): Array<GameEvent> {
    if (this.state.systemHealth <= 0) {
      return [new EnteredDefeatPhase(this.state.playerScores)];
    }

    switch (this.state.phase) {
      case Phase.newRound:
        // do not run mars events in the first round
        return this.state.isFirstRound()
          ? [
              new SubtractedSystemHealthWearAndTear(),
              new EnteredInvestmentPhase(),
            ]
          : [
              new SubtractedSystemHealthWearAndTear(),
              new EnteredMarsEventPhase(),
              new InitializedMarsEvent(),
            ];
      case Phase.defeat:
        return [];
      case Phase.events: {
        const gameEvents = [];
        if (this.state.currentEvent) {
          gameEvents.push(new FinalizedMarsEvent());
        }
        if (this.state.hasMarsEventsToProcess()) {
          gameEvents.push(new ReenteredMarsEventPhase());
          gameEvents.push(new InitializedMarsEvent());
        } else {
          // finished processing all events, finalize all pending mars events in priority order
          gameEvents.push(new ExitedMarsEventPhase());
          gameEvents.push(new EnteredInvestmentPhase());
        }
        return gameEvents;
      }
      case Phase.invest:
        return this.state.tradingEnabled
          ? [new ExitedInvestmentPhase(), new EnteredTradePhase()]
          : [new ExitedInvestmentPhase(), new EnteredPurchasePhase()];
      case Phase.trade:
        return [new ExitedTradePhase(), new EnteredPurchasePhase()];
      case Phase.purchase:
        return [new ExitedPurchasePhase(), new EnteredDiscardPhase()];
      case Phase.discard: {
        const state = this.state;
        if (state.isLastRound()) {
          return [new EnteredVictoryPhase(state.playerScores)];
        }
        return [
          new AddedSystemHealthContributions(),
          new EnteredNewRoundPhase(),
        ];
      }
      case Phase.victory:
        return [];
    }
  }
}

export class ResetGameCmd implements Command {
  constructor(private state: GameState) {}

  static fromReq(r: req.ResetGameData, state: GameState): ResetGameCmd {
    return new ResetGameCmd(state);
  }

  execute(): Array<GameEvent> {
    // FIXME: dangerously replaces game object. For development only
    this.state.unsafeReset();
    return [];
  }
}

export class PersonalGainVotes implements Command {
  constructor(private vote: boolean, private player: Player) {}

  static fromReq(
    r: req.PersonalGainVotesData,
    player: Player
  ): PersonalGainVotes {
    return new PersonalGainVotes(r.vote, player);
  }

  execute(): Array<GameEvent> {
    return [
      new VotedForPersonalGain({ vote: this.vote, role: this.player.role }),
    ];
  }
}

export class VoteForPhilanthropistCmd implements Command {
  constructor(
    private voteData: req.VoteForPhilanthropistData,
    private player: Player
  ) {}

  static fromReq(
    r: req.VoteForPhilanthropistData,
    player: Player
  ): VoteForPhilanthropistCmd {
    return new VoteForPhilanthropistCmd(r, player);
  }

  execute(): Array<GameEvent> {
    return [
      new VotedForPhilanthropist({
        voter: this.player.role,
        vote: this.voteData.vote,
      }),
    ];
  }
}

export class OutOfCommissionCuratorCmd implements Command {
  constructor(
    private data: req.OutOfCommissionCuratorData,
    private player: Player
  ) {}

  static fromReq(
    r: req.OutOfCommissionCuratorData,
    player: Player
  ): OutOfCommissionCuratorCmd {
    return new OutOfCommissionCuratorCmd(r, player);
  }

  execute(): Array<GameEvent> {
    return [new OutOfCommissionedCurator({ role: this.player.role })];
  }
}

export class OutOfCommissionPoliticianCmd implements Command {
  constructor(
    private data: req.OutOfCommissionPoliticianData,
    private player: Player
  ) {}

  static fromReq(
    r: req.OutOfCommissionPoliticianData,
    player: Player
  ): OutOfCommissionPoliticianCmd {
    return new OutOfCommissionPoliticianCmd(r, player);
  }

  execute(): Array<GameEvent> {
    return [new OutOfCommissionedPolitician({ role: this.player.role })];
  }
}

export class OutOfCommissionResearcherCmd implements Command {
  constructor(
    private data: req.OutOfCommissionResearcherData,
    private player: Player
  ) {}

  static fromReq(
    r: req.OutOfCommissionResearcherData,
    player: Player
  ): OutOfCommissionResearcherCmd {
    return new OutOfCommissionResearcherCmd(r, player);
  }

  execute(): Array<GameEvent> {
    return [new OutOfCommissionedResearcher({ role: this.player.role })];
  }
}

export class OutOfCommissionPioneerCmd implements Command {
  constructor(
    private data: req.OutOfCommissionPioneerData,
    private player: Player
  ) {}

  static fromReq(
    r: req.OutOfCommissionPioneerData,
    player: Player
  ): OutOfCommissionPioneerCmd {
    return new OutOfCommissionPioneerCmd(r, player);
  }

  execute(): Array<GameEvent> {
    return [new OutOfCommissionedPioneer({ role: this.player.role })];
  }
}

export class OutOfCommissionEntrepreneurCmd implements Command {
  constructor(
    private data: req.OutOfCommissionEntrepreneurData,
    private player: Player
  ) {}

  static fromReq(
    r: req.OutOfCommissionEntrepreneurData,
    player: Player
  ): OutOfCommissionEntrepreneurCmd {
    return new OutOfCommissionEntrepreneurCmd(r, player);
  }

  execute(): Array<GameEvent> {
    return [new OutOfCommissionedEntrepreneur({ role: this.player.role })];
  }
}

export class BondingThroughAdversityCmd implements Command {
  constructor(
    private data: req.BondingThroughAdversityData,
    private player: Player
  ) {}

  static fromReq(
    r: req.BondingThroughAdversityData,
    player: Player
  ): BondingThroughAdversityCmd {
    return new BondingThroughAdversityCmd(r, player);
  }

  execute(): Array<GameEvent> {
    return [
      new SelectedInfluence({
        role: this.player.role,
        influence: this.data.influenceVoteData.influence,
      }),
    ];
  }
}

export class BreakdownOfTrustCmd implements Command {
  constructor(private data: req.BreakdownOfTrustData, private player: Player) {}

  static fromReq(
    r: req.BreakdownOfTrustData,
    player: Player
  ): BreakdownOfTrustCmd {
    return new BreakdownOfTrustCmd(r, player);
  }

  execute(): Array<GameEvent> {
    return [
      new BreakdownOfTrustOccured({
        role: this.player.role,
        savedResources: this.data.savedResources,
      }),
    ];
  }
}

export class ChooseHeroOrPariahCmd implements Command {
  constructor(private data: req.VoteHeroOrPariahData, private player: Player) {}

  static fromReq(
    r: req.VoteHeroOrPariahData,
    player: Player
  ): ChooseHeroOrPariahCmd {
    return new ChooseHeroOrPariahCmd(r, player);
  }

  execute(): Array<GameEvent> {
    return [
      new VoteHeroOrPariah({
        role: this.player.role,
        heroOrPariah: this.data.heroOrPariah,
      }),
    ];
  }
}

export class ChooseHeroOrPariahVoteRoleCmd implements Command {
  constructor(private data: VoteHeroOrPariahRoleData, private player: Player) {}

  static fromReq(
    r: req.VoteHeroOrPariahRoleData,
    player: Player
  ): ChooseHeroOrPariahVoteRoleCmd {
    return new ChooseHeroOrPariahVoteRoleCmd(r, player);
  }

  execute(): Array<GameEvent> {
    return [
      new VoteHeroOrPariahRole({
        role: this.player.role,
        vote: this.data.vote,
      }),
    ];
  }
}
