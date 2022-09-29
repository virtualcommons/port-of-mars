import { Router, Request, Response } from 'express';
import { getServices } from '@port-of-mars/server/services';
import { User } from '@port-of-mars/server/entity/User';
import { isAuthenticated } from '@port-of-mars/server/routes/middleware';
export const dashboardRouter = Router();

dashboardRouter
  .get('/', isAuthenticated, async (req: Request, res: Response, next) => {
    try {
      const dashboardData = await getServices().dashboard.getData(req.user as User);
      res.json(dashboardData);
    }
    catch (e) {
      next(e);
    }
  });