import {TournamentRound} from "@port-of-mars/server/entity/TournamentRound";
import {Tournament} from "@port-of-mars/server/entity/Tournament";
import {Connection, EntityManager, QueryRunner} from "typeorm";
import {ServiceProvider} from "@port-of-mars/server/services";
import {TournamentRoundInvite} from "@port-of-mars/server/entity/TournamentRoundInvite";
import {createRound, createTournament, createUsers, initTransaction, rollbackTransaction} from "./common";
import {User} from "@port-of-mars/server/entity";
import {DBPersister} from "@port-of-mars/server/services/persistence";

describe('first round', () => {
  let conn: Connection;
  let qr: QueryRunner;
  let manager: EntityManager;
  let services: ServiceProvider;

  let t: Tournament;
  let tr: TournamentRound;

  beforeAll(async () => {
    [conn, qr, manager] = await initTransaction();
    services = new ServiceProvider(qr.manager);
    t = await createTournament(services);
    tr = await createRound(services, {tournamentId: t.id})
  });

  it('can be created', async () => {
    expect(tr.tournamentId).toEqual(t.id);
  });

  describe('users', () => {
    it('can join if they\'ve completed registration, passed the tutorial and not played any games this round', async () => {
      const bob = await services.account.getOrCreateUser('bob');
      expect(await services.auth.checkUserCanPlayGame(bob.id, tr.id)).toBeFalsy();

      await services.registration.submitRegistrationMetadata({username: 'bob', email: 'bob@foo.com', name: 'Bob'});
      expect(await services.auth.checkUserCanPlayGame(bob.id, tr.id)).toBeFalsy();

      await services.registration.verifyUnregisteredUser(bob, bob.registrationToken);
      expect(await services.auth.checkUserCanPlayGame(bob.id, tr.id)).toBeFalsy();

      await services.quiz.setUserQuizCompletion(bob.id, true);
      expect(await services.auth.checkUserCanPlayGame(bob.id, tr.id)).toBeFalsy();

      const invites = await services.tournament.createInvites([bob.id], tr.id);
      expect(await services.auth.checkUserCanPlayGame(bob.id, tr.id)).toBeTruthy();

      await services.quiz.setUserQuizCompletion(bob.id, true);
      expect(await services.auth.checkUserCanPlayGame(bob.id, tr.id)).toBeTruthy();

      // Don't want to have to create game and finalize it so this is a work around
      const invite = invites[0];
      invite.hasParticipated = true;
      await qr.manager.getRepository(TournamentRoundInvite).save(invite);
      expect(await services.auth.checkUserCanPlayGame(bob.id, tr.id)).toBeFalsy();
    });
  });

  afterAll(async () => rollbackTransaction(conn, qr));
});

describe('round round list', () => {
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