import { ChatReport, User } from "@port-of-mars/server/entity";
import { MoreThan, IsNull, Not, In, Repository, UpdateResult } from "typeorm";
import validator from "validator";
import { settings } from "@port-of-mars/server/settings";
import { BaseService } from "@port-of-mars/server/services/db";
import {
  generateUsername,
  ServerError,
  toClientSafeUser,
  ValidationError,
} from "@port-of-mars/server/util";
import {
  ModerationActionType,
  BAN,
  MUTE,
  ClientSafeUser,
  ProfileData,
} from "@port-of-mars/shared/types";

const logger = settings.logging.getLogger(__filename);

export class AccountService extends BaseService {
  getRepository(): Repository<User> {
    return this.em.getRepository(User);
  }

  isRegisteredAndValid(user: User): boolean {
    return !!user.isVerified && !!user.email && !!user.isActive;
  }

  async getTotalRegisteredUsers(): Promise<number> {
    return await this.getRepository().count({
      where: { isActive: true, isVerified: true },
    });
  }

  async getTotalBannedUsers(): Promise<number> {
    return await this.getRepository().count({
      where: { isBanned: true },
    });
  }

  async getTotalReportedUsers(): Promise<{ resolved: number; unresolved: number }> {
    return {
      resolved: await this.em.getRepository(ChatReport).count({
        where: { resolved: true },
      }),
      unresolved: await this.em.getRepository(ChatReport).count({
        where: { resolved: false },
      }),
    };
  }

  async setAdminByUsername(username: string): Promise<User> {
    const user = await this.findByUsername(username);
    user.isAdmin = true;
    return await this.getRepository().save(user);
  }

  async setName(userId: number, name: string): Promise<User> {
    const user = await this.findUserById(userId);
    user.name = name;
    return await this.getRepository().save(user);
  }

  async muteOrBanByUsername(username: string, action: ModerationActionType): Promise<User> {
    const user = await this.findByUsername(username);
    if (action === MUTE) {
      user.isMuted = true;
      user.muteStrikes++;
    } else if (action === BAN) {
      user.isBanned = true;
    }
    return await this.getRepository().save(user);
  }

  async unmuteOrUnbanByUsername(username: string, action: ModerationActionType): Promise<User> {
    const user = await this.findByUsername(username);
    if (action === MUTE) {
      user.isMuted = false;
      user.muteStrikes = Math.max(0, user.muteStrikes - 1);
    } else if (action === BAN) {
      user.isBanned = false;
    }
    return await this.getRepository().save(user);
  }

  async expireMute(username: string): Promise<User> {
    // unapply mute without decrementing mute strikes
    const user = await this.findByUsername(username);
    user.isMuted = false;
    return await this.getRepository().save(user);
  }

  async decrementMuteStrikes(username: string): Promise<User> {
    const user = await this.findByUsername(username);
    user.muteStrikes = Math.max(0, user.muteStrikes - 1);
    return await this.getRepository().save(user);
  }

  async unbanByUsername(username: string): Promise<User> {
    const user = await this.findByUsername(username);
    user.isBanned = false;
    return await this.getRepository().save(user);
  }

  async getBannedUsers(): Promise<Array<User>> {
    return await this.getRepository().find({
      where: { isBanned: true },
    });
  }

  async findByUsername(username: string): Promise<User> {
    return await this.getRepository().findOneByOrFail({ username });
  }

  async findUsers(usernames: Array<string>): Promise<Array<User>> {
    return await this.getRepository().find({
      where: {
        username: In(usernames),
      },
    });
  }

  async isEmailAvailable(user: User, email: string): Promise<boolean> {
    const otherUser = await this.getRepository().findOneBy({ email });
    if (otherUser) {
      return otherUser.id === user.id;
    }
    return true;
  }

  async isUsernameAvailable(username: string, user?: User): Promise<boolean> {
    const otherUser = await this.getRepository().findOneBy({ username });
    if (otherUser) {
      if (!user) {
        return false;
      }
      return otherUser.id === user.id;
    }
    return true;
  }

  async getActiveUsers(after: Date): Promise<Array<User>> {
    return await this.getRepository().find({
      select: {
        name: true,
        email: true,
        username: true,
        dateCreated: true,
      },
      where: {
        isActive: true,
        email: Not(IsNull()),
        dateCreated: MoreThan(after),
      },
    });
  }

