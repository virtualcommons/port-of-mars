import { Schema, ArraySchema, type } from "@colyseus/schema";
import {
  EventCardData,
  SoloGameParams,
  SoloGameStatus,
  SoloGameType,
  TreatmentData,
} from "@port-of-mars/shared/sologame";

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
  @type("uint8") resources = SoloGameState.DEFAULTS.freeplay.resources;
  @type("uint8") points = SoloGameState.DEFAULTS.freeplay.points;
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

export class SoloGameState extends Schema {
  @type("string") type: SoloGameType = "freeplay";
  @type("string") status: SoloGameStatus = "incomplete";
  @type("int8") systemHealth =
    SoloGameState.DEFAULTS.freeplay.systemHealthMax -
    SoloGameState.DEFAULTS.freeplay.systemHealthWear;
  @type("uint8") timeRemaining = SoloGameState.DEFAULTS.freeplay.timeRemaining;
  @type("uint8") round = 1;
  @type(TreatmentParams) treatmentParams = new TreatmentParams();
  @type(Player) player: Player = new Player();
  // @type([EventCard]) roundEventCards = new ArraySchema<EventCard>();

  // mirrors deck when deck is visible, otherwise show round cards
  @type([EventCard]) visibleEventCards = new ArraySchema<EventCard>();
  @type("int32") activeCardId = -1; // refers to the deckCardId of the active (shown in modal) card

  // @type("uint8") activeRoundCardIndex = -1;
  // @type("uint8") activeDeckCardIndex = -1;
  @type("boolean") canInvest = true;
  @type("boolean") isRoundTransitioning = false;

  gameId = 0;
  roundInitialSystemHealth = SoloGameState.DEFAULTS.freeplay.systemHealthMax;
  roundInitialPoints = 0;
  // hidden properties
  maxRound = SoloGameState.DEFAULTS.freeplay.maxRound.max;
  twoEventsThreshold = SoloGameState.DEFAULTS.freeplay.twoEventsThreshold.max;
  threeEventsThreshold = SoloGameState.DEFAULTS.freeplay.threeEventsThreshold.max;
  eventCardDeck: Array<EventCard> = [];

  get points() {
    return this.player.points;
  }

  get resources() {
    return this.player.resources;
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

  get defaultParams() {
    return SoloGameState.DEFAULTS[this.type];
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
      ...SoloGameState.STATIC_PARAMS,
    },
    prolificBaseline: {
      maxRound: { min: 8, max: 8 },
      roundTransitionDuration: 1,
      twoEventsThreshold: { min: -1, max: -1 },
      threeEventsThreshold: { min: -2, max: -2 },
      timeRemaining: 15,
      eventTimeout: 5,
      startingSystemHealth: 15,
      ...SoloGameState.STATIC_PARAMS,
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
      ...SoloGameState.STATIC_PARAMS,
    },
  };
}
