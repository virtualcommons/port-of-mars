import { Request, Response } from 'express';
import { NextFunction } from 'connect';
import { settings } from '@port-of-mars/server/settings';
import _ from 'lodash';
import { toUrl } from '@port-of-mars/server/util';
import { LOGIN_PAGE } from '@port-of-mars/shared/routes';
import { DashboardMessage } from '@port-of-mars/shared/types';
import { User } from '@port-of-mars/server/entity';

const logger = settings.logging.getLogger(__filename);

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (_.isUndefined(req.user)) {
    const loginUrl = toUrl(LOGIN_PAGE);
    logger.trace('no user on the request, redirecting to login page: %s', loginUrl)
    res.redirect(loginUrl);
  }
  else {
    next();
  }
}

export function isVerified(req: Request, res: Response, next: NextFunction) {
  if (_.isUndefined(req.user)) {
    const loginUrl = toUrl(LOGIN_PAGE);
    logger.trace('no user on the request, redirecting to login page: %s', loginUrl);
    res.redirect(loginUrl);
  }
  else {
    const verified = (req.user as User).isVerified;
    if (verified) {
      return next();
    }
    else {
      const message: DashboardMessage = { kind: 'danger', message: 'Please verify your account before proceeding.' };
      return res.status(403).json(message);
    }
  }
}