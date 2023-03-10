import { Router } from "express";
import { getServices } from "@port-of-mars/server/services";

export const leaderboardRouter = Router();

leaderboardRouter.get("/", async (req, res, next) => {
  try {
    const roomId = await getServices().leaderboard.getLeaderboardData();
    res.json(roomId);
  } catch (e) {
    next(e);
  }
});
