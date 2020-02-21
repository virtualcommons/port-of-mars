import {Client, Delayed, Room} from 'colyseus';
import { Requests } from 'shared/requests';
import { Responses } from 'shared/responses';
import { GameState, Player } from '@/rooms/game/state';
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
  PersonalGainVotes, VoteForPhilanthropistCmd, 
  OutOfCommissionCuratorCmd, OutOfCommissionPoliticianCmd, 
  OutOfCommissionResearcherCmd, OutOfCommissionPioneerCmd,
  DeleteNotificationCmd,
  OutOfCommissionEntrepreneurCmd,
  BondingThroughAdversityCmd
} from '@/rooms/game/commands';
import {Game, GameOpts, Persister} from '@/rooms/game/types';
import { Command } from '@/rooms/game/commands/types';
import { StateSnapshotTaken } from '@/rooms/game/events';
import {User} from "@/entity/User";
import {getUserByJWT} from "@/services/account";

export class GameRoom extends Room<GameState> implements Game {
  maxClients = 5;
  persister!: Persister;
  gameId!: number;

  async onAuth(client: Client, options: any) {
    const user = await getUserByJWT(options.token);
    if (user && Object.keys(this.state.userRoles).includes(user.username)) {
      return user;
    }
    return false;
  }

  async onCreate(options: GameOpts) {
    this.setState(new GameState(options));
    this.persister = options.persister;
    this.gameId = await this.persister.initialize(options);
    const snapshot = this.state.toJSON();
    const event = new StateSnapshotTaken(snapshot);
    this.persister.applyMany(this.gameId, [event]);
    this.clock.setInterval(this.gameLoop.bind(this), 1000);
  }

  onJoin(client: Client, options: any, auth: User) {
    const role = this.state.userRoles[auth.username];
    this.safeSend(client, { kind: 'set-player-role', role });
  }

  safeSend(client: Client, msg: Responses) {
    this.send(client, msg);
  }

  getPlayerByClient(client: Client): Player {
    return this.state.players[this.state.userRoles[client.auth.username]];
  }

  prepareRequest(r: Requests, client: Client): Command {
    console.log({r});
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
      case 'personal-gain':
        return PersonalGainVotes.fromReq(r, this, client);
      case 'vote-for-philanthropist':
        return VoteForPhilanthropistCmd.fromReq(r, this, client);
      case 'out-of-commission-curator':
        return OutOfCommissionCuratorCmd.fromReq(r, this, client);
      case 'out-of-commission-politician':
        return OutOfCommissionPoliticianCmd.fromReq(r, this, client);
      case 'out-of-commission-researcher':
        return OutOfCommissionResearcherCmd.fromReq(r, this, client);
      case 'out-of-commission-pioneer':
        return OutOfCommissionPioneerCmd.fromReq(r, this, client);
      case 'delete-notification':
        return DeleteNotificationCmd.fromReq(r, this, client);
      case 'out-of-commission-entrepreneur':
        return OutOfCommissionEntrepreneurCmd.fromReq(r, this, client);
      case 'bonding-through-adversity':
        return BondingThroughAdversityCmd.fromReq(r, this, client);
    }
  }

  gameLoop() {
    this.state.timeRemaining -= 1;
    if (this.state.allPlayersAreReady || this.state.timeRemaining <= 0) {
      const cmd = new SetNextPhaseCmd(this);
      const events = cmd.execute();
      this.state.applyMany(events);
      this.persister.applyMany(this.gameId, events);
    }
  }

  onMessage(client: Client, message: Requests) {
    const cmd = this.prepareRequest(message, client);
    const events = cmd.execute();
    this.state.applyMany(events);
    this.persister.applyMany(this.gameId, events);
  }
  onLeave(client: Client, consented: boolean) {}

  async onDispose() {

  }
}
