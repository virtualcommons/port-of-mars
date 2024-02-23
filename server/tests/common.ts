import { EntityManager, QueryRunner } from "typeorm";
import { ServiceProvider } from "@port-of-mars/server/services";
import { Tournament, User } from "@port-of-mars/server/entity";
import { Client } from "colyseus";
import EventEmitter from "events";
import testDataSource from "@port-of-mars/server/datasource";

export async function initTransaction(): Promise<[QueryRunner, EntityManager]> {
  /**
   * sets up the test db datasource and returns a queryrunner and that queryrunner's manager
   * which should be used for interacting with the db in tests
   */
  // FIXME: we need to initialize the datasource + sync for each test suite
  // after already doing so in the test setup. may or may not be faster to
  // just setup once and run sequentially
  await testDataSource.initialize();
  await testDataSource.synchronize();
  const qr = testDataSource.createQueryRunner();
  await qr.startTransaction();
  const manager = qr.manager;
  return [qr, manager];
}

export async function rollbackTransaction(qr: QueryRunner) {
  await qr.rollbackTransaction();
  await qr.release();
  await testDataSource.destroy();
}

export async function createUsers(
  em: EntityManager,
  name: string,
  ids: Array<number>
): Promise<Array<User>> {
  const userRepo = em.getRepository(User);
  return await userRepo.save(
    userRepo.create(
      ids.map(id => ({
        name: `${name}${id}`,
        username: `${name}${id}`,
        email: `${name}${id}@bar.com`,
      }))
    )
  );
}

export async function createTournament(
  sp: ServiceProvider,
  data?: { name?: string; active?: boolean }
): Promise<Tournament> {
  const d = {
    name: "example",
    active: true,
    minNumberOfGameRounds: 10,
    maxNumberOfGameRounds: 15,
    description: "",
    ...data,
  };
  return await sp.tournament.createTournament(d);
}

export async function createRound(
  sp: ServiceProvider,
  data: { roundNumber?: number; tournamentId: number; introSurveyUrl?: string }
) {
  const d = {
    exitSurveyUrl: "",
    introSurveyUrl: "",
    startDate: new Date("1970 01 01"),
    endDate: new Date("1970 01 03"),
    roundNumber: 1,
    numberOfGameRounds: 10,
    ...data,
  };
  return await sp.tournament.createRound(d);
}

export async function createTournamentRoundInvites(
  sp: ServiceProvider,
  data: { userIds: Array<number>; tournamentRoundId: number }
) {
  return await sp.tournament.createInvites(data.userIds, data.tournamentRoundId);
}

export function mockColyseusClients(name: string, ids: number[]): Client[] {
  return ids.map(id => {
    return {
      readyState: 1,
      id: `${id}`,
      sessionId: `session${id}`,
      state: {} as any,
      ref: new EventEmitter(),
      auth: { username: `${name}${id}`, id },
      raw: () => {},
      enqueueRaw: () => {},
      send: () => {},
      error: () => {},
      leave: () => {},
      close: () => {},
      _afterNextPatchQueue: [],
    };
  });
}
