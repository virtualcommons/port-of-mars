import * as req from 'shared/requests';
import { InvestmentData, Phase, TradeData, Role, INVESTMENTS } from 'shared/types';
import { Player } from '@/rooms/game/state';
import {
  AcceptTradeRequest,
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
  DeleteNotification,
  RejectTradeRequest,
  SetPlayerReadiness,
  PersonalGainVoted, VotedForPhilanthropist, 
  MarsEventFinalized, CommissionCurator, 
  CommissionPolitician, CommissionResearcher, 
  CommissionPioneer, CommissionEntrepreneur, SelectedInfluence, SaveResources, MarsEventInitialized
} from '@/rooms/game/events';
import { getAccomplishmentByID } from '@/data/Accomplishment';
import { Client } from 'colyseus';
import { Game } from '@/rooms/game/types';
import { Command } from '@/rooms/game/commands/types';
import { GameEvent } from '@/rooms/game/events/types';
import { tradeIsValid } from "shared/validation";
import {settings} from "@/settings";

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
    return [new TimeInvested({ investment: this.data, role })];
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
    return [new AcceptTradeRequest({ id: this.id })];
  }
}

export class RejectTradeRequestCmd implements Command {
  constructor(private id: string, private game: Game, private player: Player) {}

  static fromReq(r: req.RejectTradeRequestData, game: Game, client: Client) {
    const p = game.getPlayerByClient(client);
    return new RejectTradeRequestCmd(r.id, game, p);
  }

  execute(): Array<GameEvent> {
    return [new RejectTradeRequest({ id: this.id })];
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

  upkeep: number = this.game.state.nextRoundUpkeep();

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
      this.game.state.phase = Phase.defeat;
      return [new EnteredDefeatPhase()];
    }
  }

  execute(): Array<GameEvent> {
    switch (this.game.state.phase) {
      case Phase.defeat:
        return [];
      case Phase.events: {
        const events = [];
        if (this.game.state.currentEvent) {
          events.push(new MarsEventFinalized())
        }
        if (
          this.game.state.marsEventsProcessed + 1 >=
          this.game.state.marsEvents.length
        ) {
          events.push(new EnteredInvestmentPhase());
          this.gameOver(this.upkeep);
        } else {
          events.push(new ReenteredMarsEventPhase());
          events.push(new MarsEventInitialized());
          this.gameOver(this.upkeep);
        }

        return events;
      }
      case Phase.invest:
        return [new EnteredTradePhase()];
      case Phase.trade:
        return [new EnteredPurchasePhase()];
      case Phase.purchase:
        this.gameOver(this.upkeep);
        return [new EnteredDiscardPhase()];
      case Phase.discard: {
        const game = this.game.state;
        const round = game.round + 1;

        this.gameOver(this.upkeep);

        if (round >= game.maxRound) {
          game.phase = Phase.victory;
          return [new EnteredVictoryPhase()];
        }

        return [new EnteredMarsEventPhase(), new MarsEventInitialized()];
      }
      case Phase.victory:
        return [];
    }
  }
}

export class DeleteNotificationCmd implements Command {
  constructor(public index: number, game: Game, public player: Player){}

  static fromReq(r: req.DeleteNotificationData, game: Game, client: Client){
    const p = game.getPlayerByClient(client);
    return new DeleteNotificationCmd(r.index, game, p);
  }

  execute(){
    return [new DeleteNotification({index:this.index, player:this.player})];
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
    return [new PersonalGainVoted(this.results.value)];
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
    return [new CommissionCurator({ role: this.player.role })]
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
    return [new CommissionPolitician({ role: this.player.role })]
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
    return [new CommissionResearcher({ role: this.player.role })]
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
    return [new CommissionPioneer({ role: this.player.role })]
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
    return [new CommissionEntrepreneur({ role: this.player.role })]
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
    return [new SaveResources({role: this.player.role, savedResources: this.data.savedResources})];
  }
}
