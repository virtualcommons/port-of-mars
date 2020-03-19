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
import { Client } from 'colyseus';
import { Game } from '@port-of-mars/server/rooms/game/types';
import { Command } from '@port-of-mars/server/rooms/game/commands/types';
import { GameEvent } from '@port-of-mars/server/rooms/game/events/types';
import { tradeIsValid } from "@port-of-mars/shared/validation";
import {settings} from "@port-of-mars/server/settings";

const logger = settings.logging.getLogger(__filename);

export class SendChatMessageCmd implements Command {
  constructor(
    private message: string,
    private game: Game,
    private player: Player
  ) {}

  static fromReq(
    r: req.SendChatMessageData,
    game: Game,
    client: Client
  ): SendChatMessageCmd {
    const p = game.getPlayerByClient(client);
    logger.trace('PLAYER TROUBLESHOOT: ', p);
    return new SendChatMessageCmd(r.message, game, p);
  }

  execute() {
    logger.trace(`MESSAGE: ${this.message}\nPLAYER: ${this.player}`);
    return [
      new SentChatMessage({
        message: this.message,
        dateCreated: new Date().getTime(),
        role: this.player.role,
        round: this.game.state.round
      })
    ];
  }
}

export class PurchaseAccomplishmentCmd implements Command {
  constructor(private id: number, private game: Game, private client: Client) {}

  static fromReq(r: req.PurchaseAccomplishmentCardData, game: Game, client: Client) {
    return new PurchaseAccomplishmentCmd(r.id, game, client);
  }

  execute() {
    const p = this.game.getPlayerByClient(this.client);
    const role = p.role;
    const accomplishment = getAccomplishmentByID(role, this.id);
    if (p.isAccomplishmentPurchaseFeasible(accomplishment)) {
      return [new PurchasedAccomplishment({ accomplishment, role })];
    }
    return [];
  }
}

export class DiscardAccomplishmentCmd implements Command {
  constructor(private id: number, private game: Game, private client: Client) {}

  static fromReq(
    r: req.DiscardAccomplishmentCardData,
    game: Game,
    client: Client
  ) {
    return new DiscardAccomplishmentCmd(r.id, game, client);
  }

  execute(): Array<GameEvent> {
    const p = this.game.getPlayerByClient(this.client);
    const role = p.role;
    return [new DiscardedAccomplishment({ id: this.id, role })];
  }
}

export class TimeInvestmentCmd implements Command {
  constructor(
    private data: InvestmentData,
    private game: Game,
    private player: Player
  ) {}

  static fromReq(r: req.SetTimeInvestmentData, game: Game, client: Client) {
    const p = game.getPlayerByClient(client);
    delete r.kind;
    return new TimeInvestmentCmd(r, game, p);
  }

  execute(): Array<GameEvent> {
    const role = this.player.role;
    return [new TimeInvested( { investment: this.data, role })];
  }
}

export class SetPlayerReadinessCmd implements Command {
  constructor(
    private ready: boolean,
    private game: Game,
    private player: Player
  ) {}

  static fromReq(r: req.SetPlayerReadinessData, game: Game, client: Client) {
    const p = game.getPlayerByClient(client);
    return new SetPlayerReadinessCmd(r.value, game, p);
  }

  execute(): Array<GameEvent> {
    const role = this.player.role;
    return [new SetPlayerReadiness({ value: this.ready, role: role })];
  }
}

export class AcceptTradeRequestCmd implements Command {
  constructor(private id: string, private game: Game, private player: Player) {}

  static fromReq(r: req.AcceptTradeRequestData, game: Game, client: Client) {
    const p = game.getPlayerByClient(client);

      return new AcceptTradeRequestCmd(r.id, game, p);

  }

  execute(): Array<GameEvent> {
    return [new AcceptedTradeRequest({ id: this.id })];
  }
}

export class RejectTradeRequestCmd implements Command {
  constructor(private id: string, private game: Game, private player: Player) {}

