import * as req from '@port-of-mars/shared/game/requests';
import { InvestmentData, Phase, TradeData, Role, INVESTMENTS } from '@port-of-mars/shared/types';
import { Player } from '@port-of-mars/server/rooms/game/state';
import {
  AcceptedTradeRequest,
  PurchasedAccomplishment,
  DiscardedAccomplishment,
  EnteredDefeatPhase,
  EnteredDiscardPhase,
  EnteredInvestmentPhase,
  EnteredMarsEventPhase,
  EnteredPurchasePhase,
  EnteredTradePhase,
  EnteredVictoryPhase,
  ReenteredMarsEventPhase,
  SentChatMessage,
  SentTradeRequest,
  TimeInvested,
  RejectedTradeRequest,
  CanceledTradeRequest,
  SetPlayerReadiness,
  VotedForPersonalGain, VotedForPhilanthropist,
  FinalizedMarsEvent, OutOfCommissionedCurator,
  OutOfCommissionedPoliician, OutOfComissionedResearcher,
  OutOfCommissionedPioneer, OutOfCommissionedEntrepreneur, SelectedInfluence, KeptResources, InitializedMarsEvent
} from '@port-of-mars/server/rooms/game/events';
import { getAccomplishmentByID } from '@port-of-mars/server/data/Accomplishment';
import { GameState } from '@port-of-mars/server/rooms/game/state';
import { Command } from '@port-of-mars/server/rooms/game/commands/types';
import { GameEvent } from '@port-of-mars/server/rooms/game/events/types';
import { tradeIsValid } from "@port-of-mars/shared/validation";
import { settings } from "@port-of-mars/server/settings";

const logger = settings.logging.getLogger(__filename);


export class SendChatMessageCmd implements Command {
  constructor(
    private message: string,
    private state: GameState,
    private player: Player
  ) { }

  static fromReq(
    r: req.SendChatMessageData,
    state: GameState,
    player: Player
  ): SendChatMessageCmd {
    return new SendChatMessageCmd(r.message, state, player);
  }

  execute() {
    logger.trace(`MESSAGE: ${this.message}\nPLAYER: ${this.player}`);
    return [
      new SentChatMessage({
        message: this.message,
        dateCreated: new Date().getTime(),
        role: this.player.role,
        round: this.state.round
      })
    ];
  }
}

export class PurchaseAccomplishmentCmd implements Command {
  constructor(private id: number, private player: Player) { }

  static fromReq(r: req.PurchaseAccomplishmentCardData, player: Player) {
    return new PurchaseAccomplishmentCmd(r.id, player);
  }

  execute() {
    const role = this.player.role;
    const accomplishment = getAccomplishmentByID(role, this.id);
    if (this.player.isAccomplishmentPurchaseFeasible(accomplishment)) {
      return [new PurchasedAccomplishment({ accomplishment, role })];
    }
    return [];
  }
}

export class DiscardAccomplishmentCmd implements Command {
  constructor(private id: number, private player: Player) { }

  static fromReq(
    r: req.DiscardAccomplishmentCardData,
    player: Player
  ) {
    return new DiscardAccomplishmentCmd(r.id, player);
  }

  execute(): Array<GameEvent> {
    const role = this.player.role;
    return [new DiscardedAccomplishment({ id: this.id, role })];
  }
}

export class TimeInvestmentCmd implements Command {
  constructor(
    private data: InvestmentData,
    private player: Player
  ) { }

  static fromReq(r: req.SetTimeInvestmentData, player: Player) {
    // FIXME: why is this delete here?
    delete r.kind;
    return new TimeInvestmentCmd(r, player);
  }

  execute(): Array<GameEvent> {
    const role = this.player.role;
    return [new TimeInvested({ investment: this.data, role })];
  }
}

export class SetPlayerReadinessCmd implements Command {
  constructor(
    private ready: boolean,
    private player: Player
  ) { }

  static fromReq(r: req.SetPlayerReadinessData, player: Player) {
    return new SetPlayerReadinessCmd(r.value, player);
  }

