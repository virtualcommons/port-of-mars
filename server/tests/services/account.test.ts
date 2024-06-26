import { AccountService } from "@port-of-mars/server/services/account";
import { User, Tournament } from "@port-of-mars/server/entity";
import { settings } from "@port-of-mars/server/settings";
import { EntityManager, QueryRunner } from "typeorm";
import { ServiceProvider } from "@port-of-mars/server/services";
import { ServerError } from "@port-of-mars/server/util";
import { createTournament, initTransaction, rollbackTransaction } from "../common";

describe("a potential user", () => {
  const username = "ahacker";
  let qr: QueryRunner;
  let manager: EntityManager;
  let sp: ServiceProvider;
  let t: Tournament;
  // let tr: TournamentRound;
  let accountService: AccountService;

  beforeAll(async () => {
    [qr, manager] = await initTransaction();
    sp = new ServiceProvider(manager);
    t = await createTournament(sp);
    // tr = await createRound(sp, { tournamentId: t.id });
    accountService = sp.account;
  });

  it("can begin registration", async () => {
    const email = "a@foo.bar";
    const u = await sp.account.getOrCreateUser({ email, passportId: "12345" });
    expect(u.email).toEqual(email);
  });

  it("with an old account (no passportId) can register", async () => {
    const email = "alice@foo.bar";
    const oldUser = await sp.account.getOrCreateUser({ email });
    const newUser = await sp.account.getOrCreateUser({ email, passportId: "54321" });
    expect(newUser).toEqual(oldUser);
  });

  it("rejects updating profile with an invalid username", async () => {
    const user = await sp.account.getOrCreateUser({ email: "john@rick.com", passportId: "99999" });
    await expect(
      accountService.validateUserProfile(user, {
        username: "@john",
        email: "john@rick.com",
        name: "John Rick",
      })
    ).rejects.toThrowError(ServerError);
  });

  it("rejects updating profile with an invalid email", async () => {
    const user = await sp.account.getOrCreateUser({
      email: "mikayla@mail.com",
      passportId: "99999",
    });
    await expect(
      accountService.validateUserProfile(user, {
        username: "mbs_1959",
        email: "mikayla@mail",
        name: "",
      })
    ).rejects.toThrowError(ServerError);
  });

  it("can update profile information", async () => {
    const email = "a@foo.bar";
    const name = "Alyssa P Hacker";
    const user = await sp.account.getOrCreateUser({ email, passportId: "67890" });
    const newEmail = "b@bar.foo";
    await accountService.updateProfile(user, {
      username,
      email: newEmail,
      name: name,
    });
    expect(user.email).toBe(newEmail);
    expect(user.name).toBe(name);
    expect(user.username).toBe(username);
  });

  it("can be sent an email verification email", async () => {
    const u = await qr.manager.getRepository(User).findOneByOrFail({ username });
    await accountService.sendEmailVerification(u);
    expect(settings.emailer.lastEmail?.from).toBe("Port of Mars <portmars@asu.edu>");
    expect(settings.emailer.lastEmail?.text).toContain(
      accountService.createVerificationUrl(u.registrationToken)
    );
    expect(settings.emailer.lastEmail?.html).toContain(
      accountService.createVerificationUrl(u.registrationToken)
    );
  });

  it("can verify their email using a valid verification token", async () => {
    let u = await qr.manager.getRepository(User).findOneByOrFail({ username });

    await expect(
      accountService.verifyUnregisteredUser(u, "invalid-registration-token")
    ).rejects.toThrow(`Invalid registration token invalid-registration-token`);

    await accountService.verifyUnregisteredUser(u, u.registrationToken);
    u = await qr.manager.getRepository(User).findOneByOrFail({ username });
    expect(u.isVerified).toBeTruthy();
  });

  it("rejects user verification using an invalid verification token", async () => {
    const u = await qr.manager.getRepository(User).findOneByOrFail({ username });
    await expect(
      accountService.verifyUnregisteredUser(u, "invalid-registration-token")
    ).rejects.toThrowError(ServerError);
  });
  afterAll(async () => rollbackTransaction(qr));
});
