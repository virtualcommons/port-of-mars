import {ArraySchema, MapSchema, Schema, type} from "@colyseus/schema";
import {
  ChatMessageData,
  InvestmentData,
  MarsEventData,
  Phase,
  ResourceAmountData,
  ResourceCostData,
  Role,
  ROLES
} from "shared/types";
import _ from "lodash";
import {getRandomIntInclusive} from "@/util";
import {AccomplishmentData, getAccomplishmentIDs} from "@/repositories/Accomplishment";
import {getAllMarsEvents} from "@/repositories/MarsEvents";
import {GameEvent} from "@/events/types";

class Investment {
  constructor() {
    this.culture = 0;
    this.finance = 0;
    this.government = 0;
    this.legacy = 0;
    this.science = 0;
    this.upkeep = 0;
  }
}

interface Investment extends InvestmentData {
}

export class ChatMessage extends Schema implements ChatMessageData {
  constructor(msg: ChatMessageData) {
    super();
    this.role = msg.role;
    this.message = msg.message;
    this.dateCreated = msg.dateCreated;
    this.round = msg.round;
  }

  @type("string")
  role: string;

  @type("string")
  message: string;

  @type('number')
  dateCreated: number;

  @type('number')
  round: number;
}

class ResourceCosts extends Schema implements ResourceCostData {
  constructor(costs: ResourceCostData) {
    super();
    this.culture = costs.culture;
    this.finance = costs.finance;
    this.government = costs.government;
    this.legacy = costs.legacy;
    this.science = costs.science;
    this.upkeep = costs.upkeep;
  }

  static researcher() {
    return new ResourceCosts({culture: Infinity, finance: Infinity, government: 3, legacy: 3, science: 2, upkeep: 1})
  }

  @type('number')
  culture: number;

  @type('number')
  finance: number;

  @type('number')
  government: number;

  @type('number')
  legacy: number;

  @type('number')
  science: number;

  @type('number')
  upkeep: number;
}

class ResourceInventory implements ResourceAmountData {
  constructor() {
    this.culture = 0;
    this.finance = 0;
    this.government = 0;
    this.legacy = 0;
    this.science = 0;
  }

  @type('number')
  culture: number;

  @type('number')
  finance: number;

  @type('number')
  government: number;

  @type('number')
  legacy: number;

  @type('number')
  science: number;

  inventoryIsValid(inventory: ResourceAmountData): boolean {
    for (const [k, v] of Object.entries(this)) {
      const resourceRemaining: number = (v as any) - (inventory as any)[k];
      if (resourceRemaining < 0) {
        return false;
      }
    }
    return true;
  }

  update(inventory: InvestmentData) {
    this.culture -= inventory.culture;
    this.finance -= inventory.finance;
    this.government -= inventory.government;
    this.legacy -= inventory.legacy;
    this.science -= inventory.science;
  }
}

export class Accomplishment extends Schema implements AccomplishmentData {
  constructor(data: AccomplishmentData) {
    super();
    this.id = data.id;
    this.role = data.role;
    this.label = data.label;
    this.flavorText = data.flavorText;
    this.science = data.science;
    this.government = data.government;
    this.legacy = data.legacy;
    this.finance = data.finance;
    this.culture = data.culture;
    this.upkeep = data.upkeep;
    this.victoryPoints = data.victoryPoints;
    this.effect = data.effect;
  }

  @type('number')
  id: number;

  @type('string')
  role: Role;

  @type('string')
  label: string;

  @type('string')
  flavorText: string;

  @type('number')
  science: number;

  @type('number')
  government: number;

  @type('number')
  legacy: number;

  @type('number')
  finance: number;

  @type('number')
  culture: number;

  @type('number')
  upkeep: number;

  @type('number')
  victoryPoints: number;

  @type('string')
  effect: string;

}

export class AccomplishmentSet extends Schema {
  @type([Accomplishment])
  boughtAccomplishment: ArraySchema<Accomplishment>;

  @type(['number'])
  purchasableAccomplishments: ArraySchema<number>;

  possibleAccomplishments: Array<number>;

  constructor(role: Role) {
    super();
    this.boughtAccomplishment = new ArraySchema<Accomplishment>();
    this.purchasableAccomplishments = new ArraySchema<number>();
    this.possibleAccomplishments = getAccomplishmentIDs(role);
  }

  buy(accomplishment: AccomplishmentData) {
    if (this.purchasableAccomplishments.filter(_id => _id === accomplishment.id).length > 0) {
      this.boughtAccomplishment.push(new Accomplishment(accomplishment));
      const index = this.purchasableAccomplishments.findIndex(_id => _id === accomplishment.id);
      this.purchasableAccomplishments.splice(index, 1);
    }
  }

  discard(id: number) {

  };

  draw() {
    const index = getRandomIntInclusive(0, this.possibleAccomplishments.length - 1);
    const id = this.possibleAccomplishments[index];
    this.possibleAccomplishments.splice(index, 1);
    this.purchasableAccomplishments.push(id);
  }
}

