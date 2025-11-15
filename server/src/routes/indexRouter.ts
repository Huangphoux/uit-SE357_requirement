import { Router, Request, Response } from "express";

const indexRouter = Router();

indexRouter.get("/", (_req: Request, res: Response) => {
  res.send("You're in Index!");
});

export default indexRouter;
