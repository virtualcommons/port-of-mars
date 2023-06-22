import { Schema, ArraySchema, type } from "@colyseus/schema";
import { EventCardData, SoloGameStatus, TreatmentData } from "@port-of-mars/shared/sologame";

export class EventCard extends Schema {
  id = 0;
  deckCardId = 0;
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
  @type("boolean") isKnownNumberOfRounds = false;
  @type("boolean") isEventDeckKnown = false;
  @type("string") thresholdInformation: "unknown" | "range" | "known" = "unknown";

  constructor(data?: TreatmentData) {
    super();
    if (!data) return;
    this.isKnownNumberOfRounds = data.isKnownNumberOfRounds;
    this.isEventDeckKnown = data.isEventDeckKnown;
    this.thresholdInformation = data.thresholdInformation;
  }
}

export class SoloGameState extends Schema {
  @type("string") status: SoloGameStatus = "incomplete";
  @type("int8") systemHealth = SoloGameState.DEFAULTS.systemHealthMax;
  @type("uint8") timeRemaining = SoloGameState.DEFAULTS.timeRemaining;
  @type("uint8") round = 1;
  @type(TreatmentParams) treatmentParams = new TreatmentParams();
  @type(Player) player: Player = new Player();
  @type([EventCard]) roundEventCards = new ArraySchema<EventCard>();
  @type("uint8") activeRoundCardIndex = -1;

  gameId = 0;
  // hidden properties
  maxRound = SoloGameState.DEFAULTS.maxRound.max;
  twoCardThreshold = SoloGameState.DEFAULTS.twoCardThreshold.max;
  threeCardThreshold = SoloGameState.DEFAULTS.threeCardThreshold.max;
  eventCardDeck: Array<EventCard> = [];

  get points() {
    return this.player.points;
  }

  get resources() {
    return this.player.resources;
  }

  get activeRoundCard() {
    if (this.activeRoundCardIndex >= 0 && this.activeRoundCardIndex < this.roundEventCards.length) {
      return this.roundEventCards[this.activeRoundCardIndex];
    }
  }

  static DEFAULTS = {
    maxRound: { min: 6, max: 14 },
    twoCardThreshold: { min: 12, max: 20 },
    threeCardThreshold: { min: 5, max: 15 },
    systemHealthMax: 25,
    systemHealthWear: 5,
    timeRemaining: 30,
    eventTimeout: 10,
    points: 0,
    resources: 7,
  };
}
