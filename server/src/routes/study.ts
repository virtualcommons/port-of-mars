import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import { getServices } from "@port-of-mars/server/services";
import { toUrl } from "@port-of-mars/server/util";
import {
  PROLIFIC_MULTIPLAYER_STUDY_PAGE,
  PROLIFIC_SOLO_STUDY_PAGE,
} from "@port-of-mars/shared/routes";
import { User } from "@port-of-mars/server/entity";
import { ProlificStudyData, StudyMode } from "@port-of-mars/shared/types";
import { isAdminAuthenticated } from "@port-of-mars/server/routes/middleware";
import { BaseStudyService } from "@port-of-mars/server/services/study";

interface StudyModeRequest extends Request {
  studyService?: BaseStudyService;
  mode?: StudyMode;
}

export const studyRouter = Router();

// middleware to extract :mode parameter and attach corresponding study service
studyRouter.use("/prolific/:mode", (req: StudyModeRequest, res: Response, next: NextFunction) => {
  const mode = req.params.mode;
  if (mode === "solo") {
    req.studyService = getServices().soloStudy;
    req.mode = "solo";
  } else if (mode === "multiplayer") {
    req.studyService = getServices().multiplayerStudy;
    req.mode = "multiplayer";
  } else {
    return res.status(400).json({ message: "Invalid mode. Use 'solo' or 'multiplayer'" });
  }
  next();
});

// http://localhost:2567/study/prolific/solo?prolificId=<PROLIFIC_PID>&studyId=<STUDY_ID>
// https://portofmars.asu.edu/study/prolific/solo?prolificId=<PROLIFIC_PID>&studyId=<STUDY_ID>
// or
// http://localhost:2567/study/prolific/multiplayer?prolificId=<PROLIFIC_PID>&studyId=<STUDY_ID>
// https://portofmars.asu.edu/study/prolific/multiplayer?prolificId=<PROLIFIC_PID>&studyId=<STUDY_ID>
studyRouter.get(
  "/prolific/:mode",
  async (req: StudyModeRequest, res: Response, next: NextFunction) => {
    const prolificId = String(req.query.prolificId || "");
    if (!prolificId) {
      return res.status(403).json({
        kind: "danger",
        message: "Missing Prolific ID",
      });
    }
    const studyId = String(req.query.studyId || "");
    if (!req.studyService) {
      return res.status(500).json({ message: "Study service not set" });
    }
    const study = await req.studyService.getProlificStudy(studyId);
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
  (req: StudyModeRequest, res: Response, next: NextFunction) => {
    // use the correct passport strategy based on mode
    passport.authenticate(`local-prolific-${req.params.mode}`)(req, res, next);
  },
  (req: StudyModeRequest, res: Response) => {
    if (req.mode == "solo") {
      res.redirect(toUrl(PROLIFIC_SOLO_STUDY_PAGE));
    } else if (req.mode == "multiplayer") {
      res.redirect(toUrl(PROLIFIC_MULTIPLAYER_STUDY_PAGE));
    }
  }
);

studyRouter.get(
  "/prolific/:mode/status",
  async (req: StudyModeRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.studyService) {
        return res.status(500).json({ message: "Study service not set" });
      }
      const user = req.user as User;
      const status = await req.studyService.getProlificParticipantStatus(user);
      res.json(status);
    } catch (e) {
      next(e);
    }
  }
);

studyRouter.get(
  "/prolific/:mode/complete",
  async (req: StudyModeRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.studyService) {
        return res.status(500).json({ message: "Study service not set" });
      }
      const user = req.user as User;
      const url = await req.studyService.getProlificCompletionUrl(user, false);
      res.json(url);
    } catch (e) {
      next(e);
    }
  }
);

studyRouter.get(
  "/prolific/:mode/studies",
  isAdminAuthenticated,
  async (req: StudyModeRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.studyService) {
        return res.status(500).json({ message: "Study service not set" });
      }
      const studies = await req.studyService.getAllProlificStudies();
      for (const study of studies) {
        study.participantPoints = await req.studyService.getAllParticipantPoints(study.studyId);
      }
      res.json(studies);
    } catch (error) {
      next(error);
    }
  }
);

studyRouter.post(
  "/prolific/:mode/add",
  isAdminAuthenticated,
  async (req: StudyModeRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.studyService) {
        return res.status(500).json({ message: "Study service not set" });
      }
      const { description, studyId, completionCode, isActive } = req.body as ProlificStudyData;
      if (!description || !studyId || !completionCode) {
        return res.status(400).json({
          message: "Missing required fields: description, studyId, or completionCode.",
        });
      }
      const savedStudy = await req.studyService.createProlificStudy(
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
  "/prolific/:mode/update",
  isAdminAuthenticated,
  async (req: StudyModeRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.studyService) {
        return res.status(500).json({ message: "Study service not set" });
      }
      const { studyId, description, completionCode, isActive } = req.body as ProlificStudyData;
      const updatedStudy = await req.studyService.updateProlificStudy(
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
