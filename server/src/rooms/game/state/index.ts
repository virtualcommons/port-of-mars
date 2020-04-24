import { ArraySchema, MapSchema, Schema, type } from '@colyseus/schema';
import {
  AccomplishmentData,
  AccomplishmentSetData,
  ChatMessageData,
  CURATOR,
  ENTREPRENEUR,
  GameData,
  InvestmentData,
  MarsEventData,
  MarsLogMessageData,
  Phase,
  PIONEER,
  PlayerData,
  PlayerSetData,
  POLITICIAN,
  RESEARCHER,
  Resource,
  ResourceAmountData,
  ResourceCostData,
  Role,
  ROLES,
  SERVER,
  ServerRole,
  TradeAmountData,
  TradeData,
  TradeStatus,
  TradeSetData,
  RESOURCES,
  MarsLogCategory
} from '@port-of-mars/shared/types';
import { canSendTradeRequest } from '@port-of-mars/shared/validation';
import _ from 'lodash';
import * as assert from 'assert';
import { uuid } from 'uuidv4';
import {
  getAccomplishmentByID,
  getAccomplishmentIDs
} from '@port-of-mars/server/data/Accomplishment';
import { isProduction } from '@port-of-mars/shared/settings';
import { settings } from '@port-of-mars/server/settings';
import { GameEvent } from '@port-of-mars/server/rooms/game/events/types';
import { GameOpts, GameStateOpts } from '@port-of-mars/server/rooms/game/types';
import { MarsEventsDeck } from '@port-of-mars/server/rooms/game/state/marsEvents/MarsEventDeck';
import { MarsEvent } from '@port-of-mars/server/rooms/game/state/marsEvents/MarsEvent';

const logger = settings.logging.getLogger(__filename);

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
    };
  }

  @type('string')
  role: string;

  @type('string')
  message: string;

  @type('number')
  dateCreated: number;

  @type('number')
  round: number;
}

class PendingInvestment extends Schema implements InvestmentData {
  constructor() {
    super();
    const pendingInvestments = { ...PendingInvestment.defaults() };
    this.culture = pendingInvestments.culture;
    this.finance = pendingInvestments.finance;
    this.government = pendingInvestments.government;
    this.legacy = pendingInvestments.legacy;
    this.science = pendingInvestments.science;
    this.upkeep = pendingInvestments.upkeep;
  }

  static defaults(): InvestmentData {
    return {
      culture: 0,
      finance: 0,
      government: 0,
      legacy: 0,
      science: 0,
      upkeep: 0
    };
  }

  reset() {
    Object.assign(this, PendingInvestment.defaults());
  }

  fromJSON(data: InvestmentData) {
    Object.assign(this, data);
  }

  toJSON(): InvestmentData {
    return {
      culture: this.culture,
      finance: this.finance,
      government: this.government,
      legacy: this.legacy,
      science: this.science,
      upkeep: this.upkeep
    };
  }

  rollback(data: InvestmentData) {
    this.culture -= data.culture;
    this.finance -= data.finance;
    this.government -= data.government;
    this.legacy -= data.legacy;
    this.science -= data.science;
  }

  add(data: InvestmentData) {
    this.culture += data.culture;
    this.finance += data.finance;
    this.government += data.government;
    this.legacy += data.legacy;
    this.science += data.science;
    this.upkeep += data.upkeep;
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

export class MarsLogMessage extends Schema implements MarsLogMessageData {
  constructor(msg: MarsLogMessageData) {
    super();
    this.performedBy = msg.performedBy;
    this.round = msg.round;
    this.category = msg.category;
    this.content = msg.content;
    this.timestamp = msg.timestamp;
  }

  fromJSON(data: MarsLogMessageData) {
    Object.assign(this, data);
  }

  toJSON(): MarsLogMessageData {
    return {
      performedBy: this.performedBy,
      round: this.round,
      category: this.category,
      content: this.content,
      timestamp: this.timestamp
    };
  }

  @type('string')
  performedBy: Role | ServerRole;

  @type('number')
  round: number;

  @type('string')
  category: string;

  @type('string')
  content: string;

  @type('number')
  timestamp: number;
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
    };
  }

