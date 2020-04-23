import {User} from "@port-of-mars/server/entity";
import {settings} from "@port-of-mars/server/settings";
import {BaseService} from "@port-of-mars/server/services/db";
import {ServerError} from "@port-of-mars/server/util";
import {UpdateResult} from "typeorm";
import validator from "validator";

export class RegistrationService extends BaseService {
  createRegistrationURL(registrationToken: string) {
    return `${settings.host}/#/verify/${registrationToken}`;
  }

  async submitRegistrationMetadata(data: { username: string; email: string; name: string }) {
    const repo = this.em.getRepository(User);
    await repo.update({username: data.username}, data);
  }

  async findUnregisteredUserByRegistrationToken(registrationToken: string): Promise<User | undefined> {
    return await this.em.getRepository(User).findOne({registrationToken})
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

  async verifyUnregisteredUser(u: User, registrationToken: string): Promise<UpdateResult> {
    let r: UpdateResult;
    if (!validator.isUUID(registrationToken)) {
      throw new ServerError({
        code: 400,
        message: `Invalid registration token ${registrationToken}`,
        displayMessage: `Sorry, your registration token does not appear to be valid. Please try to verify your account again and contact us if this continues.`
      })
    }
    try {
      r = await this.em.getRepository(User).update({username: u.username, registrationToken}, {isVerified: true});
    } catch (e) {
      throw new ServerError({
        code: 400,
        error: e,
        message: `Invalid user and registration token ${u.username}, ${registrationToken}`,
        displayMessage: `Sorry, your registration token does not appear to be valid. Please try to verify your account again and contact us if this continues.`
      });
    }
    if (r.affected !== 1) {
      throw new ServerError({
        code: 404,
        message: `Invalid user and registration token ${u.username}, ${registrationToken}`,
        displayMessage: `Sorry, your registration token does not appear to be valid. Please try to verify your account again and contact us if this continues.`
      });
    }
    return r;
  }
}