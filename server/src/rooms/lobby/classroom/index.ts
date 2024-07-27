import { Client, matchMaker } from "colyseus";
import { buildGameOpts, evenlyPartition } from "@port-of-mars/server/util";
import { GameRoom } from "@port-of-mars/server/rooms/game";
import { settings } from "@port-of-mars/server/settings";
import { getServices } from "@port-of-mars/server/services";
import { AcceptInvitation, MAX_GROUP_SIZE, CLASSROOM_LOBBY_NAME } from "@port-of-mars/shared/lobby";
import { ClassroomLobbyRoomState } from "@port-of-mars/server/rooms/lobby/classroom/state";
import { LobbyClient } from "@port-of-mars/server/rooms/lobby/common/state";
import { LobbyRoom } from "@port-of-mars/server/rooms/lobby/common";
import { User } from "@port-of-mars/server/entity";
import { Group, GroupManager } from "@port-of-mars/server/rooms/lobby/common/group";

const logger = settings.logging.getLogger(__filename);

/**
 * Lobby game room for a classroom in educator mode
 * functions similarly to the tournament lobby room besides only
 * starting games when the teacher (or an admin) presses a button to call startGames
 *
 * group partitioning is done by evenly partitioning the queue of clients rather than
 * filling up to 5
 */
export class ClassroomLobbyRoom extends LobbyRoom<ClassroomLobbyRoomState> {
  classroomId = -1;
  roomName = CLASSROOM_LOBBY_NAME;
  started = false;
  static get NAME() {
    return CLASSROOM_LOBBY_NAME;
  }

  groupManager = new GroupManager();

  onClockInterval(): Promise<void> {
    // noop
    return Promise.resolve();
  }

  get queue() {
    return this.groupManager.queue;
  }

  createState() {
    return new ClassroomLobbyRoomState();
  }

  afterJoin(client: Client) {
    this.groupManager.addClientToQueue(client);
    this.setMetadata({
      clients: this.queue.map(c => {
        return {
          username: c.username,
          name: c.name,
        }
      }),
    });
    logger.info(`Client ${client.sessionId} joined lobby for classroom ${this.metadata.classroomId}`);
  }


  afterLeave(client: Client) {
    this.groupManager.removeClientFromQueue(client);
  }

  async startGames() {
    if (!this.started) {
      this.started = true;
      await this.lock();
      try {
        await this.formAndInviteGroups();
      } catch (e) {
        logger.fatal("error forming and inviting groups", e);
        this.started = false;
        await this.unlock();
      }
    }
  }

  async formAndInviteGroups() {
    this.groupManager.shuffleQueue();
    const groupSizes = evenlyPartition(this.queue.length, MAX_GROUP_SIZE);
    for (const size of groupSizes) {
      const group = this.groupManager.formGroupFromQueue(size);
      if (group) {
        await this.sendGroupInvitations(group);
        group.setForceMoveTimeout(() => {
          this.removeGroupFromLobby(group);
        });
      }
    }
  }

  async getFilledUsernames(clients: Array<LobbyClient>): Promise<Array<string>> {
    // FIXME: duplicated in freeplay lobby
    const usernames: Array<string> = clients.map(c => c.username);
    if (usernames.length < MAX_GROUP_SIZE) {
      const numberOfRequiredBots = MAX_GROUP_SIZE - usernames.length;
      const bots = await getServices().account.getOrCreateBotUsers(numberOfRequiredBots);
      return usernames.concat(bots.map(u => u.username)).slice(0, MAX_GROUP_SIZE);
    }
    return usernames;
  }

  async sendGroupInvitations(group: Group) {
    const usernames = await this.getFilledUsernames(group.clients);
    const gameOpts = await buildGameOpts(usernames, "classroom", this.classroomId);
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
    return true && !this.locked;
  }

  async canUserJoin(user: User) {
    const services = getServices();
    const student = await services.educator.getStudentByUser(user.id);
    if (student) {
      // set classroomId if this is the first client in here
      if (this.classroomId === -1) {
        // also, make sure this classroom exists
        const classroom = await services.educator.getClassroomById(student.classroomId);
        if (!classroom) return false;
        this.classroomId = student.classroomId;
        this.setMetadata({ classroomId: this.classroomId });
      } else {
        if (student.classroomId !== this.classroomId) return false;
      }
    } else {
      return false;
    }

    const numberOfActiveParticipants = await services.game.getNumberOfActiveParticipants();
    const maxConnections = await this.getMaxConnections();
    return numberOfActiveParticipants < maxConnections;
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
}
