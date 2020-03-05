import {User} from "@/entity/User";
import {getConnection} from "@/util";
import {settings} from "@/settings";

export function createRegistrationURL(registrationLink: string) {
  return `${settings.host}/${registrationLink}`;
}

export async function submitRegistrationMetadata(data: {username: string, email: string, name: string}) {
  const repo = getConnection().getRepository(User);
  await repo.update({ username: data.username }, data);
}

export async function findUnregisteredUserByRegistrationToken(registrationToken: string): Promise<User | undefined> {
  return await getConnection().getRepository(User).findOne({registrationToken})
}

export async function sendEmailVerification(u: User): Promise<void> {
  const link = createRegistrationURL(u.registrationToken);
  settings.emailer.sendMail({
    from: `Port of Mars <portmars@asu.edu>`,
    to: `${u.name} <${u.email}>`,
    subject: 'Port of Mars [Email Registration Link]',
    text: `Please complete your registration at ${link}`,
    html: `Please <a href="${link}">complete your registration</a>`
  });
  return;
}

export async function verifyUnregisteredUser(u: User) {
  const r = await getConnection().getRepository(User).update({username: u.username}, {isVerified: true});
  console.assert(r.affected === 1);
}