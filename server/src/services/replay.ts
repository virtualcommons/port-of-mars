import {GameSerialized, GameState} from "@port-of-mars/server/rooms/game/state";
import {mockGameStateInitOpts} from "@port-of-mars/server/util";
import * as entity from "@port-of-mars/server/entity";
import {gameEventDeserializer} from "@port-of-mars/server/rooms/game/events";
import _ from "lodash";
import {getLogger} from "@port-of-mars/server/settings";
import {
  CURATOR, ENTREPRENEUR, Investment, INVESTMENTS,
  Phase, PIONEER, POLITICIAN,
  RESEARCHER,
  Resource,
  RESOURCES,
  Role,
  ROLES,
  SERVER,
  ServerRole
} from "@port-of-mars/shared/types";
import {createObjectCsvWriter} from "csv-writer";
import {GameEvent} from "@port-of-mars/server/rooms/game/events/types";
import * as jdiff from 'jsondiffpatch'
import {getAccomplishmentIDs, getAllAccomplishments} from "@port-of-mars/server/data/Accomplishment";
import {EntityManager} from "typeorm/index";
import {Player, TournamentRoundInvite, User} from "@port-of-mars/server/entity";

const logger = getLogger(__filename);

function loadSnapshot(data: GameSerialized): GameState {
  const g = new GameState(mockGameStateInitOpts());
  g.fromJSON(data);
  return g;
}

export interface DiffListener {
  receive(game: GameState, diff: jdiff.Delta, event: entity.GameEvent, ge: GameEvent): void;

  finalize(): Promise<void>;
}

class ObjColumn<T> {
  constructor(private payload: any) {
  }

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

  async save() {
    const summaries = this.summarize();
    let result: IteratorResult<T> = summaries.next();
    const header = Object.keys(result.value).map(k => ({id: k, title: k}));
    const rows = [result.value];
    while (!result.done) {
      rows.push(this.transform(result.value));
      result = summaries.next();
    }

    const writer = createObjectCsvWriter({path: this.path, header});
    await writer.writeRecords(rows);
  }
}

class RoleExtractor {
  extractors: { [name: string]: <T extends GameEvent>(event: T) => Role | ServerRole } = {};

  extractRole(event: GameEvent): Role | ServerRole {
    const extractor = this.extractors[event.constructor.name];
    if (_.isEmpty(extractor)) {
      return SERVER;
    }
    return this.extractors[event.constructor.name](event);
  }
}

export type GameEventSummary =
  entity.GameEvent
  & { phaseInitialTimeRemaining: number; systemHealthInitial: number; phaseFinalTimeRemaining: number; systemHealthFinal: number; role: Role | ServerRole };

function extractBefore(g: GameState): { phaseInitialTimeRemaining: number; systemHealthInitial: number; roundInitial: number; phaseInitial: string } {
  const phaseInitialTimeRemaining = g.timeRemaining;
  const systemHealthInitial = g.systemHealth;
  return {phaseInitialTimeRemaining, systemHealthInitial, roundInitial: g.round, phaseInitial: Phase[g.phase]}
}

function extractAfter(g: GameState): { phaseFinalTimeRemaining: number; systemHealthFinal: number; roundFinal: number; phaseFinal: string } {
  const phaseFinalTimeRemaining = g.timeRemaining;
  const systemHealthFinal = g.systemHealth;
  return {phaseFinalTimeRemaining, systemHealthFinal, roundFinal: g.round, phaseFinal: Phase[g.phase]}
}

export class GameEventSummarizer extends Summarizer<GameEventSummary> {
  _summarizeEvent(game: GameState, event: entity.GameEvent): GameEventSummary {
    game.timeRemaining = event.timeRemaining;
    const before = extractBefore(game);
    const e = gameEventDeserializer.deserialize(event);
    game.applyMany([e]);
    const role = this.extractRole(game, e, event);
    const after = extractAfter(game);
    return {...event, ...before, ...after, role};
  }

