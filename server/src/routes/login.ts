import {getUserByJWT, getUserByUsername, JWT_SECRET} from '@/services/account';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import {isPage, LOGIN_PAGE, Page, PAGE_DEFAULT, PAGE_META, PAGES} from "shared/routes";

export const JWT_TOKEN_NAME = 'jwt';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    let user = await getUserByUsername(req.body.username);
    if (user) {
      const { username, passedQuiz } = user;
      res.cookie(JWT_TOKEN_NAME, jwt.sign({ username }, JWT_SECRET, { expiresIn: '12h' }), { httpOnly: true });
      res.send();
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
  const pageName = req.params.page;
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
  res.json(resJson);
}