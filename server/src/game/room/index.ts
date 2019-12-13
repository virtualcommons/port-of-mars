import {Client, Room} from "colyseus";
import {Requests} from "shared/requests"
import {Responses} from "shared/responses"
import {GameState, Player} from "@/game/state";
import {
  AcceptTradeRequestCmd,
  BuyAccomplishmentCmd, DiscardAccomplishmentCmd,
  ResetGameCmd,
  SendChatMessageCmd, SendTradeRequestCmd,
  SetNextPhaseCmd,
  SetPlayerReadinessCmd,
  TimeInvestmentCmd
} from "@/game/commands";
import {Game, PlayerReadiness} from "@/game/room/types";
import {CURATOR, Phase, Role, ROLES} from "shared/types";
import {Command} from "@/game/commands/types";
import {
  PlayerJoined, StateSnapshotTaken
} from "@/game/events";
import {GameEvent} from "@/game/events/types";

export class GameRoom extends Room<GameState> implements Game {
  maxClients = 5;

  onCreate (options: any) {
    this.setState(new GameState());
    const snapshot = this.state.toJSON();
    const event = new StateSnapshotTaken(snapshot);
  }

  onJoin (client: Client, options: any) {
    console.log('ran!');
    this.createPlayer(client);
  }

  safeSend(client: Client, msg: Responses) {
    this.send(client, msg);
  }

  createPlayer(client: Client) {
    const role = this.state.availableRoles.pop();
    if (role === undefined) {
      this.safeSend(client, { kind: 'error', message: 'Player create failed. Out of sessions'});
      return;
    }
    const e = new PlayerJoined(client.sessionId, role);
    this.state.apply(e);
    this.safeSend(client, { kind: 'set-player-role', role })
  }

  getPlayerByClient(client: Client): Player {
    return this.state.players[this.state.connections[client.sessionId]];
  }

  prepareRequest(r: Requests, client: Client): Command {
    switch (r.kind) {
      case "send-chat-message": return SendChatMessageCmd.fromReq(r, this, client);
      case "set-next-phase": return SetNextPhaseCmd.fromReq(this);
      case "set-player-readiness": return SetPlayerReadinessCmd.fromReq(r, this, client);
      case "reset-game": return ResetGameCmd.fromReq(r, this);
      case "set-time-investment": return TimeInvestmentCmd.fromReq(r, this, client);
      case "buy-accomplishment-card": return BuyAccomplishmentCmd.fromReq(r, this, client);
      case "discard-accomplishment-card": return DiscardAccomplishmentCmd.fromReq(r, this, client);
      case "accept-trade-request": return AcceptTradeRequestCmd.fromReq(r, this, client);
      case "send-trade-request": return SendTradeRequestCmd.fromReq(r, this, client);
    }
  }

  gameLoop() {
    if (this.state.allPlayersAreReady) {
      const cmd = new SetNextPhaseCmd(this);
      const events = cmd.execute();
      this.state.applyMany(events);
    }
  }

  onMessage (client: Client, message: Requests) {
    const cmd = this.prepareRequest(message, client);
    const events = cmd.execute();
    this.state.applyMany(events);
  }
  onLeave (client: Client, consented: boolean) {}
  onDispose() {}
}

