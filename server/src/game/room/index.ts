import {Client, Room} from "colyseus";
import {Requests} from "shared/requests"
import {Responses} from "shared/responses"
import {GameState, Player} from "@/game/state";
import {ResetGameCmd, SendChatMessageCmd, SetNextPhaseCmd, SetPlayerReadinessCmd, TimeInvestmentCmd} from "@/game/commands";
import {Game, PlayerReadiness} from "@/game/room/types";
import {CURATOR, Phase, Role, ROLES} from "shared/types";
import {Command} from "@/game/commands/types";
import {
  LeftDiscardPhase,
  LeftInvestmentPhase,
  LeftMarsEventPhase, LeftPreGamePhase,
  LeftPurchasePhase,
  LeftTradePhase,
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
      case "set-next-phase": return SetNextPhaseCmd.fromReq(r, this, client);
      case "set-player-readiness": return SetPlayerReadinessCmd.fromReq(r, this, client);
      case "reset-game": return ResetGameCmd.fromReq(r, this);
      case "set-time-investment": return TimeInvestmentCmd.fromReq(r, this, client);
    }
  }

  getLeftPhaseEvent(): GameEvent | undefined {
    const phase = this.state.phase;
    if (phase === Phase.discard) {
      const upkeep = this.state.nextRoundUpkeep();
      const cards = this.state.marsEventDeck.peek(upkeep);
      return new LeftDiscardPhase(cards);
    }

    switch (phase) {
      case Phase.pregame: return new LeftPreGamePhase();
      case Phase.events: return new LeftMarsEventPhase();
      case Phase.invest: return new LeftInvestmentPhase();
      case Phase.trade: return new LeftTradePhase();
      case Phase.purchase: return new LeftPurchasePhase();
    }
  }

  gameLoop() {
    if (this.state.allPlayersAreReady) {
      const nextPhaseEvent = this.getLeftPhaseEvent();
      if (nextPhaseEvent) {
        this.state.apply(nextPhaseEvent);
      }
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

