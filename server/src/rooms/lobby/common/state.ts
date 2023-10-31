import { Schema, ArraySchema, type } from "@colyseus/schema";
import { Client } from "colyseus";
import { LobbyChatMessageData } from "@port-of-mars/shared/types";

/**
 * Connected client with additional metadata
 */
export class LobbyClient extends Schema {
  @type("number") id: number;
  @type("string") username: string;
  @type("boolean") ready: boolean;
  @type("number") dateJoined: number;
  client: Client;
  accepted: boolean;

  constructor(client: Client) {
    super();
    this.client = client;
    this.username = client.auth.username;
    this.id = this.client.auth.id;
    this.ready = false;
    this.accepted = false;
    this.dateJoined = new Date().getTime();
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
export abstract class LobbyRoomState extends Schema {
  @type([LobbyClient]) clients = new ArraySchema<LobbyClient>(); // FIXME: use a MapSchema<LobbyClient, Group> instead?
  @type([LobbyChatMessage]) chat = new ArraySchema<LobbyChatMessage>();
  @type("number") dateCreated: number;
  // FIXME: we might want to relate this to service.settings.maxConnections() also but probably OK for now
  // to be a max connections to a Lobby constraint versus total number of allowable players on the server
  maxClients = 100;

  constructor() {
    super();
    this.dateCreated = new Date().getTime();
  }

  isFull() {
    return this.clients.length >= this.maxClients;
  }

  allClientsAccepted() {
    this.clients.forEach((c: LobbyClient) => {
      if (!c.accepted) return false;
    });
    return true;
  }

  addClient(client: Client) {
    const lobbyClient = new LobbyClient(client);
    if (!this.isFull()) {
      this.clients.push(lobbyClient);
    }
  }

  removeClient(username: string) {
    const index = this.clients.findIndex((c: LobbyClient) => c.username === username);
    if (index > -1) {
      this.clients.splice(index, 1);
    }
  }

  // indicate that client has accepted invitation to join a game
  setClientAccepted(username: string) {
    const index = this.clients.findIndex((c: LobbyClient) => c.username === username);
    if (index > -1) {
      this.clients[index].accepted = true;
    }
  }

  addChatMessage(username: string, message: string) {
    const data = {
      username,
      message,
      dateCreated: new Date().getTime(),
    };
    const chatMsg = new LobbyChatMessage(data);
    this.chat.push(chatMsg);
  }
}
