import { strict as assert } from "assert";
import { GameSerialized, GameState, RoundSummary } from "@port-of-mars/server/rooms/game/state";
import { mockGameStateInitOpts } from "@port-of-mars/server/util";
import * as entity from "@port-of-mars/server/entity";
import {
  ExitedMarsEventPhase,
  gameEventDeserializer,
  // Bonding Thru Adversity
  SelectedInfluence,
  // Breakdown of Trust
  BreakdownOfTrustOccurred,
  // Hero or Pariah
  VoteHeroOrPariah,
  VoteHeroOrPariahRole,
  // Compulsive Philanthropist
  VotedForPhilanthropist,
  // Personal Gain
  VotedForPersonalGain,
  // Efforts Wasted
  StagedDiscardOfPurchasedAccomplishment,
} from "@port-of-mars/server/rooms/game/events";
import _ from "lodash";
import { getLogger } from "@port-of-mars/server/settings";
import {
  CURATOR,
  ENTREPRENEUR,
  Investment,
  MarsLogMessageData,
  Phase,
  PIONEER,
  POLITICIAN,
  RESEARCHER,
  Resource,
  RESOURCES,
  Role,
  ROLES,
  SERVER,
  ServerRole,
} from "@port-of-mars/shared/types";
import { createObjectCsvWriter } from "csv-writer";
import { GameEvent } from "@port-of-mars/server/rooms/game/events/types";
import { getAllAccomplishments } from "@port-of-mars/server/data/Accomplishment";
import { Player, TournamentRoundInvite, User } from "@port-of-mars/server/entity";

const logger = getLogger(__filename);

function loadSnapshot(data: GameSerialized): GameState {
  return new GameState(mockGameStateInitOpts()).fromJSON(data);
}

class ObjColumn<T> {
  constructor(private payload: any) {}

  toString() {
    return JSON.stringify(this.payload);
  }
}

export abstract class Summarizer<T> {
  events: Map<number, Array<entity.GameEvent>>;

  constructor(events: Array<entity.GameEvent>, public path: string) {
    const gameIds = _.uniq(events.map(e => e.gameId));
    this.events = new Map();
    gameIds.forEach(id => this.events.set(id, []));
    for (const event of events) {
      this.events.get(event.gameId)?.push(event);
    }
  }

  abstract summarize(): Generator<T>;

  transform(row: T): any {
    return row;
  }

  async save(): Promise<void> {
    const summaries = this.summarize();
    let result: IteratorResult<T> = summaries.next();
    // FIXME: Cannot convert undefined or null to object in earlier tournaments
    const header = Object.keys(result.value).map(k => ({ id: k, title: k }));
    const rows = [];
    while (!result.done) {
      rows.push(this.transform(result.value));
      result = summaries.next();
    }

    const writer = createObjectCsvWriter({ path: this.path, header });
    await writer.writeRecords(rows);
  }
}

class RoleExtractor {
  extractors: {
    [name: string]: <T extends GameEvent>(event: T) => Role | ServerRole;
  } = {};

  extractRole(event: GameEvent): Role | ServerRole {
    const extractor = this.extractors[event.constructor.name];
    if (_.isEmpty(extractor)) {
      return SERVER;
    }
    return this.extractors[event.constructor.name](event);
  }
}

export type GameEventSummary = Omit<entity.GameEvent, "game"> & {
  phaseInitialTimeRemaining: number;
  systemHealthInitial: number;
  phaseFinalTimeRemaining: number;
  systemHealthFinal: number;
  role: Role | ServerRole;
};

function extractBefore(g: GameState): {
  phaseInitialTimeRemaining: number;
  systemHealthInitial: number;
  roundInitial: number;
  phaseInitial: string;
} {
  const phaseInitialTimeRemaining = g.timeRemaining;
  const systemHealthInitial = g.systemHealth;
  return {
    phaseInitialTimeRemaining,
    systemHealthInitial,
    roundInitial: g.round,
    phaseInitial: Phase[g.phase],
  };
}

function extractAfter(g: GameState): {
  phaseFinalTimeRemaining: number;
  systemHealthFinal: number;
  roundFinal: number;
  phaseFinal: string;
} {
  const phaseFinalTimeRemaining = g.timeRemaining;
  const systemHealthFinal = g.systemHealth;
  return {
    phaseFinalTimeRemaining,
    systemHealthFinal,
    roundFinal: g.round,
    phaseFinal: Phase[g.phase],
  };
}

/**
 * Emits snapshot summaries of the game state before / after each game event
 */
export class GameEventSummarizer extends Summarizer<GameEventSummary> {
  _summarizeEvent(game: GameState, event: entity.GameEvent): GameEventSummary {
    game.timeRemaining = event.timeRemaining;
    const before = extractBefore(game);
    const e = gameEventDeserializer.deserialize(event);
    game.applyMany([e]);
    const role = this.extractRole(game, e, event);
    const after = extractAfter(game);
    const eventData = _.omit(event, ["game"]);
    return { ...eventData, ...before, ...after, role };
  }