  static fromRole(role: Role): ResourceCosts {
    switch (role) {
      case CURATOR:
        return new ResourceCosts({
          culture: 2,
          finance: 3,
          government: Infinity,
          legacy: 3,
          science: Infinity,
          upkeep: 1
          // specialty: 'culture'
        });
      case ENTREPRENEUR:
        return new ResourceCosts({
          culture: 3,
          finance: 2,
          government: 3,
          legacy: Infinity,
          science: Infinity,
          upkeep: 1
          // specialty: 'finance'
        });
      case PIONEER:
        return new ResourceCosts({
          culture: 3,
          finance: Infinity,
          government: Infinity,
          legacy: 2,
          science: 3,
          upkeep: 1
          // specialty: 'legacy'
        });
      case POLITICIAN:
        return new ResourceCosts({
          culture: Infinity,
          finance: 3,
          government: 2,
          legacy: Infinity,
          science: 3,
          upkeep: 1
          // specialty: 'government'
        });
      case RESEARCHER:
        return new ResourceCosts({
          culture: Infinity,
          finance: Infinity,
          government: 3,
          legacy: 3,
          science: 2,
          upkeep: 1
          // specialty: 'science'
        });
    }
  }

  static getSpecialty(role: Role): Resource {
    switch (role) {
      case CURATOR:
        return 'culture';
      case ENTREPRENEUR:
        return 'finance';
      case PIONEER:
        return 'legacy';
      case POLITICIAN:
        return 'government';
      case RESEARCHER:
        return 'science';
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

  @type('number')
  upkeep: number;

  investmentWithinBudget(investment: InvestmentData, budget: number) {
    return (
      this.culture * investment.culture +
      this.finance * investment.finance +
      this.government * investment.government +
      this.legacy * investment.legacy +
      this.science * investment.science +
      this.upkeep * investment.upkeep <=
      budget
    );
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
    };
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

  setToZero(resource: Resource) {
    this[resource] = 0;
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

  fromJSON(data: { role: Role; id: number }) {
    Object.assign(this, getAccomplishmentByID(data.role, data.id));
  }

  toJSON() {
    return { role: this.role, id: this.id };
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
  role: Role;
  // FIXME: consider renaming to purchased to match purchasable
  purchased: Array<number>;
  purchasable: Array<number>;
  remaining: Array<number>;
}

export class AccomplishmentSet extends Schema implements AccomplishmentSetData {
  constructor(role: Role) {
    super();
    this.role = role;
    this.purchased = new ArraySchema<Accomplishment>();
    const deck = _.shuffle(getAccomplishmentIDs(role));
    const purchasableInds: Array<number> = deck.slice(0, 3);
    this.purchasable = new ArraySchema<Accomplishment>(
      ...purchasableInds.map(
        id => new Accomplishment(getAccomplishmentByID(role, id))
      )
    );
    this.deck = deck.slice(3);
  }

  fromJSON(data: AccomplishmentSetSerialized) {
    this.role = data.role;
    const purchased = _.map(
      data.purchased,
      _id => new Accomplishment(getAccomplishmentByID(this.role, _id))
    );
    const purchasable = _.map(
      data.purchasable,
      _id => new Accomplishment(getAccomplishmentByID(this.role, _id))
    );
    this.purchased.splice(0, this.purchased.length, ...purchased);
    this.purchasable.splice(0, this.purchasable.length, ...purchasable);
    this.deck = _.cloneDeep(data.remaining);
  }

  toJSON(): AccomplishmentSetSerialized {
    return {
      purchased: _.map(
        this.purchased.map(a => a.id),
        x => x
      ),
      purchasable: _.map(this.purchasable, a => a.id),
      remaining: this.deck,
      role: this.role
    };
  }

  role: Role;

  @type([Accomplishment])
  purchased: ArraySchema<Accomplishment>;

  @type([Accomplishment])
  purchasable: ArraySchema<Accomplishment>;

  deck: Array<number>;

  purchase(accomplishment: AccomplishmentData) {
    const accomplishmentIndex = this.purchasable.findIndex(
      (acc: Accomplishment) => acc.id === accomplishment.id
    );
    if (accomplishmentIndex > -1) {
      this.purchased.push(new Accomplishment(accomplishment));
      this.purchasable.splice(accomplishmentIndex, 1);
    }
  }

  discardAll(): void {
    this.deck.push(...this.purchasable.map((card: Accomplishment) => card.id));
    this.purchasable.splice(0, this.purchasable.length);
  }

  discard(id: number) {
    const index = this.purchasable.findIndex(
      (card: Accomplishment) => card.id === id
    );
    if (index < 0) {
      return;
    }
    this.purchasable.splice(index, 1);
    this.deck.push(id);
  }

  draw(numberOfCards: number) {
    for (let i = 0; i < numberOfCards; i++) {
      const id = this.deck.shift();
      const newAccomplishment = new Accomplishment(
        getAccomplishmentByID(this.role, id!)
      );
      this.purchasable.push(newAccomplishment);
    }
    assert.ok(
      this.purchasable.length <= 3,
      'Should never have more than 3 cards'
    );
  }

  refreshPurchasableAccomplishments(role: Role) {
    const numberOfAccomplishmentsToDraw = Math.min(
      3 - this.purchasable.length,
      this.deck.length
    );
    this.draw(numberOfAccomplishmentsToDraw);
  }

  peek(): number {
    return this.deck[0];
  }

  isPurchasable(accomplishment: AccomplishmentData) {
    return this.purchasable.find(a => a.id === accomplishment.id);
  }
}

export interface MarsEventDeckSerialized {
  deck: Array<MarsEventData>;
  position: number;
}

export interface PlayerSerialized {
  role: Role;
  costs: ResourceCostData;
  specialty: Resource;
  accomplishment: AccomplishmentSetSerialized;
  ready: boolean;
  timeBlocks: number;
  contributedUpkeep: number;
  victoryPoints: number;
  inventory: ResourceAmountData;
  pendingInvestments: InvestmentData;
}

export class TradeAmount extends Schema {
  constructor(role: Role, resourceAmount: ResourceAmountData) {
    super();
    this.role = role;
    this.resourceAmount = new ResourceInventory();
    this.resourceAmount.fromJSON(resourceAmount);
  }

  fromJSON(data: TradeAmountData) {
    this.role = data.role;
    this.resourceAmount.fromJSON(data.resourceAmount);
  }

  toJSON(): TradeAmountData {
    return {
      role: this.role,
      resourceAmount: this.resourceAmount
    };
  }

  @type('string')
  role: Role;

  @type(ResourceInventory)
  resourceAmount: ResourceInventory;
}

export class Trade extends Schema {
  constructor(from: TradeAmountData, to: TradeAmountData, status: TradeStatus) {
    super();
    this.from = new TradeAmount(from.role, from.resourceAmount);
    this.to = new TradeAmount(to.role, to.resourceAmount);
    this.status = status;
  }

  fromJSON(data: TradeData) {
    this.from.fromJSON(data.from);
    this.to.fromJSON(data.to);
    this.status = data.status;
  }

  toJSON(): TradeData {
    return {
      from: this.from.toJSON(),
      to: this.to.toJSON(),
      status: this.status
    };
  }

  @type(TradeAmount)
  from: TradeAmount;

  @type(TradeAmount)
  to: TradeAmount;

  @type('string')
  status:TradeStatus

  apply(state: GameState) {
    const pFrom = state.players[this.from.role];
    const pTo = state.players[this.to.role];

    pFrom.inventory.update(_.mapValues(this.from.resourceAmount, r => -r!));
    pFrom.inventory.update(this.to.resourceAmount);
    //pFrom.pendingInvestments.rollback({...this.from.resourceAmount,upkeep:0});

    pTo.inventory.update(_.mapValues(this.to.resourceAmount, r => -r!));
    pTo.inventory.update(this.from.resourceAmount);

    this.status = 'Accepted';
  }
}

export class Player extends Schema implements PlayerData {
  constructor(role: Role) {
    super();
    this.role = role;
    this.accomplishments = new AccomplishmentSet(role);
    this.costs = ResourceCosts.fromRole(role);
    // FIXME: it'd be nice to bind the specialty to the ResourceCosts e.g., this.specialty = this.costs.specialty
    // but this change cascades quite a bit into the client. revisit later
    this.specialty = ResourceCosts.getSpecialty(role);
  }

  fromJSON(data: PlayerSerialized) {
    this.role = data.role;
    this.costs.fromJSON(data.costs);
    this.specialty = data.specialty;
    this.accomplishments.fromJSON(data.accomplishment);
    this.ready = data.ready;
    this.timeBlocks = data.timeBlocks;
    this.contributedUpkeep = data.contributedUpkeep;
    this.victoryPoints = data.victoryPoints;
    this.inventory.fromJSON(data.inventory);

    // FIXME: mapping the identity function seems pretty pointless, is this just to create a list from data.notifications?
    // const notifications = _.map(data.notifications, n => n);
    // this.notifications.splice(0, this.notifications.length, ...notifications);
    return this;
  }

  toJSON(): PlayerSerialized {
    return {
      role: this.role,
      costs: this.costs.toJSON(),
      specialty: this.specialty,
      accomplishment: this.accomplishments.toJSON(),
      ready: this.ready,
      timeBlocks: this.timeBlocks,
      contributedUpkeep: this.contributedUpkeep,
      victoryPoints: this.victoryPoints,
      inventory: this.inventory.toJSON(),
      pendingInvestments: this.pendingInvestments.toJSON(),
    };
  }

  static defaults = {
    timeBlocks: 10
  };

  @type('string')
  role: Role;

  @type(ResourceCosts)
  costs: ResourceCosts;

  @type('string')
  specialty: Resource;

  @type(AccomplishmentSet)
  accomplishments: AccomplishmentSet;

  @type('boolean')
  ready = false;

  @type('number')
  timeBlocks: number = Player.defaults.timeBlocks;

  @type('number')
  contributedUpkeep = 0;

  @type(ResourceInventory)
  inventory = new ResourceInventory();

  @type(PendingInvestment)
  pendingInvestments = new PendingInvestment();

  @type('number')
  victoryPoints = 0;

  connected = true;

  isInvestmentFeasible(investment: InvestmentData) {
    return this.costs.investmentWithinBudget(investment, this.timeBlocks);
  }

  isAccomplishmentPurchaseFeasible(accomplishment: AccomplishmentData) {
    return (
      this.accomplishments.isPurchasable(accomplishment) &&
      this.inventory.canAfford(accomplishment)
    );
  }

  purchaseAccomplishment(accomplishment: AccomplishmentData) {
    this.accomplishments.purchase(accomplishment);
    const inv: ResourceAmountData = {
      culture: -accomplishment.culture,
      finance: -accomplishment.finance,
      government: -accomplishment.government,
      legacy: -accomplishment.legacy,
      science: -accomplishment.science
    };
    this.contributedUpkeep -= Math.abs(accomplishment.upkeep);
    this.victoryPoints += accomplishment.victoryPoints;
    this.inventory.update(inv);
  }

  refreshPurchasableAccomplishments() {
    this.accomplishments.refreshPurchasableAccomplishments(this.role);
  }

  resetTimeBlocks() {
    this.timeBlocks = Player.defaults.timeBlocks;
  }

  setTimeBlocks(amount: number) {
    this.timeBlocks = amount;
  }

  getLeftOverInvestments() {
    const investment = _.cloneDeep(this.pendingInvestments);

    let leftOvers = 0;
    let minCostResource = '';
    let minCost = Infinity;
    const leftOverInvestments: InvestmentData = PendingInvestment.defaults();

    for (const [k, v] of Object.entries(this.costs)) {
      if (v != Infinity) {
        leftOvers += (investment as any)[k] * v;
      }
      if (minCost > v && k != 'upkeep') {
        minCost = v;
        minCostResource = k;
      }
    }

    if (leftOvers == 0) {
      while (leftOvers + minCost <= 6) {
        (leftOverInvestments as any)[minCostResource] += 1;
        leftOvers += minCost;
      }

      while (leftOvers < 10) {
        leftOverInvestments.upkeep += 1;
        leftOvers += 1;
      }
    }

    return leftOverInvestments;
  }

  invest(investment?: InvestmentData, leftOverInvestments?: InvestmentData) {
    investment = investment ?? this.pendingInvestments;
    leftOverInvestments = leftOverInvestments ?? PendingInvestment.defaults();

    for (const [k, v] of Object.entries(investment)) {
      (investment as any)[k] += (leftOverInvestments as any)[k];
    }

    this.contributedUpkeep = investment.upkeep;
    this.inventory.update(investment);
    // console.log(this.inventory.toJSON())
  }


  invertPendingInventory() {
    const invertedInventory = PendingInvestment.defaults();
    for (const resource of RESOURCES) {
      invertedInventory[resource as Resource] = this.inventory[resource as Resource] * -1;
    }

    this.pendingInvestments.add({ ...invertedInventory, upkeep: 0 });
  }

  mergePendingAndInventory() {
    this.inventory.update(this.pendingInvestments);
    this.pendingInvestments.reset();
  }

  updateReadiness(ready: boolean): void {
    this.ready = ready;
  }
}

type PlayerSetSerialized = { [role in Role]: PlayerSerialized };

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
    };
  }

  fromJSON(data: PlayerSetSerialized) {
    this.Curator.fromJSON(data.Curator);
    this.Entrepreneur.fromJSON(data.Entrepreneur);
    this.Pioneer.fromJSON(data.Pioneer);
    this.Politician.fromJSON(data.Politician);
    this.Researcher.fromJSON(data.Researcher);
  }

  asArray(): Array<Player> {
    return [this.Curator, this.Entrepreneur, this.Pioneer, this.Politician, this.Researcher];
  }

  [Symbol.iterator](): Iterator<Player> {
    return this.asArray()[Symbol.iterator]();
    /*
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
          };
        } else {
          return {
            done: true,
            value: null
          };
        }
      }
    };
    */
  }
}

export interface GameSerialized {
  players: PlayerSetSerialized;
  userRoles: { [sessionId: string]: Role };
  maxRound: number;
  lastTimePolled: number;
  timeRemaining: number;
  round: number;
  phase: Phase;
  upkeep: number;
  logs: Array<MarsLogMessageData>;
  messages: Array<ChatMessageData>;
  marsEvents: Array<MarsEventData>;
  marsEventsProcessed: number;
  marsEventDeck: MarsEventDeckSerialized;
  tradeSet: TradeSetData;
  winners: Array<Role>;
}

export class GameState extends Schema implements GameData {

