import { Client, matchMaker } from "colyseus";
import { Mutex } from "async-mutex";
import { buildGameOpts } from "@port-of-mars/server/util";
import { GameRoom } from "@port-of-mars/server/rooms/pom/game";
import { settings } from "@port-of-mars/server/settings";
import { getServices } from "@port-of-mars/server/services";
import { TOURNAMENT_LOBBY_NAME, AcceptInvitation } from "@port-of-mars/shared/lobby";
import { TournamentLobbyRoomState } from "@port-of-mars/server/rooms/lobby/tournament/state";
import { LobbyClient } from "@port-of-mars/server/rooms/lobby/common/state";
import { LobbyRoom } from "@port-of-mars/server/rooms/lobby/common";
import { User } from "@port-of-mars/server/entity";
import { Group, GroupManager } from "@port-of-mars/server/rooms/lobby/common/group";

const logger = settings.logging.getLogger(__filename);

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
    const activeGame = await services.game.getActiveGameRoomId(user.id, "tournament");
    if (activeGame) {
      logger.warn(
        `client ${user.username} attempted to join ${this.roomName} while in another game`
      );
      return false;
    }
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
    group.setClientAccepted(client.auth.username);
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
    logger.debug("lobby chat messages %s", chatMessages.toString());
    if (chatMessages.length) {
      await getServices().tournament.saveLobbyChatMessages(this.roomId, "tournament", chatMessages);
    }
  }
}
