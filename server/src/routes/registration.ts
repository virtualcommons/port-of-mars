import { NextFunction, Request, Response, Router } from "express";
import { getServices } from "@port-of-mars/server/services";
import { User } from "@port-of-mars/server/entity/User";
import { isAuthenticated } from "@port-of-mars/server/routes/middleware";
import { getLogger } from "@port-of-mars/server/settings";

const logger = getLogger(__filename);

export const registrationRouter = Router();

registrationRouter.use(isAuthenticated);

registrationRouter.post('/grant-consent', async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User;
  try {
    const services = getServices();
    const data = { ...req.body, ...{ username: user.username } };
    const emailAvailable = await services.account.isEmailAvailable(user, data.email);
    if (emailAvailable) {
      await services.registration.submitRegistrationMetadata(user, data);
      res.json(true);
    }
    else {
      res.status(400).json({kind: 'danger', message: `The email ${data.email} is already taken. Please try another one.`})
    }
  } catch (e) {
    logger.warn("unable to process registration metadata for %s", user.username);
    next(e);
  }
});

registrationRouter.post('/deny-consent', async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User;
  try {
    const services = getServices();
    await services.account.denyConsent(user.id);
    res.json(true);
  } catch (e) {
    logger.warn("unable to deny consent for %s", user.username);
    next(e);
  }
});

registrationRouter.post('/send-email-verification', async (req: Request, res: Response, next: NextFunction) => { 
  const user = req.user as User;
  try {
    await getServices().registration.sendEmailVerification(user);
    res.json(true);
  } catch (e) {
    logger.warn("Unable to send verification email for %s", user.username);
    next(e);
  }

});

registrationRouter.post('/verify/:registrationToken', async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const registrationToken = req.params.registrationToken;
  const s = getServices();
  try {
    await s.registration.verifyUnregisteredUser(user, registrationToken);
    res.json(await s.settings.getIsSignUpEnabled() && (await s.tournament.getCurrentTournamentRound()).roundNumber === 1);
  } catch (e) {
    logger.warn(`Unable to verify unregistered user ${user.username} with token ${registrationToken}}`)
    next(e);
  }
});

registrationRouter.get('/authenticated', async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  try {
    res.json({ name: user.name, email: user.email, dateConsented: user.dateConsented ?? null, isVerified: user.isVerified });
  } catch (e) {
    logger.warn(`Unable to authorize user for registration ${user.username}`);
    next(e);
  }
});