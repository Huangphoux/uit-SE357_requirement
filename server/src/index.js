const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 3000;

const authorRouter = require("./routes/authorRouter");
// const bookRouter = require("./routes/bookRouter");
// const indexRouter = require("./routes/indexRouter");

app.use("/authors", authorRouter);
// app.use("/books", bookRouter);
// app.use("/", indexRouter);

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }

  console.log(`My first Express app - listening port ${PORT}!`);
});

