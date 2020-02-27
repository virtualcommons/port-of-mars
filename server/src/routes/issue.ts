import { NextFunction, Request, Response, Router } from 'express';
import { getUserByJWT } from '@/services/auth';
import { auth } from '@/routes/middleware';
import { sendIssue } from '@/services/email';

export const issueRouter = Router();

issueRouter.post(
  '/new',
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token: string = (req as any).token;
      const user = await getUserByJWT(token);
      if (user === undefined)
        return res.status(401).send(`User not found with provided JWT.`);

      const issueText: string = req.body.issueText;
      const userEmail: string = user.email;

      const sentIssue = await sendIssue(issueText, userEmail);
      res.sendStatus(201);
    } catch (e) {
      next(e);
    }
  }
);
