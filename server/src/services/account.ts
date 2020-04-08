import { User } from "@port-of-mars/server/entity";
import { getConnection } from "@port-of-mars/server/util";
import { EntityManager, Repository } from "typeorm"
import { settings } from "@port-of-mars/server/settings";

const logger = settings.logging.getLogger(__filename);

export class AccountService {
  em: EntityManager;

  constructor(em?: EntityManager) {
    if (!em) {
      em = getConnection().manager;
    }
    this.em = em;
  }

  getRepository(): Repository<User> {
    return this.em.getRepository(User);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return await this.getRepository().findOne({ username })
  }

  async findUserById(id: number): Promise<User | undefined> {
    return await this.getRepository().findOne(id);
  }

  async getOrCreateUser(username: string, profile?: any): Promise<User> {
    let user = await this.getRepository().findOne({ username });
    logger.info('getOrCreateUser profile: ', profile);
    if (!user) {
      user = new User();
      user.name = '';
      user.username = username;
      await getConnection().getRepository(User).save(user);
    }
    return user;
  }
}