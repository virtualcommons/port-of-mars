import { Router, Request, Response } from 'express';
import { getServices } from '@port-of-mars/server/services';
import { User } from '@port-of-mars/server/entity/User';
import { isAuthenticated } from '@port-of-mars/server/routes/middleware';

export const dashboardRouter = Router();

dashboardRouter.use(isAuthenticated);

dashboardRouter
  .get('/', async (req: Request, res: Response, next) => {
    try {
      const dashboardData = await getServices().dashboard.getData(req.user as User);
      res.json(dashboardData);
    }
    catch (e) {
      next(e);
    }
  })
  //this route is only for testing. it will be removed when the registration method is complete
  .get('/createInvite', async (req, res, next) => {
    try {
      const tournament = getServices().tournament;

      //assuming the round number is 1
      await tournament.createInvites([(req.user as User).id], 1);

      res.json({ message: "created invite for " + (req.user as User).id })

    }
    catch (e) {
      next(e);
    }
  });

