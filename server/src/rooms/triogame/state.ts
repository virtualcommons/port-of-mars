import { Schema, ArraySchema, type, MapSchema } from "@colyseus/schema";
import {
  EventCardData,
  SoloGameParams,
  SoloGameStatus,
  SoloGameType,
  TreatmentData,
} from "@port-of-mars/shared/sologame";
import { Role } from "@port-of-mars/shared/types";
import { TrioGameOpts } from "./types";
import { isProduction } from "@port-of-mars/shared/settings";
import { settings } from "@port-of-mars/server/settings";
import { User } from "@port-of-mars/server/entity/User";

import * as assert from "assert";

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
  @type("string") username = "";
  @type("uint8") resources = TrioGameState.DEFAULTS.freeplay.resources;
  @type("uint8") points = TrioGameState.DEFAULTS.freeplay.points;
  @type("uint8") pendingInvestment: number | null = null;
  @type("uint8") pointsEarned: number | null = null;
}

export class TreatmentParams extends Schema {
  @type("string") gameType: SoloGameType = "freeplay";
  @type("boolean") isNumberOfRoundsKnown = false;
  @type("boolean") isEventDeckKnown = false;
  @type("string") thresholdInformation: "unknown" | "range" | "known" = "unknown";
  @type("boolean") isLowResSystemHealth = false;

  constructor(data?: TreatmentData) {
    super();
    if (!data) return;
    this.gameType = data.gameType;
    this.isNumberOfRoundsKnown = data.isNumberOfRoundsKnown;
    this.isEventDeckKnown = data.isEventDeckKnown;
    this.thresholdInformation = data.thresholdInformation;
    this.isLowResSystemHealth = data.isLowResSystemHealth;
  }
}

export class TrioGameState extends Schema {
  @type("string") type: SoloGameType = "freeplay";
  @type("string") status: SoloGameStatus = "incomplete";
  @type("int8") systemHealth =
    TrioGameState.DEFAULTS.freeplay.systemHealthMax -
    TrioGameState.DEFAULTS.freeplay.systemHealthWear;
  @type("uint8") timeRemaining = TrioGameState.DEFAULTS.freeplay.timeRemaining;
  @type("uint8") round = 1;
  @type(TreatmentParams) treatmentParams = new TreatmentParams();

  @type([Player]) players = new ArraySchema<Player>();
  @type("string") roles = new MapSchema<string>(); // <role title, username>

  // @type([EventCard]) roundEventCards = new ArraySchema<EventCard>();

  // mirrors deck when deck is visible, otherwise show round cards
  @type([EventCard]) visibleEventCards = new ArraySchema<EventCard>();
  @type("int32") activeCardId = -1; // refers to the deckCardId of the active (shown in modal) card

  // @type("uint8") activeRoundCardIndex = -1;
  // @type("uint8") activeDeckCardIndex = -1;
  @type("boolean") canInvest = false;
  @type("boolean") isRoundTransitioning = false;

  constructor(data: TrioGameOpts) {
    super();
    if (isProduction()) {
      assert.equal(data.users.length, 3, "Must have three players");
    }
    this.users = data.users;
    this.type = data.type;
  }

  gameId!: number;
  users: Array<User> = [];
  availableRoles: Array<Role> = ["Politician", "Entrepreneur", "Researcher"]; // temporarily subset of roles for trio version
  roundInitialSystemHealth = TrioGameState.DEFAULTS.freeplay.systemHealthMax;
  roundInitialPoints: Array<number> = [];
  // hidden properties
  maxRound = TrioGameState.DEFAULTS.freeplay.maxRound.max;
  twoEventsThreshold = TrioGameState.DEFAULTS.freeplay.twoEventsThreshold.max;
  threeEventsThreshold = TrioGameState.DEFAULTS.freeplay.threeEventsThreshold.max;
  eventCardDeck: Array<EventCard> = [];

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
    this.roundInitialPoints = this.points;
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

  getPlayer(username: string): Player {
    this.players.forEach(player => {
      if (player.username == username) {
        return player;
      }
    });
    logger.fatal("TrioGameState.getPlayer: Unable to find player with username %s", username);
    throw new Error(`No player found with ${username}`);
  }

  playersInvested(): boolean {
    this.players.forEach(player => {
      if (player.pendingInvestment == null) {
        return false;
      }
    });
    return true;
  }

  get defaultParams() {
    return TrioGameState.DEFAULTS[this.type];
  }

  static STATIC_PARAMS = {
    systemHealthMax: 25,
    systemHealthWear: 5,
    points: 0,
    resources: 10,
  };

  static DEFAULTS: Record<SoloGameType, SoloGameParams> = {
    freeplay: {
      maxRound: { min: 6, max: 14 },
      roundTransitionDuration: 3,
      twoEventsThreshold: { min: 12, max: 20 },
      threeEventsThreshold: { min: 5, max: 15 },
      timeRemaining: 30,
      eventTimeout: 10,
      startingSystemHealth: 20,
      ...TrioGameState.STATIC_PARAMS,
    },
    prolificBaseline: {
      maxRound: { min: 8, max: 8 },
      roundTransitionDuration: 1,
      twoEventsThreshold: { min: -1, max: -1 },
      threeEventsThreshold: { min: -2, max: -2 },
      timeRemaining: 15,
      eventTimeout: 5,
      startingSystemHealth: 15,
      ...TrioGameState.STATIC_PARAMS,
    },
    prolificVariable: {
      maxRound: { min: 11, max: 11 },
      roundTransitionDuration: 1,
      twoEventsThreshold: { min: 16, max: 16 },
      threeEventsThreshold: { min: 9, max: 9 },
      twoEventsThresholdDisplayRange: { min: 12, max: 18 },
      threeEventsThresholdDisplayRange: { min: 5, max: 11 },
      timeRemaining: 15,
      eventTimeout: 5,
      startingSystemHealth: 15,
      ...TrioGameState.STATIC_PARAMS,
    },
  };
}
