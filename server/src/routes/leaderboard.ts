import { Router } from "express";
import { getServices } from "@port-of-mars/server/services";
import { User } from "@port-of-mars/server/entity";

export const leaderboardRouter = Router();

leaderboardRouter.get("/", async (req, res, next) => {
  const limitStr = req.query.limit as string;
  const limit = parseInt(limitStr) || 50;
  try {
    const leaderboardData = await getServices().leaderboard.getLeaderboardData(limit);
    res.json(leaderboardData);
  } catch (e) {
    next(e);
  }
});

leaderboardRouter.get("/stats", async (req, res, next) => {
  try {
    const user = req.user as User;
    const playerStats = await getServices().leaderboard.getStats(user);
    res.json(playerStats);
  } catch (e) {
    next(e);
  }
});
