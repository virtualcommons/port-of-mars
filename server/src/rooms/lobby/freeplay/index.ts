import { Client, matchMaker } from "colyseus";
import { buildGameOpts } from "@port-of-mars/server/util";
import { GameRoom } from "@port-of-mars/server/rooms/game";
import { settings } from "@port-of-mars/server/settings";
import { getServices } from "@port-of-mars/server/services";
import {
  FREE_PLAY_LOBBY_NAME,
  StartWithBots,
  VoteStartWithBots,
  StartSoloWithBots,
  AcceptInvitation,
} from "@port-of-mars/shared/lobby";
import { FreePlayLobbyRoomState } from "@port-of-mars/server/rooms/lobby/freeplay/state";
import { LobbyClient } from "@port-of-mars/server/rooms/lobby/common/state";
import { LobbyRoom } from "@port-of-mars/server/rooms/lobby/common";
import { User } from "@port-of-mars/server/entity";

const logger = settings.logging.getLogger(__filename);

export class FreePlayLobbyRoom extends LobbyRoom<FreePlayLobbyRoomState> {
  roomName = FREE_PLAY_LOBBY_NAME;

  static get NAME() {
    return FREE_PLAY_LOBBY_NAME;
  }

  createState() {
    return new FreePlayLobbyRoomState();
  }

  async onClockInterval() {
    if (this.state.ready) {
      await this.sendInvitations();
    }
  }

  // start a game by sending invitations to all clients in the lobby
  async sendInvitations() {
    // set ready to false so that invitations are only sent once
    this.state.setRoomReadiness(false);
    const usernames = await this.getFilledUsernames();
    const gameOpts = await buildGameOpts(usernames, "freeplay");
    const room = await matchMaker.createRoom(GameRoom.NAME, gameOpts);
    logger.info(`${this.roomName} created game room ${room.roomId}`);
    // send room data for new websocket connection
    this.state.clients.forEach((client: LobbyClient) => {
      this.sendSafe(client.client, {
        kind: "sent-invitation",
        roomId: room.roomId,
      });
    });
  }

  async getFilledUsernames(): Promise<Array<string>> {
    const usernames: Array<string> = this.state.clients.map(c => c.username);
    if (usernames.length < this.groupSize) {
      const numberOfRequiredBots = this.groupSize - usernames.length;
      const bots = await getServices().account.getOrCreateBotUsers(numberOfRequiredBots);
      return usernames.concat(bots.map(u => u.username)).slice(0, this.groupSize);
    }
    return usernames;
  }

  async isLobbyOpen() {
    return getServices().settings.isFreePlayEnabled();
  }

  async canUserJoin(user: User) {
    const services = getServices();
    const activeGame = await services.game.getActiveGameRoomId(user.id, "freeplay");
    if (activeGame) {
      logger.warn(
        `client ${user.username} attempted to join ${this.roomName} while in another game`
      );
      return false;
    }
    return true;
  }

  onAcceptInvitation(client: Client, message: AcceptInvitation): void {
    logger.trace(`client ${client.auth.username} accepted invitation to join a game`);
    this.state.setClientAccepted(client.auth.username);
    if (this.state.allClientsAccepted()) {
      this.state.clients.forEach((lc: LobbyClient) => {
        this.sendSafe(lc.client, { kind: "removed-client-from-lobby" });
        lc.client.leave();
      });
    }
  }

  registerLobbyHandlers(): void {
    super.registerLobbyHandlers();
    this.onMessage("start-with-bots", (client: Client, message: StartWithBots) => {
      this.startWithBots(client);
    });
    this.onMessage("vote-start-with-bots", (client: Client, message: VoteStartWithBots) => {
      this.state.setClientReadiness(client.auth.username, message.value);
    });
    this.onMessage("start-solo-with-bots", (client: Client, message: StartSoloWithBots) => {
      this.lock();
      this.state.setRoomReadiness(true);
    });
  }

  startWithBots(client: Client) {
    if (client.auth.username === this.state.leader.username) {
      this.state.setRoomReadiness(true);
    }
  }

  onLeave(client: Client, consented: boolean) {
    super.onLeave(client, consented);
    this.resetMetadata();
  }

  resetMetadata() {
    const leader = this.state.leader ? this.state.leader.username : "";
    this.setMetadata({ dateCreated: this.state.dateCreated, leader });
  }
}
