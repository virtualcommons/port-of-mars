import { Client, matchMaker } from "colyseus";
import { buildGameOpts } from "@port-of-mars/server/util";
import { GameRoom } from "@port-of-mars/server/rooms/game";
import { settings } from "@port-of-mars/server/settings";
import { getServices } from "@port-of-mars/server/services";
import { TOURNAMENT_LOBBY_NAME, AcceptInvitation } from "@port-of-mars/shared/lobby";
import { TournamentLobbyRoomState } from "@port-of-mars/server/rooms/lobby/tournament/state";
import { LobbyClient } from "@port-of-mars/server/rooms/lobby/common/state";
import { LobbyRoom } from "@port-of-mars/server/rooms/lobby/common";

const logger = settings.logging.getLogger(__filename);

export class TournamentLobbyRoom extends LobbyRoom<TournamentLobbyRoomState> {
  roomName = TOURNAMENT_LOBBY_NAME;
  static get NAME() {
    return TOURNAMENT_LOBBY_NAME;
  }

  maxClients = 100;

  // list of group ids that the room is currently trying to put into a game
  private pendingGroup: LobbyClient[] = [];

  createState() {
    return new TournamentLobbyRoomState();
  }

  async trySendInvitations() {
    // only try to send invitations if there are enough players and we are not in the middle
    // of trying to put a group into a game
    if (this.pendingGroup.length === 0 && this.state.clients.length >= 5) {
      this.pendingGroup = this.getGroupByJoinDate();
      await this.sendGroupInvitations();
    }
  }

  getGroupByJoinDate() {
    // build a group of clients by selecting the first 5 by dateJoined
    return this.state.clients.sort((a, b) => a.dateJoined - b.dateJoined).slice(0, 5);
  }

  async sendGroupInvitations() {
    const usernames = this.pendingGroup.map(client => client.username);
    const gameOpts = await buildGameOpts(usernames, "tournament");
    const room = await matchMaker.createRoom(GameRoom.NAME, gameOpts);
    logger.info(`${this.roomName} created game room ${room.roomId}`);
    // send room data for new websocket connection
    this.pendingGroup.forEach((client: LobbyClient) => {
      this.sendSafe(client.client, {
        kind: "sent-invitation",
        roomId: room.roomId,
      });
    });
  }

  allGroupClientsLeaving() {
    return this.pendingGroup.every(client => client.leaving);
  }

  async isLobbyOpen() {
    const services = getServices();
    if (await services.settings.isTournamentEnabled()) {
      return services.tournament.isLobbyOpen();
    }
    return false;
  }

  registerLobbyHandlers(): void {
    super.registerLobbyHandlers();
    this.onMessage("accept-invitation", (client: Client, message: AcceptInvitation) => {
      logger.trace(`client ${client.auth.username} accepted invitation to join a game`);
      this.state.setClientLeaving(client.auth.username);
      // check that all clients in the group are leaving
      if (this.allGroupClientsLeaving()) {
        this.pendingGroup.forEach((lc: LobbyClient) => {
          this.sendSafe(lc.client, { kind: "removed-client-from-lobby" });
          lc.client.leave();
        });
        this.pendingGroup = [];
      }
    });
  }

  onLeave(client: Client, consented: boolean) {
    super.onLeave(client, consented);
    // if a client in the pending group leaves, clear the group to try again
    const index = this.pendingGroup.findIndex(lc => lc.client.id === client.id);
    if (index) {
      this.pendingGroup.splice(index, 1);
      this.pendingGroup.forEach(lc => (lc.leaving = false));
      this.pendingGroup = [];
    }
  }
}
