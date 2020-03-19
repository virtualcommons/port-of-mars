import {User} from "@port-of-mars/server/entity/User";
import {getConnection} from "@port-of-mars/server/util";
import {EntityManager, Repository} from "typeorm"

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
    return await this.getRepository().findOne({username})
  }

  async findUserById(id: number): Promise<User | undefined> {
    return await this.getRepository().findOne(id);
  }

  async findOrCreateUser(username: string): Promise<[boolean, User]> {
    const repository = this.getRepository();
    let user = await repository.findOne({username});
    let created = false;
    if (!user) {
      user = repository.create({username, name: ''});
      created = true;
    }
    return [created, user];
  }

  async getOrCreateUser(username: string): Promise<User> {
    const user = await this.getRepository().findOne({username});
    if (user) {
      return user;
    }

    const u = new User();
    u.name = '';
    u.username = username;
    await getConnection().getRepository(User).save(u);
    return u;
  }
}