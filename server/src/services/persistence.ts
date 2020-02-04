import {Connection, Repository} from "typeorm";
import {Game} from "@/entity/Game";
import {User} from "@/entity/User";
import {Player} from "@/entity/Player";
import * as ge from "@/game/events/types";
import {GameOpts, Persister} from "@/game/room/types";
import * as assert from "assert";
import {GameEvent} from "@/entity/GameEvent";
import Mutex from "async-mutex/lib/Mutex";
import {ClockTimer} from "@gamestdio/timer/lib/ClockTimer";
import {Tournament} from "@/entity/Tournament";
import _ from "lodash";
import {getConnection} from "@/util";
import {GameState} from "@/game/state";
import {getGameById} from "@/services/game";
import {Phase} from "shared/types";

export class ConsolePersister implements Persister {
  clock: ClockTimer = new ClockTimer();

  setSyncInterval(time: number = 5000) {
    this.clock.setInterval(this.sync.bind(this), time)
  }

  initialize(options: GameOpts): Promise<number> {
    return Promise.resolve(1);
  }

  async sync() {
    console.log('synced');
  }

  async applyMany(gameId: number, events: Array<ge.GameEvent>): Promise<void> {
    console.log(events.map(e => e.serialize().kind));
    await this.sync();
  }
}

export class DBPersister implements Persister {
  pendingEvents: Array<Omit<{ [k in keyof GameEvent]: GameEvent[k] }, 'id' | 'game'>> = [];
  lock: Mutex = new Mutex();

  async initialize(options: GameOpts) {
    const g = new Game();
    const conn = getConnection();
    return await conn.transaction(async transact => {
      const tournamentRepo = transact.getRepository(Tournament);
      let tournamentId = (await tournamentRepo
        .createQueryBuilder('tournament')
        .select('MAX(id)')
        .getRawOne()).max;
      if (_.isNull(tournamentId)) {
        tournamentId = (await tournamentRepo.save(tournamentRepo.create())).id;
      }
      g.tournamentId = tournamentId;

      const userRepo = transact.getRepository(User);
      const usernames = Object.keys(options.userRoles);
      const q = await userRepo.createQueryBuilder('user')
        .select('id')
        .addSelect('username')
        .where('user.username IN (:...usernames)', {usernames});
      const rawUsers = await q.getRawMany();
      assert.equal(rawUsers.length, usernames.length);

      await transact.save(g);

      const players = [];
      for (const rawUser of rawUsers) {
        const p = {
          userId: rawUser.id,
          role: options.userRoles[rawUser.username],
          gameId: g.id
        };
        players.push(p);
      }
      await transact.getRepository(Player).createQueryBuilder()
        .insert()
        .values(players)
        .execute();

      return g.id;
    });
  }

  async sync() {
    await this.lock.runExclusive(async () => {
      if (this.pendingEvents.length > 0) {
        await getConnection().getRepository(GameEvent)
          .createQueryBuilder()
          .insert()
          .values(this.pendingEvents)
          .execute();
        this.pendingEvents = [];
      }
    })
  }

  async applyMany(gameId: number, events: Array<ge.GameEvent>) {
    const rawGameEvents = events.map(ge => {
      const ev = ge.serialize();
      return {
        gameId,
        type: ev.kind,
        payload: ev.data ?? {},
        dateCreated: new Date(ev.dateCreated)
      }
    });
    console.log(rawGameEvents);
    await this.lock.runExclusive(async () => {
      for (const rawEvent of rawGameEvents) {
        this.pendingEvents.push(rawEvent);
      }
    });
  }
}
