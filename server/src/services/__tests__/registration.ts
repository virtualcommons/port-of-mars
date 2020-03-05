import {
  createRegistrationURL,
  sendEmailVerification,
  submitRegistrationMetadata,
  verifyUnregisteredUser
} from "@/services/registration";
import {getConnection} from "@/util";
import {User} from "@/entity/User";
import {settings} from "@/settings";
import {Connection, createConnection} from "typeorm";
import shell from "shelljs";
import {getOrCreateUser} from "@/services/account";

describe('a potential user', () => {
  const username = 'ahacker';
  let conn: Connection;

  beforeAll(async () => {
    shell.exec(`createdb -w -U marsmadness -h db pom_testing`);
    conn = await createConnection('test');
  });

  it('can begin registration', async () => {
    const u = await getOrCreateUser(username);
    expect(u.username).toEqual(username);
  });

  it('can submit their registration information', async () => {
    const email = 'a@foo.bar';
    const name = 'Alyssa P Hacker';
    await submitRegistrationMetadata({ username, email, name });
    const u = await getConnection().getRepository(User).findOneOrFail({username});
    expect(u.email).toBe(email);
    expect(u.name).toBe(name);
  });

  it('can be sent an email verification email', async () => {
    const u = await getConnection().getRepository(User).findOneOrFail({username});
    await sendEmailVerification(u);
    expect(settings.emailer.lastEmail?.from).toBe('Port of Mars <portmars@asu.edu>');
    expect(settings.emailer.lastEmail?.text).toContain(createRegistrationURL(u.registrationToken));
    expect(settings.emailer.lastEmail?.html).toContain(createRegistrationURL(u.registrationToken));
  });

  it('can verify their email using a verification token', async () => {
    let u = await getConnection().getRepository(User).findOneOrFail({username});
    await verifyUnregisteredUser(u);
    u = await getConnection().getRepository(User).findOneOrFail({username});
    expect(u.isVerified).toBeTruthy();
  });

  afterAll(async () => {
    await conn.close();
    shell.exec(`dropdb -w -U marsmadness -h db pom_testing`)
  })
});