  *_summarizeGame(events: Array<entity.GameEvent>): Generator<GameEventSummary> {
    const game = loadSnapshot(events[0].payload as GameSerialized);
    const rows: Array<GameEventSummary> = [];
    for (const event of events) {
      yield this._summarizeEvent(game, event);
    }
    return rows;
  }

  getPlayerUpkeep(game: GameState) {
    return {
      [CURATOR]: game.players[CURATOR].systemHealthChanges.investment,
      [ENTREPRENEUR]: game.players[ENTREPRENEUR].systemHealthChanges.investment,
      [PIONEER]: game.players[PIONEER].systemHealthChanges.investment,
      [POLITICIAN]: game.players[POLITICIAN].systemHealthChanges.investment,
      [RESEARCHER]: game.players[RESEARCHER].systemHealthChanges.investment,
    };
  }

  *summarize(): Generator<GameEventSummary> {
    for (const [gameId, events] of this.events.entries()) {
      const gameSummary = this._summarizeGame(events);
      for (const eventSummary of gameSummary) {
        yield eventSummary;
      }
    }
  }

  transform(row: GameEventSummary) {
    const payload = new ObjColumn(row.payload);
    return { ...row, payload };
  }

  extractRole(g: GameState, e: GameEvent, event: entity.GameEvent): Role | ServerRole {
    const role = e.getRole?.(g) ?? (event.payload as any).role;
    return ROLES.includes(role) ? role : "Server";
  }
}

export interface VictoryPointExport {
  id: number;
  gameId: number;
  role: Role;
  victoryPoints: number;
  timeRemainingInitial: number;
}

export class VictoryPointSummarizer extends Summarizer<VictoryPointExport> {
  phase: Phase = Phase.invest;

  _summarizeEvent(
    game: GameState,
    event: entity.GameEvent
  ): Array<Omit<VictoryPointExport, "id" | "timeRemainingInitial">> {
    return ROLES.map(role => {
      return {
        gameId: event.gameId,
        role,
        victoryPoints: game.players[role].victoryPoints,
      };
    });
  }

  *_summarizeGame(events: Array<entity.GameEvent>): Generator<VictoryPointExport> {
    const game = loadSnapshot(events[0].payload as GameSerialized);
    let prev = this._summarizeEvent(game, events[0]);
    for (const row of prev) {
      yield {
        id: events[0].id,
        ...row,
        timeRemainingInitial: events[0].timeRemaining,
        ...extractAfter(game),
      };
    }

    for (const event of events.slice(1)) {
      const e = gameEventDeserializer.deserialize(event);
      game.timeRemaining = event.timeRemaining;
      game.applyMany([e]);
      const curr = this._summarizeEvent(game, event);
      for (const [row, prevrow] of _.zip(curr, prev)) {
        if (!_.isEqual(row, prevrow) && row) {
          yield {
            id: event.id,
            ...row,
            timeRemainingInitial: event.timeRemaining,
            ...extractAfter(game),
          };
        }
      }
      prev = curr;
    }
  }

  *summarize(): Generator<VictoryPointExport> {
    for (const events of this.events.values()) {
      const gameSummary = this._summarizeGame(events);
      for (const gameEvent of gameSummary) {
        yield gameEvent;
      }
    }
  }
}

/**
 * Emits the list of all Accomplishments currently available in Port of Mars. Completely static, this is not
 * expected to change often and if the set of accomplishments related to roles changes in the codebase, this
 * serialized list will also change.
 */
export class AccomplishmentSummarizer {
  constructor(public path: string) {}

  async save() {
    const accomplishments = getAllAccomplishments();
    const header = Object.keys(accomplishments[0]).map(name => ({
      id: name,
      title: name,
    }));
    const writer = createObjectCsvWriter({ path: this.path, header });
    await writer.writeRecords(accomplishments);
  }
}

interface PlayerRaw {
  player_id: Player["id"];
  player_gameId: Player["gameId"];
  player_role: Player["role"];
  user_participantId: User["participantId"];
  invitation_id: TournamentRoundInvite["id"];
}

interface PlayerExport {
  id: number;
  gameId: number;
  participantId: string;
  inviteId: number;
  role: Role;
}

export class PlayerSummarizer {
  constructor(public players: Array<PlayerRaw>, public path: string) {}

  *summarize(): Generator<PlayerExport> {
    for (const p of this.players) {
      yield {
        id: p.player_id,
        gameId: p.player_gameId,
        participantId: p.user_participantId,
        role: p.player_role,
        inviteId: p.invitation_id,
      };
    }
  }

