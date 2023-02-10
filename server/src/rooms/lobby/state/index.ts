import { Schema, ArraySchema, type } from "@colyseus/schema";
import { Client } from 'colyseus';
import { LobbyChatMessageData } from '@port-of-mars/shared/types';
import { settings } from "@port-of-mars/server/settings";

const logger = settings.logging.getLogger(__filename);

/**
 * Connected client with additional metadata
 */
export class LobbyClient extends Schema {
  @type("number") id: number;
  @type("string") username: string;
  @type("boolean") ready: boolean;
  client: Client;
  leaving: boolean;

  constructor(client: Client) {
    super();
    this.client = client;
    this.ready = false;
    this.username = client.auth.username;
    this.id = this.client.auth.id;
    this.leaving = false;
  }
}

/**
 * Lobby chat message
 */
export class LobbyChatMessage extends Schema implements LobbyChatMessageData {
  constructor(msg: LobbyChatMessageData) {
    super();
    this.username = msg.username;
    this.message = msg.message;
    this.dateCreated = msg.dateCreated;
  }

  @type("string") username: string;
  @type("string") message: string;
  @type("number") dateCreated: number;
}

/**
 * state of lobby room that represents a transition room between dashboard and
 * actual game room. Limited to 5 players as the game room is
 */
export class LobbyRoomState extends Schema {
  @type([LobbyClient]) clients = new ArraySchema<LobbyClient>();
  @type([LobbyChatMessage]) chat = new ArraySchema<LobbyChatMessage>();
  @type("number") dateCreated: number;
  @type("boolean") ready: boolean;

  maxClients = 5;

  constructor() {
    super();
    this.ready = false;
    this.dateCreated = new Date().getTime();
  }

  get leader(): LobbyClient {
    return this.clients[0];
  }

  isFull() {
    return this.clients.length >= this.maxClients;
  }

  allClientsLeaving() {
    this.clients.forEach((c: LobbyClient) => {
      if (!c.leaving) return false;
    });
    return true;
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

  removeClient(username: string) {
    const index = this.clients.findIndex((c: LobbyClient) => c.username === username);
    if (index > -1) {
      this.clients.splice(index, 1);
    }
  }

  // set client to ready, meaning they have indicated they are ready to start with bots
  setClientReadiness(username: string, vote: boolean) {
    if (username !== this.leader.username) {
      const index = this.clients.findIndex((c: LobbyClient) => c.username === username);
      if (index > -1) {
        this.clients[index].ready = vote;
      }
      logger.debug(index);
      logger.debug(this.clients);
      logger.debug(vote);
    }
  }

  // incidate that client has accepted invitation to start a new game
  setClientLeaving(username: string) {
    const index = this.clients.findIndex((c: LobbyClient) => c.username === username);
    if (index > -1) {
      this.clients[index].leaving = true;
    }
  }

  addChatMessage(username: string, message: string) {
    const data = {
      username,
      message,
      dateCreated: new Date().getTime()
    }
    const chatMsg = new LobbyChatMessage(data);
    this.chat.push(chatMsg);
  }

}
