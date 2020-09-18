import {Game, GameEvent, Player, TournamentRoundInvite, User} from "@port-of-mars/server/entity";
import * as ge from "@port-of-mars/server/rooms/game/events/types";
import {GameOpts, Metadata, Persister} from "@port-of-mars/server/rooms/game/types";
import * as assert from "assert";
import {Mutex} from "async-mutex";
import {ClockTimer} from "@gamestdio/timer/lib/ClockTimer";
import {getConnection} from "@port-of-mars/server/util";
import {EntityManager, In, IsNull} from "typeorm";
import _ from "lodash";
import {getServices, ServiceProvider} from "@port-of-mars/server/services/index";
import {settings} from "@port-of-mars/server/settings";
import {BaseService} from "@port-of-mars/server/services/db";
import {getBuildId} from "@port-of-mars/shared/settings";

const logger = settings.logging.getLogger(__filename);

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

export class GameConsoleService implements Persister {
  clock: ClockTimer = new ClockTimer();

  setSyncInterval(time = 5000) {
    this.clock.setInterval(this.sync.bind(this), time)
  }

  initialize(options: GameOpts, roomId: string): Promise<number> {
    return Promise.resolve(1);
  }

  finalize(gameId: number): Promise<void> {
    return Promise.resolve();
  }

  async sync() {
    console.log('synced');
  }

  async persist(events: Array<ge.GameEvent>, metadata: Metadata): Promise<void> {
    await this.sync();
  }
}

export type PendingEvent = Omit<{ [k in keyof GameEvent]: GameEvent[k] }, 'id' | 'game'>

export class DBPersister implements Persister {
  pendingEvents: Array<PendingEvent> = [];
  lock: Mutex = new Mutex();

  constructor(public _sp?: ServiceProvider) {
  }

  get sp() {
    if (!this._sp) {
      this._sp = getServices();
    }
    return this._sp;
  }

  get em() {
    return this.sp.em;
  }

  async selectUsersByUsername(em: EntityManager, usernames: Array<string>) {
    const userRepo = em.getRepository(User);
    const q = await userRepo.createQueryBuilder('user')
      .select('id')
      .addSelect('username')
      .where('user.username IN (:...usernames)', {usernames});
    const rawUsers = await q.getRawMany();
    assert.equal(rawUsers.length, usernames.length);
    return rawUsers
  }

  async createPlayers(em: EntityManager, gameId: number, userRoles: GameOpts['userRoles'], rawUsers: Array<User>): Promise<Array<Player>> {
    const players = [];
    for (const ru of rawUsers) {
      const p = {
        userId: ru.id,
        role: userRoles[ru.username],
        gameId
      };
      players.push(p);
    }
    const pu = em.getRepository(Player);
    return await pu.save(pu.create(players));
  }

  async initialize(options: GameOpts, roomId: string, shouldCreatePlayers = true): Promise<number> {
    logger.debug('initializing game %s', roomId);
    const g = new Game();
    const f = async (em: EntityManager) => {
      if (_.isNull(options.tournamentRoundId)) {
        throw new Error('could not find matching tournament round')
      }
      g.buildId = getBuildId();
      g.tournamentRoundId = options.tournamentRoundId;
      g.roomId = roomId;

      await em.save(g);
      if (shouldCreatePlayers) {
        const rawUsers = await this.selectUsersByUsername(em, Object.keys(options.userRoles));
        await this.createPlayers(em, g.id, options.userRoles, rawUsers);
      }

      return g.id;
    };
    if (this.em.queryRunner?.isTransactionActive) {
      return await f(this.em);
    } else {
      return await this.em.transaction(f);
    }
  }

  static FINAL_EVENTS = ['entered-defeat-phase', 'entered-victory-phase'];

  async finalize(gameId: number, shouldFinalizePlayers: boolean): Promise<[Game, Array<Player>, Array<TournamentRoundInvite>]> {
    const f = async (em: EntityManager) => {
      logger.debug('finalizing game %s', gameId);
      const event = await em.getRepository(GameEvent).findOneOrFail({
        where: {type: In(DBPersister.FINAL_EVENTS), gameId},
        order: {id: "DESC", dateCreated: "DESC"}
      });
      const game = await em.getRepository(Game).findOneOrFail({id: gameId});
      game.status = event.type === 'entered-defeat-phase' ? 'defeat' : 'victory';
      game.dateFinalized = this.sp.time.now();
      if (!shouldFinalizePlayers) {
        const res: [Game, Array<Player>, Array<TournamentRoundInvite>] = [await em.save(game), [], []];
        return res;
      }
      const players = await em.getRepository(Player).find({gameId});
      for (const p of players) {
        p.points = (event.payload as any)[p.role];
      }
      const invites = await em.createQueryBuilder()
        .from(TournamentRoundInvite, 'invite')
        .innerJoin('invite.tournamentRound', 'round')
        .innerJoin('round.games', 'game')
        .getMany();
      for (const invite of invites) {
        invite.hasParticipated = true;
      }
      const res = await Promise.all([em.save(game), em.save(players), em.save(invites)]);
      logger.debug('finalized game %s', gameId);
      return res;
    };
    if (this.em.queryRunner?.isTransactionActive) {
      return f(this.em);
    } else {
      return this.em.transaction(f);
    }
  }

  async sync() {
    await this.lock.runExclusive(async () => {
      const f = async (em: EntityManager) => {
        await this.em.getRepository(GameEvent)
          .createQueryBuilder()
          .insert()
          .values(this.pendingEvents)
          .execute();
        this.pendingEvents = [];
      };
      if (this.pendingEvents.length > 0) {
        logger.debug('syncing to db')
        if (this.em.queryRunner?.isTransactionActive) {
          await f(this.em);
        } else {
          await this.em.transaction(f);
        }
        logger.debug('synced to db')
      }
    })
  }

  async persist(events: Array<ge.GameEvent>, metadata: Metadata) {
    logger.debug('events: %o', events);
    const rawGameEvents = events.map(ge => toDBRawGameEvent(ge, metadata));
    await this.lock.runExclusive(async () => {
      for (const rawEvent of rawGameEvents) {
        this.pendingEvents.push(rawEvent);
      }
    });
  }
}
