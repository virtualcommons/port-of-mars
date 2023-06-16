import { Schema, ArraySchema, type } from "@colyseus/schema";
import { EventCardData, TreatmentData } from "@port-of-mars/shared/sologame";

export class EventCard extends Schema {
  @type("string") codeName = "";
  @type("string") displayName = "";
  @type("string") description = "";
  @type("int8") pointsDelta = 0;
  @type("int8") resourcesDelta = 0;
  @type("int8") systemHealthDelta = 0;

  constructor(data: EventCardData) {
    super();
    this.codeName = data.codeName;
    this.displayName = data.displayName;
    this.description = data.description;
    this.pointsDelta = data.pointsDelta;
    this.resourcesDelta = data.resourcesDelta;
    this.systemHealthDelta = data.systemHealthDelta;
  }

  get isMurphysLaw() {
    return this.codeName === "murphys-law";
  }
}

export class Player extends Schema {
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
  @type("string") status = "incomplete";
  @type("int8") systemHealth = SoloGameState.DEFAULTS.systemHealthMax;
  @type("uint8") twoCardThreshold = SoloGameState.DEFAULTS.twoCardThreshold.max;
  @type("uint8") threeCardThreshold = SoloGameState.DEFAULTS.threeCardThreshold.max;
  @type("uint8") timeRemaining = SoloGameState.DEFAULTS.timeRemaining;
  @type("uint8") maxRound = SoloGameState.DEFAULTS.maxRound.max;
  @type("uint8") round = 1;
  @type(TreatmentParams) treatmentParams = new TreatmentParams();
  @type(Player) player: Player = new Player();
  @type([EventCard]) eventCardDeck = new ArraySchema<EventCard>();
  @type([EventCard]) roundEventCards = new ArraySchema<EventCard>();
  @type("uint8") activeRoundCardIndex = -1;

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
