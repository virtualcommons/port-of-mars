import { Router, Request, Response } from 'express';
import { getServices } from '@port-of-mars/server/services';

export const statusRouter = Router();

statusRouter.get('/', async (req: Request, res: Response, next) => {
  // FIXME: add richer tournament status object to output
  try {
    const isSignUpEnabled = await getServices().settings.isSignUpEnabled();
    let tournamentRoundNumber = 1;
    if (! isSignUpEnabled) {
      const tournamentRound = await getServices().tournament.getCurrentTournamentRound();
      tournamentRoundNumber = tournamentRound.roundNumber;
    }

    res.json({
      isSignUpEnabled,
      user: req.user,
      tournamentRoundNumber,
    });
  }
  catch (e) {
    next(e);
  }
});