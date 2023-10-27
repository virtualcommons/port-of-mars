import { Client } from "colyseus";
import { settings } from "@port-of-mars/server/settings";
import { LobbyClient, LobbyRoomState } from "@port-of-mars/server/rooms/lobby/common/state";

const logger = settings.logging.getLogger(__filename);

/**
 * Lobby room state for tournaments that fills up up and allocates games
 * to a random shuffling of participants at periodic times whenever
 * number of players >= 5
 */
export class TournamentLobbyRoomState extends LobbyRoomState {
  maxClients = 200;

  clientsToGroups = new Map<string, LobbyClient[]>();

  /**
   * Returns clients that haven't been put into a group yet.
   */
  getEligibleClients() {
    return this.clients.filter((client: LobbyClient) => this.clientsToGroups.has(client.username));
  }

  getPendingGroup(client: Client) {
    return this.clientsToGroups.get(client.auth.username);
  }

  addClientToGroup(client: Client, group: LobbyClient[]) {
    this.clientsToGroups.set(client.auth.username, group);
  }

  /**
   * Clears a pending group as having successfully joined a game
   * @param group clients to remove from pending group
   */
  clearPendingGroup(group: LobbyClient[]) {
    group.forEach((lobbyClient: LobbyClient) => {
      const username = lobbyClient.username;
      this.clientsToGroups.delete(username);
      this.removeClient(username);
    });
  }

  /**
   * Resets a pending group as having failed to join a game (usually because one player left before all players accepted).
   * removes the client to group mapping and resets the leaving flag on the client
   * @param group clients to reset from pending group
   */
  resetPendingGroup(client: Client) {
    const group = this.getPendingGroup(client);
    if (group) {
      group.forEach((lobbyClient: LobbyClient) => {
        this.clientsToGroups.delete(lobbyClient.username);
        lobbyClient.leaving = false;
      });
    } else {
      logger.warn(`resetPendingGroup: client ${client.auth.username} not found in pending groups`);
    }
  }
}