  execute(): Array<GameEvent> {
    const role = this.player.role;
    return [new SetPlayerReadiness({ value: this.ready, role: role })];
  }
}

export class AcceptTradeRequestCmd implements Command {
  constructor(private id: string, private player: Player) { }

  static fromReq(r: req.AcceptTradeRequestData, player: Player) {
    return new AcceptTradeRequestCmd(r.id, player);
  }

  execute(): Array<GameEvent> {
    return [new AcceptedTradeRequest({ id: this.id })];
  }
}

export class RejectTradeRequestCmd implements Command {
  constructor(private id: string, private player: Player) { }

  static fromReq(r: req.RejectTradeRequestData, player: Player) {
    return new RejectTradeRequestCmd(r.id, this.player);
  }

  execute(): Array<GameEvent> {
    return [new RejectedTradeRequest({ id: this.id })];
  }
}

export class CancelTradeRequestCmd implements Command {
  constructor(private id: string, private player: Player) { }

  static fromReq(r: req.CancelTradeRequestData, player: Player) {
    return new CancelTradeRequestCmd(r.id, player);
  }

  execute(): Array<GameEvent> {
    return [new CanceledTradeRequest({ id: this.id })];
  }
}

export class SendTradeRequestCmd implements Command {
  constructor(
    private trade: TradeData,
    private player: Player
  ) { }

  static fromReq(r: req.SendTradeRequestData, player: Player) {
    return new SendTradeRequestCmd(r.trade, player);
  }

  execute(): Array<GameEvent> {
    if (tradeIsValid(this.player, this.trade.from.resourceAmount)) {
      return [new SentTradeRequest(this.trade)];
    }
    else {
      return [];
    }

  }
}

export class SetNextPhaseCmd implements Command {
  constructor(private state: GameState) { }

  upkeep: number = this.state.upkeep;

  static fromReq(state: GameState) {
    return new SetNextPhaseCmd(state);
  }

  /**
   * Ends game if upkeep is less than or equal to 0;
   * @param upkeep The number value of upkeep.
   *
   */
  gameOver(upkeep: number) {
    if (upkeep <= 0) {
      //this.game.state.phase = Phase.defeat;
      logger.info('SetNextPhaseCmd: upkeep reached 0', upkeep);
      return [new EnteredDefeatPhase()];
    }
    else {
      return [];
    }
  }

  execute(): Array<GameEvent> {
    switch (this.state.phase) {
      case Phase.defeat:
        return [];
      case Phase.events: {
        const events = [];
        if (this.state.currentEvent) {
          events.push(new FinalizedMarsEvent());
        }
        if (
          this.state.marsEventsProcessed + 1 >=
          this.state.marsEvents.length
        ) {
          events.push(new EnteredInvestmentPhase());
          logger.info('enter investment phase:', this.state.upkeep);

        } else {
          events.push(new ReenteredMarsEventPhase());
          events.push(new InitializedMarsEvent());
        }

        events.push(new EnteredDefeatPhase());
        return events;
      }
      case Phase.invest:
        return [new EnteredTradePhase()];
      case Phase.trade:
        return [new EnteredPurchasePhase()];
      case Phase.purchase:


        return [new EnteredDiscardPhase(), new EnteredDefeatPhase()];

      case Phase.discard: {
        const state = this.state;
        const round = state.round + 1;

        if (round >= state.maxRound) {
          state.phase = Phase.victory;
          return [new EnteredVictoryPhase(state.timeRemaining)];
        }
        return [new EnteredMarsEventPhase(), new InitializedMarsEvent(), new EnteredDefeatPhase()];
      }
      case Phase.victory:
        return [];
    }
  }
}

export class ResetGameCmd implements Command {
  constructor(private state: GameState) { }

  static fromReq(r: req.ResetGameData, state: GameState) {
    return new ResetGameCmd(state);
  }

