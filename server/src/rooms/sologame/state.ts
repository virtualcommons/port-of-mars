import { Schema, ArraySchema, type } from "@colyseus/schema";
import { EventCardData, SoloGameStatus, TreatmentData } from "@port-of-mars/shared/sologame";

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
  @type("uint8") resources = SoloGameState.DEFAULTS.resources;
  @type("uint8") points = SoloGameState.DEFAULTS.points;
}

export class TreatmentParams extends Schema {
  @type("boolean") isNumberOfRoundsKnown = false;
  @type("boolean") isEventDeckKnown = false;
  @type("string") thresholdInformation: "unknown" | "range" | "known" = "unknown";

  constructor(data?: TreatmentData) {
    super();
    if (!data) return;
    this.isNumberOfRoundsKnown = data.isNumberOfRoundsKnown;
    this.isEventDeckKnown = data.isEventDeckKnown;
    this.thresholdInformation = data.thresholdInformation;
  }
}

export class SoloGameState extends Schema {
  @type("string") status: SoloGameStatus = "incomplete";
  @type("int8") systemHealth =
    SoloGameState.DEFAULTS.systemHealthMax - SoloGameState.DEFAULTS.systemHealthWear;
  @type("uint8") timeRemaining = SoloGameState.DEFAULTS.timeRemaining;
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
  // hidden properties
  maxRound = SoloGameState.DEFAULTS.maxRound.max;
  twoEventsThreshold = SoloGameState.DEFAULTS.twoEventsThreshold.max;
  threeEventsThreshold = SoloGameState.DEFAULTS.threeEventsThreshold.max;
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

  static DEFAULTS = {
    maxRound: { min: 6, max: 14 },
    roundTransitionDuration: 3,
    twoEventsThreshold: { min: 12, max: 20 },
    threeEventsThreshold: { min: 5, max: 15 },
    systemHealthMax: 25,
    systemHealthWear: 5,
    timeRemaining: 30,
    eventTimeout: 10,
    points: 0,
    resources: 7,
  };
}