  constructor(data: GameStateOpts) {
    super();
    if (isProduction()) {
      assert.equal(Object.keys(data.userRoles).length, ROLES.length, 'Must have five players');
    }
    this.userRoles = data.userRoles;
    this.marsEventDeck = new MarsEventsDeck(data.deck);
    this.lastTimePolled = new Date();
    this.maxRound = data.numberOfGameRounds;
    this.players = new PlayerSet();
  }

  static DEFAULTS = {
    timeRemaining: 300,
    marsEventsProcessed: 0,
    round: 1,
    phase: Phase.invest,
    upkeep: 100
  };

  fromJSON(data: GameSerialized): GameState {
    this.players.fromJSON(data.players);
    this.userRoles = data.userRoles;
    this.maxRound = data.maxRound;
    this.lastTimePolled = new Date(data.lastTimePolled);
    this.timeRemaining = data.timeRemaining;
    this.round = data.round;
    this.phase = data.phase;
    this.upkeep = data.upkeep;

    const marsLogs = _.map(data.logs, m => new MarsLogMessage(m));
    this.logs.splice(0, this.logs.length, ...marsLogs);

    const chatMessages = _.map(data.messages, m => new ChatMessage(m));
    this.messages.splice(0, this.messages.length, ...chatMessages);

    const marsEvents = _.map(data.marsEvents, e => new MarsEvent(e));
    this.marsEvents.splice(0, this.marsEvents.length, ...marsEvents);

    this.marsEventsProcessed = data.marsEventsProcessed;
    this.marsEventDeck.fromJSON(data.marsEventDeck);
    Object.keys(this.tradeSet).forEach(k => delete this.tradeSet[k]);
    Object.keys(data.tradeSet).forEach(k => {
      const tradeData: TradeData = data.tradeSet[k];
      this.tradeSet[k] = new Trade(tradeData.from, tradeData.to, 'Active');
    });

    const winners = _.map(data.winners, w => w);
    this.winners.splice(0, this.winners.length, ...winners);

    return this;
  }