  static fromReq(r: req.RejectTradeRequestData, game: Game, client: Client) {
    const p = game.getPlayerByClient(client);
    return new RejectTradeRequestCmd(r.id, game, p);
  }

  execute(): Array<GameEvent> {
    return [new RejectedTradeRequest({ id: this.id })];
  }
}

export class CancelTradeRequestCmd implements Command {
  constructor(private id: string, private game: Game, private player: Player) {}

  static fromReq(r: req.CancelTradeRequestData, game: Game, client: Client) {
    const p = game.getPlayerByClient(client);
    return new CancelTradeRequestCmd(r.id, game, p);
  }

  execute(): Array<GameEvent> {
    return [new CanceledTradeRequest({ id: this.id })];
  }
}

export class SendTradeRequestCmd implements Command {
  constructor(
    private trade: TradeData,
    private game: Game,
    private player: Player
  ) {}

  static fromReq(r: req.SendTradeRequestData, game: Game, client: Client) {
    const p = game.getPlayerByClient(client);
    return new SendTradeRequestCmd(r.trade, game, p);
  }

  execute(): Array<GameEvent> {
    if(tradeIsValid(this.player,this.trade.from.resourceAmount)){
      return [new SentTradeRequest(this.trade)];
    } else{
      return [];
    }

  }
}

export class SetNextPhaseCmd implements Command {
  constructor(private game: Game) {}

  upkeep:number = this.game.state.upkeep;

  static fromReq(game: Game) {
    return new SetNextPhaseCmd(game);
  }

  /**
   * Ends game if upkeep is less than or equal to 0;
   * @param upkeep The number value of upkeep.
   *
   */
  gameOver(upkeep: number) {
    if (upkeep <= 0) {
      //this.game.state.phase = Phase.defeat;
      console.log('Upkeep is now,', upkeep);
      return [new EnteredDefeatPhase()];
    }
    else{
      return [];
    }
  }

  execute(): Array<GameEvent> {
    switch (this.game.state.phase) {
      case Phase.defeat:
        return [];
      case Phase.events: {
        const events = [];
        if (this.game.state.currentEvent) {
          events.push(new FinalizedMarsEvent());
        }
        if (
          this.game.state.marsEventsProcessed + 1 >=
          this.game.state.marsEvents.length
        ) {
          events.push(new EnteredInvestmentPhase());
          console.log(this.game.state.upkeep);

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
        const game = this.game.state;
        const round = game.round + 1;

        if (round >= game.maxRound) {
          game.phase = Phase.victory;
          return [new EnteredVictoryPhase(this.game.state.timeRemaining)];
        }
        return [new EnteredMarsEventPhase(), new InitializedMarsEvent(), new EnteredDefeatPhase()];
      }
      case Phase.victory:
        return [];
    }
  }
}

export class ResetGameCmd implements Command {
  constructor(private game: Game) {}

  static fromReq(r: req.ResetGameData, game: Game) {
    return new ResetGameCmd(game);
  }

  execute(): Array<GameEvent> {
    // NOTE: dangerously replaces game object. For development only
    this.game.state.unsafeReset();
    return [];
  }
}

export class PersonalGainVotes implements Command {
  constructor(
    private results: req.PersonalGainVotesData,
    private game: Game,
    private player: Player
  ) {}

  static fromReq(r: req.PersonalGainVotesData, game: Game, client: Client) {
    const p = game.getPlayerByClient(client);
    return new PersonalGainVotes(r, game, p);
  }

  execute(): Array<GameEvent> {
    return [new VotedForPersonalGain(this.results.value)];
  }
}

export class VoteForPhilanthropistCmd implements Command {
  constructor(
    private voteData: req.VoteForPhilanthropistData,
    private game: Game,
    private player: Player
  ) {}

  static fromReq(r: req.VoteForPhilanthropistData, game: Game, client: Client) {
    const p = game.getPlayerByClient(client);
    return new VoteForPhilanthropistCmd(r, game, p);
  }

