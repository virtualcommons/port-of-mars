import { TournamentRoundInvite, User } from "@port-of-mars/server/entity";
import { getConnection } from "@port-of-mars/server/util";
import { settings } from "@port-of-mars/server/settings";
import { EntityManager } from "typeorm";
import {BaseService} from "@port-of-mars/server/services/db";

export class RegistrationService extends BaseService {
  createRegistrationURL(registrationToken: string) {
    return `${settings.host}/#/verify/${registrationToken}`;
  }

  async submitRegistrationMetadata(data: { username: string; email: string; name: string }) {
    const repo = this.em.getRepository(User);
    await repo.update({ username: data.username }, data);
  }

  async findUnregisteredUserByRegistrationToken(registrationToken: string): Promise<User | undefined> {
    return await this.em.getRepository(User).findOne({ registrationToken })
  }

  async sendEmailVerification(u: User): Promise<void> {
    const link = this.createRegistrationURL(u.registrationToken);
    settings.emailer.sendMail({
      from: `Port of Mars <portmars@asu.edu>`,
      to: `${u.name} <${u.email}>`,
      subject: 'Port of Mars [Email Registration Link]',
      text: `Please complete your registration at ${link}`,
      html: `Please <a href="${link}">complete your registration</a>`
    });
    return;
  }

  async verifyUnregisteredUser(u: User) {
    const r = await this.em.getRepository(User).update({ username: u.username }, { isVerified: true });
    console.assert(r.affected === 1);
  }
}