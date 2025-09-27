import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3000;

import indexRouter from "./routes/indexRouter.js";
app.use("/index", indexRouter);

import authorRouter from "./routes/authorRouter.js";
app.use("/authors", authorRouter);

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`My first Express app - listening port ${PORT}!`);
});