  execute(): Array<GameEvent> {
    return [new VotedForPhilanthropist({ voter: this.player.role, vote: this.voteData.vote })];
  }
}

export class OutOfCommissionCuratorCmd implements Command {
  constructor(
    private data: req.OutOfCommissionCuratorData,
    private game: Game,
    private player: Player
  ) {}

  static fromReq(r: req.OutOfCommissionCuratorData, game: Game, client: Client) {
    const p = game.getPlayerByClient(client);
    return new OutOfCommissionCuratorCmd(r, game, p);
  }

  execute(): Array<GameEvent> {
    return [new OutOfCommissionedCurator({ role: this.player.role })]
  }
}

export class OutOfCommissionPoliticianCmd implements Command {
  constructor(
    private data: req.OutOfCommissionPoliticianData,
    private game: Game,
    private player: Player
  ) {}

  static fromReq(r: req.OutOfCommissionPoliticianData, game: Game, client: Client) {
    const p = game.getPlayerByClient(client);
    return new OutOfCommissionPoliticianCmd(r, game, p);
  }

  execute(): Array<GameEvent> {
    return [new OutOfCommissionedPoliician( { role: this.player.role })]
  }
}

export class OutOfCommissionResearcherCmd implements Command {
  constructor(
    private data: req.OutOfCommissionResearcherData,
    private game: Game,
    private player: Player
  ) {}

  static fromReq(r: req.OutOfCommissionResearcherData, game: Game, client: Client) {
    const p = game.getPlayerByClient(client);
    return new OutOfCommissionResearcherCmd(r, game, p);
  }

  execute(): Array<GameEvent> {
    return [new OutOfComissionedResearcher({ role: this.player.role })]
  }
}

export class OutOfCommissionPioneerCmd implements Command {
  constructor(
    private data: req.OutOfCommissionPioneerData,
    private game: Game,
    private player: Player
  ) {}

  static fromReq(r: req.OutOfCommissionPioneerData, game: Game, client: Client) {
    const p = game.getPlayerByClient(client);
    return new OutOfCommissionPioneerCmd(r, game, p);
  }

  execute(): Array<GameEvent> {
    return [new OutOfCommissionedPioneer({ role: this.player.role })]
  }
}

export class OutOfCommissionEntrepreneurCmd implements Command {
  constructor(
    private data: req.OutOfCommissionEntrepreneurData,
    private game: Game,
    private player: Player
  ) {}

  static fromReq(r: req.OutOfCommissionEntrepreneurData, game: Game, client: Client) {
    const p = game.getPlayerByClient(client);
    return new OutOfCommissionEntrepreneurCmd(r, game, p);
  }

  execute(): Array<GameEvent> {
    return [new OutOfCommissionedEntrepreneur({ role: this.player.role })]
  }
}

export class BondingThroughAdversityCmd implements Command {
  constructor(
    private data: req.BondingThroughAdversityData,
    private game: Game,
    private player: Player
  ) {}

  static fromReq(r: req.BondingThroughAdversityData, game: Game, client: Client) {
    const p = game.getPlayerByClient(client);
    return new BondingThroughAdversityCmd(r, game, p);
  }

  execute(): Array<GameEvent> {
    return [new SelectedInfluence({role: this.player.role, influence: this.data.influenceVoteData.influence }) ]
  }
}

export class BreakdownOfTrustCmd implements Command {
  constructor(
    private data: req.BreakdownOfTrustData,
    private game: Game,
    private player: Player,
  ){}

  static fromReq(r: req.BreakdownOfTrustData, game: Game, client: Client){
    const p = game.getPlayerByClient(client);
    return new BreakdownOfTrustCmd(r, game, p);
  }

  execute(): Array<GameEvent> {
    return [new KeptResources({role: this.player.role, savedResources: this.data.savedResources})];
  }
}
