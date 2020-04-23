import { User } from "@port-of-mars/server/entity";
import { getConnection } from "@port-of-mars/server/util";
import { EntityManager, Repository } from "typeorm"
import { settings } from "@port-of-mars/server/settings";
import {BaseService} from "@port-of-mars/server/services/db";

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

  async getOrCreateUser(username: string, profile?: any): Promise<User> {
    let user = await this.getRepository().findOne({ username });
    logger.info('getOrCreateUser for username %s and profile: %o', username, profile);
    if (!user) {
      user = new User();
      user.name = '';
      user.username = username;
      await getConnection().getRepository(User).save(user);
    }
    return user;
  }
}