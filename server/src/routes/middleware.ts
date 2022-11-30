import { Request, Response } from 'express';
import { NextFunction } from 'connect';
import { settings } from '@port-of-mars/server/settings';
import _ from 'lodash';
import { toUrl } from '@port-of-mars/server/util';
import { LOGIN_PAGE } from '@port-of-mars/shared/routes';
import { DashboardMessage } from '@port-of-mars/shared/types';
import { User } from '@port-of-mars/server/entity';

const logger = settings.logging.getLogger(__filename);

// exclude a route from middleware
export function unless(path: any, middleware: any) {
  return function(req: Request, res: Response, next: NextFunction) {
    if (path === req.path) {
      return next();
    } else {
      return middleware(req, res, next);
    }
  }
}

export function isAdminAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (_.isUndefined(req.user)) {
    logger.trace('no user on the request, redirecting to login page');
    return res.status(401).json({ kind: 'info', message: 'Please sign in before continuing.'});
  }
  else if (! (req.user as User).isAdmin) {
    logger.warn('Non-admin user attempting to access admin section: %o', req.user);
    return res.status(403).json({ kind: 'info', message: 'You do not appear to have access to this area. This has been logged.'});
  }
  else {
    logger.trace('admin user accessing admin section: %o', req.user);
    next();
  }
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (_.isUndefined(req.user)) {
    const loginUrl = toUrl(LOGIN_PAGE);
    logger.trace('no user on the request, redirecting to login page: %s', loginUrl)
    return res.status(401).json({ kind: 'info', message: 'Please sign in before continuing.'});
  }
  else {
    next();
  }
}

export function isVerified(req: Request, res: Response, next: NextFunction) {
  if (_.isUndefined(req.user)) {
    const loginUrl = toUrl(LOGIN_PAGE);
    logger.trace('no user on the request, redirecting to login page: %s', loginUrl);
    return res.status(401).json({ kind: 'info', message: 'Please sign in before continuing.'});
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
