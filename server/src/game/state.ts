import {ArraySchema, MapSchema, Schema, type} from "@colyseus/schema";
import {
  AccomplishmentData,
  AccomplishmentSetData,
  ChatMessageData,
  CURATOR,
  ENTREPRENEUR,
  GameData,
  InvestmentData,
  MarsEventData,
  Phase,
  PIONEER,
  PlayerData,
  PlayerSetData,
  POLITICIAN,
  RESEARCHER,
  ResourceAmountData,
  ResourceCostData,
  Role,
  ROLES
} from "shared/types";
import _ from "lodash";
import {getRandomIntInclusive} from "@/util";
import {getAccomplishmentByID, getAccomplishmentIDs} from "@/repositories/Accomplishment";
import {getAllMarsEvents, getMarsEventByID} from "@/repositories/MarsEvents";
import {GameEvent} from "@/game/events/types";

export class ChatMessage extends Schema implements ChatMessageData {
  constructor(msg: ChatMessageData) {
    super();
    this.role = msg.role;
    this.message = msg.message;
    this.dateCreated = msg.dateCreated;
    this.round = msg.round;
  }

  fromJSON(data: ChatMessageData) {
    Object.assign(this, data);
  }

  toJSON(): ChatMessageData {
    return {
      role: this.role,
      message: this.message,
      dateCreated: this.dateCreated,
      round: this.round
    }
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

  fromJSON(data: ResourceCostData) {
    Object.assign(this, data);
  }

  toJSON(): ResourceCostData {
    return {
      culture: this.culture,
      finance: this.finance,
      government: this.government,
      legacy: this.legacy,
      science: this.science,
      upkeep: this.upkeep
    }
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

  investmentWithinBudget(investment: InvestmentData, budget: number) {
    return this.culture*investment.culture +
      this.finance*investment.finance +
      this.government*investment.government +
      this.legacy*investment.legacy +
      this.science*investment.science +
      this.upkeep*investment.upkeep <= budget;
  }
}

class ResourceInventory extends Schema implements ResourceAmountData {
  constructor() {
    super();
    this.culture = 0;
    this.finance = 0;
    this.government = 0;
    this.legacy = 0;
    this.science = 0;
  }

  fromJSON(data: ResourceAmountData) {
    Object.assign(this, data);
  }

  toJSON(): ResourceAmountData {
    return {
      culture: this.culture,
      finance: this.finance,
      government: this.government,
      legacy: this.legacy,
      science: this.science
    }
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

  canAfford(inventory: ResourceAmountData): boolean {
    for (const [k, v] of Object.entries(this)) {
      const resourceRemaining: number = (v as any) - (inventory as any)[k];
      if (resourceRemaining < 0) {
        return false;
      }
    }
    return true;
  }

  update(newResources: ResourceAmountData) {
    this.culture += newResources.culture;
    this.finance += newResources.finance;
    this.government += newResources.government;
    this.legacy += newResources.legacy;
    this.science += newResources.science;
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

  fromJSON(data: {role: Role, id: number}) {
    Object.assign(this, getAccomplishmentByID(data.role, data.id));
  }

  toJSON() {
    return {role: this.role, id: this.id};
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

interface AccomplishmentSetSerialized {
  role: Role
  bought: Array<number>
  purchasable: Array<number>
  remaining: Array<number>
}

export class AccomplishmentSet extends Schema implements AccomplishmentSetData {
  constructor(role: Role) {
    super();
    this.role = role;
    this.bought = new ArraySchema<Accomplishment>();
    const deck = _.shuffle(getAccomplishmentIDs(role));
    const purchasableInds: Array<number> = deck.slice(0, 3);
    this.purchasable = new ArraySchema<Accomplishment>(...purchasableInds.map(id => new Accomplishment(getAccomplishmentByID(role, id))));
    this.deck = deck.slice(3);
  }

  fromJSON(data: AccomplishmentSetSerialized) {
    this.role = data.role;
    const bought = _.map(data.bought, _id => new Accomplishment(getAccomplishmentByID(this.role, _id)));
    const purchasable = _.map(data.purchasable, _id => new Accomplishment(getAccomplishmentByID(this.role, _id)));
    this.bought.splice(0, this.bought.length, ...bought);
    this.purchasable.splice(0, this.purchasable.length, ...purchasable);
    this.deck =  _.cloneDeep(data.remaining);
  }

  toJSON(): AccomplishmentSetSerialized {
    return {
      bought: _.map(this.bought.map(a => a.id), x => x),
      purchasable: _.map(this.purchasable, a => a.id),
      remaining: this.deck,
      role: this.role
    }
  }

  role: Role;

  @type([Accomplishment])
  bought: ArraySchema<Accomplishment>;

  @type([Accomplishment])
  purchasable: ArraySchema<Accomplishment>;

  deck: Array<number>;

  position: number = 0;

  buy(accomplishment: AccomplishmentData) {
    if (this.purchasable.filter(a => a.id === accomplishment.id).length > 0) {
      this.bought.push(new Accomplishment(accomplishment));
      const index = this.purchasable.findIndex(a => a.id === accomplishment.id);
      this.purchasable.splice(index, 1);
    }
  }

  draw() {
    const index = getRandomIntInclusive(0, this.deck.length - 1);
    const id = this.deck[index];
    this.deck.splice(index, 1);
    this.purchasable.push(new Accomplishment(getAccomplishmentByID(this.role, id)));
  }

  isPurchasable(accomplishment: AccomplishmentData) {
    return this.purchasable.find(a => a.id === accomplishment.id);
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

  static fromID(id: number) {
    const me = getMarsEventByID(id)!;
    return new MarsEvent(me);
  }

  toJSON(): number {
    return this.id;
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

interface MarsEventDeckSerialized {
  position: number
  deck: Array<MarsEventData>
}

export class MarsEventsDeck {
  constructor(data: Partial<MarsEventDeckSerialized> = {}) {
    this.deck = data.deck ? data.deck : _.shuffle(_.clone(getAllMarsEvents()));
    this.position = data.position ? data.position : 0;
  }

  fromJSON(data: MarsEventDeckSerialized) {
    this.deck.splice(0, this.deck.length, ...data.deck);
    this.position = data.position;
  }

  toJSON(): {position: number, deck: Array<MarsEventData>} {
    return {
      deck: this.deck,
      position: this.position
    }
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

export interface PlayerSerialized {
  role: Role
  costs: ResourceCostData
  accomplishment: AccomplishmentSetSerialized
  ready: boolean
  timeBlocks: number
  contributedUpkeep: number
  victoryPoints: number
  inventory: ResourceAmountData
}

export class Player extends Schema implements PlayerData {
  constructor(role: Role) {
    super();
    this.role = role;
    this.accomplishment = new AccomplishmentSet(role);
  }

  fromJSON(data: PlayerSerialized) {
    this.role = data.role;
    this.costs.fromJSON(data.costs);
    this.accomplishment.fromJSON(data.accomplishment);
    this.ready = data.ready;
    this.timeBlocks = data.timeBlocks;
    this.contributedUpkeep = data.contributedUpkeep;
    this.victoryPoints = data.victoryPoints;
    this.inventory.fromJSON(data.inventory);
    return this;
  }

  toJSON(): PlayerSerialized {
    return {
      role: this.role,
      costs: this.costs.toJSON(),
      accomplishment: this.accomplishment.toJSON(),
      ready: this.ready,
      timeBlocks: this.timeBlocks,
      contributedUpkeep: this.contributedUpkeep,
      victoryPoints: this.victoryPoints,
      inventory: this.inventory.toJSON()
    };
  }

  @type("string")
  role: Role;

  @type(ResourceCosts)
  costs = ResourceCosts.researcher();

  @type(AccomplishmentSet)
  accomplishment: AccomplishmentSet;

  @type("boolean")
  ready: boolean = false;

  timeBlocks: number = 10;

  contributedUpkeep: number = 0;

  inventory = new ResourceInventory();

  @type("number")
  victoryPoints: number = 0;

  isInvestmentFeasible(investment: InvestmentData) {
    return this.costs.investmentWithinBudget(investment, this.timeBlocks);
  }

  isAccomplishmentPurchaseFeasible(accomplishment: AccomplishmentData) {
    return this.accomplishment.isPurchasable(accomplishment) && this.inventory.canAfford(accomplishment);
  }

  buyAccomplishment(accomplishment: AccomplishmentData) {
    this.accomplishment.buy(accomplishment);
    const inv: ResourceAmountData = {
      culture: - accomplishment.culture,
      finance: - accomplishment.finance,
      government: - accomplishment.government,
      legacy: - accomplishment.legacy,
      science: - accomplishment.science
    };
    this.contributedUpkeep -= accomplishment.upkeep;
    this.victoryPoints += accomplishment.victoryPoints;
    this.inventory.update(inv)
  }

  invest(investment: InvestmentData) {
    this.contributedUpkeep = investment.upkeep;
    this.inventory.update(investment);
  }
}

type PlayerSetSerialized = { [role in Role]: PlayerSerialized }

class PlayerSet extends Schema implements PlayerSetData {
  constructor() {
    super();
    this.Curator = new Player(CURATOR);
    this.Entrepreneur = new Player(ENTREPRENEUR);
    this.Pioneer = new Player(PIONEER);
    this.Politician = new Player(POLITICIAN);
    this.Researcher = new Player(RESEARCHER);
  }

  @type(Player)
  Curator: Player;

  @type(Player)
  Entrepreneur: Player;

  @type(Player)
  Pioneer: Player;

  @type(Player)
  Politician: Player;

  @type(Player)
  Researcher: Player;

  toJSON(): PlayerSetSerialized {
    return {
      Curator: this.Curator.toJSON(),
      Entrepreneur: this.Entrepreneur.toJSON(),
      Pioneer: this.Pioneer.toJSON(),
      Politician: this.Politician.toJSON(),
      Researcher: this.Researcher.toJSON()
    }
  }

  fromJSON(data: PlayerSetSerialized) {
    this.Curator.fromJSON(data.Curator);
    this.Entrepreneur.fromJSON(data.Entrepreneur);
    this.Pioneer.fromJSON(data.Pioneer);
    this.Politician.fromJSON(data.Politician);
    this.Researcher.fromJSON(data.Researcher);
  }

  [Symbol.iterator](): Iterator<Player> {
    let index = 0;
    const self = this;
    return {
      next(): IteratorResult<Player> {
        if (index < ROLES.length) {
          const role = ROLES[index];
          index += 1;
          return {
            done: false,
            value: self[role]
          }
        } else {
          return {
            done: true,
            value: null
          }
        }
      }
    }
  }
}

interface GameSerialized {
  availableRoles: Array<Role>
  players: PlayerSetSerialized
  connections: { [sessionId: string]: Role }
  maxRound: number
  lastTimePolled: number
  timeRemaining: number
  round: number
  phase: Phase
  upkeep: number
  messages: Array<ChatMessageData>
  marsEvents: Array<number>
  marsEventsProcessed: number
  marsEventDeck: MarsEventDeckSerialized
}

export class GameState extends Schema implements GameData {
  constructor() {
    super();
    this.marsEventDeck = new MarsEventsDeck();
    this.lastTimePolled = new Date();
    this.maxRound = getRandomIntInclusive(8, 12);
    this.players = new PlayerSet();
  }

  static DEFAULTS = {
    timeRemaining: 300,
    marsEventsProcessed: 0,
    round: 0,
    phase: Phase.pregame,
    upkeep: 100
  };

  fromJSON(data: GameSerialized): GameState {
    this.availableRoles = data.availableRoles;
    this.players.fromJSON(data.players);
    this.connections = data.connections;
    this.maxRound = data.maxRound;
    this.lastTimePolled = new Date(data.lastTimePolled);
    this.timeRemaining = data.timeRemaining;
    this.round = data.round;
    this.phase = data.phase;
    this.upkeep = data.upkeep;

    const chatMessages = _.map(data.messages, m => new ChatMessage(m));
    this.messages.splice(0, this.messages.length, ...chatMessages);

    const marsEvents = _.map(data.marsEvents, _id => MarsEvent.fromID(_id));
    this.marsEvents.splice(0, this.marsEvents.length, ...marsEvents);

    this.marsEventsProcessed = data.marsEventsProcessed;
    this.marsEventDeck.fromJSON(data.marsEventDeck);
    return this;
  }

  toJSON(): GameSerialized {
    return {
      availableRoles: this.availableRoles,
      players: this.players.toJSON(),
      connections: this.connections,
      maxRound: this.maxRound,
      lastTimePolled: this.lastTimePolled.getTime(),
      timeRemaining: this.timeRemaining,
      round: this.round,
      phase: this.phase,
      upkeep: this.upkeep,
      messages: _.map(this.messages, x => x),
      marsEvents: _.map(this.marsEvents, e => e.toJSON()),
      marsEventsProcessed: this.marsEventsProcessed,
      marsEventDeck: this.marsEventDeck.toJSON()
    };
  }

  availableRoles = _.cloneDeep(ROLES);

  @type(PlayerSet)
  players: PlayerSet;

  connections: { [sessionId: string]: Role } = {};

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

  invest(role: Role, investment: InvestmentData) {
    const player = this.players[role];
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
    this.players.fromJSON((new PlayerSet()).toJSON());
    this.marsEventDeck = new MarsEventsDeck();
  }

  nextRoundUpkeep(): number {
    let contributedUpkeep = 0;
    for (const p of this.players) {
      contributedUpkeep += p.contributedUpkeep;
    }
    return this.upkeep + contributedUpkeep - 25;
  }

  applyMany(event: Array<GameEvent>): void {
    event.forEach(e => e.apply(this));
  }

  apply(event: GameEvent): void {
    event.apply(this);
  }
}
