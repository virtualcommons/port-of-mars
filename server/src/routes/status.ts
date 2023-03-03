import { Router, Request, Response } from "express";

export const statusRouter = Router();

statusRouter.get("/", async (req: Request, res: Response, next) => {
  // provide initial data to client
  try {
    res.json({
      user: req.user,
    });
  } catch (e) {
    next(e);
  }
});
