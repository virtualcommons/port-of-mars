import { Router, Request, Response } from "express";
import { getServices } from "@port-of-mars/server/services";
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

adminRouter.get("/settings", async (req: Request, res: Response, next) => {
  try {
    const settings = await getServices().settings.getSettings();
    res.json(settings);
  } catch (e) {
    next(e);
  }
});

adminRouter.post("/settings", async (req: Request, res: Response, next) => {
  try {
    const data = req.body;
    await getServices().settings.setSettings(data);
    res.json(true);
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

adminRouter.get("/moderation-actions", async (req: Request, res: Response, next) => {
  try {
    const moderationActions = await getServices().admin.getModerationActions();
    res.json(moderationActions);
  } catch (e) {
    next(e);
  }
});

adminRouter.post("/submit-chat-report", async (req: Request, res: Response, next) => {
  try {
    const data = req.body;
    await getServices().admin.submitChatReport(data);
    res.json(true);
  } catch (e) {
    next(e);
  }
});

adminRouter.post("/take-moderation-action", async (req: Request, res: Response, next) => {
  try {
    const data = req.body;
    await getServices().admin.takeModerationAction(data);
    res.json(true);
  } catch (e) {
    next(e);
  }
});

adminRouter.post("/undo-moderation-action", async (req: Request, res: Response, next) => {
  try {
    const data = req.body;
    await getServices().admin.undoModerationAction(data);
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
