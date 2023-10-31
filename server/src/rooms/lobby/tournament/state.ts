import { Client } from "colyseus";
import { LobbyClient, LobbyRoomState } from "@port-of-mars/server/rooms/lobby/common/state";

/**
 * Lobby room state for tournaments that fills up up and allocates games
 * to a random shuffling of participants at periodic times whenever
 * number of players >= 5
 */
export class TournamentLobbyRoomState extends LobbyRoomState {
  maxClients = 200;

  // only holds clients that still need to be put into a group
  queue: LobbyClient[] = [];
  // groups indexed by a unique group id
  pendingGroups: Map<string, LobbyClient[]> = new Map();
  // map client username to group id
  clientToGroup: Map<string, string> = new Map();

  allGroupClientsAccepted(groupId: string) {
    const group = this.pendingGroups.get(groupId);
    if (group) {
      return group.every(client => client.accepted);
    }
    return false;
  }

  getClientPendingGroupId(client: Client) {
    return this.clientToGroup.get(client.auth.username);
  }

  getPendingGroup(id: string) {
    return this.pendingGroups.get(id);
  }

  setPendingGroup(id: string, group: LobbyClient[]) {
    this.pendingGroups.set(id, group);
    group.forEach(client => {
      this.clientToGroup.set(client.username, id);
    });
  }

  /**
   * Clear a group and add the clients back to the queue, optionally leaving one client out
   * in the case that they left the lobby entirely
   */
  resetPendingGroup(id: string, leavingClient?: Client) {
    const group = this.pendingGroups.get(id);
    if (group) {
      group.forEach(client => {
        this.clientToGroup.delete(client.username);
        client.accepted = false;
        // if a client left the group, don't add them back to the queue
        if (!leavingClient || client.username !== leavingClient.auth.username)
          this.queue.push(client);
      });
      this.pendingGroups.delete(id);
    }
  }
}
