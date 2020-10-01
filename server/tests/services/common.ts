import {Connection, createConnection, EntityManager, QueryRunner} from "typeorm";
import {ServiceProvider} from "@port-of-mars/server/services";
import {Tournament, User} from "@port-of-mars/server/entity";

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
    numberOfGameRounds: 10,
    ...data
  };
  return await sp.tournament.createRound(d);
}

export async function createTournamentRoundInvites(sp: ServiceProvider, data: { userIds: Array<number>; tournamentRoundId: number }) {
  return await sp.tournament.createInvites(data.userIds, data.tournamentRoundId);
}