  toJSON(): GameSerialized {
    return {
      players: this.players.toJSON(),
      userRoles: this.userRoles,
      maxRound: this.maxRound,
      lastTimePolled: this.lastTimePolled.getTime(),
      timeRemaining: this.timeRemaining,
      round: this.round,
      phase: this.phase,
      upkeep: this.upkeep,
      logs: _.map(this.logs, x => x.toJSON()),
      messages: _.map(this.messages, x => x.toJSON()),
      marsEvents: _.map(this.marsEvents, e => e.toJSON()),
      marsEventsProcessed: this.marsEventsProcessed,
      marsEventDeck: this.marsEventDeck.toJSON(),
      tradeSet: this.tradeSet.toJSON(),
      winners: _.map(this.winners, w => w)
    };
  }

  @type(PlayerSet)
  players: PlayerSet;

  userRoles: GameOpts['userRoles'] = {};

  maxRound: number;
  lastTimePolled: Date;

  @type('number')
  timeRemaining: number = GameState.DEFAULTS.timeRemaining;

  @type('number')
  round: number = GameState.DEFAULTS.round;

  @type('number')
  phase: Phase = GameState.DEFAULTS.phase;

  @type('number')
  upkeep: number = GameState.DEFAULTS.upkeep;

  @type([MarsLogMessage])
  logs = new ArraySchema<MarsLogMessage>();

