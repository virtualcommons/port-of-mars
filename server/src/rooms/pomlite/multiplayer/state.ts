import { Schema, ArraySchema, type, MapSchema } from "@colyseus/schema";
import {
  EventCardData,
  LiteGameParams,
  LiteGameType,
  LiteGameStatus,
  TreatmentData,
  HiddenParams,
} from "@port-of-mars/shared/lite";
import { Role, LiteRoleAssignment } from "@port-of-mars/shared/types";
import { Client } from "colyseus";
import { settings } from "@port-of-mars/server/settings";

const logger = settings.logging.getLogger(__filename);

export class EventCard extends Schema {
  id = 0;
  @type("boolean") expired = false;
  @type("boolean") inPlay = false; // indicates that the card has been drawn for current round
  @type("int32") deckCardId = 0;
  @type("string") codeName = "";
  @type("string") displayName = "";
  @type("string") flavorText = "";
  @type("string") effectText = "";
  @type("int8") pointsEffect = 0;
  @type("int8") resourcesEffect = 0;
  @type("int8") systemHealthEffect = 0;

  constructor(data: EventCardData) {
    super();
    this.id = data.id;
    this.codeName = data.codeName;
    this.displayName = data.displayName;
    this.flavorText = data.flavorText;
    this.effectText = data.effectText;
    this.pointsEffect = data.pointsEffect;
    this.resourcesEffect = data.resourcesEffect;
    this.systemHealthEffect = data.systemHealthEffect;
  }

  get isMurphysLaw() {
    return this.codeName === "murphysLaw";
  }
}

export class Player extends Schema {
  userId = 0;
  @type("int32") playerId = 0;
  @type("string") username = "";
  @type("string") role: Role = "Politician";
  @type("uint8") resources = LiteGameState.DEFAULTS.freeplay.resources;
  @type("uint8") points = LiteGameState.DEFAULTS.freeplay.points;
  @type("int8") pendingInvestment = -1;
  @type("boolean") hasInvested = false;
  @type("uint8") pointsEarned = 0;
  @type("boolean") isReadyToStart = false;
}

export class TreatmentParams extends Schema {
  @type("string") gameType: LiteGameType = "prolificBaseline";
  @type("boolean") isNumberOfRoundsKnown = false;
  @type("boolean") isEventDeckKnown = false;
  @type("string") thresholdInformation: "unknown" | "range" | "known" = "unknown";
  @type("boolean") isLowResSystemHealth = false;
  @type("string") instructions = "";

  constructor(data?: TreatmentData) {
    super();
    if (!data) return;
    this.gameType = data.gameType as LiteGameType;
    this.isNumberOfRoundsKnown = data.isNumberOfRoundsKnown;
    this.isEventDeckKnown = data.isEventDeckKnown;
    this.thresholdInformation = data.thresholdInformation;
    this.isLowResSystemHealth = data.isLowResSystemHealth;
    this.instructions = data.instructions || "";
  }
}

export class LiteGameState extends Schema {
  @type("boolean") isWaitingToStart = true;
  @type("string") type: LiteGameType = "prolificBaseline";
  @type("string") status: LiteGameStatus = "incomplete";
  @type("int8") systemHealth =
    LiteGameState.DEFAULTS.freeplay.systemHealthMax -
    LiteGameState.DEFAULTS.freeplay.systemHealthWear;
  @type("uint8") timeRemaining = LiteGameState.DEFAULTS.freeplay.timeRemaining;
  @type("uint8") round = 1;
  @type(TreatmentParams) treatmentParams = new TreatmentParams();

  @type("int8") numPlayers = 3; // default, should be set to DEFAULTS.<gameType>.numPlayers
  @type({ map: Player }) players = new MapSchema<Player>(); // track by client.auth.id.toString() (db id)

  // mirrors deck when deck is visible, otherwise show round cards
  @type([EventCard]) visibleEventCards = new ArraySchema<EventCard>();
  @type("int32") activeCardId = -1; // refers to the deckCardId of the active (shown in modal) card

  @type("boolean") canInvest = false;
  @type("boolean") isRoundTransitioning = false;

  gameId = 0;
  userRoles: LiteRoleAssignment;
  roundInitialSystemHealth = LiteGameState.DEFAULTS.freeplay.systemHealthMax;
  isRoundInitialized = false;

  maxRound = LiteGameState.DEFAULTS.freeplay.maxRound.max;
  twoEventsThreshold = LiteGameState.DEFAULTS.freeplay.twoEventsThreshold.max;
  threeEventsThreshold = LiteGameState.DEFAULTS.freeplay.threeEventsThreshold.max;
  // this one doesn't have to be a schema property since visibleEventCards already mirrors it
  eventCardDeck: Array<EventCard> = [];

  constructor(data: { userRoles: LiteRoleAssignment; type: LiteGameType }) {
    super();
    this.type = data.type;
    this.numPlayers = this.defaultParams.numPlayers || 3;
    this.userRoles = data.userRoles;
    // set players
    for (const [role, user] of this.userRoles) {
      const player = new Player();
      player.userId = user.id;
      player.username = user.username;
      player.role = role;
      player.points = 0;
      this.players.set(user.id.toString(), player);
    }
  }

