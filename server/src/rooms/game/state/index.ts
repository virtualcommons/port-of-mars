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
  MarsLogCategory,
  RoundIntroductionData,
  SystemHealthChangesData,
  PurchasedSystemHealthData,
  AccomplishmentPurchaseData,
  INVESTMENTS,
  INVESTMENT_LABELS
} from '@port-of-mars/shared/types';
import { canSendTradeRequest } from '@port-of-mars/shared/validation';
import _ from 'lodash';
import * as assert from 'assert';
import {
  getAccomplishmentByID,
  getAccomplishmentIDs
} from '@port-of-mars/server/data/Accomplishment';
import {COST_INAFFORDABLE, isProduction, SYSTEM_HEALTH_MAINTENANCE_COST} from '@port-of-mars/shared/settings';
import { settings } from '@port-of-mars/server/settings';
import { GameEvent } from '@port-of-mars/server/rooms/game/events/types';
import { GameOpts, GameStateOpts } from '@port-of-mars/server/rooms/game/types';
import MarsEventsDeck from '@port-of-mars/server/rooms/game/state/marsevents/MarsEventDeck';
import { MarsEvent } from '@port-of-mars/server/rooms/game/state/marsevents/MarsEvent';
import { SimpleBot } from "@port-of-mars/server/rooms/game/state/bot";

