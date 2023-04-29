import { Router, Request, Response } from "express";
import { User } from "@port-of-mars/server/entity";
import { toClientSafeUser } from "@port-of-mars/server/util";

export const statusRouter = Router();

statusRouter.get("/", async (req: Request, res: Response, next) => {
  // provide initial data to client
  try {
    const user = req.user as User;
    if (user) {
      const safeUser = toClientSafeUser(user);
      res.json({
        user: { ...safeUser },
      });
    } else {
      res.json({ user: null });
    }
  } catch (e) {
    next(e);
  }
});
