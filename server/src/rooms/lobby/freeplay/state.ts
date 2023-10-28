import { type } from "@colyseus/schema";
import { Client } from "colyseus";
import { LobbyClient, LobbyRoomState } from "@port-of-mars/server/rooms/lobby/common/state";

/**
 * Lobby room state with additional functionality for a freeplay lobby that only allows 5 players
 * and can begin a game with less
 */
export class FreePlayLobbyRoomState extends LobbyRoomState {
  @type("boolean") ready: boolean;

  maxClients = 5;

  constructor() {
    super();
    this.ready = false;
  }

  get leader(): LobbyClient {
    return this.clients[0];
  }

  // set room to ready, meaning a game will start soon
  setRoomReadiness(ready: boolean) {
    this.ready = ready;
  }

  addClient(client: Client) {
    const lobbyClient = new LobbyClient(client);
    if (!this.isFull()) {
      this.clients.push(lobbyClient);
    }
    if (this.isFull()) {
      this.ready = true;
    }
  }

  // set client to ready, meaning they have indicated they are ready to start with bots
  setClientReadiness(username: string, vote: boolean) {
    if (username !== this.leader.username) {
      const index = this.clients.findIndex((c: LobbyClient) => c.username === username);
      if (index > -1) {
        this.clients[index].ready = vote;
      }
    }
  }
}
