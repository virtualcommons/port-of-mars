import { Room, Client } from "colyseus";
import { LobbyClient, LobbyRoomState } from "@port-of-mars/server/rooms/lobby/common/state";
import { settings } from "@port-of-mars/server/settings";
import { getServices } from "@port-of-mars/server/services";
import * as http from "http";
import {
  AcceptInvitation,
  BASE_LOBBY_NAME,
  MAX_GROUP_SIZE,
  LobbyResponse,
  SendLobbyChatMessage,
} from "@port-of-mars/shared/lobby";
import { User } from "@port-of-mars/server/entity";

const logger = settings.logging.getLogger(__filename);

export abstract class LobbyRoom<RoomStateType extends LobbyRoomState> extends Room<RoomStateType> {
  groupSize = MAX_GROUP_SIZE; // number of players per game (may need to be parameterizable someday)
  patchRate = 1000 / 5; // sends state to client 5 times per second
  clockInterval = 1000 * 5; // try to form new gamerooms with groupSize clients every 5 seconds

  roomName = BASE_LOBBY_NAME;

  static get NAME() {
    return BASE_LOBBY_NAME;
  }

  /**
   * Called in onCreate to set the room state
   */
  abstract createState(): RoomStateType;

  /**
   * Called at each interval to send invitations to clients deemed ready to start a game
   */
  abstract onClockInterval(): Promise<void>;

  sendSafe(client: Client, msg: LobbyResponse) {
    client.send(msg.kind, msg);
  }

  async onCreate(options: any) {
    logger.trace(`${this.roomName} ${this.roomId} created`);
    this.setState(this.createState());
    this.resetMetadata();
    this.registerLobbyHandlers();
    this.clock.setInterval(async () => {
      await this.onClockInterval();
    }, this.clockInterval);
  }

  onDispose() {
    logger.trace(`Disposing of ${this.roomName} ${this.roomId}, no connected clients`);
  }

  async getMaxConnections() {
    return await getServices().settings.maxConnections();
  }

  async getNumberOfActiveParticipants() {
    return await getServices().game.getNumberOfActiveParticipants();
  }

  /**
   * Called in onAuth to check whether the lobby can be joined by anyone
   */
  async isLobbyOpen(): Promise<boolean> {
    return true;
  }

  /**
   * Called in onAuth to check whether a user can join the lobby
   */
  async canUserJoin(user: User): Promise<boolean> {
    return true;
  }

  async onAuth(client: Client, options: any, request?: http.IncomingMessage) {
    try {
      if (!(await this.isLobbyOpen())) {
        return false;
      }
      const user = await getServices().account.findUserById((request as any).session.passport.user);
      if (!(await this.canUserJoin(user))) {
        return false;
      }
      if (user.isBanned) {
        logger.info(`Banned user ${user.username} attempted to join ${this.roomName}`);
        return false;
      }
      return user;
    } catch (e) {
      logger.fatal(`Unable to authenticate client: ${e}`);
    }
    return false;
  }

  /**
   * Hook that gets called after onJoin
   */
  afterJoin(client: Client): void {}

  async onJoin(client: Client, options: any, auth: any) {
    const sp = getServices();
    // if existing room found, give option to join that room
    // reject join if max connections reached
    const numberOfActiveParticipants = await sp.game.getNumberOfActiveParticipants();
    const maxConnections = await sp.settings.maxConnections();
    if (numberOfActiveParticipants + this.state.clients.length > maxConnections) {
      this.sendSafe(client, {
        kind: "join-failure",
        reason: "Sorry, Port of Mars is currently full! Please try again later.",
      });
      return;
    }
    // if user is already in lobby, reject and offer troubleshooting
    if (this.state.clients.find((c: LobbyClient) => c.id === client.auth.id)) {
      this.sendSafe(client, {
        kind: "join-failure",
        reason: "You are already in a lobby. Please check your other browser windows.",
      });
      return;
    }
    // add client to lobby
    logger.debug(
      `attempting to add client ${client.auth.username} to ${this.roomName} ${this.roomId}`
    );
    this.state.addClient(client);
    this.resetMetadata();
    this.afterJoin(client);
  }

  /**
   * Hook that gets called after onLeave
   */
  afterLeave(client: Client): void {}

  onLeave(client: Client, consented: boolean): void {
    logger.trace(`Client ${client.auth.username} left ${this.roomName} ${this.roomId}`);
    this.state.removeClient(client.auth.username);
    this.afterLeave(client);
  }

  /**
   * Handle client accepting an invitation to start a game
   */
  abstract onAcceptInvitation(client: Client, message: AcceptInvitation): void;

  registerLobbyHandlers(): void {
    this.onMessage("send-lobby-chat-message", (client: Client, message: SendLobbyChatMessage) => {
      if (client.auth.isMuted) {
        logger.trace(`client ${client.auth.username} attempted to send a chat message while muted`);
        return;
      }
      this.state.addChatMessage(client.auth.username, message.value);
    });
    this.onMessage("accept-invitation", (client: Client, message: AcceptInvitation) => {
      this.onAcceptInvitation(client, message);
    });
  }

  resetMetadata() {
    this.setMetadata({ dateCreated: this.state.dateCreated });
  }
}
