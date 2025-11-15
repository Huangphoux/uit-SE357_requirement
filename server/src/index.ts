import express from "express";
import session from "express-session";
import dotenv from "dotenv";
// @ts-expect-error - no types available for connect-sqlite3
import connectSqlite3 from "connect-sqlite3";
import passport from "./config/passport.js";
import indexRouter from "./routes/indexRouter.js";
import authorRouter from "./routes/authorRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const SQLiteStore = connectSqlite3(session);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({
      db: "sessions.db",
      dir: "./prisma",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/index", indexRouter);
app.use("/authors", authorRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});
