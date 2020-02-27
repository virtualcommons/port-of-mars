import { Request, Response } from 'express';
import { NextFunction } from 'connect';

export function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.jwt;
  if (token) {
    console.log({token});
    (req as any).token = token;
  }
  next();
}
