import { Router, Request, Response } from "express";
import { User } from "@port-of-mars/server/entity";
import { toClientSafeUser } from "@port-of-mars/server/util";
import { getServices } from "@port-of-mars/server/services";
import { ClientInitStatus } from "@port-of-mars/shared/types";
import { isEducatorMode } from "@port-of-mars/shared/settings";

export const statusRouter = Router();

statusRouter.get("/", async (req: Request, res: Response, next) => {
  // provide initial data to client
  try {
    const services = getServices();
    const user = req.user as User;
    let isTeacher = false;
    if (user && isEducatorMode()) {
      // check if user is a teacher, only bother in educator mode
      isTeacher = !!(await services.educator.getTeacherByUserId(user.id));
    }
    const safeUser = user ? { ...toClientSafeUser(user), isTeacher } : null;
    const settings = await services.settings.getSettings();
    const { isFreePlayEnabled, isTournamentEnabled, announcementBannerText } = settings;
    let tournamentStatus = null;
    let tournamentRoundSchedule = null;
    if (isTournamentEnabled) {
      tournamentStatus = await services.tournament.getTournamentStatus();
      tournamentRoundSchedule = await services.tournament.getTournamentRoundSchedule({ user });
    }

    const status: ClientInitStatus = {
      isFreePlayEnabled,
      isTournamentEnabled,
      user: safeUser,
      tournamentStatus,
      tournamentRoundSchedule,
      announcementBannerText,
    };
    res.json(status);
  } catch (e) {
    next(e);
  }
});
