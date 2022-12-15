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

adminRouter.get("/rooms", async (req: Request, res: Response, next) => {
  try {
    const rooms = await getServices().admin.getActiveRooms();
    res.json(rooms);
  } catch (e) {
    next(e);
  }
});

adminRouter.get("/lobby", async (req: Request, res: Response, next) => {
  try {
    const lobby = await getServices().admin.getLobbyData();
    res.json(lobby);
  } catch (e) {
    next(e);
  }
});

adminRouter.get("/room", async (req: Request, res: Response, next) => {
  const roomId = req.query.roomId as string;
  try {
    const room = await getServices().admin.getInspectData(roomId);
    if (!room) {
      res.status(204).send(`"Room ${roomId} not found"`);
      return;
    }
    res.json(room);
  } catch (e) {
    next(e);
  }
});

adminRouter.get("/chat-reports", async (req: Request, res: Response, next) => {
  const onlyUnresolved = req.query.onlyUnresolved === "true";
  try {
    const chatReports = await getServices().admin.getChatReports(onlyUnresolved);
    res.json(chatReports);
  } catch (e) {
    next(e);
  }
});

adminRouter.get("/incidents", async (req: Request, res: Response, next) => {
  try {
    const incidents = await getServices().admin.getIncidents();
    res.json(incidents);
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

adminRouter.post("/take-action", async (req: Request, res: Response, next) => {
  try {
    const data = req.body;
    await getServices().admin.takeAction(data);
    res.json(true);
  } catch (e) {
    next(e);
  }
});

adminRouter.post("/undo-action", async (req: Request, res: Response, next) => {
  try {
    const data = req.body;
    await getServices().admin.undoAction(data);
    res.json(true);
  } catch (e) {
    next(e);
  }
});

adminRouter.get("/banned-users", async (req: Request, res: Response, next) => {
  try {
    const bannedUsers = await getServices().account.getBannedUsers();
    res.json(bannedUsers);
  } catch (e) {
    next(e);
  }
});
