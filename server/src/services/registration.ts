import {User} from "@/entity/User";
import {getConnection} from "@/util";
import {settings} from "@/settings";

export async function initRegistration(username: string): Promise<User> {
  const u = new User();
  u.name = '';
  u.username = username;
  await getConnection().getRepository(User).save(u);
  return u;
}

export function createRegistrationURL(registrationLink: string) {
  return `${settings.host}/${registrationLink}`;
}

export async function submitRegistrationMetadata(data: {username: string, email: string, name: string}) {
  const repo = getConnection().getRepository(User);
  await repo.update({ username: data.username }, data);
}

export async function findUnregisteredUserByRegistrationLink(registrationToken: string): Promise<User | undefined> {
  return await getConnection().getRepository(User).findOne({registrationToken})
}

export function sendEmailVerification(u: User) {
  const link = createRegistrationURL(u.registrationToken);
  settings.emailer.sendMail({
    from: `Port of Mars <portmars@asu.edu>`,
    to: `${u.name} <${u.email}>`,
    subject: 'Port of Mars [Email Registration Link]',
    text: `Please complete your registration at ${link}`,
    html: `Please <a href="${link}">complete your registration</a>`
  })
}

export async function verifyUnregisteredUser(u: User) {
  await getConnection().getRepository(User).update({username: u.username}, {isVerified: true});
}