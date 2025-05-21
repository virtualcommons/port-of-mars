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
import { LiteGameRoom } from "@port-of-mars/server/rooms/pomlite/multiplayer";
import { LitePlayerUser } from "@port-of-mars/shared/types";
import { LiteGameType } from "@port-of-mars/shared/lite";
import { LiteGameState } from "@port-of-mars/server/rooms/pomlite/multiplayer/state";

const logger = settings.logging.getLogger(__filename);

/**
 * Lobby room for tournaments that fills up up and allocates games
 * to a random shuffling of participants at periodic times whenever
 * number of players >= the max group size
 */
export class LiteLobbyRoom extends LobbyRoom<LiteLobbyRoomState> {
  roomName = LITE_LOBBY_NAME;
  groupSize = 3; // default, should be set to DEFAULTS.<gameType>.numPlayers
  type: LiteGameType = "prolificBaseline";

  static get NAME() {
    return LITE_LOBBY_NAME;
  }

  clockInterval = 1000 * 5; // try to form groups every 5 seconds
  LOBBY_WAIT_LIMIT_MS = 5 * 60 * 1000; // 5 minutes in milliseconds
  lastPlayerJoinTimestamp: number = Date.now(); // timestamp of the last player join to the lobby room

  private mutex = new Mutex();

  groupManager = new GroupManager(this.groupSize);

  get queue() {
    return this.groupManager.queue;
  }

  createState() {
    return new LiteLobbyRoomState();
  }

  async onCreate(options: { type: LiteGameType }) {
    await super.onCreate(options);
    this.type = options.type;
    this.groupSize = LiteGameState.DEFAULTS[this.type].numPlayers || 3;
    this.lastPlayerJoinTimestamp = Date.now();
  }

  afterJoin(client: Client) {
    this.groupManager.addClientToQueue(client);
    this.sendSafe(client, {
      kind: "set-group-size",
      groupSize: this.groupSize,
    });
    this.lastPlayerJoinTimestamp = Date.now(); // reset stale lobby timer on any new join
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
      await this.checkLobbyTimeout(); // call the timeout check
    } finally {
      release();
    }
  }

  async checkLobbyTimeout() {
    if (Date.now() - this.lastPlayerJoinTimestamp > this.LOBBY_WAIT_LIMIT_MS) {
      const queueSnapshot = [...this.queue];

      if (queueSnapshot.length > 0) {
        const { multiplayerStudy, account } = getServices();

        for (const lobbyClient of queueSnapshot) {
          try {
            const user = await account.findUserById(lobbyClient.client.auth.id);
            if (user) {
              // redirect to prolific completion url
              const completionUrl = await multiplayerStudy.getProlificCompletionUrl(user, false);
              this.sendSafe(lobbyClient.client, {
                kind: "lobby-timeout-redirect",
                completionUrl: completionUrl,
              });
              lobbyClient.client.leave(); // this will trigger afterLeave, removing them from queue
            } else {
              logger.warn(`Timeout: User with id ${lobbyClient.client.auth.id} not found`);
            }
          } catch (error: any) {
            logger.warn(`Timeout: Error processing client ${lobbyClient.username}`);
          }
        }
      }
      // reset the timestamp regardless of whether anyone was timed out or if queue was empty
      this.lastPlayerJoinTimestamp = Date.now();
    }
  }

  async formAndInviteGroups() {
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
    const room = await matchMaker.createRoom(LiteGameRoom.NAME, {
      type: this.type,
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
    // check if user is a study participant that has not played a game yet
    const services = getServices();
    try {
      const participant = await services.multiplayerStudy.getProlificParticipantStatus(user);
      if (participant.status === "not-started") {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
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
