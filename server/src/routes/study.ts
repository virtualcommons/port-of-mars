import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import { getServices } from "@port-of-mars/server/services";
import { toUrl } from "@port-of-mars/server/util";
import { PROLIFIC_STUDY_PAGE } from "@port-of-mars/shared/routes";
import { User } from "@port-of-mars/server/entity";
import { ProlificStudyData } from "@port-of-mars/shared/types";
import { isAdminAuthenticated } from "@port-of-mars/server/routes/middleware";

export const studyRouter = Router();

// http://localhost:2567/study/prolific?prolificId=<PROLIFIC_PID>&studyId=<STUDY_ID>
// https://portofmars.asu.edu/study/prolific?prolificId=<PROLIFIC_PID>&studyId=<STUDY_ID>
studyRouter.get(
  "/prolific",
  async (req: Request, res: Response, next: NextFunction) => {
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

studyRouter.get("/prolific/status", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const services = getServices();
    const user = req.user as User;
    const status = await services.study.getProlificParticipantStatus(user);
    res.json(status);
  } catch (e) {
    next(e);
  }
});

studyRouter.get("/prolific/complete", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const services = getServices();
    const user = req.user as User;
    const url = await services.study.getProlificCompletionUrl(user);
    res.json(url);
  } catch (e) {
    next(e);
  }
});

studyRouter.get(
  "/prolific/studies",
  isAdminAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studies = await getServices().study.getAllProlificStudies();
      for (const study of studies) {
        study.participantPoints = await getServices().study.getAllParticipantPoints(study.studyId);
      }
      res.json(studies);
    } catch (error) {
      next(error);
    }
  }
);

studyRouter.post(
  "/prolific/add",
  isAdminAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { description, studyId, completionCode, isActive } = req.body as ProlificStudyData;
      if (!description || !studyId || !completionCode) {
        return res.status(400).json({
          message: "Missing required fields: description, studyId, or completionCode.",
        });
      }
      const savedStudy = await getServices().study.createProlificStudy(
        studyId,
        completionCode,
        description,
        isActive ?? true
      );
      res.status(201).json(savedStudy);
    } catch (error) {
      console.error("Error adding new study:", error);
      next(error);
    }
  }
);

studyRouter.post(
  "/prolific/update",
  isAdminAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { studyId, description, completionCode, isActive } = req.body as ProlificStudyData;
      const updatedStudy = await getServices().study.updateProlificStudy(
        studyId,
        completionCode,
        description,
        isActive ?? true
      );
      if (!updatedStudy) {
        return res.status(404).json({ message: `Study with ID ${studyId} not found.` });
      }
      res.status(200).json(updatedStudy);
    } catch (error) {
      console.error("Error updating study:", error);
      res.status(500).json({ message: "Internal Server Error", error });
    }
  }
);
