import {Router, Request, Response} from 'express';
import { getServices } from '@port-of-mars/server/services';
import { User } from '@port-of-mars/server/entity/User';

export const dashboardRouter = Router();

function checkUser(req: Request, res: Response){
}

dashboardRouter
.get('/', async (req, res, next) => {

  try{
    const dashboard = getServices().dashboard;
    const tournament = getServices().tournament;
    
    let tutorial = dashboard.hasUserPassedTutorial(req.user as User);
    
    let currentTournamentRound = await tournament.getCurrentTournamentRound();
    let roundInviteList = await tournament.getInviteList();

    let surveys = dashboard.getUserSurveys(currentTournamentRound,roundInviteList,(req.user as User).id)
    
    res.json({
      actionItems: [tutorial, ...surveys].filter(item => {
        return item != undefined;
      }),
      upcomingGames: [],
      stats: [],
    });
  }
  catch(e){
    next(e);
  }
  
})
//this route is only for testing. it will be removed when the registration method is complete
.get('/createInvite', async (req,res,next) => {
  try{
    const registration = getServices().registration;

    //assuming the round number is 1
    await registration.createInvites([(req.user as User).id],1);

    res.json({"created invite for ":(req.user as User).id})

  }
  catch(e){
    next(e);
  }
});

