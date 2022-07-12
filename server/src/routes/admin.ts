import { Router, Request, Response } from "express";
import { getServices } from "@port-of-mars/server/services";
import { isAdminAuthenticated } from "@port-of-mars/server/routes/middleware";

export const adminRouter = Router();

adminRouter.use(isAdminAuthenticated);

adminRouter.get("/", async (req: Request, res: Response, next) => {
  try {
    // FIXME: replace with AdminService calls
    const gameService = getServices().game;
    const totalCompletedGames = await gameService.getTotalCompletedGames();
    const totalVictoryGamesWithoutBots =
      await gameService.getTotalGamesWithoutBots();
    const totalActiveGames = await gameService.getTotalActiveGames();
    const activeGames = await gameService.getAllActiveGames();
    const adminData = {
      totalCompletedGames,
      totalVictoryGamesWithoutBots,
      totalActiveGames,
      activeGames,
    };
    res.json(adminData);
  } catch (e) {
    next(e);
  }
});