  @type([ChatMessage])
  messages = new ArraySchema<ChatMessage>();

  @type([MarsEvent])
  marsEvents = new ArraySchema<MarsEvent>();

  @type('number')
  marsEventsProcessed = GameState.DEFAULTS.marsEventsProcessed;

  marsEventDeck: MarsEventsDeck;

  @type({ map: Trade })
  tradeSet = new MapSchema<Trade>();

  @type(['string'])
  winners = new ArraySchema<Role>();

  invest(role: Role, investment: InvestmentData) {
    const player = this.players[role];
    player.invest(investment);
    player.contributedUpkeep = investment.upkeep;
  }

  getPlayer(username: string): Player {
    if (this.hasUser(username)) {
      return this.players[this.userRoles[username]];
    }
    logger.fatal("GameState.getPlayer: Unable to find player with username", username);
    throw new Error(`No player found with ${username}`);
  }

  getPlayers(): Array<Player> {
    return this.players.asArray();
  }

  hasUser(username: string | undefined): boolean {
    if (username) {
      return Object.keys(this.userRoles).includes(username);
    }
    return false;
  }

  get allPlayersAreReady(): boolean {
    for (const player of this.players) {
      if (!player.ready) {
        return false;
      }
    }
    return true;
  }

  refreshPlayerPurchasableAccomplisments(): void {
    for (const player of this.players) {
      player.refreshPurchasableAccomplishments();
    }
  }

