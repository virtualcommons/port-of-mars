import { Responses } from "@port-of-mars/shared/game/responses";
import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import {
  AccomplishmentData,
  ChatMessageData,
  GameData,
  InvestmentData,
  Phase,
  ResourceAmountData,
  Role,
  ROLES,
  SERVER,
  ServerRole,
  TradeData,
  MarsLogCategory,
  INVESTMENTS,
  INVESTMENT_LABELS,
} from "@port-of-mars/shared/types";
import _ from "lodash";
import * as assert from "assert";
import { isProduction } from "@port-of-mars/shared/settings";
import { settings } from "@port-of-mars/server/settings";
import { GameEvent } from "@port-of-mars/server/rooms/game/events/types";
import { GameOpts, GameStateOpts } from "@port-of-mars/server/rooms/game/types";
import MarsEventsDeck from "@port-of-mars/server/rooms/game/state/marsevents/MarsEventDeck";
import { MarsEvent } from "@port-of-mars/server/rooms/game/state/marsevents/MarsEvent";
import { Player, PlayerSet } from "@port-of-mars/server/rooms/game/state/player";
import { SystemHealthMarsEvent } from "@port-of-mars/server/rooms/game/state/systemhealth";
import { Trade } from "@port-of-mars/server/rooms/game/state/trade";
import { ChatMessage, MarsLogMessage } from "@port-of-mars/server/rooms/game/state/message";
import { RoundIntroduction } from "@port-of-mars/server/rooms/game/state/roundintroduction";
import { AccomplishmentPurchase } from "@port-of-mars/server/rooms/game/state/accomplishment";
import { GameSerialized, RoundSummary } from "@port-of-mars/server/rooms/game/state/types";

const logger = settings.logging.getLogger(__filename);

export enum ActionOrdering {
  // the pending action will be processed first in line alongside all other FIRSTs
  FIRST = 1,
  // pending actions to be processed after FIRSTs
  MIDDLE = 10,
  // final actions to be processed
  LAST = 20,
}

export interface PendingMarsEventAction {
  ordering: ActionOrdering;
  execute(state: GameState): void;
}

