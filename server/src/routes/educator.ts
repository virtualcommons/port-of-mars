import { NextFunction, Request, Response, Router } from "express";
import { getServices } from "@port-of-mars/server/services";
import { User } from "@port-of-mars/server/entity/User";
import { isAuthenticated } from "@port-of-mars/server/routes/middleware";
import { ValidationError } from "@port-of-mars/server/util";
import { getLogger } from "@port-of-mars/server/settings";

const logger = getLogger(__filename);

export const educatorRouter = Router();

educatorRouter.use(isAuthenticated);

educatorRouter.post("/confirm-student", async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User;
  try {
    const services = getServices();
    const data = { ...req.body };
    await services.account.setName(user.id, data.name);
    // TODO: set verified, etc?
    // generate password and return it
    // res.json(password);
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(e.code).json(e.toDashboardMessage());
    } else {
      logger.warn("unable to update profile metadata for user ID %d", user.id);
      next(e);
    }
  }
});
