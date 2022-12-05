import { Router, Request, Response } from "express";
import { getServices } from "@port-of-mars/server/services";
import { AdminStats } from "@port-of-mars/shared/types";
import { unless, isAdminAuthenticated } from "@port-of-mars/server/routes/middleware";

export const adminRouter = Router();

adminRouter.use(unless("/submit-report", isAdminAuthenticated));

adminRouter.get("/stats", async (req: Request, res: Response, next) => {
  try {
    const adminStats = await getServices().admin.getAdminStats();
    res.json(adminStats);
  } catch (e) {
    next(e);
  }
});

adminRouter.get("/chat-reports", async (req: Request, res: Response, next) => {
  try {
    const chatReports = await getServices().admin.getChatReports();
    res.json(chatReports);
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

adminRouter.post("/resolve-report", async (req: Request, res: Response, next) => {
  try {
    const data = req.body;
    await getServices().admin.resolveReport(data);
    res.json(true);
  } catch (e) {
    next(e);
  }
});