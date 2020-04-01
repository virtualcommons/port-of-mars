import { Game } from "@port-of-mars/server/entity/Game";
import { User } from "@port-of-mars/server/entity/User";
import { Player } from "@port-of-mars/server/entity/Player";
import * as ge from "@port-of-mars/server/rooms/game/events/types";
import { GameOpts, Metadata, Persister } from "@port-of-mars/server/rooms/game/types";
import * as assert from "assert";
import { GameEvent } from "@port-of-mars/server/entity/GameEvent";
import Mutex from "async-mutex/lib/Mutex";
import { ClockTimer } from "@gamestdio/timer/lib/ClockTimer";
import _ from "lodash";
import { getConnection } from "@port-of-mars/server/util";
import { TournamentRound } from "@port-of-mars/server/entity/TournamentRound";
import {EntityManager} from "typeorm";

function toDBRawGameEvent(gameEvent: ge.GameEvent, metadata: Metadata) {
  const ev = gameEvent.serialize();
  return {
    ...ev,
    ...metadata
  }
}

export function toDBGameEvent(gameEvent: ge.GameEvent, metadata: Metadata) {
  const dbRawGameEvent = toDBRawGameEvent(gameEvent, metadata);
  const dbGameEvent = new GameEvent();
  Object.assign(dbGameEvent, dbRawGameEvent);
  return dbGameEvent
}

export class ConsolePersister implements Persister {
  clock: ClockTimer = new ClockTimer();

  setSyncInterval(time: number = 5000) {
    this.clock.setInterval(this.sync.bind(this), time)
  }

  initialize(options: GameOpts, roomId: string): Promise<number> {
    return Promise.resolve(1);
  }

  async sync() {
    console.log('synced');
  }

  async persist(events: Array<ge.GameEvent>, metadata: Metadata): Promise<void> {
    await this.sync();
  }
}

export class DBPersister implements Persister {
  pendingEvents: Array<Omit<{ [k in keyof GameEvent]: GameEvent[k] }, 'id' | 'game'>> = [];
  lock: Mutex = new Mutex();

  constructor(public _em?: EntityManager) {}

  get em() {
    return this._em ?? getConnection().manager;
  }

  async initialize(options: GameOpts, roomId: string): Promise<number> {
    const g = new Game();
    const f = async (em: EntityManager) => {
      if (_.isNull(options.tournamentRoundId)) {
        throw new Error('could not find matching tournament round')
      }
      g.tournamentRoundId = options.tournamentRoundId;
      g.roomId = roomId;

      const userRepo = em.getRepository(User);
      const usernames = Object.keys(options.userRoles);
      const q = await userRepo.createQueryBuilder('user')
        .select('id')
        .addSelect('username')
        .where('user.username IN (:...usernames)', { usernames });
      const rawUsers = await q.getRawMany();
      assert.equal(rawUsers.length, usernames.length);

      await em.save(g);

      const players = [];
      for (const rawUser of rawUsers) {
        const p = {
          userId: rawUser.id,
          role: options.userRoles[rawUser.username],
          gameId: g.id
        };
        players.push(p);
      }
      await em.getRepository(Player).createQueryBuilder()
        .insert()
        .values(players)
        .execute();

      return g.id;
    };
    if (this.em.queryRunner?.isTransactionActive) {
      return f(this.em);
    } else {
      return this.em.transaction(f);
    }
  }

  async sync() {
    await this.lock.runExclusive(async () => {
      if (this.pendingEvents.length > 0) {
        await this.em.getRepository(GameEvent)
          .createQueryBuilder()
          .insert()
          .values(this.pendingEvents)
          .execute();
        this.pendingEvents = [];
      }
    })
  }

  async persist(events: Array<ge.GameEvent>, metadata: Metadata) {
    const rawGameEvents = events.map(ge => toDBRawGameEvent(ge, metadata));
    await this.lock.runExclusive(async () => {
      for (const rawEvent of rawGameEvents) {
        this.pendingEvents.push(rawEvent);
      }
    });
  }
}