  async save() {
    const summaries = this.summarize();
    let result: IteratorResult<PlayerExport> = summaries.next();
    const header = Object.keys(result.value).map(k => ({ id: k, title: k }));
    const rows = [result.value];
    // eslint-disable-next-line no-constant-condition
    while (true) {
      result = summaries.next();
      if (result.done) {
        break;
      }
      rows.push(result.value);
    }

    const writer = createObjectCsvWriter({ path: this.path, header });
    await writer.writeRecords(rows);
  }
}

export interface PlayerInvestmentExport {
  id: number;
  gameId: number;
  role: Role;
  investment: Investment;
  name: string;
  availableTimeBlocks: number;
  value: number;
  initialTimeRemaining: number;
}

export class PlayerInvestmentSummarizer extends Summarizer<PlayerInvestmentExport> {
  _summarizeEvent(
    game: GameState,
    event: entity.GameEvent
  ): Array<Omit<PlayerInvestmentExport, "id" | "initialTimeRemaining">> {
    return _.flatMap(ROLES, (role: Role) => [
      ...RESOURCES.map((investment: Resource) => ({
        gameId: event.gameId,
        role,
        investment,
        name: "pendingInvestment",
        availableTimeBlocks: game.players[role].timeBlocks,
        value: game.players[role].pendingInvestments[investment],
      })),
      {
        gameId: event.gameId,
        role,
        investment: "systemHealth",
        name: "pendingInvestment",
        availableTimeBlocks: game.players[role].timeBlocks,
        value: game.players[role].pendingInvestments["systemHealth"],
      },
      ...RESOURCES.map((investment: Resource) => ({
        gameId: event.gameId,
        role,
        investment,
        name: "cost",
        availableTimeBlocks: game.players[role].timeBlocks,
        value: game.players[role].costs[investment],
      })),
      {
        gameId: event.gameId,
        role,
        investment: "systemHealth",
        name: "cost",
        availableTimeBlocks: game.players[role].timeBlocks,
        value: game.players[role].costs.systemHealth,
      },
      ...RESOURCES.map((investment: Resource) => ({
        gameId: event.gameId,
        role,
        investment,
        name: "inventory",
        availableTimeBlocks: game.players[role].timeBlocks,
        value: game.players[role].inventory[investment],
      })),
      {
        gameId: event.gameId,
        role,
        investment: "systemHealth",
        name: "inventory",
        availableTimeBlocks: game.players[role].timeBlocks,
        value: game.players[role].systemHealthChanges.investment,
      },
    ]);
  }

  *_summarizeGame(events: Array<entity.GameEvent>): Generator<PlayerInvestmentExport> {
    const initialEvent = events[0];
    const game = loadSnapshot(initialEvent.payload as GameSerialized);
    let prev = this._summarizeEvent(game, initialEvent);
    for (const row of prev) {
      yield {
        id: initialEvent.id,
        ...row,
        initialTimeRemaining: initialEvent.timeRemaining,
        ...extractAfter(game),
      };
    }

    for (const event of events.slice(1)) {
      const e = gameEventDeserializer.deserialize(event);
      game.timeRemaining = event.timeRemaining;
      game.applyMany([e]);
      const curr = this._summarizeEvent(game, event);
      for (const row of curr) {
        yield {
          id: event.id,
          ...(row as Omit<PlayerInvestmentExport, "id">),
          initialTimeRemaining: event.timeRemaining,
          ...extractAfter(game),
        };
      }
      prev = curr;
    }
  }

  *summarize(): Generator<PlayerInvestmentExport> {
    for (const events of this.events.values()) {
      const gameSummary = this._summarizeGame(events);
      for (const gameEvent of gameSummary) {
        yield gameEvent;
      }
    }
  }
}

export interface MarsEventExport {
  gameId: number;
  round: number;
  name: string;
  description: string;
  index: number;
  payload: string;
}

/**
 * replays every single event that occurred when it reaches ExitedMarsEventPhase,
 * goes through all the mars events that live inside the gameState and prints them out
 */
export class MarsEventSummarizer extends Summarizer<MarsEventExport> {
  _summarizeEvent(game: GameState, event: entity.GameEvent): Array<MarsEventExport> {
    return game.marsEvents.map((marsEvent, index) => ({
      gameId: event.gameId,
      round: game.round,
      name: marsEvent.name,
      description: marsEvent.effect,
      index,
      payload: JSON.stringify(event.payload),
    }));
  }

