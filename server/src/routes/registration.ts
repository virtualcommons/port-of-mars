import {NextFunction, Request, Response, Router} from "express";
import {getServices} from "@port-of-mars/server/services";
import {User} from "@port-of-mars/server/entity/User";

export const registrationRouter = Router();

registrationRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const services = getServices();
    const data = {...req.body, ...{username: (req.user as User).username}};
    await services.registration.submitRegistrationMetadata(data);
    services.registration.sendEmailVerification(req.user as User);
    res.json();
  } catch (e) {
    next(e);
  }
});

registrationRouter.post('/verify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user) {
      await getServices().registration.verifyUnregisteredUser(req.user as User);
      res.json();
    }
  } catch (e) {
    next(e);
  }
});

registrationRouter.post('/tutorial', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const services = getServices();
    const data = {...req.body, ...{username: (req.user as User).username}};
    await services.registration.submitRegistrationMetadata(data);
    services.registration.sendEmailVerification(req.user as User);
    res.json();
  } catch (e) {
    next(e);
  }
});
