import { User } from "@port-of-mars/server/entity";
import { settings, getLogger } from "@port-of-mars/server/settings";
import { BaseService } from "@port-of-mars/server/services/db";
import { ServerError } from "@port-of-mars/server/util";
import { UpdateResult } from "typeorm";
import validator from "validator";
import _ from "lodash";


const logger = getLogger(__filename);

export class RegistrationService extends BaseService {

  createVerificationUrl(registrationToken: string) {
    return `${settings.host}/#/verify/${registrationToken}`;
  }

  async submitRegistrationMetadata(user: User, data: { username: string; email: string; name: string }) {
    const repo = this.em.getRepository(User);
    user.name = data.name;
    user.email = data.email;
    user.dateConsented = new Date();
    await repo.save(user);
    logger.debug("updated registration metadata for user %o", data);
    await this.sendEmailVerification(user);
    // check if we need to create an invitation for this new user (currently only in the first round of a tournament)
    const tournamentService = this.sp.tournament;
    const tournamentRound = await tournamentService.getCurrentTournamentRound();
    await tournamentService.getActiveRoundInvite(user.id, tournamentRound);
  }

  async findUnregisteredUserByRegistrationToken(registrationToken: string): Promise<User | undefined> {
    return await this.em.getRepository(User).findOne({ registrationToken })
  }

  async sendEmailVerification(u: User): Promise<void> {
    if (_.isEmpty(u.email)) {
      logger.warn("Trying to send email verification to a user with no email.");
      return;
    }
    const verificationUrl = this.createVerificationUrl(u.registrationToken);
    settings.emailer.sendMail({
      from: `Port of Mars <portmars@asu.edu>`,
      to: u.email,
      bcc: settings.supportEmail,
      subject: '[Port of Mars] Email Verification',
      text: `Please verify your email and complete your registration at ${verificationUrl}`,
      html: `Please <a href="${verificationUrl}">verify your email and complete your registration at ${verificationUrl}.</a>`
    }, function(err, info) {
      if (err) {
        logger.warn(`error : $err`);
        throw new ServerError(err);
      }
      else {
        logger.info(`Successfully sent? %o`, info);
      }
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
      r = await this.em.getRepository(User).update({ username: u.username, registrationToken }, { isVerified: true });
    } catch (e) {
      logger.fatal("error while updating user %s registration token %s", u.username, registrationToken);
      throw new ServerError({
        code: 400,
        error: e,
        message: `Invalid user and registration token ${u.username}, ${registrationToken}`,
        displayMessage: `Sorry, your registration token ${registrationToken} does not appear to be valid. Please try to verify your account again and contact us if this continues.`
      });
    }
    if (r.affected !== 1) {
      logger.debug("affected more than one row in registration update: %s", u.username);
      throw new ServerError({
        code: 404,
        message: `Invalid user and registration token ${u.username}, ${registrationToken}`,
        displayMessage: `Sorry, your registration token does not appear to be valid. Please try to verify your account again and contact us if this continues.`
      });
    }
    return r;
  }
}