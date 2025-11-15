// routes/authorRouter.ts
import { Router, Request, Response } from "express";

import { getAuthorById } from "../controllers/authorController.js";

const authorRouter = Router();

authorRouter.get("/", (_req: Request, res: Response) => {
  res.send("All authors");
});
authorRouter.get("/:authorId", getAuthorById);

export default authorRouter;
