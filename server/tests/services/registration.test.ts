import {
  RegistrationService,
} from "@port-of-mars/server/services/registration";
import {User} from "@port-of-mars/server/entity/User";
import {settings} from "@port-of-mars/server/settings";
import {Connection, createConnection, QueryRunner} from "typeorm";
import {ServiceProvider} from "@port-of-mars/server/services";
import {ServerError} from "@port-of-mars/server/util";

describe('a potential user', () => {
  const username = 'ahacker';
  let conn: Connection;
  let qr: QueryRunner;
  let sp: ServiceProvider;
  let registrationService: RegistrationService;

  beforeAll(async () => {
    conn = await createConnection('test');
    qr = conn.createQueryRunner();
    sp = new ServiceProvider(qr.manager);
    registrationService = sp.registration;
    await qr.connect();
    await qr.startTransaction();
  });

  it('can begin registration', async () => {
      const u = await sp.account.getOrCreateUser(username);
      expect(u.username).toEqual(username);
  });

  it('can submit their registration information', async () => {
    const email = 'a@foo.bar';
    const name = 'Alyssa P Hacker';
    await registrationService.submitRegistrationMetadata({ username, email, name });
    const u = await qr.manager.getRepository(User).findOneOrFail({username});
    expect(u.email).toBe(email);
    expect(u.name).toBe(name);
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

  afterAll(async () => {
    await qr.rollbackTransaction();
    await qr.release();
    await conn.close();
  })
});