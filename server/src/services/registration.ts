import { User } from "@port-of-mars/server/entity";
import { getLogger } from "@port-of-mars/server/settings";
import { BaseService } from "@port-of-mars/server/services/db";
import { ServerError } from "@port-of-mars/server/util";
import { UpdateResult } from "typeorm";
import validator from "validator";

const logger = getLogger(__filename);

export class RegistrationService extends BaseService {
  async grantConsent(user: User) {
    const repo = this.em.getRepository(User);
    user.dateConsented = new Date();
    await repo.save(user);
  }

  async findUnregisteredUserByRegistrationToken(
    registrationToken: string
  ): Promise<User | undefined> {
    return await this.em.getRepository(User).findOne({ registrationToken });
  }

  async verifyUnregisteredUser(u: User, registrationToken: string): Promise<UpdateResult> {
    let r: UpdateResult;
    if (!validator.isUUID(registrationToken)) {
      throw new ServerError({
        code: 400,
        message: `Invalid registration token ${registrationToken}`,
        displayMessage: `Sorry, your registration token does not appear to be valid. Please try to verify your account again and contact us if this continues.`,
      });
    }
    try {
      r = await this.em
        .getRepository(User)
        .update({ username: u.username, registrationToken }, { isVerified: true });
    } catch (e) {
      logger.fatal(
        "error while updating user %s registration token %s",
        u.username,
        registrationToken
      );
      throw new ServerError({
        code: 400,
        error: e as Error,
        message: `Invalid user and registration token ${u.username}, ${registrationToken}`,
        displayMessage: `Sorry, your registration token ${registrationToken} does not appear to be valid. Please try to verify your account again and contact us if this continues.`,
      });
    }
    if (r.affected !== 1) {
      logger.debug("affected more than one row in registration update: %s", u.username);
      throw new ServerError({
        code: 404,
        message: `Invalid user and registration token ${u.username}, ${registrationToken}`,
        displayMessage: `Sorry, your registration token does not appear to be valid. Please try to verify your account again and contact us if this continues.`,
      });
    }
    return r;
  }
}
