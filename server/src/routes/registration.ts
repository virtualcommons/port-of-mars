import {NextFunction, Request, Response, Router} from "express";
import {sendEmailVerification, submitRegistrationMetadata, verifyUnregisteredUser} from "@/services/registration";
import {User} from "@/entity/User";

export const registrationRouter = Router();

registrationRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = {...req.body, ...{username: (req.user as User).username}};
    await submitRegistrationMetadata(data);
    sendEmailVerification(req.user as User);
    res.json();
  } catch (e) {
    next(e);
  }
});

registrationRouter.post('/verify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user) {
      await verifyUnregisteredUser(req.user as User);
      res.json();
    }
  } catch (e) {
    next(e);
  }
});