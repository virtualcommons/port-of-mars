import {Router} from "express";
import {getServices} from "@port-of-mars/server/services";
import {User} from "@port-of-mars/server/entity";
import {settings} from "@port-of-mars/server/settings";

const logger = settings.logging.getLogger(__filename);

export const gameRouter = Router();

gameRouter.get('/latest-active', async (req, res, next) => {
  try {
    const user = req.user as User | undefined;
    if (!user) {
      res.status(401).json();
      return;
    }
    const roomId = await getServices().game.getLatestActiveGameByUserId((user).id);
    logger.info('found active game with roomId', roomId, 'for user', user);
    res.json(roomId);
  } catch (e) {
    next(e);
  }
});