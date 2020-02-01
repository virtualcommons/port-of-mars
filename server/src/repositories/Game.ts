import {Connection, Repository} from "typeorm";
import {Game} from "@/entity/Game";
import {User} from "@/entity/User";
import {Player} from "@/entity/Player";
import * as ge from "@/game/events/types";
import {GameOpts, PersistenceAPI} from "@/game/room/types";
import * as assert from "assert";
import {GameEvent} from "@/entity/GameEvent";
import Mutex from "async-mutex/lib/Mutex";
import {ClockTimer} from "@gamestdio/timer/lib/ClockTimer";
import {Tournament} from "@/entity/Tournament";
import _ from "lodash";

export class ConsolePersistenceAPI implements PersistenceAPI {
  clock: ClockTimer = new ClockTimer();

  constructor(public connection: Connection) {
  }

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

export class DBPersistenceAPI implements PersistenceAPI {
  game: Repository<Game>;
  gameEvent: Repository<GameEvent>;
  user: Repository<User>;
  player: Repository<Player>;
  tournament: Repository<Tournament>;

  pendingEvents: Array<Omit<{ [k in keyof GameEvent]: GameEvent[k] }, 'id' | 'game'>> = [];
  lock: Mutex = new Mutex();

  constructor(public connection: Connection) {
    this.game = connection.getRepository(Game);
    this.gameEvent = connection.getRepository(GameEvent);
    this.user = connection.getRepository(User);
    this.player = connection.getRepository(Player);
    this.tournament = connection.getRepository(Tournament);
  }

  async initialize(options: GameOpts) {
    const g = new Game();
    let tournamentId = (await this.tournament
      .createQueryBuilder('tournament')
      .select('MAX(id)')
      .getRawOne()).max;
    if (_.isNull(tournamentId)) {
      tournamentId = (await this.tournament.save(this.tournament.create())).id;
    }
    g.tournamentId = tournamentId;

    const usernames = Object.keys(options.userRoles);
    const q = await this.user.createQueryBuilder('user')
      .select('id')
      .addSelect('username')
      .where('user.username IN (:...usernames)', {usernames});
    const rawUsers = await q.getRawMany();
    assert.equal(rawUsers.length, usernames.length);
    await this.game.save(g);

    const players = [];
    for (const rawUser of rawUsers) {
      const p = {
        userId: rawUser.id,
        role: options.userRoles[rawUser.username],
        gameId: g.id
      };
      players.push(p);
    }
    await this.player.createQueryBuilder()
      .insert()
      .values(players)
      .execute();

    return g.id;
  }

  async sync() {
    await this.lock.runExclusive(async () => {
      if (this.pendingEvents.length > 0) {
        await this.gameEvent
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
        console.log({ eventLength: this.pendingEvents.length});
      }
    });
  }
}