  async getActiveEmails(after: Date): Promise<Array<string>> {
    const users: Array<User> = await this.getActiveUsers(after);
    return users.map(u => u.email ?? "");
  }

  async deactivateUsers(emails: Array<string>): Promise<number> {
    const repository = this.getRepository();
    const users = await repository.find({
      where: {
        email: In(emails),
      },
    });
    for (const u of users) {
      u.isActive = false;
    }
    await repository.save(users);
    return users.length;
  }

  async findUserById(id: number): Promise<User> {
    return await this.getRepository().findOneByOrFail({ id });
  }

  async denyConsent(id: number): Promise<ClientSafeUser> {
    const repo = this.getRepository();
    const user = await repo.findOneByOrFail({ id });
    user.dateConsented = undefined;
    await repo.save(user);
    return toClientSafeUser(user);
  }

  async grantConsent(id: number): Promise<ClientSafeUser> {
    const repo = this.getRepository();
    const user = await repo.findOneByOrFail({ id });
    user.dateConsented = new Date();
    await repo.save(user);
    return toClientSafeUser(user);
  }

  async setLastPlayerIp(id: number, ip: string): Promise<UpdateResult> {
    return await this.getRepository().update(id, { lastPlayerIp: ip });
  }

  async validateUserProfile(user: User, profileData: ProfileData): Promise<void> {
    const isEmailAvailable = await this.isEmailAvailable(user, profileData.email);
    const isUsernameAvailable = await this.isUsernameAvailable(profileData.username, user);
    if (!isEmailAvailable) {
      throw new ValidationError({
        displayMessage: `The email ${profileData.email} is already taken. Please try another one.`,
      });
    }
    if (!isUsernameAvailable) {
      throw new ValidationError({
        displayMessage: `The username ${profileData.username} is already taken. Please try another one.`,
      });
    }
    if (!validator.isEmail(profileData.email)) {
      throw new ValidationError({
        displayMessage: `Please enter a valid email address.`,
      });
    }
    if (!validator.isLength(profileData.username, { min: 1, max: 30 })) {
      throw new ValidationError({
        displayMessage: `Please choose a username between 1 and 30 characters long`,
      });
    }
    if (!validator.isAlphanumeric(profileData.username, "en-US", { ignore: "_" })) {
      throw new ValidationError({
        displayMessage: `Please choose a username with only letters, numbers and underscores`,
      });
    }
  }

  async updateProfile(user: User, profileData: ProfileData): Promise<ClientSafeUser> {
    const repo = this.em.getRepository(User);
    user.username = profileData.username;
    user.name = profileData.name;
    if (user.email && profileData.email && user.email !== profileData.email) {
      user.email = profileData.email;
      user.isVerified = false;
    }
    user.dateConsented = new Date();
    const updatedUser = await repo.save(user);
    logger.debug("updated profile data for user %o", profileData);
    if (!user.isVerified) {
      await this.sendEmailVerification(user);
    }
    return toClientSafeUser(updatedUser);
  }

  createVerificationUrl(registrationToken: string) {
    // FIXME: depends on VueRouter hash mode
    return `${settings.host}/#/verify/${registrationToken}`;
  }

  async sendEmailVerification(u: User): Promise<void> {
    if (!u.email) {
      logger.warn("Trying to send email verification to a user with no email.");
      return;
    }
    const verificationUrl = this.createVerificationUrl(u.registrationToken);
    settings.emailer.sendMail(
      {
        from: `Port of Mars <${settings.supportEmail}>`,
        to: u.email,
        bcc: settings.supportEmail,
        subject: "[Port of Mars] Verify your email",
        // FIXME: convert these to a server-side template
        text: `Greetings! Someone signed this email address up (${u.email}) to participate in the Port of Mars.
      If this was you, please complete your registration by going to ${verificationUrl} and clicking on the "Verify" button.
      If you did not request this, there is no need to take any action and you can safely ignore this message.

      Thanks for participating!
      the Port of Mars team`,
        html: `Greetings!
      <p>Someone signed this email address up (${u.email}) to participate in the Port of Mars.
      If this was you, please complete your registration by <a href='${verificationUrl}'>going to ${verificationUrl}</a> 
      and clicking on the "Verify" button.</p>
      <p>If you did not request this, there is no need to take any action and you can safely ignore this message.</p>

      <p>
      Thanks for participating!
      </p>
      the Port of Mars team`,
      },
      function (err, info) {
        if (err) {
          logger.warn(`error : $err`);
          throw new ServerError(err);
        } else {
          logger.info(`Successfully sent? %o`, info);
        }
      }
    );
    return;
  }