export class MarsEvent extends Schema implements MarsEventData {
  constructor(data: MarsEventData) {
    super();
    this.id = data.id;
    this.name = data.name;
    this.flavorText = data.flavorText;
    this.effect = data.effect;
  }

  @type('number')
  id: number;

  @type('string')
  name: string;

  @type('string')
  flavorText: string;

  @type('string')
  effect: string;

}

export class MarsEventsDeck {
  constructor() {
    this.deck = _.shuffle(_.clone(getAllMarsEvents()));
    this.position = 0;
  }

  position: number;
  deck: Array<MarsEventData>;

  updatePosition(cardsUsed: number): void {
    this.position = (this.position + cardsUsed) % this.deck.length;
  }

  public peek(upkeep: number): Array<MarsEvent> {
    const nCardsToDraw = upkeep < 33 ? 3 : upkeep < 67 ? 2 : 1;
    const cardsInds = _.map(_.range(this.position, this.position + nCardsToDraw), ind => ind % this.deck.length);
    return _.map(cardsInds, ind => new MarsEvent(this.deck[ind]));
  }
}

export class Player extends Schema {
  constructor(role: Role) {
    super();
    this.role = role;
    this.accomplishment = new AccomplishmentSet(role);
  }

  @type("string")
  role: Role;

  @type(ResourceCosts)
  costs = ResourceCosts.researcher();

  @type(AccomplishmentSet)
  accomplishment: AccomplishmentSet;

  @type("boolean")
  ready: boolean = false;

  contributedUpkeep: number = 0;

  inventory = new ResourceInventory();

  invest(investment: InvestmentData) {
    this.contributedUpkeep = investment.upkeep;
    this.inventory.update(investment);
  }
}

export class GameState extends Schema {
  constructor() {
    super();
    this.marsEventDeck = new MarsEventsDeck();
    this.lastTimePolled = new Date();
    this.maxRound = getRandomIntInclusive(8, 12);
    this.replacePlayers();
  }

  static DEFAULTS = {
    timeRemaining: 300,
    marsEventsProcessed: 0,
    round: 0,
    phase: Phase.pregame,
    upkeep: 100
  };

  replacePlayers() {
    ROLES.forEach(r => this.players[r] = new Player(r));
  }

  availableRoles = _.cloneDeep(ROLES);

  @type({map: Player})
  players = new MapSchema<Player>();

  connections: { [sessionId: string]: string } = {};

  maxRound: number;
  lastTimePolled: Date;

  @type("number")
  timeRemaining: number = GameState.DEFAULTS.timeRemaining;

  @type("number")
  round: number = GameState.DEFAULTS.round;

  @type("number")
  phase: Phase = GameState.DEFAULTS.phase;

  @type("number")
  upkeep: number = GameState.DEFAULTS.upkeep;

  @type([ChatMessage])
  messages = new ArraySchema<ChatMessage>();

  @type([MarsEvent])
  marsEvents = new ArraySchema<MarsEvent>();

  @type("number")
  marsEventsProcessed = GameState.DEFAULTS.marsEventsProcessed;

  marsEventDeck: MarsEventsDeck;

  invest(sessionId: string, investment: Investment) {
    const player = this.players[sessionId];
    player.invest(investment);
    player.contributedUpkeep = investment.upkeep
  }

  get allPlayersAreReady(): boolean {
    for (const r of ROLES) {
      const p = this.players[r];
      if (p.ready) {
        return true;
      }
    }
    return false;
  }

  resetPlayerReadiness(): void {
    for (const r of ROLES) {
      const p = this.players[r];
      p.ready = false;
    }
  }

  resetPlayerContributedUpkeep(): void {
    for (const r of ROLES) {
      const p = this.players[r];
      p.contributedUpkeep = 0;
    }
  }

  resetPlayerInvestmentPlans(): void {
    for (const r of ROLES) {
      const p = this.players[r];
    }
  }

  unsafeReset(): void {
    this.marsEventsProcessed = GameState.DEFAULTS.marsEventsProcessed;
    this.phase = GameState.DEFAULTS.phase;
    this.round = GameState.DEFAULTS.round;
    this.timeRemaining = GameState.DEFAULTS.timeRemaining;
    this.upkeep = GameState.DEFAULTS.upkeep;
    this.marsEvents.splice(0, this.marsEvents.length);
    this.messages.splice(0, this.messages.length);
    this.replacePlayers();
    this.marsEventDeck = new MarsEventsDeck();
  }

  nextRoundUpkeep(): number {
    const contributedUpkeep = _.reduce(this.players, (s, p) => s + p.contributedUpkeep, 0);
    return this.upkeep + contributedUpkeep - 25;
  }

  applyMany(event: Array<GameEvent>): void {
    event.forEach(e => e.apply(this));
  }

  apply(event: GameEvent): void {
    event.apply(this);
  }
}