import { Client, matchMaker } from "colyseus";
import { Mutex } from "async-mutex";
import { settings } from "@port-of-mars/server/settings";
import { getServices } from "@port-of-mars/server/services";
import { AcceptInvitation, LITE_LOBBY_NAME } from "@port-of-mars/shared/lobby";
import { LiteLobbyRoomState } from "@port-of-mars/server/rooms/lobby/lite/state";
import { LobbyClient } from "@port-of-mars/server/rooms/lobby/common/state";
import { LobbyRoom } from "@port-of-mars/server/rooms/lobby/common";
import { User } from "@port-of-mars/server/entity";
import { Group, GroupManager } from "@port-of-mars/server/rooms/lobby/common/group";
import { SoloGameRoom } from "@port-of-mars/server/rooms/pomlite/solo";
import { settings as sharedSettings } from "@port-of-mars/shared/settings";
import { MultiplayerGameRoom } from "../../pomlite/multiplayer";
import { LitePlayerUser } from "@port-of-mars/shared/types";

const logger = settings.logging.getLogger(__filename);

/**
 * Lobby room for tournaments that fills up up and allocates games
 * to a random shuffling of participants at periodic times whenever
 * number of players >= the max group size
 */
export class LiteLobbyRoom extends LobbyRoom<LiteLobbyRoomState> {
  roomName = LITE_LOBBY_NAME;
  // FIXME: this should be based on the game type, we can do this by
  // throwing it in the data structure that holds events, etc for each type
  // FIXME: also include the multiplayer game type here somehow so we know
  // which to use and then pass it into the game room options
  groupSize = sharedSettings.LITE_MULTIPLAYER_PLAYERS_COUNT;
  static get NAME() {
    return LITE_LOBBY_NAME;
  }

  clockInterval = 1000 * 5; // try to form groups every 5 seconds

  private mutex = new Mutex();

  // FIXME: implemented for sologame, use multiplayer
  groupManager = new GroupManager(this.groupSize);

  get queue() {
    return this.groupManager.queue;
  }

  createState() {
    return new LiteLobbyRoomState();
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
    const playerUsers: Array<LitePlayerUser> = group.clients.map(client => {
      return {
        username: client.username,
        id: client.id,
      };
    });
    const type = "prolific"; // FIXME: this shouldn't be hardcoded
    const room = await matchMaker.createRoom(MultiplayerGameRoom.NAME, {
      type,
      users: playerUsers,
    });
    logger.info(`${this.roomName} created game room ${room.roomId}`);
    // send room data for new websocket connection
    group.clients.forEach((lobbyClient: LobbyClient) => {
      this.sendSafe(lobbyClient.client, {
        kind: "sent-invitation",
        roomId: room.roomId,
      });
    });
  }

  async canUserJoin(user: User) {
    // FIXME: check if user is a study participant that has not played a game yet
    return true;
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
}
