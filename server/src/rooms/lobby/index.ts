import { Room, Client, matchMaker } from 'colyseus';
import { buildGameOpts } from '@port-of-mars/server/util';
import { GameRoom } from '@port-of-mars/server/rooms/game';
import { LobbyClient, LobbyRoomState } from '@port-of-mars/server/rooms/lobby/state';
import { settings } from "@port-of-mars/server/settings";
import { getServices } from "@port-of-mars/server/services";
import _ from "lodash";
import * as http from "http";
import {
  LobbyResponse,
  LOBBY_NAME,
  AcceptInvitation,
  StartWithBots,
  VoteStartWithBots,
  SendLobbyChatMessage,
  StartSoloWithBots,
} from "@port-of-mars/shared/lobby";

const logger = settings.logging.getLogger(__filename);

export const sendSafe = (client: Client, msg: LobbyResponse) => {
  client.send(msg.kind, msg);
}

export class LobbyRoom extends Room<LobbyRoomState> {

  public static get NAME(): string { return LOBBY_NAME }

  maxClients = 5;
  patchRate = 1000 / 5; // sends state to client 5 times per second

  async onCreate(options: any) {
    logger.trace("LobbyRoom '%s' created", this.roomId);
    this.setState(new LobbyRoomState());
    this.resetMetadata();
    this.registerLobbyHandlers();
    this.clock.setInterval(() => {
      if (this.state.ready) {
        this.sendInvitations();
      }
    }, 1000);
  }
  
  onLeave(client: Client, consented: boolean): void {
    logger.trace("Client %s left LobbyRoom %s", client.auth.username, this.roomId);
    this.state.removeClient(client.auth.username);
    this.resetMetadata();
  }

  onDispose() {
    logger.info("Disposing of LobbyRoom %s, no connected clients", this.roomId);
  }

  async onAuth(client: Client, options: any, request?: http.IncomingMessage) {
    try {
      const user = await getServices().account.findUserById((request as any).session.passport.user);
      if (user.isBanned) {
        logger.info("Banned user %s attempted to join the lobby", user.username);
        return false;
      }
      return user;
    } catch (e) {
      logger.fatal("Unable to authenticate client: %s", e);
    }
    return false;
  }

  async onJoin(client: Client, options: any, auth: any) {
    const sp = getServices();
    // if existing room found, give option to join that room
    // reject join if max connections reached
    const numberOfActiveParticipants = await sp.game.getNumberOfActiveParticipants();
    const maxConnections = await sp.settings.maxConnections();
    if (numberOfActiveParticipants + this.state.clients.length > maxConnections) {
      sendSafe(client, {
        kind: "join-failure",
        reason: "Sorry, Port of Mars is currently full! Please try again later."
      });
      return;
    }
    // if user is already in lobby, reject and offer troubleshooting
    if (this.state.clients.find((c: LobbyClient) => c.id === client.auth.id)) {
      sendSafe(client, {
        kind: "join-failure",
        reason: "You are already in a lobby. Please check your other browser windows."
      });
      return;
    }
    // add client to lobby
    logger.debug("attempting to add client %s to lobby room %s", client.auth.username, this.roomId);
    this.state.addClient(client);
    this.resetMetadata();
  }

  registerLobbyHandlers(): void {
    this.onMessage("start-with-bots", (client: Client, message: StartWithBots) => {
      this.startWithBots(client);
    });
    this.onMessage("vote-start-with-bots", (client: Client, message: VoteStartWithBots) => {
      this.state.setClientReadiness(client.auth.username, message.value);
    });
    this.onMessage("send-lobby-chat-message", (client: Client, message: SendLobbyChatMessage) => {
      if (client.auth.isMuted) {
        logger.trace("client %s attempted to send a chat message while muted", client.auth.username);
        return;
      }
      this.state.addChatMessage(client.auth.username, message.value);
    });
    this.onMessage("start-solo-with-bots", (client: Client, message: StartSoloWithBots) => {
      this.lock();
      this.state.setRoomReadiness(true);
    });
    this.onMessage("accept-invitation", (client: Client, message: AcceptInvitation) => {
      logger.trace("client %s accepted invitation to join a game");
      this.state.setClientLeaving(client.auth.username);
      if (this.state.allClientsLeaving()) {
        this.state.clients.forEach((lc: LobbyClient) => {
          sendSafe(lc.client, { kind: "removed-client-from-lobby" });
          lc.client.leave();
        });
      }
    });
  }

  startWithBots(client: Client) {
    if (client.auth.username === this.state.leader.username) {
      this.state.setRoomReadiness(true);
    }
  }

  async getFilledUsernames(): Promise<Array<string>> {
    let usernames: Array<string> = [];
    this.state.clients.forEach((client: LobbyClient) => {
      usernames.push(client.username);
    });
    if (usernames.length < this.state.maxClients) {
      const requiredBots = this.state.maxClients - usernames.length;
      const bots = await getServices().account.getOrCreateBotUsers(requiredBots);
      return usernames.concat(bots.map(u => u.username)).slice(0, this.state.maxClients);
    }
    return usernames;
  }

  // start a game by sending invitations to all clients in the lobby
  async sendInvitations() {
    // set ready to false so that invitations are only sent once
    this.state.setRoomReadiness(false);
    const usernames = await this.getFilledUsernames();
    const gameOpts = await buildGameOpts(usernames);
    const room = await matchMaker.createRoom(GameRoom.NAME, gameOpts);
    logger.info("Lobby created room %o", room);
    // send room data for new websocket connection
    this.state.clients.forEach((client: LobbyClient) => {
      sendSafe(client.client, {
        kind: "sent-invitation",
        roomId: room.roomId,
      });
    });
  }

  resetMetadata() {
    const leader = this.state.leader ? this.state.leader.username : "";
    this.setMetadata({ dateCreated: this.state.dateCreated, leader });
  }

}