  _summarizeGame(events: Array<entity.GameEvent>): Array<MarsEventExport> {
    const game = loadSnapshot(events[0].payload as GameSerialized);
    // const exitedMarsEventPhase = new ExitedMarsEventPhase();
    const remainingEvents = events.slice(1);
    const eventPayloadMap = this.getEventPayloadMap();
    let allMarsEvents: Array<MarsEventExport> = [];
    for (const event of remainingEvents) {
      const e = gameEventDeserializer.deserialize(event);
      game.timeRemaining = event.timeRemaining;
      game.applyMany([e]);
      // every time we run into a game event that has a payload,
      // summarize the game state's current set of MarsEvents
      // and produce values to summarize()

      if (eventPayloadMap.has(event.type)) {
        const marsEventSummary = this._summarizeEvent(game, event);
        allMarsEvents = allMarsEvents.concat(marsEventSummary);
        //   for (const row of marsEventSummary) {
        //     // row in csv
        //     yield row;
        //   }
        //
      }
    }
    return allMarsEvents;
  }

  *summarize(): Generator<MarsEventExport> {
    for (const gameEvents of this.events.values()) {
      const marsEventsSummary = this._summarizeGame(gameEvents);
      for (const marsEvents of marsEventsSummary) {
        yield marsEvents;
      }
    }
  }

  getEventPayloadMap(): Map<string, Record<string, unknown>> {
    const events = [
      BreakdownOfTrustOccurred,
      StagedDiscardOfPurchasedAccomplishment,
      SelectedInfluence,
      VoteHeroOrPariah,
      VoteHeroOrPariahRole,
      VotedForPhilanthropist,
      VotedForPersonalGain,
      ExitedMarsEventPhase,
    ];

    const eventPayloadMap = new Map(events.map(e => [_.kebabCase(e.name), {}]));
    return eventPayloadMap;
  }
}

export interface MarsLogExport extends MarsLogMessageData {
  gameId: number;
}

export class MarsLogSummarizer extends Summarizer<MarsLogExport> {
  _summarizeGame(events: Array<entity.GameEvent>): GameState {
    // FIXME: may want to relate mars logs with game events - that isn't done right now
    const game = loadSnapshot(events[0].payload as GameSerialized);
    for (const event of events.slice(1)) {
      const e = gameEventDeserializer.deserialize(event);
      game.applyMany([e]);
    }
    return game;
  }

  *summarize(): Generator<MarsLogExport> {
    for (const [gameId, events] of this.events.entries()) {
      const gameSummary = this._summarizeGame(events);
      for (const marsLog of gameSummary.logs) {
        yield { ...marsLog, gameId };
      }
    }
  }
}

export class GameReplayer {
  constructor(public events: Array<entity.GameEvent>) {}

  get endState(): GameState {
    const events = this.events.slice(1).map(e => gameEventDeserializer.deserialize(e));
    const gameState = loadSnapshot(this.events[0].payload as GameSerialized);
    gameState.applyMany(events);
    return gameState;
  }

  /**
   * replay all events and validate that the actual (snapshot) data lines up with the
   * simulated game state
   */
  validate(): Array<{ round: number; success: boolean; error?: any }> {
    // pull all events after the initial TakenStateSnapshot and deserialize them
    const events = this.events.slice(1);
    const gameState = loadSnapshot(this.events[0].payload as GameSerialized);
    let currentRoundGameEvents = [];
    const results = [];
    for (const event of events) {
      if (event.type !== "taken-round-snapshot") {
        currentRoundGameEvents.push(event);
      } else {
        // do the validation against event.payload against the currentRoundGameEvents
        const stateSnapshot = event.payload as RoundSummary;
        gameState.applyMany(currentRoundGameEvents.map(e => gameEventDeserializer.deserialize(e)));
        // assert that round summary data lines up properly with the current gameState
        try {
          assert.deepEqual(stateSnapshot, gameState.getRoundSummary());
          logger.trace(`successfully validated round ${gameState.round}`);
          results.push({
            round: gameState.round,
            success: true,
          });
        } catch (e) {
          logger.trace(`failed to validate round ${gameState.round}`);
          logger.trace(e);
          results.push({
            round: gameState.round,
            success: false,
            error: e,
          });
        }
        currentRoundGameEvents = [];
      }
    }
    if (!results.length) {
      throw new Error(
        "Game contains no round snapshots, nothing to validate against for legacy games"
      );
    }
    return results;
  }

  summarize<T>(summarizer: (g: GameState) => T): Array<T> {
    const g = loadSnapshot(this.events[0].payload as GameSerialized);
    const summaries: Array<T> = [];
    let timeToNextTransition = g.timeRemaining;
    for (const event of this.events.slice(1)) {
      const summary = summarizer(g);
      const phase = g.phase;
      const e = gameEventDeserializer.deserialize(event);
      g.applyMany([e]);
      if (!_.isEqual(phase, g.phase)) {
        summaries.push({
          ...summary,
          duration: timeToNextTransition - event.timeRemaining,
        });
        timeToNextTransition = g.timeRemaining;
      }
    }
    summaries.push({ ...summarizer(g), duration: 0 });
    return summaries;
  }
}
