import {Connection, createConnection, EntityManager, QueryRunner} from "typeorm";
import { getConnection } from "@port-of-mars/server/util";
import {ServiceProvider} from "@port-of-mars/server/services";
import {Tournament, TournamentRound, User} from "@port-of-mars/server/entity";
import {DBPersister} from "@port-of-mars/server/services/persistence";
import {GameOpts, Persister} from "@port-of-mars/server/rooms/game/types";
import * as assert from "assert";
import {ROLES} from "@port-of-mars/shared/types";

export async function initTransaction(): Promise<[Connection, QueryRunner, EntityManager]> {
  const conn = await createConnection('test');
  const qs = conn.createQueryRunner();
  await qs.startTransaction();
  const manager = qs.manager;
  return [
    conn,
    qs,
    manager,
  ]
}

export async function rollbackTransaction(conn: Connection, qs: QueryRunner) {
  await qs.rollbackTransaction();
  await qs.release();
  await conn.close();
}

export async function createUsers(em: EntityManager, name: string, ids: Array<number>): Promise<Array<User>> {
  const userRepo = em.getRepository(User);
  return await userRepo.save(userRepo.create(ids.map(id => ({
    name: `${name}${id}`,
    username: `${name}${id}`,
    email: `${name}${id}@bar.com`
  }))));
}

export async function createTournament(sp: ServiceProvider, data?: { name?: string; active?: boolean }): Promise<Tournament> {
  const d = {
    name: 'example',
    active: true,
    ...data
  };
  return await sp.tournament.createTournament(d);
}

export async function createRound(sp: ServiceProvider, data: { roundNumber?: number; tournamentId: number }) {
  const d = {
    exitSurveyUrl: '',
    introSurveyUrl: '',
    startDate: new Date('1970 01 01'),
    endDate: new Date('1970 01 03'),
    roundNumber: 1,
    ...data
  };
  return await sp.tournament.createRound(d);
}

