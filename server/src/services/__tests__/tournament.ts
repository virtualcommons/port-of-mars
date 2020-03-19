import {TournamentRound} from "@port-of-mars/server/entity/TournamentRound";
import {Tournament} from "@port-of-mars/server/entity/Tournament";
import {Connection, createConnection, EntityManager, getConnection, QueryRunner} from "typeorm";
import {TournamentService} from "@port-of-mars/server/services/tournament";
import {RegistrationService} from "@port-of-mars/server/services/registration";
import {User} from "@port-of-mars/server/entity/User";
import {AccountService} from "@port-of-mars/server/services/account";
import {AuthService} from "@port-of-mars/server/services/auth";
import {ServiceProvider} from "@port-of-mars/server/services";
import {TournamentRoundInvite} from "@port-of-mars/server/entity/TournamentRoundInvite";

describe('first round', () => {
  let conn: Connection;
  let qr: QueryRunner;
  let services: ServiceProvider;

  let tournament: Tournament;
  let round: TournamentRound;

  beforeAll(async () => {
    conn = await createConnection('test');
    qr = conn.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    services = new ServiceProvider(qr.manager);

    tournament = await services.tournament.createTournament({
      name: 'main',
      active: true
    });
    round = await services.tournament.createRound({
      tournamentId: tournament.id,
      startDate: new Date('September 1, 2020'),
      endDate: new Date('September 2, 2020'),
      roundNumber: 1
    });
  });

  it('can be created', async () => {
    expect(round.tournamentId).toEqual(tournament.id);
  });

  describe('users', () => {
    it('can join if they\'ve completed registration, passed the tutorial and not played any games this round', async () => {
      const bob = await services.account.getOrCreateUser('bob');
      expect(await services.auth.checkUserCanPlayGame(bob.id, round.id)).toBeFalsy();

      await services.registration.submitRegistrationMetadata({username: 'bob', email: 'bob@foo.com', name: 'Bob'});
      expect(await services.auth.checkUserCanPlayGame(bob.id, round.id)).toBeFalsy();

      await services.registration.verifyUnregisteredUser(bob);
      expect(await services.auth.checkUserCanPlayGame(bob.id, round.id)).toBeFalsy();

      await services.quiz.setUserQuizCompletion(bob.id, true);
      expect(await services.auth.checkUserCanPlayGame(bob.id, round.id)).toBeFalsy();

      const invites = await services.registration.createInvites([bob.id], round.id);
      expect(await services.auth.checkUserCanPlayGame(bob.id, round.id)).toBeTruthy();

      await services.quiz.setUserQuizCompletion(bob.id, true);
      expect(await services.auth.checkUserCanPlayGame(bob.id, round.id)).toBeTruthy();

      // Don't want to have to create game and finalize it so this is a work around
      const invite = invites[0];
      invite.hasParticipated = true;
      await qr.manager.getRepository(TournamentRoundInvite).save(invite);
      expect(await services.auth.checkUserCanPlayGame(bob.id, round.id)).toBeFalsy();
    });
  });

  afterAll(async () => {
    await qr.rollbackTransaction();
    await qr.release();
    await conn.close();
  })
});

// describe('subsequent rounds', () => {
//   it('can be created');
//
//   describe('users', () => {
//     it('can join if they\'ve completed registration, passed the tutorial and not played any games this round');
//     it('cannot join if they haven\'t completed registration');
//     it('cannot join if they haven\'t passed the tutorial');
//     it('cannot join if they\'ve played any games this round');
//     it('are added to the invite list after being assigned to a game')
//   });
//
//   it('can be finalized', () => {
//
//   })
// });