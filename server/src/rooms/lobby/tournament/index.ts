import { Client, matchMaker } from "colyseus";
import { buildGameOpts } from "@port-of-mars/server/util";
import { GameRoom } from "@port-of-mars/server/rooms/game";
import { settings } from "@port-of-mars/server/settings";
import { getServices } from "@port-of-mars/server/services";
import { TOURNAMENT_LOBBY_NAME, AcceptInvitation } from "@port-of-mars/shared/lobby";
import { TournamentLobbyRoomState } from "@port-of-mars/server/rooms/lobby/tournament/state";
import { LobbyClient } from "@port-of-mars/server/rooms/lobby/common/state";
import { LobbyRoom } from "@port-of-mars/server/rooms/lobby/common";
import * as _ from "lodash";

const logger = settings.logging.getLogger(__filename);

export class TournamentLobbyRoom extends LobbyRoom<TournamentLobbyRoomState> {
  roomName = TOURNAMENT_LOBBY_NAME;
  static get NAME() {
    return TOURNAMENT_LOBBY_NAME;
  }

  clockInterval = 1000 * 60; // try to form groups every 60 seconds
  processingClients = false; // naive lock to attempt to prevent concurrent access to trySendInvitations

  createState() {
    return new TournamentLobbyRoomState();
  }

  async trySendInvitations() {
    // only try to send invitations if there are enough players and we are not in the middle
    // of trying to put groups into a game
    if (this.processingClients) {
      return;
    }
    this.processingClients = true;
    const clients = this.state.getEligibleClients();
    if (clients.length >= 5) {
      const shuffledClients = _.shuffle(clients);
      while (shuffledClients.length >= 5) {
        const group = shuffledClients.splice(0, 5);
        await this.sendGroupInvitations(group);
      }
    }
    this.processingClients = false;
  }

  async sendGroupInvitations(group: LobbyClient[]) {
    const usernames = group.map(client => client.username);
    const gameOpts = await buildGameOpts(usernames, "tournament");
    const room = await matchMaker.createRoom(GameRoom.NAME, gameOpts);
    logger.info(`${this.roomName} created game room ${room.roomId}`);
    // send room data for new websocket connection
    group.forEach((lobbyClient: LobbyClient) => {
      this.state.addClientToGroup(lobbyClient.client, group);
      this.sendSafe(lobbyClient.client, {
        kind: "sent-invitation",
        roomId: room.roomId,
      });
    });
  }

  async isLobbyOpen() {
    const services = getServices();
    if (await services.settings.isTournamentEnabled()) {
      return services.tournament.isLobbyOpen();
    }
    return false;
  }

  async canClientJoin(client: Client) {
    const services = getServices();
    const numberOfActiveParticipants = await services.game.getNumberOfActiveParticipants();
    const maxConnections = await this.getMaxConnections();
    return (
      numberOfActiveParticipants < maxConnections && services.tournament.canPlayInRound(client.auth)
    );
  }

  allGroupClientsLeaving(group: LobbyClient[]) {
    return group.every(client => client.leaving);
  }

  registerLobbyHandlers(): void {
    super.registerLobbyHandlers();
    this.onMessage("accept-invitation", (client: Client, message: AcceptInvitation) => {
      logger.trace(`client ${client.auth.username} accepted invitation to join a game`);
      this.state.setClientLeaving(client.auth.username);
      const pendingGroup = this.state.getPendingGroup(client);
      // check that all clients in the group are leaving
      if (!pendingGroup) {
        logger.fatal(`no client group found for client ${client.auth.username}`);
        return;
      }
      // FIXME: consider refactoring to some better abstractions,
      // with a ClientGroup class that can encapsulate this logic + cleanup
      // etc.
      if (this.allGroupClientsLeaving(pendingGroup)) {
        pendingGroup.forEach((lc: LobbyClient) => {
          this.sendSafe(lc.client, { kind: "removed-client-from-lobby" });
          lc.client.leave();
        });
        // clear this group from the state and remove from the list of connected
        // clients
        this.state.clearPendingGroup(pendingGroup);
      }
    });
  }

  onLeave(client: Client, consented: boolean) {
    // cleans up the client state
    super.onLeave(client, consented);
    // if a client in a pending group leaves, reset all other clients in the group
    this.state.resetPendingGroup(client);
  }
}
