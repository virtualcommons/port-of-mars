import { Room, Client } from "colyseus";
import {ResourceAmountData, PlayerData, Stage, AccomplishmentData} from "shared/types";
import _ from "lodash";

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

const ROLES = ['curator', 'entrepreneur', 'pioneer', 'politician', 'researcher'];

interface Effect {

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

class GameState {
  constructor() {
    this.players = {
      curator: new Player('curator'),
      entrepreneur: new Player('entrepreneur'),
      pioneer: new Player('pioneer'),
      politician: new Player('politician'),
      researcher: new Player('researcher')
    };
    this.round = 0;
    this.stage = Stage.events;
    this.active_effects = [];
  }

  createPlayer(id: string) {}
}
interface GameState extends GameData {}

export class GameRoom extends Room {
  onCreate (options: any) {
    this.setState(new GameState())
  }

  onJoin (client: Client, options: any) {
    this.state
  }

  onMessage (client: Client, message: any) {}
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

export class Player {
  constructor(role: string) {
    this.accomplishments = [];
    this.costs = new ResourceCosts();
    this.resources = new ResourceAllocation();
    this.role = role;
  }

  get victoryPoints() {
    return 1;
  }

  buy(accomplishment: AccomplishmentData) {
    
    this.accomplishments.push(accomplishment);
    this.resources = _.mergeWith(this.resources, accomplishment.costs, (r, a) => r - a);
  }
}
export interface Player extends PlayerData<AccomplishmentData, ResourceAllocation, ResourceCosts> {}