  * _summarizeGame(events: Array<entity.GameEvent>): Generator<GameEventSummary> {
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
    }
  }

  * summarize(): Generator<GameEventSummary> {
    for (const [gameId, events] of this.events.entries()) {
      const gameSummary = this._summarizeGame(events);
      for (const eventSummary of gameSummary) {
        yield eventSummary;
      }
    }
  }

  transform(row: GameEventSummary) {
    const payload = new ObjColumn(row.payload);
    return {...row, payload};
  }

  extractRole(g: GameState, e: GameEvent, event: entity.GameEvent): Role | ServerRole {
    const role = e.getRole?.(g) ?? (event.payload as any).role;
    return ROLES.includes(role) ? role : 'Server'
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

  _summarizeEvent(game: GameState, event: entity.GameEvent): Array<Omit<VictoryPointExport, 'id' | 'timeRemainingInitial'>> {
    return ROLES.map(role => {
      return {
        gameId: event.gameId,
        role,
        victoryPoints: game.players[role].victoryPoints
      }
    });
  }

  * _summarizeGame(events: Array<entity.GameEvent>): Generator<VictoryPointExport> {
    const game = loadSnapshot(events[0].payload as GameSerialized);
    let prev = this._summarizeEvent(game, events[0])
    for (const row of prev) {
      yield {id: events[0].id, ...row, timeRemainingInitial: events[0].timeRemaining, ...extractAfter(game)};
    }

    for (const event of events.slice(1)) {
      const e = gameEventDeserializer.deserialize(event);
      game.timeRemaining = event.timeRemaining;
      game.applyMany([e]);
      const curr = this._summarizeEvent(game, event);
      for (const [row, prevrow] of _.zip(curr, prev)) {
        if (!_.isEqual(row, prevrow) && row) {
          yield {id: event.id, ...row, timeRemainingInitial: event.timeRemaining, ...extractAfter(game)};
        }
      }
      prev = curr;
    }
  }

  * summarize(): Generator<VictoryPointExport> {
    for (const events of this.events.values()) {
      const gameSummary = this._summarizeGame(events);
      for (const gameEvent of gameSummary) {
        yield gameEvent;
      }
    }
  }
}

export class AccomplishmentSummarizer {
  constructor(public path: string) {}

  async save() {
    const accomplishements = getAllAccomplishments();
    const header = Object.keys(accomplishements[0]).map(name => ({id: name, title: name}))
    const writer = createObjectCsvWriter({path: this.path, header});
    await writer.writeRecords(accomplishements);
  }
}

interface PlayerRaw {
  player_id: Player['id'],
  player_gameId: Player['gameId'],
  player_role: Player['role'],
  user_participantId: User['participantId'],
  invitation_id: TournamentRoundInvite['id']
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

  * summarize(): Generator<PlayerExport> {
    for (const p of this.players) {
      yield {id: p.player_id, gameId: p.player_gameId, participantId: p.user_participantId, role: p.player_role, inviteId: p.invitation_id}
    }
  }

  async save() {
    const summaries = this.summarize();
    let result: IteratorResult<PlayerExport> = summaries.next();
    const header = Object.keys(result.value).map(k => ({id: k, title: k}));
    const rows = [result.value];
    // eslint-disable-next-line no-constant-condition
    while (true) {
      result = summaries.next();
      if (result.done) {
        break;
      }
      rows.push(result.value);
    }

    const writer = createObjectCsvWriter({path: this.path, header});
    await writer.writeRecords(rows);
  }
}

export interface PlayerInvestmentExport {
  id: number;
  gameId: number;
  role: Role;
  investment: Investment;
  name: string;
  value: number;
  initialTimeRemaining: number;
}

