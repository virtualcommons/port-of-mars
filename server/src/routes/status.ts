import { Router, Request, Response } from "express";
import { User } from "@port-of-mars/server/entity";

export const statusRouter = Router();

statusRouter.get("/", async (req: Request, res: Response, next) => {
  // provide initial data to client
  // could also use destructuring denylist of fields e.g.
  // const { registrationToken, otherFieldsToExclude, ...user } = req.user;
  try {
    const user = req.user as User;
    res.json({
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
        isMuted: user.isMuted,
        isBanned: user.isBanned,
        passedQuiz: user.passedQuiz,
        isVerified: user.isVerified,
        dateConsented: user.dateConsented,
        participantId: user.participantId,
      },
    });
  } catch (e) {
    next(e);
  }
});
