import {Router, Request, Response} from 'express';
import { getServices } from '@port-of-mars/server/services';
import { User } from '@port-of-mars/server/entity/User';

export const dashboardRouter = Router();

function checkUser(req: Request, res: Response){
}

dashboardRouter.get('/', async (req, res, next) => {

  try{
    const dashboard = getServices().dashboard;
    const tournamnet = getServices().tournament;
    
    let tutorial = await dashboard.hasUserPassedTutorial(req.user as User);
    
    let currentTournamentRound = await tournamnet.getCurrentTournamentRound();
    let introductionSurvey = await dashboard.getIntroSurveyUrl(currentTournamentRound);
    let exitSurvey = await dashboard.getExitSurveyUrl(currentTournamentRound);
    //let isInGame = await dashboard.isUserInGame(req.user as User);
    
    res.json({
      actionItems: [tutorial, introductionSurvey, exitSurvey],
      upcomingGames: [],
      stats: [],
    });
  }
  catch(e){
    next(e);
  }
  
});
