import { Request, Response } from 'express';
import { NextFunction } from 'connect';
import {settings} from '@/settings';
import _ from 'lodash';
import { toUrl } from '@/util';
import { LOGIN_PAGE } from 'shared/routes';

const logger = settings.logging.getLogger(__filename);

export function auth(req: Request, res: Response, next: NextFunction) {
  if (_.isUndefined(req.user)) {
    const loginUrl = toUrl(LOGIN_PAGE);
    logger.trace('no user on the request, redirecting to login page: ', loginUrl)
    res.status(404).send();

    // res.redirect(loginUrl);
  }
  else {
    next();
  }
}
