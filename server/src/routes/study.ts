import { Router, Request, Response } from "express";
import passport from "passport";
import { getServices } from "@port-of-mars/server/services";
import { toUrl } from "@port-of-mars/server/util";
import { PROLIFIC_STUDY_PAGE } from "@port-of-mars/shared/routes";
import { User } from "@port-of-mars/server/entity";
// import { settings } from "@port-of-mars/server/settings";

// const logger = settings.logging.getLogger(__filename);

export const studyRouter = Router();

// http://localhost:2567/study/prolific?prolificId=<PROLIFIC_PID>&studyId=<STUDY_ID>
// https://portofmars.asu.edu/study/prolific?prolificId=<PROLIFIC_PID>&studyId=<STUDY_ID>
studyRouter.get(
  "/prolific",
  async (req: Request, res: Response, next) => {
    const prolificId = String(req.query.prolificId || "");
    if (!prolificId) {
      return res.status(403).json({
        kind: "danger",
        message: "Missing Prolific ID",
      });
    }
    const studyId = String(req.query.studyId || "");
    const study = await getServices().study.getProlificStudy(studyId);
    if (!study || !study.isActive) {
      return res.status(403).json({
        kind: "danger",
        message: "Not a valid study",
      });
    }
    req.body.prolificId = prolificId;
    req.body.studyId = studyId;
    next();
  },
  passport.authenticate("local-prolific"),
  (req: Request, res: Response) => {
    res.redirect(toUrl(PROLIFIC_STUDY_PAGE));
  }
);

studyRouter.get("/prolific/status", async (req: Request, res: Response, next) => {
  try {
    const services = getServices();
    const user = req.user as User;
    const status = await services.study.getProlificParticipantStatus(user);
    res.json(status);
  } catch (e) {
    next(e);
  }
});

studyRouter.get("/prolific/complete", async (req: Request, res: Response, next) => {
  try {
    const services = getServices();
    const user = req.user as User;
    const url = await services.study.getProlificCompletionUrl(user);
    res.json(url);
  } catch (e) {
    next(e);
  }
});
