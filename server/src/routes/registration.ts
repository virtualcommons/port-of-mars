import { NextFunction, Request, Response, Router } from "express";
import { getServices } from "@port-of-mars/server/services";
import { User } from "@port-of-mars/server/entity/User";
import { isAuthenticated } from "@port-of-mars/server/routes/middleware";
import { getLogger } from "@port-of-mars/server/settings";

const logger = getLogger(__filename);

export const registrationRouter = Router();

registrationRouter.use(isAuthenticated);

registrationRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User;
  try {
    const services = getServices();
    const data = { ...req.body, ...{ username: user.username } };
    await services.registration.submitRegistrationMetadata(data);
    logger.debug("updated registration metadata for user %o", data);
    await services.registration.sendEmailVerification(user);
    res.json(true);
  } catch (e) {
    logger.warn("unable to process registration metadata for %s", user.username);
    next(e);
  }
});

registrationRouter.post('/verify/:registrationToken', async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const registrationToken = req.params.registrationToken;
  try {
    await getServices().registration.verifyUnregisteredUser(user, registrationToken);
    res.json(true);
  } catch (e) {
    logger.warn(`Unable to verify unregistered user ${user.username} with token ${registrationToken}}`)
    next(e);
  }
});