const logger = settings.logging.getLogger(__filename);

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

  add(newResources: ResourceAmountData) {
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

export class TradeAmount extends Schema {
  constructor(role: Role, resourceAmount: ResourceAmountData) {
    super();
    this.role = role;
    this.resourceAmount = new ResourceInventory();
    this.resourceAmount.fromJSON(resourceAmount);
  }

  fromJSON(data: TradeAmountData): void {
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

export class AccomplishmentPurchase extends Schema implements AccomplishmentPurchaseData {
  constructor(data: AccomplishmentPurchaseData) {
    super();
    this.name = data.name;
    this.victoryPoints = data.victoryPoints;
  }

  toJSON(): AccomplishmentPurchaseData {
    return {name: this.name, victoryPoints: this.victoryPoints};
  }

  fromJSON(data: AccomplishmentPurchaseData) {
    Object.assign(this, data);
  }

  @type('string')
  name: string;

  @type('number')
  victoryPoints: number;
}

export class Trade extends Schema {
  constructor(id: string, sender: TradeAmountData, recipient: TradeAmountData, status: TradeStatus) {
    super();
    this.id = id;
    this.sender = new TradeAmount(sender.role, sender.resourceAmount);
    this.recipient = new TradeAmount(recipient.role, recipient.resourceAmount);
    this.status = status;
  }

  fromJSON(data: TradeData): void {
    this.id = data.id;
    this.sender.fromJSON(data.sender);
    this.recipient.fromJSON(data.recipient);
    this.status = data.status;
  }

  toJSON(): TradeData {
    return {
      id: this.id,
      sender: this.sender.toJSON(),
      recipient: this.recipient.toJSON(),
      status: this.status
    };
  }

  @type('string')
  id: string;

  @type(TradeAmount)
  sender: TradeAmount;

  @type(TradeAmount)
  recipient: TradeAmount;

  @type('string')
  status: TradeStatus

  apply(state: GameState): void {
    const pFrom = state.players[this.sender.role];
    const pTo = state.players[this.recipient.role];

    pFrom.inventory.add(_.mapValues(this.sender.resourceAmount, r => -r!));
    pFrom.inventory.add(this.recipient.resourceAmount);
    //pFrom.pendingInvestments.rollback({...this.from.resourceAmount,systemHealth:0});

    pTo.inventory.add(_.mapValues(this.recipient.resourceAmount, r => -r!));
    pTo.inventory.add(this.sender.resourceAmount);

    this.status = 'Accepted';
  }
}

export class RoundIntroduction extends Schema implements RoundIntroductionData {
  constructor() {
    super();
  }

  fromJSON(data: RoundIntroductionData): void {
    this.maintenanceSystemHealth = data.maintenanceSystemHealth;
    this.systemHealthContributed = data.systemHealthContributed;
    this.accomplishmentPurchases.splice(0, this.accomplishmentPurchases.length, ...data.accomplishmentPurchases.map(ap => new AccomplishmentPurchase(ap)));
    this.completedTrades.splice(0, this.completedTrades.length, ...data.completedTrades.map(ct => new Trade(ct.id, ct.sender, ct.recipient, ct.status)));
  }

  toJSON(): RoundIntroductionData {
    return {
      systemHealthContributed: this.systemHealthContributed,
      systemHealthTaken: this.systemHealthTaken,
      maintenanceSystemHealth: this.maintenanceSystemHealth,
      accomplishmentPurchases: this.accomplishmentPurchases.map(ap => ap.toJSON()),
      completedTrades: this.completedTrades.map(ct => ct.toJSON())
    }
  }

  @type('number')
  maintenanceSystemHealth = -SYSTEM_HEALTH_MAINTENANCE_COST;

  @type('number')
  systemHealthContributed = 0;

  @type('number')
  systemHealthTaken = 0;

  @type([AccomplishmentPurchase])
  accomplishmentPurchases = new ArraySchema<AccomplishmentPurchase>();

  @type([Trade])
  completedTrades = new ArraySchema<Trade>();

  addContribution(systemHealth: number): void {
    this.systemHealthContributed += systemHealth;
  }

  addTaken(systemHealth: number): void {
    this.systemHealthTaken += systemHealth;
  }

  addAccomplishmentPurchase(accomplishment: AccomplishmentPurchase): void {
    this.accomplishmentPurchases.push(accomplishment);
  }

  addCompletedTrade(trade: Trade) {
    // this.completedTrades.push(trade.clone());
  }

  reset(): void {
    this.systemHealthContributed = 0;
    this.systemHealthTaken = 0;
    this.accomplishmentPurchases.splice(0, this.accomplishmentPurchases.length);
    this.completedTrades.splice(0, this.completedTrades.length);
  }
}

export class ChatMessage extends Schema implements ChatMessageData {
  constructor(msg: ChatMessageData) {
    super();
    this.role = msg.role;
    this.message = msg.message;
    this.dateCreated = msg.dateCreated;
    this.round = msg.round;
  }

  fromJSON(data: ChatMessageData): void {
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

class PendingInvestment implements InvestmentData {

  culture: number;
  finance: number;
  government: number;
  legacy: number;
  science: number;
  systemHealth: number;

  constructor() {
    const pendingInvestments = { ...PendingInvestment.defaults() };
    this.culture = pendingInvestments.culture;
    this.finance = pendingInvestments.finance;
    this.government = pendingInvestments.government;
    this.legacy = pendingInvestments.legacy;
    this.science = pendingInvestments.science;
    this.systemHealth = pendingInvestments.systemHealth;
  }

  static defaults(): InvestmentData {
    return {
      culture: 0,
      finance: 0,
      government: 0,
      legacy: 0,
      science: 0,
      systemHealth: 0
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
      systemHealth: this.systemHealth
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
    this.systemHealth += data.systemHealth;
  }

  updateAsInventory(newResources: ResourceAmountData) {
    this.culture = newResources.culture;
    this.finance = newResources.finance;
    this.government = newResources.government;
    this.legacy = newResources.legacy;
    this.science = newResources.science;
  }
}

export class MarsLogMessage extends Schema implements MarsLogMessageData {
  constructor(msg: MarsLogMessageData) {
    super();
    this.round = msg.round;
    this.performedBy = msg.performedBy;
    this.category = msg.category;
    this.content = msg.content;
    this.timestamp = msg.timestamp;
    this.id = msg.id;
  }

  fromJSON(data: MarsLogMessageData): void {
    Object.assign(this, data);
  }

  toJSON(): MarsLogMessageData {
    return {
      round: this.round,
      performedBy: this.performedBy,
      category: this.category,
      content: this.content,
      timestamp: this.timestamp,
      id: this.id,
    };
  }

  @type('number')
  round: number;

  @type('string')
  performedBy: Role | ServerRole;

  @type('string')
  category: string;

  @type('string')
  content: string;

  @type('number')
  timestamp: number;

  @type('number')
  id: number;
}

class ResourceCosts extends Schema implements ResourceCostData {
  constructor(costs: ResourceCostData) {
    super();
    this.culture = costs.culture;
    this.finance = costs.finance;
    this.government = costs.government;
    this.legacy = costs.legacy;
    this.science = costs.science;
    this.systemHealth = costs.systemHealth;
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
      systemHealth: this.systemHealth
    };
  }

  static getCosts(role: Role): ResourceCostData {
      switch (role) {
        case CURATOR:
          return {
            culture: 2,
            finance: 3,
            government: COST_INAFFORDABLE,
            legacy: 3,
            science: COST_INAFFORDABLE,
            systemHealth: 1
            // specialty: 'culture'
          };
        case ENTREPRENEUR:
          return {
            culture: 3,
            finance: 2,
            government: 3,
            legacy: COST_INAFFORDABLE,
            science: COST_INAFFORDABLE,
            systemHealth: 1
            // specialty: 'finance'
          };
        case PIONEER:
          return {
            culture: 3,
            finance: COST_INAFFORDABLE,
            government: COST_INAFFORDABLE,
            legacy: 2,
            science: 3,
            systemHealth: 1
            // specialty: 'legacy'
          };
        case POLITICIAN:
          return {
            culture: COST_INAFFORDABLE,
            finance: 3,
            government: 2,
            legacy: COST_INAFFORDABLE,
            science: 3,
            systemHealth: 1
            // specialty: 'government'
          };
        case RESEARCHER:
          return {
            culture: COST_INAFFORDABLE,
            finance: COST_INAFFORDABLE,
            government: 3,
            legacy: 3,
            science: 2,
            systemHealth: 1
            // specialty: 'science'
          };
      }
  }

  static senderRole(role: Role): ResourceCosts {
    return new ResourceCosts(ResourceCosts.getCosts(role));
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
  systemHealth: number;

  investmentWithinBudget(investment: InvestmentData, budget: number) {
    return (
      this.culture * investment.culture +
      this.finance * investment.finance +
      this.government * investment.government +
      this.legacy * investment.legacy +
      this.science * investment.science +
      this.systemHealth * investment.systemHealth <=
      budget
    );
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
    this.systemHealth = data.systemHealth;
    this.victoryPoints = data.victoryPoints;
    this.effect = data.effect;
  }

  fromJSON(data: { role: Role; id: number }): void {
    Object.assign(this, getAccomplishmentByID(data.role, data.id));
  }

  toString(): string {
    return JSON.stringify(super.toJSON());
  }

  toJSON(): { role: Role, id: number } {
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
  systemHealth: number;

  @type('number')
  victoryPoints: number;

  @type('string')
  effect: string;
}

interface AccomplishmentSetSerialized {
  role: Role;
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

  fromJSON(data: AccomplishmentSetSerialized): void {
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

  purchase(accomplishment: AccomplishmentData): void {
    const accomplishmentIndex = this.purchasable.findIndex(
      (acc: Accomplishment) => acc.id === accomplishment.id
    );
    if (accomplishmentIndex > -1) {
      this.purchased.push(new Accomplishment(accomplishment));
      this.purchasable.splice(accomplishmentIndex, 1);
    }
  }

  discardPurchased(id: number): void {
    const ind = this.purchased.findIndex(acc => acc.id === id);
    logger.info('Discarding purchase %d %d %o', ind, id, this.purchased);
    if (ind >= 0) {
      this.purchased.splice(ind, 1);
    }
  }

  discardAll(): void {
    this.deck.push(...this.purchasable.map((card: Accomplishment) => card.id));
    this.purchasable.splice(0, this.purchasable.length);
  }

  discard(id: number): void {
    const index = this.purchasable.findIndex(
      (card: Accomplishment) => card.id === id
    );
    if (index < 0) {
      return;
    }
    this.purchasable.splice(index, 1);
    this.deck.push(id);
  }

  draw(numberOfCards: number): void {
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

  refreshPurchasableAccomplishments(role: Role): void {
    const numberOfAccomplishmentsToDraw = Math.min(
      3 - this.purchasable.length,
      this.deck.length
    );
    this.draw(numberOfAccomplishmentsToDraw);
  }

  peek(): number {
    return this.deck[0];
  }

  isPurchasable(accomplishment: AccomplishmentData): Accomplishment {
    return this.purchasable.find(a => a.id === accomplishment.id)!;
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
  systemHealthChange: SystemHealthChangesData;
  victoryPoints: number;
  inventory: ResourceAmountData;
  pendingInvestments: InvestmentData;
}

export interface Bot {
  active: boolean;
  // elapsed: number;
  resetElapsed(): void;
  act(state: GameState, player: Player): Array<GameEvent>;
}

export class PurchasedSystemHealth extends Schema implements PurchasedSystemHealthData {
  constructor(data: PurchasedSystemHealthData) {
    super();
    this.description = data.description;
    this.systemHealth = data.systemHealth;
  }

  fromJSON(data: PurchasedSystemHealthData): void {
    this.description = data.description;
    this.systemHealth = data.systemHealth;
  }

  toJSON(): PurchasedSystemHealthData {
    return {
      description: this.description,
      systemHealth: this.systemHealth
    }
  }

  @type('string')
  description: string;

  @type('number')
  systemHealth: number;
}

/**
 * Maintained to display the system health report state at the beginning of a round on the client
 */
export class SystemHealthChanges extends Schema implements SystemHealthChangesData {
  fromJSON(data: SystemHealthChangesData): void {
    this.investment = data.investment;
    this.purchases.splice(this.purchases.length, 0, ...data.purchases.map(p => new PurchasedSystemHealth(p)));
  }

  toJSON(): SystemHealthChangesData {
    return {
      investment: this.investment,
      purchases: this.purchases
    };
  }

  addPurchase(purchase: PurchasedSystemHealth): void {
    this.purchases.push(purchase);
  }

  reset(): void {
    this.investment = 0;
    this.purchases.splice(0, this.purchases.length);
  }

  netChange(): number {
    let netSystemChange = this.investment;
    for (const purchase of this.purchases) {
      netSystemChange += purchase.systemHealth;
    }
    return netSystemChange;
  }

  @type('number')
  investment = 0;

  @type([PurchasedSystemHealth])
  purchases = new ArraySchema<PurchasedSystemHealth>();
}

export class Player extends Schema implements PlayerData {
  constructor(role: Role) {
    super();
    this.role = role;
    this.bot = SimpleBot.fromActor(this);
    this.accomplishments = new AccomplishmentSet(role);
    this.costs = ResourceCosts.senderRole(role);
    // FIXME: it'd be nice to bind the specialty to the ResourceCosts e.g., this.specialty = this.costs.specialty
    // but this change cascades quite a bit into the client. revisit later
    this.specialty = ResourceCosts.getSpecialty(role);
  }

  fromJSON(data: PlayerSerialized): Player {
    this.role = data.role;
    this.costs.fromJSON(data.costs);
    this.specialty = data.specialty;
    this.accomplishments.fromJSON(data.accomplishment);
    this.ready = data.ready;
    this.timeBlocks = data.timeBlocks;
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
      victoryPoints: this.victoryPoints,
      inventory: this.inventory.toJSON(),
      pendingInvestments: this.pendingInvestments.toJSON(),
      systemHealthChange: this.systemHealthChanges.toJSON(),
    };
  }

  static defaults = {
    timeBlocks: 10
  };

  @type('string')
  role: Role;

  @type(ResourceCosts)
  costs: ResourceCosts;

  @type('boolean')
  botWarning = false;

  @type('string')
  specialty: Resource;

  @type(AccomplishmentSet)
  accomplishments: AccomplishmentSet;

  @type('boolean')
  ready = false;

  @type('number')
  timeBlocks: number = Player.defaults.timeBlocks;

  @type(SystemHealthChanges)
  systemHealthChanges = new SystemHealthChanges();

  @type(ResourceInventory)
  inventory = new ResourceInventory();

  pendingInvestments = new PendingInvestment();

  @type('number')
  victoryPoints = 0;

  connected = true;

  bot: Bot;

  act(state: GameState): Array<GameEvent> {
    return this.bot.act(state, this);
  }

  resetElapsed(): void {
    this.bot.resetElapsed();
  }

  isInvestmentFeasible(investment: InvestmentData): boolean {
    return this.costs.investmentWithinBudget(investment, this.timeBlocks);
  }

  isAccomplishmentPurchaseFeasible(accomplishment: AccomplishmentData): boolean {
    return (
      this.accomplishments.isPurchasable(accomplishment) &&
      this.inventory.canAfford(accomplishment)
    ) ?? false;
  }

  discardAccomplishment(id: number): void {
    this.accomplishments.discard(id);
  }

  discardPurchasedAccomplishment(id: number): void {
    this.accomplishments.discardPurchased(id);
  }

  purchaseAccomplishment(accomplishment: AccomplishmentData): void {
    this.accomplishments.purchase(accomplishment);
    const inv: ResourceAmountData = {
      culture: -accomplishment.culture,
      finance: -accomplishment.finance,
      government: -accomplishment.government,
      legacy: -accomplishment.legacy,
      science: -accomplishment.science
    };
    logger.trace('accomplishments: %o', JSON.stringify(this.accomplishments.purchasable.map(p => _.fromPairs(Object.entries(p)))));
    logger.trace('accomplishment systemHealth: %d [%s] (%o)', accomplishment.systemHealth, accomplishment.label, _.fromPairs(_.toPairs(accomplishment)))
    if (accomplishment.systemHealth !== 0) {
      this.systemHealthChanges
        .addPurchase(new PurchasedSystemHealth({
          description: `Purchase: ${accomplishment.label}`,
          systemHealth: accomplishment.systemHealth
        }));
    }
    logger.trace('purchases: %o', this.systemHealthChanges.purchases);
    // FIXME: victoryPoints should probably be a computed property
    // that sums this.accomplishments.purchased.victoryPoints
    // and not a cached numerical value
    // will this cause issues for the Schema though if
    // we convert it into a getter?
    this.victoryPoints += accomplishment.victoryPoints;
    this.inventory.add(inv);
  }

  reset(): void {
    this.resetCosts();
    this.ready = false;
    this.refreshPurchasableAccomplishments();
    this.resetTimeBlocks();
  }

  resetCosts(): void {
    logger.info('costs (before) [%s]: %o', this.role, this.costs.toJSON());
    this.costs.fromJSON(ResourceCosts.getCosts(this.role));
    logger.info('costs (after) [%s]: %o', this.role, this.costs.toJSON());
  }

  refreshPurchasableAccomplishments(): void {
    this.accomplishments.refreshPurchasableAccomplishments(this.role);
  }

  resetTimeBlocks(): void {
    this.timeBlocks = Player.defaults.timeBlocks;
  }

  setTimeBlocks(amount: number): void {
    this.timeBlocks = amount;
  }

  get currentTimeBlocksAmount(): number {
    return this.timeBlocks;
  }

  getLeftOverInvestments(): InvestmentData {
    const investment = _.cloneDeep(this.pendingInvestments);

    let leftOvers = 0;
    let minCostResource = '';
    let minCost = Infinity;
    const leftOverInvestments: InvestmentData = PendingInvestment.defaults();

    for (const [k, v] of Object.entries(this.costs)) {
      if (v != Infinity) {
        leftOvers += (investment as any)[k] * v;
      }
      if (minCost > v && k != 'systemHealth') {
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
        leftOverInvestments.systemHealth += 1;
        leftOvers += 1;
      }
    }

    return leftOverInvestments;
  }

  invest(): void {
    this.systemHealthChanges.investment = this.pendingInvestments.systemHealth;
    this.applyPendingInvestments();
  }

  invertPendingInventory(): void {
    const invertedInventory = PendingInvestment.defaults();
    for (const resource of RESOURCES) {
      invertedInventory[resource as Resource] = this.inventory[resource as Resource] * -1;
    }

    this.pendingInvestments.add({ ...invertedInventory, systemHealth: 0 });
  }

  applyPendingInvestments(): void {
    this.inventory.add(this.pendingInvestments);
    this.pendingInvestments.reset();
  }

  updateReadiness(ready: boolean): void {
    this.ready = ready;
  }

  assignPendingInvestmentsToInventory(): void {
    for (const resource of RESOURCES) {
      this.inventory[resource] = this.pendingInvestments[resource];
    }
    this.pendingInvestments.reset();
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
  }
}

export interface GameSerialized {
  players: PlayerSetSerialized;
  userRoles: { [username: string]: Role };
  maxRound: number;
  lastTimePolled: number;
  timeRemaining: number;
  botWarning: boolean;
  round: number;
  phase: Phase;
  systemHealth: number;
  logs: Array<MarsLogMessageData>;
  messages: Array<ChatMessageData>;
  marsEvents: Array<MarsEventData>;
  marsEventsProcessed: number;
  marsEventDeck: MarsEventDeckSerialized;
  roundIntroduction: RoundIntroductionData;
  tradeSet: TradeSetData;
  winners: Array<Role>;
  tradingEnabled: boolean;
  heroOrPariah: '' | 'hero' | 'pariah';
}

export enum ActionOrdering {
  // the pending action will be processed first in line alongside all other FIRSTs
  FIRST = 1,
  // pending actions to be processed after FIRSTs
  MIDDLE = 10,
  // final actions to be processed
  LAST = 20
}

export interface PendingMarsEventAction {
  ordering: ActionOrdering;
  execute(state: GameState): void;
}

export class GameState extends Schema implements GameData {

  userRoles: GameOpts['userRoles'] = {};
  gameId!: number;
  maxRound: number;
  lastTimePolled: Date;
  marsEventDeck: MarsEventsDeck;
  pendingMarsEventActions: Array<PendingMarsEventAction> = [];
  pendingSystemHealthContribution = 0;

  @type(RoundIntroduction)
  roundIntroduction: RoundIntroduction = new RoundIntroduction();

  @type(PlayerSet)
  players: PlayerSet;

  @type('number')
  timeRemaining = 60;

  @type('boolean')
  botWarning: boolean = GameState.DEFAULTS.botWarning;

  @type('number')
  round: number = GameState.DEFAULTS.round;

  @type('number')
  phase: Phase = GameState.DEFAULTS.phase;

  @type('number')
  systemHealth: number = GameState.DEFAULTS.systemHealth;

  @type([MarsLogMessage])
  logs = new ArraySchema<MarsLogMessage>();

  @type([ChatMessage])
  messages = new ArraySchema<ChatMessage>();

  @type([MarsEvent])
  marsEvents = new ArraySchema<MarsEvent>();

  @type('number')
  marsEventsProcessed = GameState.DEFAULTS.marsEventsProcessed;

  @type({ map: Trade })
  tradeSet = new MapSchema<Trade>();

  @type(['string'])
  winners = new ArraySchema<Role>();

  @type('boolean')
  tradingEnabled = true;

  @type('string')
  heroOrPariah: '' | 'hero' | 'pariah' = '';

  constructor(data: GameStateOpts) {
    super();
    if (isProduction() && data.userRoles) {
      assert.equal(Object.keys(data.userRoles).length, ROLES.length, 'Must have five players');
    }
    this.userRoles = data.userRoles;
    this.marsEventDeck = new MarsEventsDeck(data.deck);
    this.lastTimePolled = new Date();
    this.maxRound = data.numberOfGameRounds;
    this.players = new PlayerSet();
  }

  static DEFAULTS = {
    botWarning: false,
    timeRemaining: 300,
    marsEventsProcessed: 0,
    round: 1,
    phase: Phase.newRound,
    systemHealth: 100,
    heroOrPariah: ''
  };

  fromJSON(data: GameSerialized): GameState {
    this.players.fromJSON(data.players);
    this.userRoles = data.userRoles;
    this.maxRound = data.maxRound;
    this.lastTimePolled = new Date(data.lastTimePolled);
    this.botWarning = data.botWarning;
    this.timeRemaining = data.timeRemaining;
    this.round = data.round;
    this.phase = data.phase;
    this.systemHealth = data.systemHealth;
    this.roundIntroduction.fromJSON(data.roundIntroduction);
    this.tradingEnabled = data.tradingEnabled;
    this.heroOrPariah = data.heroOrPariah;

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
      this.tradeSet[k] = new Trade(k, tradeData.sender, tradeData.recipient, 'Active');
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
      botWarning: this.botWarning,
      timeRemaining: this.timeRemaining,
      round: this.round,
      phase: this.phase,
      systemHealth: this.systemHealth,
      logs: _.map(this.logs, x => x.toJSON()),
      messages: _.map(this.messages, x => x.toJSON()),
      marsEvents: _.map(this.marsEvents, e => e.toJSON()),
      marsEventsProcessed: this.marsEventsProcessed,
      marsEventDeck: this.marsEventDeck.toJSON(),
      roundIntroduction: this.roundIntroduction.toJSON(),
      tradeSet: this.tradeSet.toJSON(),
      tradingEnabled: this.tradingEnabled,
      winners: _.map(this.winners, w => w),
      heroOrPariah: this.heroOrPariah
    };
  }

  isFirstRound(): boolean {
    return this.round === GameState.DEFAULTS.round;
  }

  isLastRound(): boolean {
    return this.round === this.maxRound;
  }

  disableTrading(): void {
    this.tradingEnabled = false;
  }

  act(): Array<GameEvent> {
    const events: Array<GameEvent> = [];
    for (const player of this.players) {
      const es = player.act(this);
      this.applyMany(es);
      if (es.length > 0) {
        logger.debug('events to concat: %o', es);
      }
      events.splice(events.length, 0, ...es);
      if (es.length > 0) {
        logger.debug('events (all): %o', events);
      }
    }
    return events;
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

  hasMarsEventsToProcess(): boolean {
    // // need to lookahead to see if there are any mars events that add to the event queue
    // // could add side effect information to the mars event data
    // if (this.currentEvent.id === 'murphysLaw') {
    //   return true;
    // }
    return this.marsEventsProcessed < this.marsEvents.length - 1;
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

  resetRound(): void {
    // FIXME: replace various resetXYZ with resetRound() / resetPhase()
    this.tradingEnabled = true;
    this.resetHeroOrPariah();
    // FIXME: move rest of the player resets above into this loop as a player.resetRound()
    for (const player of this.players) {
      player.reset();
    }
  }

  resetPlayerCosts(): void {
    for (const player of this.players) {
      logger.info('costs (before) [%s]: %o', player.role, player.costs.toJSON());
      player.costs.fromJSON(ResourceCosts.getCosts(player.role));
      logger.info('costs (after) [%s]: %o', player.role, player.costs.toJSON());
    }
  }

  resetHeroOrPariah(): void {
    this.heroOrPariah = '';
  }

  resetPlayerReadiness(): void {
    for (const player of this.players) {
      player.ready = false;
    }
  }

  resetPlayerContributions(): void {
    for (const player of this.players) {
      player.systemHealthChanges.reset()
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
    this.systemHealth = GameState.DEFAULTS.systemHealth;
    this.logs.splice(0, this.logs.length);
    this.marsEvents.splice(0, this.marsEvents.length);
    this.messages.splice(0, this.messages.length);
    this.players.fromJSON(new PlayerSet().toJSON());
    this.marsEventDeck = new MarsEventsDeck(_.shuffle(this.marsEventDeck.deck));
    this.winners.splice(0, this.winners.length);
    this.heroOrPariah = '';
  }

  updateSystemHealth(): void {
    this.systemHealth = this.nextRoundSystemHealth();
  }

  nextRoundSystemHealth(): number {
    return _.clamp(this.systemHealth + this.systemHealthContributed() + this.systemHealthTaken(), 0, 100);
  }
  
  systemHealthContributed(): number {
    let contributed = 0;
    for (const p of this.players) {
      contributed += p.systemHealthChanges.investment;
    }
    logger.trace('system health contributed: %d', contributed);
    return contributed;
  }
  
  systemHealthTaken(): number {
    let taken = 0;
    for (const p of this.players) {
      for (const purchase of p.systemHealthChanges.purchases) {
        taken += purchase.systemHealth;
      }
    }
    logger.trace('system health taken: %d', taken);
    return taken;
  }

  increaseSystemHealth(amount: number): number {
    const current = this.systemHealth;
    this.systemHealth = _.clamp(current + amount, 0, 100);
    return this.systemHealth;
  }

  decreaseSystemHealth(amount: number): number {
    const current = this.systemHealth;
    this.systemHealth = _.clamp(current - amount, 0, 100);
    return this.systemHealth;
  }

  applyPendingActions(): void {
    this.pendingMarsEventActions.sort((a, b) => {
      return a.ordering - b.ordering;
    });
    for (const action of this.pendingMarsEventActions) {
      action.execute(this);
    }
    this.pendingMarsEventActions = [];
  }

  clearTrades(): void {
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
    message: string,
    category: string,
    performedBy: Role | ServerRole = SERVER
  ): MarsLogMessage {
    const msg = new MarsLogMessage({
      round: this.round,
      performedBy,
      category,
      content: message,
      timestamp: new Date().getTime(),
      id: this.logs.length
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

  evaluateGameWinners(): void {
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

  addGameWinner(winner: Role): void {
    this.winners.push(winner);
  }

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
    const performedBy: ServerRole = SERVER;
    const recipientRole: Role = trade.recipient.role;
    const senderRole: Role = trade.sender.role;

    this.tradeSet[trade.id] = new Trade(trade.id, trade.sender, trade.recipient, 'Active');

    switch (reason) {
      case 'sent-trade-request':
        message = `The ${senderRole} sent a trade request to the ${recipientRole}.`;
        category = MarsLogCategory.sentTrade;
        this.log(message, category, performedBy);
        break;
      default:
        break;
    }
  }

  canCompleteTrade(sender: PlayerData, recipient: PlayerData, trade: Trade): boolean {
    return canSendTradeRequest(sender, trade.sender.resourceAmount)
      && canSendTradeRequest(recipient, trade.recipient.resourceAmount);
  }

  acceptTrade(id: string): void {
    const performedBy: ServerRole = SERVER;

    const trade: Trade | undefined = this.tradeSet[id];
    if (!trade) {
      logger.warn('Trade not accepted. Could not find %s', id);
      return;
    }
    const senderRole = trade.sender.role;
    const recipientRole = trade.recipient.role;
    const sender = this.players[senderRole];
    const recipient = this.players[recipientRole];
    const fromTradeResources: ResourceAmountData = trade.sender.resourceAmount;

    const toMsg: Array<string> = [];
    const fromMsg: Array<string> = [];

    const toTradeResources: ResourceAmountData = trade.recipient.resourceAmount;

    // apply trade resources to sender's inventory
    sender.inventory.add(_.mapValues(trade.sender.resourceAmount, r => -r!));
    sender.inventory.add(trade.recipient.resourceAmount);
    // apply trade resources to recipient's inventory
    recipient.inventory.add(_.mapValues(trade.recipient.resourceAmount, r => -r!));
    recipient.inventory.add(trade.sender.resourceAmount);

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
    const message = `The ${senderRole} has traded ${fromMsg.join(', ')} in exchange for ${toMsg.join(', ')} from the ${recipientRole}.`;
    const category = MarsLogCategory.acceptTrade;
    this.roundIntroduction.addCompletedTrade(this.tradeSet[id]);
    this.log(message, category, performedBy);
    this.tradeSet[id].status = 'Accepted';
  }

  rejectTrade(id: string) {
    const performedBy: ServerRole = SERVER;
    const trade: Trade | undefined = this.tradeSet[id];
    if (!trade) {
      logger.warn('Could not remove trade. Trade %s not found', id);
      return;
    }
    const recipientRole: Role = this.tradeSet[id].recipient.role;
    const senderRole: Role = this.tradeSet[id].sender.role;

    const message = `The ${recipientRole} rejected a trade request from the ${senderRole}.`;
    const category = MarsLogCategory.rejectTrade;
    this.log(message, category, performedBy);
    this.tradeSet[id].status = 'Rejected';
  }

  cancelTrade(id: string, byServer=false) {
    const performedBy: ServerRole = SERVER;

    const trade: Trade | undefined = this.tradeSet[id];
    if (!trade) {
      logger.warn('Trade not accepted. Could not find %s', id);
      return;
    }
    const senderRole = trade.sender.role;
    const recipientRole = trade.recipient.role;
    const sender = this.players[senderRole];
    const recipient = this.players[recipientRole];
    const fromTradeResources: ResourceAmountData = trade.sender.resourceAmount;

    const message = byServer
      ? `The ${senderRole} is unable to fulfill a trade request previously sent to the ${recipientRole}. The trade will be removed.`
      : `The ${senderRole} canceled a trade request sent to the ${recipientRole}.`;
    const category = MarsLogCategory.invalidTrade;
    this.log(message, category, performedBy);
    this.tradeSet[id].status = 'Cancelled';
  }

  purchaseAccomplishment(role: Role, accomplishment: AccomplishmentData): void {
    const { label, systemHealth, victoryPoints } = accomplishment;
    const costArray: Array<string> = [];
    const auditIndex = this.marsEvents.findIndex(event => event.id === 'audit');
    const isUnderAudit = auditIndex !== -1 && auditIndex <= this.marsEventsProcessed;

    if (isUnderAudit) {
      for(const investment of INVESTMENTS) {
        if (accomplishment[investment] != 0) {
          costArray.push(`${INVESTMENT_LABELS[investment]}=${accomplishment[investment]}`);
        }
      }
    } else if (systemHealth != 0) {
      costArray.push(`System Health= ${systemHealth}`);
    }

    const cost = costArray.length > 0 ? `COST: ${costArray.join(', ')}.` : '';

    const message = `The ${role} purchased an accomplishment: ${label}. ${cost} ${victoryPoints} points were added to the ${role}'s score.`;
    const category: string = MarsLogCategory.purchaseAccomplishment;
    const performedBy: ServerRole = SERVER;
    this.players[role].purchaseAccomplishment(accomplishment);
    const ap = new AccomplishmentPurchase({name: label, victoryPoints});
    this.roundIntroduction.addAccomplishmentPurchase(ap);
    this.log(message, category, performedBy);
  }

  discardAccomplishment(role: Role, id: number): void {
    this.players[role].discardAccomplishment(id);
  }

  discardPurchasedAccomplishment(role: Role, id: number): void {
    this.players[role].discardPurchasedAccomplishment(id);
  }

  drawMarsEvents(nCards: number): void {
    const cards = this.marsEventDeck.peek(nCards);
    const marsEvents = cards.map(e => {
      const me = new MarsEvent(e);
      me.updateElapsed();
      return me;
    });
    this.timeRemaining = marsEvents[0].timeDuration;
    this.marsEvents.push(...marsEvents);
    this.marsEventDeck.updatePosition(this.marsEvents.length);
  }
}
