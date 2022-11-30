import { Router, Request, Response } from "express";
import { getServices } from "@port-of-mars/server/services";
import { unless, isAdminAuthenticated } from "@port-of-mars/server/routes/middleware";

export const adminRouter = Router();

adminRouter.use(unless("/submit-report", isAdminAuthenticated));

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

adminRouter.post("/submit-report", async (req: Request, res: Response, next) => {
  try {
    const data = req.body;
    await getServices().admin.submitReport(data);
    res.json(true);
  } catch (e) {
    next(e);
  }
});
