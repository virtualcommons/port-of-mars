import {User} from "@/entity/User";
import {getConnection} from "@/util";
import {Repository} from "typeorm"

export function getRepository(): Repository<User> {
  return getConnection().getRepository(User);
}

export async function findByUsername(username: string): Promise<User | undefined> {
  return await getRepository().findOne({username})
}

export async function findById(id: number): Promise<User | undefined> {
  return await getRepository().findOne(id);
}

export async function findOrCreateUser(username: string, profile: object): Promise<User | undefined> {
  const repository = getRepository();
  let user = await repository.findOne({username});
  let created = false;
  if (! user) {
    user = repository.create({username});
    created = true;
  }
  // FIXME: update user with profile fields after we figure out what ASU CAS gives us
  console.log(profile);
  await repository.save(user);
  return user;
}