export class PlayerInvestmentSummarizer extends Summarizer<PlayerInvestmentExport> {
  _summarizeEvent(game: GameState, event: entity.GameEvent): Array<Omit<PlayerInvestmentExport, 'id' | 'initialTimeRemaining'>> {
    return _.flatMap(
      ROLES,
      (role: Role) =>
        [
          ...RESOURCES.map(
            (investment: Resource) => ({
              gameId: event.gameId,
              role,
              investment,
              name: 'pendingInvestment',
              value: game.players[role].pendingInvestments[investment],
            })),
          {
            gameId: event.gameId,
            role,
            investment: 'systemHealth',
            name: 'pendingInvestment',
            value: game.players[role].pendingInvestments['systemHealth'],
          },
          ...RESOURCES.map(
            (investment: Resource) => ({
              gameId: event.gameId,
              role,
              investment,
              name: 'cost',
              value: game.players[role].costs[investment]
            })),
          {
            gameId: event.gameId,
            role,
            investment: 'systemHealth',
            name: 'cost',
            value: game.players[role].costs.systemHealth
          },
          ...RESOURCES.map(
            (investment: Resource) => ({
              gameId: event.gameId,
              role,
              investment,
              name: 'inventory',
              value: game.players[role].inventory[investment],
            })),
          {
            gameId: event.gameId,
            role,
            investment: 'systemHealth',
            name: 'inventory',
            value: game.players[role].systemHealthChanges.investment,
          }
        ]);
  }

  * _summarizeGame(events: Array<entity.GameEvent>): Generator<PlayerInvestmentExport> {
    const game = loadSnapshot(events[0].payload as GameSerialized);
    let prev = this._summarizeEvent(game, events[0]);
    for (const row of prev) {
      yield {id: events[0].id, ...row, initialTimeRemaining: events[0].timeRemaining, ...extractAfter(game)};
    }

    for (const event of events.slice(1)) {
      const e = gameEventDeserializer.deserialize(event);
      game.timeRemaining = event.timeRemaining;
      game.applyMany([e]);
      const curr = this._summarizeEvent(game, event);
      for (const row of curr) {
          yield {id: event.id, ...row as Omit<PlayerInvestmentExport, 'id'>, initialTimeRemaining: event.timeRemaining, ...extractAfter(game)};
      }
      prev = curr;
    }
  }

  * summarize(): Generator<PlayerInvestmentExport> {
    for (const events of this.events.values()) {
      const gameSummary = this._summarizeGame(events);
      for (const gameEvent of gameSummary) {
        yield gameEvent;
      }
    }
  }
}

export interface MarsEventExport {
  id: number;
  gameId: number;
  round: number;
  name: string;
  description: string;
  index: number;
  initialTimeRemaining: number;
}

export class MarsEventSummarizer extends Summarizer<MarsEventExport> {
  _summarizeEvent(game: GameState, event: entity.GameEvent): Array<Omit<MarsEventExport, 'id' | 'initialTimeRemaining'>> {
    return game.marsEvents.map((marsEvent, index) => ({
      gameId: event.gameId,
      round: game.round,
      name: marsEvent.name,
      description: marsEvent.effect,
      index
    }))
  }

  * _summarizeGame(events: Array<entity.GameEvent>): Generator<MarsEventExport> {
    const game = loadSnapshot(events[0].payload as GameSerialized);
    let prev = this._summarizeEvent(game, events[0]);
    for (const row of prev) {
      yield {id: events[0].id, ...row, initialTimeRemaining: events[0].timeRemaining, ...extractBefore(game)};
    }

    for (const event of events.slice(1)) {
      const e = gameEventDeserializer.deserialize(event);
      game.timeRemaining = event.timeRemaining;
      game.applyMany([e]);
      const curr = this._summarizeEvent(game, event);
      for (const [row, prevrow] of _.zip(curr, prev)) {
        if (!_.isEqual(row, prevrow) && row) {
          yield {id: event.id, ...row, initialTimeRemaining: event.timeRemaining, ...extractAfter(game)}
        }
      }
      prev = curr;
    }
  }

  * summarize(): Generator<MarsEventExport> {
    for (const events of this.events.values()) {
      const gameSummary = this._summarizeGame(events);
      for (const gameEvent of gameSummary) {
        yield gameEvent;
      }
    }
  }
}

export class GameReplayer {
  constructor(public events: Array<entity.GameEvent>) {
  }

  get endState(): GameState {
    const events = this.events.slice(1).map(e => gameEventDeserializer.deserialize(e));
    const g = loadSnapshot(this.events[0].payload as GameSerialized);
    logger.info('events: %o', events);
    g.applyMany(events)
    return g;
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
        summaries.push({...summary, duration: timeToNextTransition - event.timeRemaining});
        timeToNextTransition = g.timeRemaining;
      }
    }
    summaries.push({...summarizer(g), duration: 0});
    return summaries;
  }
}