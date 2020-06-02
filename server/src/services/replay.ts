import {GameSerialized, GameState} from "@port-of-mars/server/rooms/game/state";
import {mockGameStateInitOpts} from "@port-of-mars/server/util";
import * as entity from "@port-of-mars/server/entity";
import {gameEventDeserializer} from "@port-of-mars/server/rooms/game/events";
import _ from "lodash";
import {getLogger} from "@port-of-mars/server/settings";
import {
  CURATOR, ENTREPRENEUR,
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

export interface GameEventAction {
  gameId: number;
  type: string;
  action: object;
  players: ObjColumn<Array<Role>>;
  originator: Role | ServerRole;
}

export interface GameEventChange {
  gameId: number;
  operation: 'update';
  field: string;
  value: any;
}

export class DiffGameEvent implements DiffListener {
  constructor(public filename: string) {}

  actions: Array<GameEventAction> = [];
  changes: Array<GameEventChange> = [];

  FIELDS = ['round', 'phase', 'timeRemaining', 'upkeep']

  extractRole(g: GameState, e: GameEvent, event: entity.GameEvent): Role | ServerRole {
    const role = e.getRole?.(g) ?? (event.payload as any).role;
    return ROLES.includes(role) ? role : 'Server'
  }

  receive(game: GameState, diff: jdiff.Delta, event: entity.GameEvent, ge: GameEvent): void {
    const playerDiff = diff['players'];
    const players = new ObjColumn(Object.keys(playerDiff || {}));

    const originator = this.extractRole(game, ge, event);
    this.actions.push({gameId: event.gameId, type: event.type, action: event.payload, players, originator});
  }

  async finalize(): Promise<void> {
    const csvActionWriter = createObjectCsvWriter({
      header: [
        'gameId',
        'operation',
        'type',
        'action'],
      path: this.filename
    });
    await csvActionWriter.writeRecords(this.actions)
  }
}

export class DiffStream {
  listeners: Array<DiffListener> = [];
  events: Array<entity.GameEvent>;
  snapshot: GameSerialized;

  constructor(events: Array<entity.GameEvent>) {
    this.events = events.slice(1);
    this.snapshot = events[0].payload as GameSerialized;
  }

  register(listener: DiffListener): void {
    this.listeners.push(listener);
  }

  deserialize(event: entity.GameEvent): GameEvent {
    return gameEventDeserializer.deserialize(event);
  }

  notify(game: GameState, delta: jdiff.Delta, event: entity.GameEvent, ge: GameEvent): void {
    for (const listener of this.listeners) {
      listener.receive(game, delta, event, ge);
    }
  }

  async finalize() {
    await Promise.all(this.listeners.map(l => l.finalize()));
  }

  run(): void {
    const prev = loadSnapshot(this.snapshot);
    const curr = loadSnapshot(this.snapshot);

    for (const event of this.events) {
      const e = this.deserialize(event);
      curr.applyMany([e]);
      const delta = jdiff.diff(prev, curr);
      if (delta) {
        this.notify(curr, delta, event, e);
      }
      prev.applyMany([e]);
    }
  }
}

export abstract class Summarizer<T> {
  abstract path: string;

  abstract summarize(): Generator<T>;

  transform(row: T): any {
    return row;
  }

  async save() {
    const summaries = this.summarize();
    let result: IteratorResult<T> = summaries.next();
    const header =  Object.keys(result.value).map(k => ({id: k, title: k}));
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

export class GameEventSummarizer extends Summarizer<GameEventSummary> {
  constructor(public events: Array<entity.GameEvent>, public path: string) {
    super();
  }

  _summarize(game: GameState, event: entity.GameEvent): GameEventSummary {
    const before = this.extractBefore(game);
    const e = gameEventDeserializer.deserialize(event);
    game.applyMany([e]);
    const role = this.extractRole(game, e, event);
    const after = this.extractAfter(game);
    return {...event, ...before, ...after, role};
  }

  getPlayerUpkeep(game: GameState) {
    return {
      [CURATOR]: game.players[CURATOR].contributedUpkeep,
      [ENTREPRENEUR]: game.players[ENTREPRENEUR].contributedUpkeep,
      [PIONEER]: game.players[PIONEER].contributedUpkeep,
      [POLITICIAN]: game.players[POLITICIAN].contributedUpkeep,
      [RESEARCHER]: game.players[RESEARCHER].contributedUpkeep,
    }
  }

  * summarize(): Generator<GameEventSummary> {
    const game = loadSnapshot(this.events[0].payload as GameSerialized);
    for (const event of this.events.slice(1)) {
      yield this._summarize(game, event);
      logger.info('id: %d (upkeep: %d) [%s] %o', event.id, game.upkeep, event.type, this.getPlayerUpkeep(game));
    }
  }

  transform(row: GameEventSummary) {
    const payload = new ObjColumn(row.payload);
    return {...row, payload};
  }

  extractBefore(g: GameState): { phaseInitialTimeRemaining: number; systemHealthInitial: number } {
    const phaseInitialTimeRemaining = g.timeRemaining;
    const systemHealthInitial = g.upkeep;
    return {phaseInitialTimeRemaining, systemHealthInitial}
  }

  extractRole(g: GameState, e: GameEvent, event: entity.GameEvent): Role | ServerRole {
    const role = e.getRole?.(g) ?? (event.payload as any).role;
    return ROLES.includes(role) ? role : 'Server'
  }

  extractAfter(g: GameState): { phaseFinalTimeRemaining: number; systemHealthFinal: number } {
    const phaseFinalTimeRemaining = g.timeRemaining;
    const systemHealthFinal = g.upkeep;
    return {phaseFinalTimeRemaining, systemHealthFinal}
  }
}

export interface VictoryPointExport {
  gameEventId: number;
  role: Role;
  victoryPoints: number;
}

export class VictoryPointSummarizer extends Summarizer<VictoryPointExport> {
  phase: Phase = Phase.invest;

  constructor(public events: Array<entity.GameEvent>, public path: string) {
    super();
  }

  _summarize(game: GameState, event: entity.GameEvent): Array<VictoryPointExport> {
    return ROLES.map(role => {
      return {
        gameEventId: event.id,
        role,
        victoryPoints: game.players[role].victoryPoints
      }
    });
  }

  * summarize(): Generator<VictoryPointExport> {
    const game = loadSnapshot(this.events[0].payload as GameSerialized);
    for (const row of this._summarize(game, this.events[0])) {
      yield row;
    }

    this.phase = game.phase;
    for (const event of this.events.slice(1)) {
      const e = gameEventDeserializer.deserialize(event);
      game.applyMany([e]);
      if (this.phase === game.phase) {
        continue;
      }
      this.phase = game.phase;
      const rows = this._summarize(game, event);
      for (const row of rows) {
        yield row;
      }
    }
  }
}

export interface PlayerInvestmentExport {
  gameEventId: number;
  role: Role;
  resource: Resource;
  amount: number;
  cost: number;
}

export class PlayerInvestmentSummarizer extends Summarizer<PlayerInvestmentExport> {
  constructor(public events: Array<entity.GameEvent>, public path: string) {
    super();
  }

  _summarize(game: GameState, event: entity.GameEvent): Array<PlayerInvestmentExport> {
    return _.flatMap(
      ROLES,
      role =>
        RESOURCES.map(
          resource => ({
            gameEventId: event.id,
            role,
            resource,
            amount: game.players[role].inventory[resource],
            cost: game.players[role].costs[resource]
          })));
  }

  * summarize(): Generator<PlayerInvestmentExport> {
    const game = loadSnapshot(this.events[0].payload as GameSerialized);
    for (const row of this._summarize(game, this.events[0])) {
      yield row;
    }

    for (const event of this.events.slice(1)) {
      const e = gameEventDeserializer.deserialize(event);
      game.applyMany([e]);
      for (const row of this._summarize(game, event)) {
        yield row;
      }
    }
  }
}

export interface MarsEventExport {
  id: number;
  round: number;
  name: string;
  description: string;
  index: number;
}

export class MarsEventSummarizer extends Summarizer<MarsEventExport> {
  constructor(public events: Array<entity.GameEvent>, public path: string) {
    super();
  }

  _summarize(game: GameState, event: entity.GameEvent): Array<MarsEventExport> {
    return game.marsEvents.map((marsEvent, index) => ({
      id: event.id,
      round: game.round,
      name: marsEvent.name,
      description: marsEvent.effect,
      index
    }))
  }

  * summarize(): Generator<MarsEventExport> {
    const game = loadSnapshot(this.events[0].payload as GameSerialized);
    for (const row of this._summarize(game, this.events[0])) {
      yield row;
    }

    for (const event of this.events.slice(1)) {
      const e = gameEventDeserializer.deserialize(event);
      game.applyMany([e]);
      for (const row of this._summarize(game, event)) {
        yield row;
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