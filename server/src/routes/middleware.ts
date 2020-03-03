import { Request, Response } from 'express';
import { NextFunction } from 'connect';
import {settings} from "@/settings";

const logger = settings.logging.getLogger(__filename);

export function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.jwt;
  if (token) {
    logger.trace({token});
    (req as any).token = token;
  }
  next();
}