  resetPlayerReadiness(): void {
    for (const player of this.players) {
      player.ready = false;
    }
  }

  resetPlayerContributedUpkeep(): void {
    for (const player of this.players) {
      player.contributedUpkeep = 0;
    }
  }

  updateMarsEventsElapsed(): void {
    for (const event of this.marsEvents) {
      event.updateElapsed();
    }
  }

  handleIncomplete(): void {
    this.marsEvents = this.marsEvents.filter(event => {
      return !event.complete;
    });
  }

  unsafeReset(): void {
    this.marsEventsProcessed = GameState.DEFAULTS.marsEventsProcessed;
    this.phase = GameState.DEFAULTS.phase;
    this.round = GameState.DEFAULTS.round;
    this.timeRemaining = GameState.DEFAULTS.timeRemaining;
    this.upkeep = GameState.DEFAULTS.upkeep;
    this.logs.splice(0, this.logs.length);
    this.marsEvents.splice(0, this.marsEvents.length);
    this.messages.splice(0, this.messages.length);
    this.players.fromJSON(new PlayerSet().toJSON());
    this.marsEventDeck = new MarsEventsDeck(_.shuffle(this.marsEventDeck.deck));
    this.winners.splice(0, this.winners.length);
  }

  nextRoundUpkeep(): number {
    let contributedUpkeep = 0;
    for (const p of this.players) {
      contributedUpkeep += p.contributedUpkeep;
    }
    return this.upkeep + contributedUpkeep - 25;
  }

