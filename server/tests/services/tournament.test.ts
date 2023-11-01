import { TournamentRound } from "@port-of-mars/server/entity/TournamentRound";
import { Tournament } from "@port-of-mars/server/entity/Tournament";
import { Connection, EntityManager, QueryRunner } from "typeorm";
import { ServiceProvider } from "@port-of-mars/server/services";
import { createRound, createTournament, initTransaction, rollbackTransaction } from "../common";

describe("a tournament round", () => {
  let conn: Connection;
  let qr: QueryRunner;
  let _manager: EntityManager;
  let services: ServiceProvider;

  let t: Tournament;
  let tr: TournamentRound;

  beforeAll(async () => {
    [conn, qr, _manager] = await initTransaction();
    services = new ServiceProvider(qr.manager);
    t = await createTournament(services);
    tr = await createRound(services, { tournamentId: t.id });
  });

  it("can be created", async () => {
    expect(tr.tournamentId).toEqual(t.id);
  });

  // FIXME: add tests for invitation, survey, etc. logic

  afterAll(async () => rollbackTransaction(conn, qr));
});
