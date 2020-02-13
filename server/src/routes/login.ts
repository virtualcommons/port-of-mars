import { getUserByUsername, JWT_SECRET } from '@/services/account';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    let user = await getUserByUsername(req.body.username);
    if (user) {
      const { username, passedQuiz } = user;
      res.json({
        token: jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' }),
        username,
        passedQuiz
      });
    } else {
      res
        .status(403)
        .json(`user account with username ${req.body.username} not found`);
    }
  } catch (e) {
    next(e);
  }
}