  subtractUpkeep(amount: number): void {
    const current = this.upkeep;
    if (current - amount >= 0) {
      this.upkeep = current - amount;
    } else {
      this.upkeep = 0;
    }
  }

  clearTrades() {
    Object.keys(this.tradeSet).forEach(trade => delete this.tradeSet[trade]);
  }

  applyMany(event: Array<GameEvent>): void {
    event.forEach(e => e.apply(this));
  }

  apply(event: GameEvent): void {
    event.apply(this);
  }

  // REFACTOR: DEFAULT CATEGORY

  log(
    round: number,
    message: string,
    category: string,
    performedBy: Role | ServerRole = SERVER
  ): MarsLogMessage {
    const msg = new MarsLogMessage({
      round,
      performedBy,
      category,
      content: message,
      timestamp: new Date().getTime()
    });
    this.logs.push(msg);
    return msg;
  }

  get playerScores(): { [role in Role]: number } {
    const scores: { [role in Role]: number } = {} as any;
    for (const r of ROLES) {
      scores[r] = this.players[r].victoryPoints;
    }
    return scores;
  }

  get currentEvent() {
    return this.marsEvents[this.marsEventsProcessed];
  }

  evaluateGameWinners() {
    const playerScores: Array<[Role, number]> = this.players.asArray().map(p => [p.role, p.victoryPoints]);
    const winners: Array<Role> = [];

    for (const p of this.players) {
      playerScores.push([p.role, p.victoryPoints]);
    }

    const sorted = _.reverse(_.sortBy(playerScores, [1]));
    sorted.forEach((s: [Role, number]) => {
      if (s[1] === sorted[0][1]) winners.push(s[0]);
    })

    this.winners.push(...winners);
  }

  addGameWinner(winner: Role) {
    this.winners.push(winner);
  }

  // NOTE :: NEW CHANGES
  addChat(message: ChatMessageData): void {
    this.messages.push(new ChatMessage(message));
  }

  investTime(role: Role, investment: InvestmentData): void {
    this.players[role].pendingInvestments.fromJSON(investment);
  }

  setPlayerReadiness(role: Role, ready: boolean): void {
    this.players[role].updateReadiness(ready);
  }

  addTrade(trade: TradeData, reason?: string): void {
    let message: string;
    let category: string;
    let round: number = this.round;
    const performedBy: ServerRole = SERVER;
    const toRole: Role = trade.to.role;
    const fromRole: Role = trade.from.role;
    const id = uuid();

    this.tradeSet[id] = new Trade(trade.from, trade.to, 'Active');

    switch (reason) {
      case 'sent-trade-request':
        message = `The ${fromRole} sent a trade request to the ${toRole}.`;
        category = MarsLogCategory.sentTrade;
        this.log(round, message, category, performedBy);
        break;
      default:
        break;
    }
  }

