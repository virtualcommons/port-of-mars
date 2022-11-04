import {RegistrationService} from "@port-of-mars/server/services/registration";
import {User, Tournament, TournamentRound} from "@port-of-mars/server/entity";
import {settings} from "@port-of-mars/server/settings";
import {Connection, EntityManager, QueryRunner} from "typeorm";
import {ServiceProvider} from "@port-of-mars/server/services";
import {ServerError} from "@port-of-mars/server/util";
import {createRound, createTournament, initTransaction, rollbackTransaction} from "./common";

describe('a potential user', () => {
  const username = 'ahacker';
  let conn: Connection;
  let qr: QueryRunner;
  let manager: EntityManager;
  let sp: ServiceProvider;
  let t: Tournament;
  let tr: TournamentRound;
  let registrationService: RegistrationService;

  beforeAll(async () => {
    [conn, qr, manager] = await initTransaction();
    sp = new ServiceProvider(qr.manager);
    t = await createTournament(sp);
    tr = await createRound(sp, {tournamentId: t.id});
    registrationService = sp.registration;
  });

  it('can begin registration', async () => {
      const u = await sp.account.getOrCreateUser("foo", username);
      expect(u.username).toEqual(username);
  });

  it('can submit their registration information', async () => {
    const email = 'a@foo.bar';
    const name = 'Alyssa P Hacker';
    const user = await sp.account.getOrCreateUser("foo", username);
    await registrationService.submitRegistrationMetadata(user, { username, email, name });
    expect(user.email).toBe(email);
    expect(user.name).toBe(name);
  });

  it('can be sent an email verification email', async () => {
    const u = await qr.manager.getRepository(User).findOneOrFail({username});
    await registrationService.sendEmailVerification(u);
    expect(settings.emailer.lastEmail?.from).toBe('Port of Mars <portmars@asu.edu>');
    expect(settings.emailer.lastEmail?.text).toContain(registrationService.createVerificationUrl(u.registrationToken));
    expect(settings.emailer.lastEmail?.html).toContain(registrationService.createVerificationUrl(u.registrationToken));
  });

  it('can verify their email using a valid verification token', async () => {
    let u = await qr.manager.getRepository(User).findOneOrFail({username});

    await expect(registrationService.verifyUnregisteredUser(u, 'invalid-registration-token')
    ).rejects.toThrow(`Invalid registration token invalid-registration-token`);
    
    await registrationService.verifyUnregisteredUser(u, u.registrationToken);
    u = await qr.manager.getRepository(User).findOneOrFail({username});
    expect(u.isVerified).toBeTruthy();
  });

  it('rejects user verification using an invalid verification token', async () => {
    const u = await qr.manager.getRepository(User).findOneOrFail({username});
    await expect(registrationService.verifyUnregisteredUser(u, 'invalid-registration-token')).rejects.toThrowError(ServerError);
  });
  afterAll(async () => rollbackTransaction(conn, qr));
});