  async findUnregisteredUserByRegistrationToken(registrationToken: string): Promise<User | null> {
    return await this.em.getRepository(User).findOneBy({ registrationToken });
  }

  async verifyUnregisteredUser(u: User, registrationToken: string): Promise<UpdateResult> {
    let r: UpdateResult;
    if (!validator.isUUID(registrationToken)) {
      throw new ServerError({
        code: 400,
        message: `Invalid registration token ${registrationToken}`,
        displayMessage: `Sorry, your registration token does not appear to be valid. Please try to verify your account again and contact us if this continues.`,
      });
    }
    try {
      r = await this.em
        .getRepository(User)
        .update({ id: u.id, registrationToken }, { isVerified: true });
    } catch (e) {
      logger.fatal(
        "error while updating user %s registration token %s",
        u.username,
        registrationToken
      );
      throw new ServerError({
        code: 400,
        error: e as Error,
        message: `Invalid user and registration token ${u.username}, ${registrationToken}`,
        displayMessage: `Sorry, your registration token ${registrationToken} does not appear to be valid. Please try to verify your account again and contact us if this continues.`,
      });
    }
    if (r.affected !== 1) {
      logger.debug("affected more than one row in registration update: %s", u.username);
      throw new ServerError({
        code: 404,
        message: `Invalid user and registration token ${u.username}, ${registrationToken}`,
        displayMessage: `Sorry, your registration token does not appear to be valid. Please try to verify your account again and contact us if this continues.`,
      });
    }
    return r;
  }

  async getOrCreateTestUser(username: string, shouldSkipVerification = true): Promise<User> {
    let user = await this.getRepository().findOneBy({ username });
    if (!user) {
      user = new User();
      user.username = username;
      user.name = "";
      user.email = `${username}@email.com`;
      logger.info("getOrCreateTestUser: not found, creating test user %s", user.username);
    } else {
      logger.info("getOrCreateTestUser: test user %s exists", user.username);
    }
    // test user, set fake data so they can immediately join a game
    if (shouldSkipVerification) {
      user.dateConsented = new Date();
      user.isVerified = true;
    }
    await this.getRepository().save(user);
    return user;
  }

  async getOrCreateUser(userData: {
    email: string;
    passportId?: string;
    name?: string;
    username?: string;
  }): Promise<User> {
    let user: User | null;
    // try to find user by id
    if (userData.passportId) {
      user = await this.getRepository().findOneBy({ passportId: userData.passportId });
    }
    // if no id or find by id turned up empty, try to find user by email
    if (!userData.passportId || !user) {
      user = await this.getRepository().findOneBy({ email: userData.email });
    }
    if (!user) {
      user = new User();
      user.email = userData.email;
      user.passportId = userData.passportId ?? "";
      user.username = userData.username || (await generateUsername());
      user.name = userData.name || "";
      user.isSystemBot = false;
      logger.info("getOrCreateUser: not found, creating user %s", user.username);
      await this.getRepository().save(user);
    } else {
      logger.info("getOrCreateUser: user %s exists", user.username);
    }
    return user;
  }

  async getOrCreateBotUsers(requiredNumberOfBots: number): Promise<Array<User>> {
    const bots = await this.getRepository().find({
      where: { isSystemBot: true },
      take: requiredNumberOfBots,
    });
    const numberOfBotsToCreate = requiredNumberOfBots - bots.length;
    if (numberOfBotsToCreate > 0) {
      for (let i = 0; i < numberOfBotsToCreate; i++) {
        const bot = new User();
        bot.username = await generateUsername();
        bot.name = `robot ${bot.username}`;
        bot.isSystemBot = true;
        await this.getRepository().save(bot);
        bots.push(bot);
      }
    }
    return bots;
  }
}