  execute(): Array<GameEvent> {
    // FIXME: dangerously replaces game object. For development only
    this.state.unsafeReset();
    return [];
  }
}

export class PersonalGainVotes implements Command {
  constructor(
    private results: req.PersonalGainVotesData,
  ) { }

  static fromReq(r: req.PersonalGainVotesData) {
    return new PersonalGainVotes(r);
  }

  execute(): Array<GameEvent> {
    return [new VotedForPersonalGain(this.results.value)];
  }
}

export class VoteForPhilanthropistCmd implements Command {
  constructor(
    private voteData: req.VoteForPhilanthropistData,
    private player: Player
  ) { }

  static fromReq(r: req.VoteForPhilanthropistData, player: Player) {
    return new VoteForPhilanthropistCmd(r, player);
  }

  execute(): Array<GameEvent> {
    return [new VotedForPhilanthropist({ voter: this.player.role, vote: this.voteData.vote })];
  }
}

export class OutOfCommissionCuratorCmd implements Command {
  constructor(
    private data: req.OutOfCommissionCuratorData,
    private player: Player
  ) { }

  static fromReq(r: req.OutOfCommissionCuratorData, player: Player) {
    return new OutOfCommissionCuratorCmd(r, player);
  }

  execute(): Array<GameEvent> {
    return [new OutOfCommissionedCurator({ role: this.player.role })]
  }
}

export class OutOfCommissionPoliticianCmd implements Command {
  constructor(
    private data: req.OutOfCommissionPoliticianData,
    private player: Player
  ) { }

  static fromReq(r: req.OutOfCommissionPoliticianData, player: Player) {
    return new OutOfCommissionPoliticianCmd(r, player);
  }

  execute(): Array<GameEvent> {
    return [new OutOfCommissionedPoliician({ role: this.player.role })]
  }
}

export class OutOfCommissionResearcherCmd implements Command {
  constructor(
    private data: req.OutOfCommissionResearcherData,
    private player: Player
  ) { }

  static fromReq(r: req.OutOfCommissionResearcherData, player: Player) {
    return new OutOfCommissionResearcherCmd(r, player);
  }

  execute(): Array<GameEvent> {
    return [new OutOfComissionedResearcher({ role: this.player.role })]
  }
}

export class OutOfCommissionPioneerCmd implements Command {
  constructor(
    private data: req.OutOfCommissionPioneerData,
    private player: Player
  ) { }

  static fromReq(r: req.OutOfCommissionPioneerData, player: Player) {
    return new OutOfCommissionPioneerCmd(r, player);
  }

  execute(): Array<GameEvent> {
    return [new OutOfCommissionedPioneer({ role: this.player.role })]
  }
}

export class OutOfCommissionEntrepreneurCmd implements Command {
  constructor(
    private data: req.OutOfCommissionEntrepreneurData,
    private player: Player
  ) { }

  static fromReq(r: req.OutOfCommissionEntrepreneurData, player: Player) {
    return new OutOfCommissionEntrepreneurCmd(r, player);
  }

  execute(): Array<GameEvent> {
    return [new OutOfCommissionedEntrepreneur({ role: this.player.role })]
  }
}

export class BondingThroughAdversityCmd implements Command {
  constructor(
    private data: req.BondingThroughAdversityData,
    private player: Player
  ) { }

  static fromReq(r: req.BondingThroughAdversityData, player: Player) {
    return new BondingThroughAdversityCmd(r, player);
  }

  execute(): Array<GameEvent> {
    return [new SelectedInfluence({ role: this.player.role, influence: this.data.influenceVoteData.influence })]
  }
}

export class BreakdownOfTrustCmd implements Command {
  constructor(
    private data: req.BreakdownOfTrustData,
    private player: Player,
  ) { }

  static fromReq(r: req.BreakdownOfTrustData, player: Player) {
    return new BreakdownOfTrustCmd(r, player);
  }

  execute(): Array<GameEvent> {
    return [new KeptResources({ role: this.player.role, savedResources: this.data.savedResources })];
  }
}