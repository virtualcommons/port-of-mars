import {User} from "@/entity/User";
import {Repository} from "typeorm";

interface AuthFail {
  message: string
}

interface UserData {
  username: string;
  email: string;
  name: string;
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const authenticate =
  (verify: (service: string, ticket: string) => Promise<Partial<UserData>>) =>
  async (userRepo: Repository<User>, ticket: string, service: string): Promise<User | AuthFail> => {

  const userdata = await verify(ticket, service);

  if (!userdata.username) {
    return { message: 'CAS server did not authorize ticket' };
  }

  const user = await userRepo.findOne({ username: userdata.username });
  if (user) {
    return user;
  }

  const new_user = new User();
  new_user.username = userdata.username;
  new_user.email = userdata.email ?? '';
  new_user.name = userdata.name ?? '';
  await userRepo.save(new_user);
  return new_user;
};