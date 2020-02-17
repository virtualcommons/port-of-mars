import { Request, Response } from 'express';
import { NextFunction } from 'connect';

export function auth(req: Request, res: Response, next: NextFunction) {
  const bearer = req.headers.authorization;
  const parts: Array<string> = bearer ? bearer.split(' ') : [];
  if (bearer && parts.length === 2 && parts[0] === 'Bearer') {
    (req as any).token = parts[1];
  }
  next();
}
