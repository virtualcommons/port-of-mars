import { Client, matchMaker } from "colyseus";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { Mutex } from "async-mutex";
import { buildGameOpts } from "@port-of-mars/server/util";
import { GameRoom } from "@port-of-mars/server/rooms/game";
import { settings } from "@port-of-mars/server/settings";
import { getServices } from "@port-of-mars/server/services";
import {
  TOURNAMENT_LOBBY_NAME,
  AcceptInvitation,
  MAX_GROUP_SIZE,
} from "@port-of-mars/shared/lobby";
import { TournamentLobbyRoomState } from "@port-of-mars/server/rooms/lobby/tournament/state";
import { LobbyClient } from "@port-of-mars/server/rooms/lobby/common/state";
import { LobbyRoom } from "@port-of-mars/server/rooms/lobby/common";
import { User } from "@port-of-mars/server/entity";

const logger = settings.logging.getLogger(__filename);

class Group {
  id: string;
  size: number;
  clients: LobbyClient[];
  forceMoveTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(clients: LobbyClient[], size = MAX_GROUP_SIZE) {
    this.id = uuidv4();
    this.size = size;
    this.clients = clients;
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

class GroupManager {
  queue: LobbyClient[] = []; // clients waiting to be put into a group
  pendingGroups: Map<string, Group> = new Map(); // group id -> group
  clientToGroup: Map<string, Group> = new Map(); // username -> group

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
    const group = new Group(this.queue.splice(0, MAX_GROUP_SIZE));
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

/**
 * Lobby room for tournaments that fills up up and allocates games
 * to a random shuffling of participants at periodic times whenever
 * number of players >= the max group size
 */
export class TournamentLobbyRoom extends LobbyRoom<TournamentLobbyRoomState> {
  roomName = TOURNAMENT_LOBBY_NAME;
  static get NAME() {
    return TOURNAMENT_LOBBY_NAME;
  }

  clockInterval = 1000 * 60; // try to form groups every 60 seconds

  private mutex = new Mutex();

  groupManager = new GroupManager();

  get queue() {
    return this.groupManager.queue;
  }

  createState() {
    return new TournamentLobbyRoomState();
  }

  afterJoin(client: Client) {
    this.groupManager.addClientToQueue(client);
  }

  afterLeave(client: Client) {
    this.groupManager.removeClientFromQueue(client);
  }

  async onClockInterval() {
    // only try to send invitations if there are enough players and we are not in the middle
    // of trying to put groups into a game
    const release = await this.mutex.acquire();
    try {
      await this.formAndInviteGroups();
    } finally {
      release();
    }
  }

  async formAndInviteGroups() {
    this.groupManager.shuffleQueue();
    while (this.queue.length >= this.groupSize) {
      const group = this.groupManager.formGroupFromQueue();
      if (group) {
        await this.sendGroupInvitations(group);
        group.setForceMoveTimeout(() => {
          this.removeGroupFromLobby(group);
        });
      }
    }
  }

  async sendGroupInvitations(group: Group) {
    const usernames = group.clients.map(client => client.username);
    const gameOpts = await buildGameOpts(usernames, "tournament");
    const room = await matchMaker.createRoom(GameRoom.NAME, gameOpts);
    logger.info(`${this.roomName} created game room ${room.roomId}`);
    // send room data for new websocket connection
    group.clients.forEach((lobbyClient: LobbyClient) => {
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

  async canUserJoin(user: User) {
    const services = getServices();
    const numberOfActiveParticipants = await services.game.getNumberOfActiveParticipants();
    const maxConnections = await this.getMaxConnections();
    return numberOfActiveParticipants < maxConnections && services.tournament.canPlayInRound(user);
  }

  onAcceptInvitation(client: Client, message: AcceptInvitation) {
    logger.trace(`client ${client.auth.username} accepted invitation to join a game`);
    this.state.setClientAccepted(client.auth.username);
    const group = this.groupManager.getClientPendingGroup(client);
    // check that all clients in the group have accepted the invitation
    if (!group) {
      logger.warn(`no client group found for client ${client.auth.username}`);
      return;
    }
    if (group.allClientsAccepted()) {
      group.clearForceMoveTimeout();
      this.removeGroupFromLobby(group);
    }
  }

  removeGroupFromLobby(group: Group) {
    group.clients.forEach(lc => {
      this.sendSafe(lc.client, { kind: "removed-client-from-lobby" });
      lc.client.leave();
    });
    this.groupManager.removeGroup(group);
  }

  async onDispose() {
    super.onDispose();
    logger.debug("Saving all lobby chat messages");
    const chatMessages = [...this.state.chat];
    logger.debug("lobby chat messages %s", chatMessages);
    if (chatMessages.length) {
      await getServices().tournament.saveLobbyChatMessages(this.roomId, "tournament", chatMessages);
    }
  }
}
