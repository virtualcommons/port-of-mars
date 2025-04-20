import { Schema, ArraySchema, type, MapSchema } from "@colyseus/schema";
import {
  EventCardData,
  MultiplayerGameType,
  LiteGameParams,
  LiteGameStatus,
  SoloGameType,
  TreatmentData,
} from "@port-of-mars/shared/lite";
import { Role, LiteRoleAssignment } from "@port-of-mars/shared/types";
import { isProduction } from "@port-of-mars/shared/settings";
import { settings } from "@port-of-mars/server/settings";
import { User } from "@port-of-mars/server/entity/User";

import * as assert from "assert";
import { Client } from "colyseus";

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
  @type("string") role: Role = "Politician";
  @type("uint8") resources = MultiplayerGameState.DEFAULTS.freeplay.resources;
  @type("uint8") points = MultiplayerGameState.DEFAULTS.freeplay.points;
  @type("uint8") pendingInvestment: number | null = null;
  @type("uint8") pointsEarned: number | null = null;
  @type("boolean") isReady = false;
}

export class MultiplayerGameState extends Schema {
  @type("string") type: MultiplayerGameType = "prolific";
  @type("string") status: LiteGameStatus = "incomplete";
  @type("int8") systemHealth =
    MultiplayerGameState.DEFAULTS.freeplay.systemHealthMax -
    MultiplayerGameState.DEFAULTS.freeplay.systemHealthWear;
  @type("uint8") timeRemaining = MultiplayerGameState.DEFAULTS.freeplay.timeRemaining;
  @type("uint8") round = 1;

  @type("int8") numPlayers = 3;
  @type({ map: Player }) players = new MapSchema<Player>(); // track by client.auth.id.toString() (db id)

  // @type([EventCard]) roundEventCards = new ArraySchema<EventCard>();

  // mirrors deck when deck is visible, otherwise show round cards
  @type([EventCard]) visibleEventCards = new ArraySchema<EventCard>();
  @type("int32") activeCardId = -1; // refers to the deckCardId of the active (shown in modal) card

  // @type("uint8") activeRoundCardIndex = -1;
  // @type("uint8") activeDeckCardIndex = -1;
  @type("boolean") canInvest = false;
  @type("boolean") isRoundTransitioning = false;

  // assumes these aren't ever hidden properties in the multiplayer lite version
  @type("int8") maxRound = MultiplayerGameState.DEFAULTS.freeplay.maxRound.max;
  @type("int8") twoEventsThreshold = MultiplayerGameState.DEFAULTS.freeplay.twoEventsThreshold.max;
  @type("int8") threeEventsThreshold =
    MultiplayerGameState.DEFAULTS.freeplay.threeEventsThreshold.max;
  // this one doesn't have to be a schema property since visibleEventCards already mirrors it
  eventCardDeck: Array<EventCard> = [];

  constructor(data: { userRoles: LiteRoleAssignment; type: MultiplayerGameType }) {
    super();
    this.type = data.type;
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

  userRoles: LiteRoleAssignment;
  gameId!: number;
  roundInitialSystemHealth = MultiplayerGameState.DEFAULTS.freeplay.systemHealthMax;
  roundInitialPoints: Array<number> = [];

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
    this.visibleEventCards = new ArraySchema(...this.eventCardDeck);
  }

  getPlayer(client: Client): Player {
    // get a player by their auth user id
    const player = this.players.get(client.auth.id.toString());
    if (player) {
      return player;
    }
    logger.fatal(
      "MultiplayerGameState.getPlayer: Unable to find player with id %s",
      client.auth.id
    );
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

  get defaultParams() {
    return MultiplayerGameState.DEFAULTS[this.type];
  }

  static DEFAULTS: Record<MultiplayerGameType, LiteGameParams> = {
    // unused for now
    freeplay: {
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
    // FIXME: come up with some good settings
    prolific: {
      maxRound: { min: 8, max: 8 },
      roundTransitionDuration: 3,
      twoEventsThreshold: { min: 48, max: 48 },
      threeEventsThreshold: { min: 27, max: 27 },
      timeRemaining: 20,
      eventTimeout: 5,
      startingSystemHealth: 45,
      systemHealthMax: 60,
      systemHealthWear: 15,
      points: 0,
      resources: 10,
      availableRoles: ["Politician", "Entrepreneur", "Researcher"],
    },
  };
}
