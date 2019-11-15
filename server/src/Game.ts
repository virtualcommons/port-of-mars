import {Client, Room} from "colyseus";
import {AccomplishmentData, PlayerData, ResourceAmountData, Stage, ChatMessageData} from "shared/types";
import _ from "lodash";
import {ArraySchema, Schema, type, MapSchema} from "@colyseus/schema";
import {Requests} from "shared/requests"
import {Responses} from "shared/responses"

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

const ROLES = ['Curator', 'Entrepreneur', 'Pioneer', 'Politician', 'Researcher'];

class Effect extends Schema {

}

class ChatMessage extends Schema implements ChatMessageData {
  constructor(msg: ChatMessageData) {
    super();
    this.role = msg.role;
    this.message = msg.message;
    this.time = msg.time;
    this.round = msg.round;
  }

  @type("string")
  role: string;

  @type("string")
  message: string;

  @type('number')
  time: number;

  @type('number')
  round: number;
}


interface GameData {
  players: {
    curator: Player,
    entrepreneur: Player,
    pioneer: Player,
    politician: Player,
    researcher: Player,
  };
  round: number
  stage: Stage
  upkeep: number
  active_effects: Array<Effect>
}

class Player extends Schema {
  constructor(role: string) {
    super();
    this.role = role;
  }

  @type("string")
  role: string;
}

class GameState extends Schema {
  availableRoles = _.cloneDeep(ROLES);

  @type({ map: Player })
  players = new MapSchema<Player>();

  @type("number")
  round: number = 0;

  @type("number")
  stage: Stage = Stage.events;

  @type("number")
  upkeep: number = 100;

  @type("number")
  timeRemaining: number = 300;

  @type([ChatMessage])
  messages = new ArraySchema<ChatMessage>();
}

export class GameRoom extends Room<GameState> {
  maxClients = 5;

  onCreate (options: any) {
    this.setState(new GameState());
    this.clock.setInterval(() => this.state.timeRemaining -= 1, 1000);
  }

  onJoin (client: Client, options: any) {
    this.createPlayer(client);
  }

  sendSafe(client: Client, msg: Responses) {
    this.send(client, msg);
  }

  createPlayer(client: Client) {
    const role = this.state.availableRoles.pop();
    if (role === undefined) {
      this.sendSafe(client, { kind: 'error', message: 'Player create failed. Out of sessions'});
      return;
    }
    this.state.players[client.sessionId] = new Player(role);
    this.sendSafe(client, { kind: 'set-player-role', role })
  }

  addChatMessage(sessionId: string, message: string, round: number) {
    this.state.messages.push(new ChatMessage({
      role: this.state.players[sessionId].role,
      time: (new Date()).getTime(),
      message,
      round
    }))
  }

  onMessage (client: Client, message: Requests) {
    switch (message.kind) {
      case 'send-chat-message': this.addChatMessage(client.sessionId, message.message, this.state.round); break;
      case 'buy-accomplishment-card': console.log(`buying card ${message.id}`); break;
    }
  }
  onLeave (client: Client, consented: boolean) {}
  onDispose() {}
}

class ResourceAllocation {
  constructor() {
    this.culture = 0;
    this.finance = 0;
    this.government = 0;
    this.legacy = 0;
    this.science = 0;
  }
}
interface ResourceAllocation extends ResourceAmountData {}

class ResourceCosts {
  constructor() {
    this.culture = 0;
    this.finance = 0;
    this.government = 0;
    this.legacy = 0;
    this.science = 0;
    this.upkeep = 0;
  }
}
interface ResourceCosts extends ResourceAmountData {}
