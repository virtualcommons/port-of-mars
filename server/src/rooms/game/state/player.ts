import { Schema, type } from "@colyseus/schema";
import {
  AccomplishmentData,
  CURATOR,
  ENTREPRENEUR,
  InvestmentData,
  PIONEER,
  PlayerData,
  PlayerSetData,
  POLITICIAN,
  RESEARCHER,
  Resource,
  ResourceAmountData,
  Role,
  RESOURCES,
} from "@port-of-mars/shared/types";
import _ from "lodash";
import { GameEvent } from "@port-of-mars/server/rooms/game/events/types";
import { SimpleBot } from "@port-of-mars/server/rooms/game/state/bot";
import { settings } from "@port-of-mars/server/settings";
import { GameState } from "@port-of-mars/server/rooms/game/state/game";
import { SystemHealthChanges, PurchasedSystemHealth } from "@port-of-mars/server/rooms/game/state/systemhealth";
import { AccomplishmentSet } from "@port-of-mars/server/rooms/game/state/accomplishment"
import { ResourceInventory, ResourceCosts } from "@port-of-mars/server/rooms/game/state/resource"
import { PlayerSetSerialized, PlayerSerialized, PlayerSummary, PlayerSetSummary } from "@port-of-mars/server/rooms/game/state/types";
import { GameStateOpts, PlayerOptsData } from "@port-of-mars/server/rooms/game/types";

const logger = settings.logging.getLogger(__filename);

class PendingInvestments implements InvestmentData {
  culture: number;
  finance: number;
  government: number;
  legacy: number;
  science: number;
  systemHealth: number;

