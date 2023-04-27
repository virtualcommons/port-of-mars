import { NextFunction, Request, Response, Router } from "express";
import { getServices } from "@port-of-mars/server/services";
import { User } from "@port-of-mars/server/entity/User";
import { isAuthenticated } from "@port-of-mars/server/routes/middleware";
import { ServerError } from "@port-of-mars/server/util";
import { getLogger } from "@port-of-mars/server/settings";

const logger = getLogger(__filename);

export const registrationRouter = Router();

registrationRouter.use(isAuthenticated);

registrationRouter.post(
  "/grant-consent",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    try {
      getServices().registration.grantConsent(user);
      res.json(true);
    } catch (e) {
      logger.warn("Unable to grant consent for user %o", user);
      next(e);
    }
  }
);

registrationRouter.post(
  "/update-profile",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    try {
      const services = getServices();
      const data = { ...req.body };
      const emailAvailable = await services.account.isEmailAvailable(user, data.email);
      const usernameAvailable = await services.account.isUsernameAvailable(data.username, user);
      if (!emailAvailable) {
        res.status(400).json({
          kind: "danger",
          message: `The email ${data.email} is already taken. Please try another one.`,
        });
      } else if (!usernameAvailable) {
        res.status(400).json({
          kind: "danger",
          message: `The username ${data.username} is already taken. Please try another one.`,
        });
      } else {
        try {
          await services.account.updateProfile(user, data);
        } catch (e) {
          if (e instanceof ServerError) {
            res.status(e.code).json({
              kind: "danger",
              message: e.displayMessage,
            });
          }
          return;
        }
        res.json(true);
      }
    } catch (e) {
      logger.warn("unable to update profile metadata for user ID %s", user.id);
      next(e);
    }
  }
);

registrationRouter.post(
  "/deny-consent",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    try {
      const services = getServices();
      await services.account.denyConsent(user.id);
      res.json(true);
    } catch (e) {
      logger.warn("unable to deny consent for %s", user.username);
      next(e);
    }
  }
);

registrationRouter.post(
  "/send-email-verification",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    try {
      await getServices().account.sendEmailVerification(user);
      res.json(true);
    } catch (e) {
      logger.warn("Unable to send verification email for %s", user.username);
      next(e);
    }
  }
);

registrationRouter.post(
  "/verify/:registrationToken",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const registrationToken = req.params.registrationToken;
    const s = getServices();
    try {
      await s.registration.verifyUnregisteredUser(user, registrationToken);
      res.json(await s.settings.isTournamentSignUpEnabled());
    } catch (e) {
      logger.warn(
        `Unable to verify unregistered user ${user.username} with token ${registrationToken}}`
      );
      next(e);
    }
  }
);

registrationRouter.get(
  "/authenticated",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    try {
      res.json({
        username: user.username,
        name: user.name,
        email: user.email,
        dateConsented: user.dateConsented ?? null,
        isVerified: user.isVerified,
      });
    } catch (e) {
      logger.warn(`Unable to authorize user for registration ${user.username}`);
      next(e);
    }
  }
);