export class GameState
  extends Schema
  implements
    GameData<
      ChatMessage,
      MarsEvent,
      MarsLogMessage,
      PlayerSet,
      RoundIntroduction,
      Map<string, Trade>
    >
{
  userRoles: GameOpts["userRoles"] = {};
  playerOpts: GameOpts["playerOpts"];
  gameId!: number;
  maxRound: number;
  lastTimePolled: Date;
  marsEventDeck: MarsEventsDeck;
  pendingMarsEventActions: Array<PendingMarsEventAction> = [];

  @type(RoundIntroduction)
  roundIntroduction: RoundIntroduction = new RoundIntroduction();

  @type(PlayerSet)
  players: PlayerSet;

  @type("number")
  timeRemaining = 60;

  @type("number")
  round: number = GameState.DEFAULTS.round;

  @type("number")
  phase: Phase = GameState.DEFAULTS.phase;

  @type("number")
  systemHealth: number = GameState.DEFAULTS.systemHealth;

  @type([MarsLogMessage])
  logs = new ArraySchema<MarsLogMessage>();

  @type([ChatMessage])
  messages = new ArraySchema<ChatMessage>();

  @type([MarsEvent])
  marsEvents = new ArraySchema<MarsEvent>();

  @type("number")
  marsEventsProcessed = GameState.DEFAULTS.marsEventsProcessed;

  @type({ map: Trade })
  tradeSet = new MapSchema<Trade>();

  @type(["string"])
  winners = new ArraySchema<Role>();

  @type("boolean")
  tradingEnabled = true;

  @type("string")
  heroOrPariah: "" | "hero" | "pariah" = "";

  constructor(data: GameStateOpts) {
    super();
    if (isProduction() && data.userRoles) {
      assert.equal(Object.keys(data.userRoles).length, ROLES.length, "Must have five players");
    }
    this.userRoles = data.userRoles;
    this.playerOpts = data.playerOpts;
    this.marsEventDeck = new MarsEventsDeck(data.deck);
    this.lastTimePolled = new Date();
    this.maxRound = data.numberOfGameRounds;
    this.players = new PlayerSet(data.playerOpts);
  }

  static DEFAULTS = {
    marsEventsProcessed: 0,
    round: 1,
    phase: Phase.newRound,
    systemHealth: 100,
    heroOrPariah: "",
  };

  static DEFAULT_PHASE_DURATION: Record<Phase, number> = {
    [Phase.newRound]: 60,
    [Phase.events]: 90,
    [Phase.invest]: 180,
    [Phase.trade]: 180,
    [Phase.purchase]: 60,
    [Phase.discard]: 60,
    [Phase.victory]: 10000,
    [Phase.defeat]: 10000,
  };

  fromJSON(data: GameSerialized): GameState {
    this.players.fromJSON(data.players);
    this.userRoles = data.userRoles;
    this.maxRound = data.maxRound;
    this.lastTimePolled = new Date(data.lastTimePolled);
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
    this.clearTrades();
    Object.keys(data.tradeSet).forEach(k => {
      const tradeData: TradeData = data.tradeSet[k];
      this.tradeSet.set(k, new Trade(k, tradeData.sender, tradeData.recipient, "Active"));
    });

    const winners = _.map(data.winners, w => w);
    this.winners.splice(0, this.winners.length, ...winners);

    return this;
  }

  getRoundSummary(): RoundSummary {
    return {
      systemHealth: this.systemHealth,
      round: this.round,
      messagesLength: this.messages.length,
      logsLength: this.logs.length,
      marsEventIds: _.map(this.marsEvents, e => e.id),
      marsEventsProcessed: this.marsEventsProcessed,
      players: this.players.getPlayerSetSummary(),
    };
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
      heroOrPariah: this.heroOrPariah,
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
        logger.debug("events to concat: %o", es);
      }
      events.splice(events.length, 0, ...es);
      if (es.length > 0) {
        logger.debug("events (all): %o", events);
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

  hasUser(username: string): boolean {
    for (const player of this.players) {
      if (player.username === username) {
        return true;
      }
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

  /**
   * Apply maintenance costs to system health. This occurs after we exit the new round phase
   */
  subtractSystemHealthWearAndTear(): void {
    this.addSystemHealth(-25);
    // we can now safely reset each player's system health changes because
    // the system health report has been generated
    this.resetPlayerContributions();
    this.roundIntroduction.initialize(this.systemHealth);
    this.log(
      `Standard wear and tear reduces System Health by 25.
        At the beginning of this round, System Health = ${this.systemHealth}.`,
      MarsLogCategory.systemHealth
    );
  }

  /**
   * clean up and initialization for a new round, precursor to the new round after we exit the discard phase
   */
  setUpNewRound(): void {
    this.phase = Phase.newRound;
    this.timeRemaining = GameState.DEFAULT_PHASE_DURATION[this.phase];
    this.round += 1;
    this.roundIntroduction.updateSystemHealthGroupContributions(this.getPlayers());
    this.log(`Round ${this.round} begins.`, MarsLogCategory.newRound);
    logger.debug("[game %d] current system health: %d", this.gameId, this.systemHealth);
    this.tradingEnabled = true;
    this.resetHeroOrPariah();
    for (const player of this.players) {
      player.reset();
    }
  }

  resetHeroOrPariah(): void {
    this.heroOrPariah = "";
  }

  resetPlayerReadiness(): void {
    for (const player of this.players) {
      player.ready = false;
    }
  }

  resetPlayerContributions(): void {
    for (const player of this.players) {
      player.systemHealthChanges.reset();
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
    this.timeRemaining = GameState.DEFAULT_PHASE_DURATION[this.phase];
    this.systemHealth = GameState.DEFAULTS.systemHealth;
    this.logs.splice(0, this.logs.length);
    this.marsEvents.splice(0, this.marsEvents.length);
    this.messages.splice(0, this.messages.length);
    this.players.fromJSON(new PlayerSet(this.playerOpts).toJSON());
    this.marsEventDeck = new MarsEventsDeck(_.shuffle(this.marsEventDeck.deck));
    this.winners.splice(0, this.winners.length);
    this.heroOrPariah = "";
  }

  setNextRoundSystemHealth(): void {
    this.systemHealth = this.nextRoundSystemHealth();
  }

  nextRoundSystemHealth(): number {
    return _.clamp(
      this.systemHealth + this.totalSystemHealthContributions() + this.systemHealthTaken(),
      0,
      100
    );
  }

  totalSystemHealthContributions(): number {
    let contributed = 0;
    for (const p of this.players) {
      contributed += p.systemHealthChanges.investment;
    }
    return contributed;
  }

  systemHealthTaken(): number {
    let taken = 0;
    for (const p of this.players) {
      for (const purchase of p.systemHealthChanges.purchases) {
        taken += purchase.systemHealth;
      }
    }
    logger.trace("system health taken: %d", taken);
    return taken;
  }

  addSystemHealth(amount: number): number {
    const current = this.systemHealth;
    this.systemHealth = _.clamp(current + amount, 0, 100);
    return this.systemHealth;
  }

  applySystemHealthMarsEvent(event: SystemHealthMarsEvent) {
    this.roundIntroduction.addSystemHealthMarsEvent(event);
    this.addSystemHealth(event.systemHealthModification);
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
    logger.debug("clearing trade set %o ", this.tradeSet);
    this.tradeSet.forEach((trade: TradeData) => this.tradeSet.delete(trade.id));
  }

  applyMany(event: Array<GameEvent>): Array<Responses> {
    const responses: Array<Responses> = [];
    event.forEach(e => {
      const response = e.apply(this);
      if (response) {
        responses.push(response);
      }
    });
    return responses;
  }

  apply(event: GameEvent): void | Responses {
    return event.apply(this);
  }

  // REFACTOR: DEFAULT CATEGORY

  log(message: string, category: string, performedBy: Role | ServerRole = SERVER): MarsLogMessage {
    const msg = new MarsLogMessage({
      round: this.round,
      performedBy,
      category,
      content: message,
      timestamp: new Date().getTime(),
      id: this.logs.length,
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

  get currentEvent(): MarsEvent {
    const marsEventIndex = Math.min(this.marsEventsProcessed, this.marsEvents.length - 1);
    return this.marsEvents[marsEventIndex];
  }

  evaluateGameWinners(): void {
    const playerScores: Array<[Role, number]> = this.players
      .asArray()
      .map(p => [p.role, p.victoryPoints]);
    const winners: Array<Role> = [];

    for (const p of this.players) {
      playerScores.push([p.role, p.victoryPoints]);
    }

    const sorted = _.reverse(_.sortBy(playerScores, [1]));
    sorted.forEach((s: [Role, number]) => {
      if (s[1] === sorted[0][1]) winners.push(s[0]);
    });

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

    this.tradeSet.set(trade.id, new Trade(trade.id, trade.sender, trade.recipient, "Active"));

    switch (reason) {
      case "sent-trade-request":
        message = `The ${senderRole} sent a trade request to the ${recipientRole}.`;
        category = MarsLogCategory.sentTrade;
        this.log(message, category, performedBy);
        break;
      default:
        break;
    }
  }

  canCompleteTrade(sender: Player, recipient: Player, trade: Trade): boolean {
    return (
      sender.canSendTradeRequest(trade.sender.resourceAmount) &&
      recipient.canSendTradeRequest(trade.recipient.resourceAmount)
    );
  }

  acceptTrade(id: string): void {
    const performedBy: ServerRole = SERVER;

    const trade: Trade | undefined = this.tradeSet.get(id);
    if (!trade) {
      logger.warn("Trade not accepted. Could not find %s", id);
      return;
    }
    const senderRole = trade.sender.role;
    const recipientRole = trade.recipient.role;
    const sender = this.players[senderRole];
    const recipient = this.players[recipientRole];
    const fromTradeResources: ResourceAmountData = trade.sender.resourceAmount;

    const recipientTradeResources: Array<string> = [];
    const senderTradeResources: Array<string> = [];

    const toTradeResources: ResourceAmountData = trade.recipient.resourceAmount;

    // apply trade resources to sender's inventory
    sender.inventory.add(_.mapValues(trade.sender.resourceAmount, r => -r!));
    sender.inventory.add(trade.recipient.resourceAmount);
    // apply trade resources to recipient's inventory
    recipient.inventory.add(_.mapValues(trade.recipient.resourceAmount, r => -r!));
    recipient.inventory.add(trade.sender.resourceAmount);

    for (const [resource, amount] of Object.entries(toTradeResources)) {
      if (amount > 0) {
        recipientTradeResources.push(`${amount} ${_.capitalize(resource)}`);
      }
    }
    for (const [resource, amount] of Object.entries(fromTradeResources)) {
      if (amount > 0) {
        senderTradeResources.push(`${amount} ${_.capitalize(resource)}`);
      }
    }

    if (senderTradeResources.length === 0) {
      senderTradeResources.push("nothing");
    }

    if (recipientTradeResources.length === 0) {
      recipientTradeResources.push("nothing");
    }

    const message = `${senderRole} traded ${senderTradeResources.join(
      ", "
    )} to ${recipientRole} in exchange for ${recipientTradeResources.join(", ")}.`;
    const category = MarsLogCategory.acceptTrade;
    this.roundIntroduction.addCompletedTrade(this.tradeSet.get(id)!);
    this.log(message, category, performedBy);
    this.tradeSet.get(id)!.status = "Accepted";
  }

  rejectTrade(id: string): void {
    const performedBy: ServerRole = SERVER;
    const trade: Trade | undefined = this.tradeSet.get(id);
    if (!trade) {
      logger.warn("Could not remove trade. Trade %s not found", id);
      return;
    }
    const recipientRole: Role = this.tradeSet.get(id)!.recipient.role;
    const senderRole: Role = this.tradeSet.get(id)!.sender.role;

    const message = `The ${recipientRole} rejected a trade request from the ${senderRole}.`;
    const category = MarsLogCategory.rejectTrade;
    this.log(message, category, performedBy);
    this.tradeSet.get(id)!.status = "Rejected";
  }

  cancelTrade(id: string, byServer = false): void {
    const performedBy: ServerRole = SERVER;

    const trade: Trade | undefined = this.tradeSet.get(id);
    if (!trade) {
      logger.warn("Trade not cancelled. Could not find %s", id);
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
    this.tradeSet.get(id)!.status = "Cancelled";
  }

  purchaseAccomplishment(role: Role, accomplishment: AccomplishmentData): void {
    const { label, systemHealth, victoryPoints } = accomplishment;
    const costArray: Array<string> = [];
    const auditIndex = this.marsEvents.findIndex(event => event.id === "audit");
    const isUnderAudit = auditIndex !== -1 && auditIndex <= this.marsEventsProcessed;

    if (isUnderAudit) {
      for (const investment of INVESTMENTS) {
        if (accomplishment[investment] != 0) {
          costArray.push(`${INVESTMENT_LABELS[investment]} ${accomplishment[investment]}`);
        }
      }
    } else if (systemHealth != 0) {
      costArray.push(`System Health ${systemHealth}`);
    }
    const cost = costArray.length > 0 ? `Cost(s): ${costArray.join(", ")}.` : "";
    const message = `The ${role} purchased an accomplishment: ${label}. ${cost} ${victoryPoints} points were added to the ${role}'s score.`;
    const category: string = MarsLogCategory.purchaseAccomplishment;
    const performedBy: ServerRole = SERVER;
    this.players[role].purchaseAccomplishment(accomplishment);
    const ap = new AccomplishmentPurchase({
      name: label,
      victoryPoints,
      systemHealthModification: systemHealth,
    });
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
