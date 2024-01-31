import { Router, Request, Response } from "express";
import { User } from "@port-of-mars/server/entity";
import { getServices } from "@port-of-mars/server/services";
import { getPagePath, TOURNAMENT_DASHBOARD_PAGE } from "@port-of-mars/shared/routes";
import { settings, getLogger } from "@port-of-mars/server/settings";
import { ServerError } from "@port-of-mars/server/util";
import { isDevOrStaging } from "@port-of-mars/shared/settings";

export const tournamentRouter = Router();

const logger = getLogger(__filename);

// https://portofmars.asu.edu/tournament/survey/complete/?pid=${e://Field/pid}&surveyId=${e://Field/SurveyID}&tid=${e://Field/tid}
// http://localhost:8081/tournament/survey/complete?pid=cdf6a97d-d537-4fc5-b655-7c22651cc61c&tid=2&surveyId=SV_0c8tCMZkAUh4V8x
tournamentRouter.get("/survey/complete", async (req: Request, res: Response, next) => {
  logger.debug("trying to mark survey complete");
  try {
    const participantId = String(req.query.pid ?? "");
    const surveyId = String(req.query.surveyId ?? "");
    const inviteId = Number(req.query.tid);
    logger.debug("marking survey %s completion for %s on %d", surveyId, participantId, inviteId);
    if (inviteId && (isDevOrStaging() || (participantId && surveyId))) {
      await getServices().survey.setSurveyComplete({ inviteId, surveyId });
    } else {
      next(
        new ServerError({
          code: 400,
          message: "Missing data from end of survey redirect, please check survey " + surveyId,
        })
      );
    }
    res.redirect(`${settings.host}/${getPagePath(TOURNAMENT_DASHBOARD_PAGE)}`);
  } catch (e) {
    logger.fatal("Unable to mark survey completion");
    logger.fatal(e as Error);
    next(e);
  }
});

tournamentRouter.get("/invite-status", async (req: Request, res: Response, next) => {
  try {
    const user = req.user as User;
    if (!user) {
      res.status(401);
    }
    const tournamentData = await getServices().tournament.getTournamentRoundInviteStatus(user);
    res.json(tournamentData);
  } catch (e) {
    logger.fatal("Unable to get tournament invite status for user %o", req);
    logger.fatal(e as Error);
    next(e);
  }
});

tournamentRouter.get("/status", async (req: Request, res: Response, next) => {
  try {
    const tournamentData = await getServices().tournament.getTournamentStatus();
    res.json(tournamentData);
  } catch (e) {
    logger.fatal("Unable to get tournament status");
    logger.fatal(e as Error);
    next(e);
  }
});

tournamentRouter.get("/schedule", async (req: Request, res: Response, next) => {
  const user = req.user as User;
  if (!user) {
    res.status(401);
  }
  try {
    const schedule = await getServices().tournament.getTournamentRoundSchedule({ user });
    res.json(schedule);
  } catch (e) {
    logger.fatal("Unable to get tournament round schedule: %s", e);
    next(e);
  }
});

tournamentRouter.post("/signup/add", async (req: Request, res: Response, next) => {
  const user = req.user as User;
  if (!user) {
    res.status(401);
  }
  const tournamentRoundDateId = Number(req.query.tournamentRoundDateId);
  const inviteId = Number(req.query.inviteId);
  try {
    // consider sending an immediate google calendar via email
    // https://github.com/virtualcommons/planning/issues/69
    await getServices().tournament.addSignup(user, tournamentRoundDateId, inviteId);
    const schedule = await getServices().tournament.getTournamentRoundSchedule({ user });
    res.json(schedule);
  } catch (e) {
    logger.fatal("Unable to add tournament signup: %s", e);
    next(e);
  }
});

tournamentRouter.post("/signup/remove", async (req: Request, res: Response, next) => {
  const user = req.user as User;
  if (!user) {
    res.status(401);
  }
  const tournamentRoundDateId = Number(req.query.tournamentRoundDateId);
  const inviteId = Number(req.query.inviteId);
  try {
    await getServices().tournament.removeSignup(user, tournamentRoundDateId, inviteId);
    const schedule = await getServices().tournament.getTournamentRoundSchedule({ user });
    res.json(schedule);
  } catch (e) {
    logger.fatal("Unable to remove tournament signup: %s", e);
    next(e);
  }
});
