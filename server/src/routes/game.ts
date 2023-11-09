import { Router } from "express";
import { getServices } from "@port-of-mars/server/services";
import { User } from "@port-of-mars/server/entity";
import { settings } from "@port-of-mars/server/settings";
import { DashboardMessage, GameType } from "@port-of-mars/shared/types";
import { isVerified } from "@port-of-mars/server/routes/middleware";

const logger = settings.logging.getLogger(__filename);

export const gameRouter = Router();

gameRouter.use(isVerified);

gameRouter.get("/latest-active", async (req, res, next) => {
  try {
    const user = req.user as User;
    const roomId = await getServices().game.getActiveGameRoomId(user.id);
    if (roomId) {
      logger.info("found active game with roomId %s for user %o", roomId, user);
      res.json(roomId);
    } else {
      const message: DashboardMessage = { kind: "danger", message: "Did not find an active game." };
      logger.info("no game room for user %o", user);
      res.status(404).json(message);
    }
  } catch (e) {
    next(e);
  }
});

gameRouter.get("/has-active", async (req, res, next) => {
  try {
    const type = req.query.type as GameType | undefined;
    const user = req.user as User;
    const roomId = await getServices().game.getActiveGameRoomId(user.id, type);
    res.json(!!roomId);
  } catch (e) {
    next(e);
  }
});
