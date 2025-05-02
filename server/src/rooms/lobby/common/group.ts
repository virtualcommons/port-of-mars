import { Client } from "colyseus";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { MAX_GROUP_SIZE } from "@port-of-mars/shared/lobby";
import { LobbyClient } from "@port-of-mars/server/rooms/lobby/common/state";

export class Group {
  id: string;
  size: number;
  clients: LobbyClient[];
  forceMoveTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(clients: LobbyClient[], size = MAX_GROUP_SIZE) {
    this.id = uuidv4();
    this.size = size;
    this.clients = clients;
  }

  setClientAccepted(username: string) {
    const index = this.clients.findIndex((c: LobbyClient) => c.username === username);
    if (index > -1) {
      this.clients[index].accepted = true;
    }
  }
  allClientsAccepted() {
    return this.clients.every(client => client.accepted);
  }

  setForceMoveTimeout(cb: () => void, timeout = 1000 * 15) {
    this.forceMoveTimeout = setTimeout(cb, timeout);
  }

  clearForceMoveTimeout() {
    if (this.forceMoveTimeout) {
      clearTimeout(this.forceMoveTimeout);
    }
    this.forceMoveTimeout = null;
  }
}

export class GroupManager {
  queue: LobbyClient[] = []; // clients waiting to be put into a group
  pendingGroups: Map<string, Group> = new Map(); // group id -> group
  clientToGroup: Map<string, Group> = new Map(); // username -> group
  groupSize: number;

  constructor(groupSize = MAX_GROUP_SIZE) {
    this.groupSize = groupSize;
  }

  shuffleQueue() {
    this.queue = _.shuffle(this.queue);
  }

  addClientToQueue(client: Client) {
    const lobbyClient = new LobbyClient(client);
    this.queue.push(lobbyClient);
    return lobbyClient;
  }

  removeClientFromQueue(client: Client) {
    const index = this.queue.findIndex(
      lobbyClient => lobbyClient.username === client.auth.username
    );
    if (index !== -1) {
      this.queue.splice(index, 1);
    }
  }

  getClientPendingGroup(client: Client) {
    return this.clientToGroup.get(client.auth.username);
  }

  getPendingGroup(id: string) {
    return this.pendingGroups.get(id);
  }

  formGroupFromQueue(): Group {
    const group = new Group(this.queue.splice(0, this.groupSize), this.groupSize);
    group.clients.forEach(client => {
      client.accepted = false;
      this.clientToGroup.set(client.username, group);
    });
    this.pendingGroups.set(group.id, group);
    return group;
  }

  removeGroup(group: Group) {
    group.clients.forEach(client => {
      this.clientToGroup.delete(client.username);
    });
    this.pendingGroups.delete(group.id);
  }
}
