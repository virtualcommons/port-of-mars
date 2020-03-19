import http from "http";
import { Client, Room } from 'colyseus';
import { Requests, Responses } from '@port-of-mars/shared/game';
import { GameState, Player } from '@port-of-mars/server/rooms/game/state';
import {
  AcceptTradeRequestCmd,
  PurchaseAccomplishmentCmd,
  DiscardAccomplishmentCmd,
  ResetGameCmd,
  SendChatMessageCmd,
  SendTradeRequestCmd,
  SetNextPhaseCmd,
  SetPlayerReadinessCmd,
  TimeInvestmentCmd,
  RejectTradeRequestCmd,
  CancelTradeRequestCmd,
  PersonalGainVotes, VoteForPhilanthropistCmd,
  OutOfCommissionCuratorCmd, OutOfCommissionPoliticianCmd,
  OutOfCommissionResearcherCmd, OutOfCommissionPioneerCmd,
  OutOfCommissionEntrepreneurCmd,
  BondingThroughAdversityCmd,
  BreakdownOfTrustCmd
} from '@port-of-mars/server/rooms/game/commands';
import { Game, GameOpts, Metadata, Persister } from '@port-of-mars/server/rooms/game/types';
import { Command } from '@port-of-mars/server/rooms/game/commands/types';
import { TakenStateSnapshot } from '@port-of-mars/server/rooms/game/events';
import { User } from "@port-of-mars/server/entity/User";
import { settings } from "@port-of-mars/server/settings";
import { getServices } from "@port-of-mars/server/services";

const logger = settings.logging.getLogger(__filename);

export class GameRoom extends Room<GameState> implements Game {
  public static get NAME(): string { return 'port_of_mars_game_room' };
  maxClients = 5;
  autoDispose = false;
  persister!: Persister;
  gameId!: number;

  async onAuth(client: Client, options: any, request: http.IncomingMessage) {
    try {
      logger.debug('GameRoom.onAuth for client:', client.id);
      const user = await getServices().account.findUserById((request as any).session.passport.user);
      logger.debug('GameRoom.onAuth found user:', user);
      if (this.state.hasUser(user?.username)) {
        return user;
      }
      return false;
    }
    catch (e) {
      logger.fatal('GameRoom.onAuth exception: ', e);
      return false;
    }
  }

  async onCreate(options: GameOpts) {
    this.setState(new GameState(options));
    this.setPrivate(true);
    this.persister = options.persister;
    this.gameId = await this.persister.initialize(options, this.roomId);
    const snapshot = this.state.toJSON();
    const event = new TakenStateSnapshot(snapshot);
    this.persister.persist([event], this.getMetadata());
    this.clock.setInterval(this.gameLoop.bind(this), 1000);
  }

  safeSend(client: Client, msg: Responses) {
    this.send(client, msg);
  }

  getMetadata(): Metadata {
    return {
      gameId: this.gameId,
      dateCreated: new Date(),
      timeRemaining: this.state.timeRemaining
    }
  }

  getPlayer(client: Client): Player {
    return this.state.getPlayer(client.auth.username);
  }

  prepareRequest(r: Requests, client: Client): Command {
    logger.trace('prepareRequest from', client.id, ':', { r });
    const player = this.getPlayer(client);
    switch (r.kind) {
      case 'send-chat-message':
        return SendChatMessageCmd.fromReq(r, this.state, player);
      case 'set-next-phase':
        return SetNextPhaseCmd.fromReq(this.state);
      case 'set-player-readiness':
        return SetPlayerReadinessCmd.fromReq(r, player);
      case 'reset-game':
        return ResetGameCmd.fromReq(r, this.state);
      case 'set-time-investment':
        return TimeInvestmentCmd.fromReq(r, player);
      case 'purchase-accomplishment-card':
        return PurchaseAccomplishmentCmd.fromReq(r, player);
      case 'discard-accomplishment-card':
        return DiscardAccomplishmentCmd.fromReq(r, player);
      case 'accept-trade-request':
        return AcceptTradeRequestCmd.fromReq(r);
      case 'reject-trade-request':
        return RejectTradeRequestCmd.fromReq(r);
      case 'cancel-trade-request':
        return CancelTradeRequestCmd.fromReq(r, player);
      case 'send-trade-request':
        return SendTradeRequestCmd.fromReq(r, player);
      case 'personal-gain':
        return PersonalGainVotes.fromReq(r);
      case 'vote-for-philanthropist':
        return VoteForPhilanthropistCmd.fromReq(r, player);
      case 'out-of-commission-curator':
        return OutOfCommissionCuratorCmd.fromReq(r, player);
      case 'out-of-commission-politician':
        return OutOfCommissionPoliticianCmd.fromReq(r, player);
      case 'out-of-commission-researcher':
        return OutOfCommissionResearcherCmd.fromReq(r, player);
      case 'out-of-commission-pioneer':
        return OutOfCommissionPioneerCmd.fromReq(r, player);
      case 'out-of-commission-entrepreneur':
        return OutOfCommissionEntrepreneurCmd.fromReq(r, player);
      case 'bonding-through-adversity':
        return BondingThroughAdversityCmd.fromReq(r, player);
      case 'breakdown-of-trust':
        return BreakdownOfTrustCmd.fromReq(r, player);
    }
  }

  gameLoop() {
    this.state.timeRemaining -= 1;
    if (this.state.allPlayersAreReady || this.state.timeRemaining <= 0) {
      // phase initialization
      const cmd = new SetNextPhaseCmd(this.state);
      const events = cmd.execute();
      this.state.applyMany(events);
      this.persister.persist(events, this.getMetadata());
    }
  }

  onMessage(client: Client, message: Requests) {
    const cmd = this.prepareRequest(message, client);
    const events = cmd.execute();
    this.state.applyMany(events);
    this.persister.persist(events, this.getMetadata());
  }

  async onLeave(client: Client, consented: boolean) {
    const player = this.getPlayer(client);
    logger.info('player left:', client.id);
    try {
      player.connected = false;
      await this.allowReconnection(client);
      logger.info("player", client.id, "reconnected to", this.roomId);
      player.connected = true;
    } catch (e) {
      logger.fatal(e);
    }
  }

  onJoin(client: Client, options: any, auth: User) {
    logger.info(`client ${client.id} joined game ${this.roomId} ${auth}`);
    const player = this.getPlayer(client);
    this.safeSend(client, { kind: 'set-player-role', role: player.role });
  }

  async onDispose() {
    logger.info('Disposing of room', this.roomId)
  }

}