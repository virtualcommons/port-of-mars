import * as assert from "assert";
import { Mutex } from "async-mutex";
import { EntityManager, In } from "typeorm";
import _ from "lodash";

import { Game, GameEvent, Player, TournamentRoundInvite, User } from "@port-of-mars/server/entity";
import * as ge from "@port-of-mars/server/rooms/game/events/types";
import { GameOpts, Metadata, Persister } from "@port-of-mars/server/rooms/game/types";
import { getServices, ServiceProvider } from "@port-of-mars/server/services/index";
import { getLogger } from "@port-of-mars/server/settings";
import { BUILD_ID } from "@port-of-mars/shared/settings";

const logger = getLogger(__filename);

function toDBRawGameEvent(gameEvent: ge.GameEvent, metadata: Metadata) {
  const ev = gameEvent.serialize();
  return {
    ...ev,
    ...metadata,
  };
}

export function toDBGameEvent(gameEvent: ge.GameEvent, metadata: Metadata) {
  const dbRawGameEvent = toDBRawGameEvent(gameEvent, metadata);
  const dbGameEvent = new GameEvent();
  Object.assign(dbGameEvent, dbRawGameEvent);
  return dbGameEvent;
}

export type PendingEvent = Omit<{ [k in keyof GameEvent]: GameEvent[k] }, "id" | "game">;

export class DBPersister implements Persister {
  pendingEvents: Array<PendingEvent> = [];
  lock: Mutex = new Mutex();

  constructor(public _sp?: ServiceProvider) {}

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
    const rawUsers = await userRepo.find({
      select: ["id", "username", "lastPlayerIp"],
      where: {
        username: In(usernames),
      },
    });
    /*
    const q = await userRepo.createQueryBuilder('user')
      .select('id')
      .addSelect('username')
      .addSelect('user.lastPlayerIp')
      .where('user.username IN (:...usernames)', {usernames});
    const rawUsers = await q.getRawMany();
    */

    assert.equal(rawUsers.length, usernames.length);
    return rawUsers;
  }

  async createPlayers(
    em: EntityManager,
    gameId: number,
    userRoles: GameOpts["userRoles"],
    rawUsers: Array<User>
  ): Promise<Array<Player>> {
    const players = [];
    for (const ru of rawUsers) {
      const p = {
        userId: ru.id,
        role: userRoles[ru.username],
        gameId,
        playerIp: ru.lastPlayerIp,
      };
      players.push(p);
    }
    const pu = em.getRepository(Player);
    return await pu.save(pu.create(players));
  }

  async initialize(options: GameOpts, roomId: string, shouldCreatePlayers = true): Promise<number> {
    logger.debug("initializing game %s", roomId);
    const game = new Game();
    const f = async (em: EntityManager) => {
      if (_.isNull(options.tournamentRoundId)) {
        throw new Error("could not find matching tournament round");
      }
      game.buildId = BUILD_ID;
      game.tournamentRoundId = options.tournamentRoundId;
      game.roomId = roomId;
      game.type = options.type;
      if (options.treatmentId) {
        game.treatmentId = options.treatmentId;
      }
      await em.save(game);

      if (shouldCreatePlayers) {
        const rawUsers = await this.selectUsersByUsername(em, Object.keys(options.userRoles));
        await this.createPlayers(em, game.id, options.userRoles, rawUsers);
      }

      return game.id;
    };
    if (this.em.queryRunner?.isTransactionActive) {
      return await f(this.em);
    } else {
      return await this.em.transaction(f);
    }
  }

  static FINAL_EVENTS = ["entered-defeat-phase", "entered-victory-phase"];

  async finalize(gameId: number, shouldFinalizePlayers: boolean): Promise<[Game, Array<Player>]> {
    const f = async (em: EntityManager) => {
      logger.debug("finalizing game %d", gameId);
      const event = await em.getRepository(GameEvent).findOneOrFail({
        where: { type: In(DBPersister.FINAL_EVENTS), gameId },
        order: { id: "DESC", dateCreated: "DESC" },
      });
      const game = await em.getRepository(Game).findOneByOrFail({ id: gameId });
      game.status = event.type === "entered-defeat-phase" ? "defeat" : "victory";
      game.dateFinalized = this.sp.time.now();
      if (!shouldFinalizePlayers) {
        const res: [Game, Array<Player>] = [await em.save(game), []];
        return res;
      }
      const players = await em.getRepository(Player).findBy({ gameId });
      for (const p of players) {
        p.points = (event.payload as any)[p.role];
      }

      const userIds = players.map(p => p.userId);
      logger.debug("Finalizing invites and setting hasParticipated for users: %o", userIds);
      await em
        .createQueryBuilder()
        .update(TournamentRoundInvite)
        .set({ hasParticipated: true })
        .where("tournamentRoundId = :tournamentRoundId", {
          tournamentRoundId: game.tournamentRoundId,
        })
        .andWhere("userId in (:...userIds)", { userIds })
        .execute();

      const res = await Promise.all([em.save(game), em.save(players)]);
      logger.debug("finalized game %d", gameId);
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
      const f = async () => {
        await this.em
          .getRepository(GameEvent)
          .createQueryBuilder()
          .insert()
          .values(this.pendingEvents)
          .execute();
        this.pendingEvents = [];
      };
      if (this.pendingEvents.length > 0) {
        logger.trace("syncing to db");
        if (this.em.queryRunner?.isTransactionActive) {
          await f();
        } else {
          await this.em.transaction(f);
        }
        logger.trace("synced to db");
      }
    });
  }

  async persist(events: Array<ge.GameEvent>, metadata: Metadata) {
    logger.debug("events: %o", events);
    const rawGameEvents = events.map(ge => toDBRawGameEvent(ge, metadata));
    await this.lock.runExclusive(async () => {
      for (const rawEvent of rawGameEvents) {
        this.pendingEvents.push(rawEvent);
      }
    });
  }
}
