import { Schema, ArraySchema, type } from "@colyseus/schema";

export class EventCard extends Schema {
  @type("string") codeName = "";
  @type("string") displayName = "";
  @type("string") description = "";
  @type("int8") pointsDelta = 0;
  @type("int8") resourcesDelta = 0;
  @type("int8") systemHealthDelta = 0;

  get isMurphysLaw() {
    return this.codeName === "murphys-law";
  }
}

export class Player extends Schema {
  @type("string") username = "";
  @type("uint8") resources = 0;
  @type("uint8") points = 0;
}

export class TreatmentParams extends Schema {
  @type("boolean") isKnownNumberOfRounds = false;
  @type("boolean") isEventDeckKnown = false;
  @type("string") thresholdInformation: "unknown" | "range" | "known" = "unknown";
}

export class SoloGameState extends Schema {
  // FIXME: these should come from defaults as well
  @type("string") status = "incomplete";
  @type("int8") systemHealth = 25;
  @type("uint8") twoCardThreshold = 15;
  @type("uint8") threeCardThreshold = 8;
  @type("uint8") timeRemaining = 30;
  @type("uint8") round = 1;
  @type("uint8") maxRound = 0;
  @type(TreatmentParams) treatmentParams = new TreatmentParams();
  @type(Player) player!: Player;
  @type([EventCard]) eventCardDeck = new ArraySchema<EventCard>();
  @type([EventCard]) roundEventCards = new ArraySchema<EventCard>();
  @type("uint8") activeRoundCardIndex = -1;

  get points() {
    if (this.player) return this.player.points;
  }

  get resources() {
    if (this.player) return this.player.resources;
  }

  get activeRoundCard() {
    if (this.activeRoundCardIndex >= 0 && this.activeRoundCardIndex < this.roundEventCards.length) {
      return this.roundEventCards[this.activeRoundCardIndex];
    }
  }
}
