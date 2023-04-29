import { NextFunction, Request, Response, Router } from "express";
import { getServices } from "@port-of-mars/server/services";
import { User } from "@port-of-mars/server/entity/User";
import { isAuthenticated } from "@port-of-mars/server/routes/middleware";
import { ValidationError } from "@port-of-mars/server/util";
import { getLogger } from "@port-of-mars/server/settings";

const logger = getLogger(__filename);

export const accountRouter = Router();

accountRouter.use(isAuthenticated);

accountRouter.post("/update-profile", async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User;
  try {
    const services = getServices();
    const data = { ...req.body };
    await services.account.validateUserProfile(user, data);
    const updatedUser = await services.account.updateProfile(user, data);
    res.json(updatedUser);
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(e.code).json(e.toDashboardMessage());
    } else {
      logger.warn("unable to update profile metadata for user ID %s", user.id);
      next(e);
    }
  }
});

accountRouter.post("/grant-consent", async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User;
  try {
    const services = getServices();
    const updatedUser = await services.account.grantConsent(user.id);
    res.json(updatedUser);
  } catch (e) {
    logger.warn("Unable to grant consent for user %o", user);
    next(e);
  }
});

accountRouter.post("/deny-consent", async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User;
  try {
    const services = getServices();
    const updatedUser = await services.account.denyConsent(user.id);
    res.json(updatedUser);
  } catch (e) {
    logger.warn("unable to deny consent for %s", user.username);
    next(e);
  }
});

accountRouter.post(
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

accountRouter.post(
  "/verify/:registrationToken",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const registrationToken = req.params.registrationToken;
    const s = getServices();
    try {
      await s.account.verifyUnregisteredUser(user, registrationToken);
      res.json(await s.settings.isTournamentSignUpEnabled());
    } catch (e) {
      logger.warn(
        `Unable to verify unregistered user ${user.username} with token ${registrationToken}}`
      );
      next(e);
    }
  }
);

accountRouter.get("/authenticated", async (req: Request, res: Response, next: NextFunction) => {
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
});
