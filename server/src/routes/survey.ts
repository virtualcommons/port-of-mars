import { Router, Request, Response } from 'express';
import { getServices } from '@port-of-mars/server/services';
import { getPagePath, DASHBOARD_PAGE } from '@port-of-mars/shared/routes';
import { settings, getLogger } from '@port-of-mars/server/settings';
import { ServerError } from '@port-of-mars/server/util';

export const surveyRouter = Router();

const logger = getLogger(__filename);

// https://portofmars.asu.edu/survey/complete/?pid=${e://Field/pid}&surveyId=${e://Field/SurveyID}&tid=${e://Field/tid}
// http://localhost:8081/survey/complete?pid=cdf6a97d-d537-4fc5-b655-7c22651cc61c&tid=2&surveyId=SV_0c8tCMZkAUh4V8x

surveyRouter
  .get('/complete', async (req: Request, res: Response, next) => {
    logger.debug("trying to mark survey complete");
    try {
      const participantId = String(req.query.pid);
      const inviteId = Number(req.query.tid);
      const surveyId = String(req.query.surveyId);
      logger.debug("marking survey %s completion for %s on %d", surveyId, participantId, inviteId);
      if (participantId && surveyId && inviteId) {
        await getServices().tournament.setSurveyComplete({inviteId, surveyId});
      }
      else {
        next(new ServerError({code: 400, message: "Missing data from end of survey redirect, please check survey " + surveyId}));
      }
      const referrer = req.get('Referrer');
      res.redirect(`${settings.host}/${getPagePath(DASHBOARD_PAGE)}`)
    }
    catch (e) {
      logger.fatal(e);
      next(e);
    }
  })