  constructor() {
    const pendingInvestments = { ...PendingInvestments.defaults() };
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
      systemHealth: 0,
    };
  }

  reset() {
    Object.assign(this, PendingInvestments.defaults());
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
      systemHealth: this.systemHealth,
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

export interface Bot {
  active: boolean;
  // elapsed: number;
  resetElapsed(): void;
  act(state: GameState, player: Player): Array<GameEvent>;
}

export class Player
  extends Schema
  implements
    PlayerData<AccomplishmentSet, ResourceInventory, SystemHealthChanges>
{
  constructor(role: Role, data: PlayerOptsData) {
    super();
    this.role = role;
    this.username = data.username;
    this.isBot = data.isBot;
    this.isMuted = data.isMuted;
    this.bot = SimpleBot.fromActor(this);
    this.accomplishments = new AccomplishmentSet(role);
    this.costs = ResourceCosts.senderRole(role);
    // FIXME: it'd be nice to bind the specialty to the ResourceCosts e.g., this.specialty = this.costs.specialty
    // but this change cascades quite a bit into the client. revisit later
    this.specialty = ResourceCosts.getSpecialty(role);
  }

  fromJSON(data: PlayerSerialized): Player {
    this.role = data.role;
    this.username = data.username;
    this.isBot = data.isBot;
    this.isMuted = data.isMuted;
    this.costs.fromJSON(data.costs);
    this.specialty = data.specialty;
    // this.accomplishments = "";
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
      username: this.username,
      isBot: this.isBot,
      isMuted: this.isMuted,
      costs: this.costs.toJSON(),
      specialty: this.specialty,
      // FIXME: rename to accomplishments but will also involve a data migration for all persisted events
      accomplishment: this.accomplishments.toJSON(),
      ready: this.ready,
      timeBlocks: this.timeBlocks,
      victoryPoints: this.victoryPoints,
      inventory: this.inventory.toJSON(),
      pendingInvestments: this.pendingInvestments.toJSON(),
      systemHealthChange: this.systemHealthChanges.toJSON(),
    };
  }

  getPlayerSummary(): PlayerSummary {
    return {
      role: this.role,
      ready: this.ready,
      timeBlocks: this.timeBlocks,
      victoryPoints: this.victoryPoints,
      inventory: this.inventory.toJSON(),
    }
  }

  static defaults = {
    timeBlocks: 10,
  };

  @type("string")
  role: Role;

  @type("string")
  username: string;

  @type("boolean")
  isBot: boolean

  @type(ResourceCosts)
  costs: ResourceCosts;

  @type("boolean")
  botWarning = false;

  @type("boolean")
  isMuted = false;

  @type("string")
  specialty: Resource;

  @type(AccomplishmentSet)
  accomplishments: AccomplishmentSet;

  @type("boolean")
  ready = false;

  @type("number")
  timeBlocks: number = Player.defaults.timeBlocks;

  @type(SystemHealthChanges)
  systemHealthChanges = new SystemHealthChanges();

  @type(ResourceInventory)
  inventory = new ResourceInventory();

  pendingInvestments = new PendingInvestments();

  @type("number")
  victoryPoints = 0;

  connected = true;

  bot: Bot;

  @type("boolean")
  isCompulsivePhilanthropist = false;

  activateBot() {
    this.isBot = true;
  }

  deactivateBot() {
    this.isBot = false;
  }

  act(state: GameState): Array<GameEvent> {
    return this.bot.act(state, this);
  }

  resetElapsed(): void {
    this.bot.resetElapsed();
  }

  isInvestmentFeasible(investment: InvestmentData): boolean {
    return this.costs.investmentWithinBudget(investment, this.timeBlocks);
  }

  isAccomplishmentPurchaseFeasible(
    accomplishment: AccomplishmentData
  ): boolean {
    return (
      (this.accomplishments.isPurchasable(accomplishment) &&
        this.inventory.canAfford(accomplishment)) ??
      false
    );
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
      science: -accomplishment.science,
    };
    logger.trace(
      "accomplishments: %o",
      JSON.stringify(
        this.accomplishments.purchasable.map((p) =>
          _.fromPairs(Object.entries(p))
        )
      )
    );
    logger.trace(
      "accomplishment systemHealth: %d [%s] (%o)",
      accomplishment.systemHealth,
      accomplishment.label,
      _.fromPairs(_.toPairs(accomplishment))
    );
    if (accomplishment.systemHealth !== 0) {
      this.systemHealthChanges.addPurchase(
        new PurchasedSystemHealth({
          description: `Purchase: ${accomplishment.label}`,
          systemHealth: accomplishment.systemHealth,
        })
      );
    }
    logger.trace("purchases: %o", this.systemHealthChanges.purchases);
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
    this.isCompulsivePhilanthropist = false;
    this.refreshPurchasableAccomplishments();
    this.resetTimeBlocks();
  }

  resetCosts(): void {
    logger.info("costs (before) [%s]: %o", this.role, this.costs.toJSON());
    this.costs.fromJSON(ResourceCosts.getCosts(this.role));
    logger.info("costs (after) [%s]: %o", this.role, this.costs.toJSON());
  }

  refreshPurchasableAccomplishments(): void {
    this.accomplishments.refreshPurchasableAccomplishments(this.role);
  }

  setCompulsivePhilanthropist(): void {
    this.isCompulsivePhilanthropist = true;
    // this.systemHealthChanges.investment = this.timeBlocks;
    // this.timeBlocks = 0;
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
    let minCostResource = "";
    let minCost = Infinity;
    const leftOverInvestments: InvestmentData = PendingInvestments.defaults();

    for (const [k, v] of Object.entries(this.costs)) {
      if (v != Infinity) {
        leftOvers += (investment as any)[k] * v;
      }
      if (minCost > v && k != "systemHealth") {
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
    if (this.isCompulsivePhilanthropist) {
      logger.info("compulsive philanthropist: adding all timeblocks to system health")
      this.pendingInvestments.reset();
      // take dynamic system health costs into account (Difficult Conditions Event)
      this.pendingInvestments.systemHealth = Math.floor(this.timeBlocks / this.costs.systemHealth);
    }
    logger.info("investing %o", this.pendingInvestments);
    this.systemHealthChanges.investment = this.pendingInvestments.systemHealth;
    this.applyPendingInvestments();
  }

  clearPendingInventory(): void {
    this.pendingInvestments.reset();
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

  /**
   * Returns true if the given playerData has enough resources to send a trade request
   * for the given tradeAmount
   * @param tradeAmount
   */
  canSendTradeRequest(tradeAmount: ResourceAmountData): boolean {
    const availableResources: ResourceAmountData = { ...this.inventory };
    for (const resource of RESOURCES) {
      if (tradeAmount[resource] > availableResources[resource]) {
        return false;
      }
    }
    return true;
  }
}

export class PlayerSet extends Schema implements PlayerSetData<Player> {
  constructor(playerOpts: GameStateOpts["playerOpts"]) {
    super();
    // FIXME: could reduce duplication here
    this.Curator = new Player(CURATOR, playerOpts.get(CURATOR)!);
    this.Entrepreneur = new Player(ENTREPRENEUR, playerOpts.get(ENTREPRENEUR)!);
    this.Pioneer = new Player(PIONEER, playerOpts.get(PIONEER)!);
    this.Politician = new Player(POLITICIAN, playerOpts.get(POLITICIAN)!);
    this.Researcher = new Player(RESEARCHER, playerOpts.get(RESEARCHER)!);
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
      Researcher: this.Researcher.toJSON(),
    };
  }

  fromJSON(data: PlayerSetSerialized) {
    this.Curator.fromJSON(data.Curator);
    this.Entrepreneur.fromJSON(data.Entrepreneur);
    this.Pioneer.fromJSON(data.Pioneer);
    this.Politician.fromJSON(data.Politician);
    this.Researcher.fromJSON(data.Researcher);
  }

  getPlayerSetSummary(): PlayerSetSummary {
    return {
      Curator: this.Curator.getPlayerSummary(),
      Entrepreneur: this.Entrepreneur.getPlayerSummary(),
      Pioneer: this.Pioneer.getPlayerSummary(),
      Politician: this.Politician.getPlayerSummary(),
      Researcher: this.Researcher.getPlayerSummary(),
    };
  }

  asArray(): Array<Player> {
    return [
      this.Curator,
      this.Entrepreneur,
      this.Pioneer,
      this.Politician,
      this.Researcher,
    ];
  }

  [Symbol.iterator](): Iterator<Player> {
    return this.asArray()[Symbol.iterator]();
  }
}
