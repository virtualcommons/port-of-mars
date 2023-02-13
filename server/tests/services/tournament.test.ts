import { TournamentRound } from "@port-of-mars/server/entity/TournamentRound";
import { Tournament } from "@port-of-mars/server/entity/Tournament";
import { Connection, EntityManager, QueryRunner } from "typeorm";
import { ServiceProvider } from "@port-of-mars/server/services";
import { TournamentRoundInvite } from "@port-of-mars/server/entity/TournamentRoundInvite";
import { createRound, createTournament, initTransaction, rollbackTransaction } from "./common";

describe.skip("first round", () => {
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

  describe("users", () => {
    it("can join if they've completed registration, passed the tutorial and not played any games this round", async () => {
      const bob = await services.account.getOrCreateUser({
        email: "bob@foo.com",
        passportId: "foo",
      });
      expect(await services.auth.checkUserHasTournamentInvite(bob.id, tr.id)).toBeFalsy();
      await services.registration.submitRegistrationMetadata(bob, {
        username: "bob",
        email: "bob@foo.com",
        name: "Bob",
      });
      expect(await services.auth.checkUserHasTournamentInvite(bob.id, tr.id)).toBeFalsy();
      // FIXME: invites are automatically created in submitRegistrationMetadata now for the first round of a tournament
      // we should test that an invite exists now since this is the first round of the Tournament

      await services.registration.verifyUnregisteredUser(bob, bob.registrationToken);
      expect(await services.auth.checkUserHasTournamentInvite(bob.id, tr.id)).toBeFalsy();

      await services.quiz.setUserQuizCompletion(bob.id, true);
      await services.tournament.createInvite(bob.id, tr.id);
      expect(await services.auth.checkUserHasTournamentInvite(bob.id, tr.id)).toBeTruthy();

      // workaround to avoid creating and finalizing a game
      const invite = await services.tournament.getActiveRoundInvite(bob.id);
      expect(invite).toBeDefined();
      if (invite) {
        invite.hasParticipated = true;
        await qr.manager.getRepository(TournamentRoundInvite).save(invite);
        expect(await services.auth.checkUserHasTournamentInvite(bob.id, tr.id)).toBeFalsy();
      }
    });
  });

  afterAll(async () => rollbackTransaction(conn, qr));
});

/*
describe('round list', () => {
  let conn: Connection;
  let qr: QueryRunner;
  let manager: EntityManager;
  let services: ServiceProvider;

  let t: Tournament;
  let tr1: TournamentRound;
  let tr2: TournamentRound;
  let g1users: Array<User>;
  let g2users: Array<User>;
  let persister: DBPersister;

  beforeAll(async () => {
    [conn, qr, manager] = await initTransaction();
    services = new ServiceProvider(qr.manager);
    t = await createTournament(services);
    tr1 = await createRound(services, {tournamentId: t.id});
    tr2 = await createRound(services, {roundNumber: 2, tournamentId: t.id});
    g1users = await createUsers(manager, 'bob', [1,2,3,4,5]);
    g2users = await createUsers(manager, 'adison', [1,2,3,4,5]);
    persister = new DBPersister(services);
  });
  
  afterAll(async () => rollbackTransaction(conn, qr));
});
*/
