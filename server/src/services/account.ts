import { User } from "@port-of-mars/server/entity";
import { UpdateResult, Repository } from "typeorm"
import { settings } from "@port-of-mars/server/settings";
import { BaseService } from "@port-of-mars/server/services/db";

const logger = settings.logging.getLogger(__filename);

export class AccountService extends BaseService {
  getRepository(): Repository<User> {
    return this.em.getRepository(User);
  }

  isRegisteredAndValid(user: User): boolean {
    return !!user.isVerified && !!user.email;
  }

  async findByUsername(username: string): Promise<User> {
    return await this.getRepository().findOneOrFail({ username })
  }

  async findUserById(id: number): Promise<User> {
    return await this.getRepository().findOneOrFail(id);
  }

  async denyConsent(id: number): Promise<UpdateResult> {
    return await this.getRepository().update(id, { dateConsented: undefined });
  }

  async getOrCreateTestUser(username: string): Promise<User> {
    const user = await this.getOrCreateUser(username);
    // test user, set fake data so they can immediately join a game
    user.email = `${username}@mailinator.com`;
    // user.dateConsented = new Date();
    user.isVerified = true;
    user.passedQuiz = true;
    user.name = `Test User ${username}`;
    await this.getRepository().save(user);
    // in subsequent tournament rounds should we create an TournamentRoundInvite for this year

    return user;
  }

  async getOrCreateUser(username: string, profile?: any): Promise<User> {
    let user = await this.getRepository().findOne({ username });
    logger.info('getOrCreateUser for username %s and profile: %o', username, profile);
    if (!user) {
      user = new User();
      user.name = '';
      user.username = username;
      await this.getRepository().save(user);
    }
    return user;
  }
}