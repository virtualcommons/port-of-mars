import http from "http";
import {Client, Delayed, Room} from 'colyseus';
import {Requests} from '@port-of-mars/shared/game/requests';
import {Responses} from '@port-of-mars/shared/game/responses';
import {GameState, Player} from '@port-of-mars/server/rooms/game/state';
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
import { findUserById } from "@port-of-mars/server/services/account";

const logger = settings.logging.getLogger(__filename);

export class GameRoom extends Room<GameState> implements Game {
  maxClients = 5;
  persister!: Persister;
  gameId!: number;

  async onAuth(client: Client, options: any, request?: http.IncomingMessage) {
    const user = await findUserById((request as any).session.passport.user);
    if (user && Object.keys(this.state.userRoles).includes(user.username)) {
      return user;
    }
    return false;
  }

  async onCreate(options: GameOpts) {
    this.setState(new GameState(options));
    this.persister = options.persister;
    this.gameId = await this.persister.initialize(options, this.roomId);
    const snapshot = this.state.toJSON();
    const event = new TakenStateSnapshot(snapshot);
    this.persister.applyMany([event], this.getMetadata());
    this.clock.setInterval(this.gameLoop.bind(this), 1000);
  }

  onJoin(client: Client, options: any, auth: User) {
    const role = this.state.userRoles[auth.username];
    this.safeSend(client, {kind: 'set-player-role', role});
  }

  onMessage(client: Client, message: Requests) {
    const cmd = this.prepareRequest(message, client);
    const events = cmd.execute();
    this.state.applyMany(events);
    this.persister.applyMany(this.gameId, events);
  }

  async onLeave(client: Client, consented: boolean) {
    const player = this.state.getPlayer(client.auth.username);
    logger.info('player left: ', player);
    try {
      if (consented) {
        logger.info('player closed the window or left manually');
      }
      await this.allowReconnection(client, 60*4);
      logger.info("player reconnected!");
      this.safeSend(client, { kind: "set-player-role", role: player.role });
    } catch (e) {
      logger.info(e);
    }
  }

  async onDispose() {
    logger.info('Disposing of room', this.roomId)
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

  getPlayerByClient(client: Client): Player {
    return this.state.getPlayer(client.auth.username);
  }

  prepareRequest(r: Requests, client: Client): Command {
    logger.trace({r});
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
      case 'purchase-accomplishment-card':
        return PurchaseAccomplishmentCmd.fromReq(r, this, client);
      case 'discard-accomplishment-card':
        return DiscardAccomplishmentCmd.fromReq(r, this, client);
      case 'accept-trade-request':
        return AcceptTradeRequestCmd.fromReq(r, this, client);
      case 'reject-trade-request':
        return RejectTradeRequestCmd.fromReq(r, this, client);
      case 'cancel-trade-request':
        return CancelTradeRequestCmd.fromReq(r, this, client);
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
      case 'out-of-commission-entrepreneur':
        return OutOfCommissionEntrepreneurCmd.fromReq(r, this, client);
      case 'bonding-through-adversity':
        return BondingThroughAdversityCmd.fromReq(r, this, client);
      case 'breakdown-of-trust':
        return BreakdownOfTrustCmd.fromReq(r, this, client);
    }
  }

  gameLoop() {
    this.state.timeRemaining -= 1;
    if (this.state.allPlayersAreReady || this.state.timeRemaining <= 0) {
      const cmd = new SetNextPhaseCmd(this);
      const events = cmd.execute();
      this.state.applyMany(events);
      this.persister.applyMany(events, this.getMetadata());
    }
  }

  onMessage(client: Client, message: Requests) {
    const cmd = this.prepareRequest(message, client);
    const events = cmd.execute();
    this.state.applyMany(events);
    this.persister.applyMany(events, this.getMetadata());
  }
  onLeave(client: Client, consented: boolean) {}
}
