import { Client, Room } from 'colyseus';
import { Requests } from 'shared/requests';
import { Responses } from 'shared/responses';
import { GameState, Player } from '@/game/state';
import {
  AcceptTradeRequestCmd,
  BuyAccomplishmentCmd,
  DiscardAccomplishmentCmd,
  ResetGameCmd,
  SendChatMessageCmd,
  SendTradeRequestCmd,
  SetNextPhaseCmd,
  SetPlayerReadinessCmd,
  TimeInvestmentCmd,
  RejectTradeRequestCmd,
  EventSendPollResultsCmd,
  EventModifyInfluencesCmd,
  EventModifyAccomplishmentsCmd
} from '@/game/commands';
import { Game, PlayerReadiness } from '@/game/room/types';
import { CURATOR, Phase, Role, ROLES } from 'shared/types';
import { Command } from '@/game/commands/types';
import { StateSnapshotTaken } from '@/game/events';
import { GameEvent } from '@/game/events/types';
import {getRepository} from "typeorm";
import {User} from "@/entity/User";
import {verify} from "@/login";

export class GameRoom extends Room<GameState> implements Game {
  maxClients = 5;

  async onAuth(client: Client, options: any) {
    const userRepo = getRepository(User);
    const user = await verify(userRepo, options.token);
    if (user && Object.keys(this.state.connections).includes(user.username)) {
      return user;
    }
    return false;
  }

  onCreate(options: { [username: string]: Role }) {
    this.setState(new GameState(options));
    const snapshot = this.state.toJSON();
    const event = new StateSnapshotTaken(snapshot);
    this.clock.setInterval(this.gameLoop.bind(this), 1000);
  }

  onJoin(client: Client, options: any, auth: User) {
    const role = this.state.connections[auth.username];
    this.safeSend(client, { kind: 'set-player-role', role });
  }

  safeSend(client: Client, msg: Responses) {
    this.send(client, msg);
  }

  getPlayerByClient(client: Client): Player {
    return this.state.players[this.state.connections[client.sessionId]];
  }

  prepareRequest(r: Requests, client: Client): Command {
    switch (r.kind) {
      case 'send-chat-message':
        return SendChatMessageCmd.fromReq(r, this, client);
      case 'set-next-phase':
        return SetNextPhaseCmd.fromReq(this);
      case 'set-player-readiness':
        return SetPlayerReadinessCmd.fromReq(r, this, client);
      case 'reset-game':
        return ResetGameCmd.fromReq(r, this);
      case 'set-time-investment':
        return TimeInvestmentCmd.fromReq(r, this, client);
      case 'buy-accomplishment-card':
        return BuyAccomplishmentCmd.fromReq(r, this, client);
      case 'discard-accomplishment-card':
        return DiscardAccomplishmentCmd.fromReq(r, this, client);
      case 'accept-trade-request':
        return AcceptTradeRequestCmd.fromReq(r, this, client);
      case 'reject-trade-request':
        return RejectTradeRequestCmd.fromReq(r, this, client);
      case 'send-trade-request':
        return SendTradeRequestCmd.fromReq(r, this, client);
      case 'event-send-poll-results':
        return EventSendPollResultsCmd.fromReq(r, this, client);
      case 'event-modify-influences':
        return EventModifyInfluencesCmd.fromReq(r, this, client);
      case 'event-modify-accomplishments':
        return EventModifyAccomplishmentsCmd.fromReq(r, this, client);
    }
  }

  gameLoop() {
    this.state.timeRemaining -= 1;
    if (this.state.allPlayersAreReady || this.state.timeRemaining <= 0) {
      const cmd = new SetNextPhaseCmd(this);
      const events = cmd.execute();
      this.state.applyMany(events);
    }
  }

  onMessage(client: Client, message: Requests) {
    const cmd = this.prepareRequest(message, client);
    const events = cmd.execute();
    this.state.applyMany(events);
  }
  onLeave(client: Client, consented: boolean) {}
  onDispose() {}
}
