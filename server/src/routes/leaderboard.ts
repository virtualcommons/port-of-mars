import { Router } from "express";
import { getServices } from "@port-of-mars/server/services";
import { User } from "@port-of-mars/server/entity";

export const leaderboardRouter = Router();

leaderboardRouter.get("/", async (req, res, next) => {
  try {
    const roomId = await getServices().leaderboard.getLeaderboardData();
    res.json(roomId);
  } catch (e) {
    next(e);
  }
});

leaderboardRouter.get("/stats", async (req, res, next) => {
  try {
    const user = req.user as User;
    const roomId = await getServices().leaderboard.getStats(user);
    res.json(roomId);
  } catch (e) {
    next(e);
  }
});
