import * as req from 'shared/requests';
import {
  InvestmentData,
  Phase,
  TradeData,
  Role
} from 'shared/types';
import { MarsEvent, Player } from '@/rooms/game/state';
import {
  AcceptTradeRequest,
  BoughtAccomplishment,
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
  RejectTradeRequest,
  SetPlayerReadiness,
  PersonalGainVoted
} from '@/rooms/game/events';
import { getAccomplishmentByID } from '@/data/Accomplishment';
import { Client } from 'colyseus';
import { Game } from '@/rooms/game/types';
import { Command } from '@/rooms/game/commands/types';
import { GameEvent } from '@/rooms/game/events/types';

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
    console.log('PLAYER TROUBLESHOOT: ', p);
    return new SendChatMessageCmd(r.message, game, p);
  }

  execute() {
    console.log(`MESSAGE: ${this.message}\nPLAYER: ${this.player}`);
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

export class BuyAccomplishmentCmd implements Command {
  constructor(private id: number, private game: Game, private client: Client) {}

  static fromReq(r: req.BuyAccomplishmentCardData, game: Game, client: Client) {
    return new BuyAccomplishmentCmd(r.id, game, client);
  }

  execute() {
    const p = this.game.getPlayerByClient(this.client);
    const role = p.role;
    const accomplishment = getAccomplishmentByID(role, this.id);
    if (p.isAccomplishmentPurchaseFeasible(accomplishment)) {
      return [new BoughtAccomplishment({ accomplishment, role })];
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
    //console.log({r});
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
    return [new SentTradeRequest(this.trade)];
  }
}

export class SetNextPhaseCmd implements Command {
  constructor(private game: Game) {}

  static fromReq(game: Game) {
    return new SetNextPhaseCmd(game);
  }

  execute(): Array<GameEvent> {
    switch (this.game.state.phase) {
      case Phase.defeat:
        return [];
      case Phase.events: {
        if (
          this.game.state.marsEventsProcessed + 1 >=
          this.game.state.marsEvents.length
        ) {
          return [new EnteredInvestmentPhase()];
        } else {
          return [new ReenteredMarsEventPhase()];
        }
      }
      case Phase.invest:
        return [new EnteredTradePhase()];
      case Phase.trade:
        return [new EnteredPurchasePhase()];
      case Phase.purchase:
        return [new EnteredDiscardPhase()];
      case Phase.discard: {
        const game = this.game.state;
        const upkeep = game.nextRoundUpkeep();
        const round = game.round + 1;

        if (upkeep <= 0) {
          game.phase = Phase.defeat;
          return [new EnteredDefeatPhase()];
        }

        if (round >= game.maxRound) {
          game.phase = Phase.victory;
          return [new EnteredVictoryPhase()];
        }

        return [new EnteredMarsEventPhase()];
      }
      case Phase.pregame:
        return [new EnteredInvestmentPhase()];
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
    private results: Role,
    private game: Game,
    private player: Player
  ) {}

  static fromReq(r: req.PersonalGainVotesData, game: Game, client: Client) {
    const p = game.getPlayerByClient(client);
    return new PersonalGainVotes(r.value, game, p);
  }

  execute(): Array<GameEvent> {
    return [new PersonalGainVoted({ results: this.results })];
  }
}
