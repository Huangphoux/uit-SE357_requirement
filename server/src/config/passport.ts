import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { prisma } from "../lib/prisma.js";
import { comparePassword } from "../helpers/hashPasswords.js";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: string;
    }
  }
}

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        return done(null, {
          id: user.id,
          email: user.email,
          role: user.role,
        });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return done(new Error("User not found"));
    }

    done(null, {
      id: user.id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    done(error);
  }
});

export default passport;