  removeTrade(id: string, reason?: string): void {
    let message: string;
    let category: string;
    let round: number = this.round;
    const performedBy: ServerRole = SERVER;
    const toRole: Role = this.tradeSet[id].to.role;
    const fromRole: Role = this.tradeSet[id].from.role;

    switch (reason) {
      case 'reject-trade-request':
        message = `The ${toRole} rejected a trade request from the ${fromRole}.`;
        category = MarsLogCategory.rejectTrade;
        this.log(round, message, category, performedBy);
        this.tradeSet[id].status = 'Rejected';
        break;
      case 'cancel-trade-request':
        message = `The ${fromRole} canceled a trade request sent to the ${toRole}.`;
        category = MarsLogCategory.cancelTrade;
        this.log(round, message, category, performedBy);
        this.tradeSet[id].status = 'Cancelled';
        break;
      default:
        break;
    }
  }

  canCompleteTrade(fromPlayer: PlayerData, toPlayer: PlayerData, trade: Trade): boolean {
    return canSendTradeRequest(fromPlayer, trade.from.resourceAmount) 
      && canSendTradeRequest(toPlayer, trade.to.resourceAmount);
  }

  acceptTrade(id: string): void {
    let message: string;
    let category: string;
    let round: number = this.round;
    const performedBy: ServerRole = SERVER;

    const trade: Trade = this.tradeSet[id];
    const fromRole = trade.from.role;
    const toRole = trade.to.role;
    const fromPlayer = this.players[fromRole];
    const toPlayer = this.players[toRole];
    const fromTradeResources: ResourceAmountData = trade.from.resourceAmount;

    if (this.canCompleteTrade(fromPlayer, toPlayer, trade)) {
      const toMsg: Array<string> = [];
      const fromMsg: Array<string> = [];

      const toTradeResources: ResourceAmountData = trade.to.resourceAmount;

      // apply trade resources to fromPlayer's inventory
      fromPlayer.inventory.update(_.mapValues(trade.from.resourceAmount, r => -r!));
      fromPlayer.inventory.update(trade.to.resourceAmount);
      // apply trade resources to toPlayer's inventory
      toPlayer.inventory.update(_.mapValues(trade.to.resourceAmount, r => -r!));
      toPlayer.inventory.update(trade.from.resourceAmount);

      for (const [resource, amount] of Object.entries(toTradeResources)) {
        if (amount > 0) {
          const resourceFormatted = resource.charAt(0).toUpperCase() + resource.slice(1);
          toMsg.push(`${resourceFormatted}: ${amount}`);
        }
      }
      for (const [resource, amount] of Object.entries(fromTradeResources)) {
        if (amount > 0) {
          const resourceFormatted = resource.charAt(0).toUpperCase() + resource.slice(1);
          toMsg.push(`${resourceFormatted}: ${amount}`);
        }
      }
      message = `The ${fromRole} has traded ${fromMsg.join(', ')} in exchange for ${toMsg.join(', ')} from the ${toRole}.`;
      category = MarsLogCategory.acceptTrade;
      this.log(round, message, category, performedBy);
      this.tradeSet[id].status = 'Accepted';
    } else {
      message = `The ${fromRole} is unable to fulfill a trade request previously sent to the ${toRole}. The trade will be removed.`;
      category = MarsLogCategory.invalidTrade;
      this.log(round, message, category, performedBy);
      this.tradeSet[id].status = 'Cancelled';
    }
  }

  purchaseAccomplishment(role: Role, accomplishment: AccomplishmentData): void {
    const { label, science, government, legacy, finance, culture, upkeep, victoryPoints } = accomplishment;
    const message = `The ${role} purchased an accomplishment: ${label}.
    COST: System Health: ${upkeep}, Science: ${science}, Government: ${government}, Legacy: ${legacy}, Finance: ${finance}, Culture: ${culture}.
    ${victoryPoints} points were added to the ${role}'s score.`;
    const category: string = MarsLogCategory.purchaseAccomplishment;
    const performedBy: ServerRole = SERVER;
    let round: number = this.round;

    this.players[role].purchaseAccomplishment(accomplishment);
    this.log(round, message, category, performedBy);
  }

  discardAccomplishment(role: Role, id: number): void {
    this.players[role].accomplishments.discard(id);
  }
}
