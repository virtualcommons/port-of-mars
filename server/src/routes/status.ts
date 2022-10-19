import { Router, Request, Response } from 'express';
import { getServices } from '@port-of-mars/server/services';
import { TournamentStatus } from '@port-of-mars/shared/types';

export const statusRouter = Router();

statusRouter.get('/', async (req: Request, res: Response, next) => {
  // provide tournament status + schedule
  try {
    const gameDates = await getServices().schedule.getScheduledDates();
    res.json({
      user: req.user,
      schedule: gameDates.map(d => d.date.getTime()),
    });
  }
  catch (e) {
    next(e);
  }
});