  get points() {
    const points: number[] = [];
    this.players.forEach(player => points.push(player.points));
    return points;
  }

  get resources() {
    const resources: number[] = [];
    this.players.forEach(player => resources.push(player.resources));
    return resources;
  }

  get activeCard() {
    return this.eventCardDeck.find(card => card.deckCardId === this.activeCardId);
  }

  get unexpiredCards() {
    return this.eventCardDeck.filter(card => !card.expired);
  }

  get roundEventCards() {
    return this.eventCardDeck.filter(card => card.inPlay);
  }

  get upcomingEventCards() {
    return this.eventCardDeck.filter(card => !card.inPlay && !card.expired);
  }

  get nextRoundCard() {
    return this.roundEventCards.find(card => !card.expired);
  }

  updateRoundInitialValues() {
    this.roundInitialSystemHealth = this.systemHealth;
  }

  updateVisibleCards() {
    // update visible cards, needs to be called after making changes to the deck that should be
    // reflected on the client
    if (this.treatmentParams.isEventDeckKnown) {
      // probably a more efficient way to do this
      this.visibleEventCards = new ArraySchema(...this.eventCardDeck);
    } else {
      this.visibleEventCards = new ArraySchema(...this.roundEventCards);
    }
  }

  getPlayer(client: Client): Player {
    // get a player by their auth user id
    const player = this.players.get(client.auth.id.toString());
    if (player) {
      return player;
    }
    logger.fatal("LiteGameState.getPlayer: Unable to find player with id %s", client.auth.id);
    throw new Error(`No player found with id ${client.auth.id}`);
  }

  playersInvested(): boolean {
    this.players.forEach(player => {
      if (player.pendingInvestment == null) {
        return false;
      }
    });
    return true;
  }

  buildHiddenParams(): HiddenParams {
    const data: HiddenParams = {
      eventCardDeck: [],
    };
    if (this.treatmentParams.isEventDeckKnown) {
      data.eventCardDeck = this.eventCardDeck.map(card => card.toJSON() as EventCardData);
    }
    if (this.treatmentParams.isNumberOfRoundsKnown) {
      data.maxRound = this.maxRound;
    }
    if (this.treatmentParams.thresholdInformation === "known") {
      data.twoEventsThreshold = this.twoEventsThreshold;
      data.threeEventsThreshold = this.threeEventsThreshold;
    } else if (this.treatmentParams.thresholdInformation === "range") {
      data.twoEventsThresholdRange =
        this.defaultParams.twoEventsThresholdDisplayRange || this.defaultParams.twoEventsThreshold;
      data.threeEventsThresholdRange =
        this.defaultParams.threeEventsThresholdDisplayRange ||
        this.defaultParams.threeEventsThreshold;
    }
    return data;
  }

  get defaultParams() {
    return LiteGameState.DEFAULTS[this.type];
  }

  static DEFAULTS: Record<LiteGameType, LiteGameParams> = {
    // unused for now
    freeplay: {
      numPlayers: 3,
      maxRound: { min: 6, max: 14 },
      roundTransitionDuration: 3,
      twoEventsThreshold: { min: 12, max: 20 },
      threeEventsThreshold: { min: 5, max: 15 },
      timeRemaining: 30,
      eventTimeout: 10,
      startingSystemHealth: 20,
      systemHealthMax: 25,
      systemHealthWear: 5,
      points: 0,
      resources: 10,
      availableRoles: ["Politician", "Entrepreneur", "Researcher"],
    },
    prolificBaseline: {
      numPlayers: 3,
      nextGameType: "prolificVariable",
      maxRound: { min: 8, max: 8 },
      roundTransitionDuration: 2,
      twoEventsThreshold: { min: -1, max: -1 },
      threeEventsThreshold: { min: -2, max: -2 },
      timeRemaining: 20,
      eventTimeout: 3,
      startingSystemHealth: 45,
      systemHealthMax: 75,
      systemHealthWear: 15,
      points: 0,
      resources: 10,
      availableRoles: ["Politician", "Entrepreneur", "Researcher"],
    },
    prolificVariable: {
      numPlayers: 3,
      maxRound: { min: 11, max: 11 },
      roundTransitionDuration: 2,
      twoEventsThreshold: { min: 48, max: 48 },
      threeEventsThreshold: { min: 27, max: 27 },
      twoEventsThresholdDisplayRange: { min: 36, max: 54 },
      threeEventsThresholdDisplayRange: { min: 15, max: 33 },
      timeRemaining: 20,
      eventTimeout: 3,
      startingSystemHealth: 45,
      systemHealthMax: 75,
      systemHealthWear: 15,
      points: 0,
      resources: 10,
      availableRoles: ["Politician", "Entrepreneur", "Researcher"],
    },
  };
}
