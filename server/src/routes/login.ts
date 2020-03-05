import {findByUsername} from '@/services/account';
import {generateJWT, getUserByJWT, setJWTCookie} from '@/services/auth';
import { NextFunction, Request, Response } from 'express';
import {isPage, LOGIN_PAGE, Page, PAGE_DEFAULT, PAGE_META, PAGES} from "shared/routes";
import cookie from 'cookie';

export const JWT_TOKEN_NAME = 'jwt';

export async function login(req: Request, res: Response, next: NextFunction) {
  // FIXME: only allow this when config.devMode = true
  try {
    let user = await findByUsername(req.body.username);
    if (user) {
      const expiration = 604800000;
      res.json({ cookie: cookie.serialize('jwt', generateJWT(req.body.username), {path: '/', expires: new Date(Date.now() + expiration)})});
    } else {
      res
        .status(403)
        .json(`user account with username ${req.body.username} not found`);
    }
  } catch (e) {
    next(e);
  }
}

export async function nextPage(req: Request, res: Response, next: NextFunction) {
  const pageName = req.params.pageName;
  const resJson: { page: Page } = {page: LOGIN_PAGE};
  if (!isPage(pageName)) {
    res.json(resJson);
    return;
  }
  const page = PAGE_META[pageName];
  const token: string = (req as any).token;
  const user = token ? await getUserByJWT(token) : undefined;
  if (page.meta.requiresAuth && user?.passedQuiz) {
    resJson.page = pageName;
  }
  if (!page.meta.requiresAuth) {
    resJson.page = pageName;
  }
  res.json(resJson);
}
