import { prisma } from "util/db";
import jwt from "jsonwebtoken";
import authConfig from "config/auth.config";
import lockoutConfig from "config/lockout.config";
import { comparePassword, hashPassword } from "util/hash";
// import { z } from "zod";
// import AuthSchema from "./auth.schema";

// const ONE_MINUTE: number = 60 * 1000; // one minute in milliseconds

export default class AuthService {
  static async register(name: string, email: string, password: string) {
    if (await prisma.user.findUnique({ where: { email } })) {
      throw new Error("Email is already in use");
    }

    const user = await prisma.user.create({
      data: { name, email, password: await hashPassword(password) },
    });

    return user;
  }

  static async login(email: string, password: string, ip: string) {
    const MAX_ATTEMPTS = parseInt(lockoutConfig.maxAttempts);
    const BLOCK_TIME = parseInt(lockoutConfig.lockoutTime);

    const attempt = await prisma.loginAttempt.findUnique({
      where: { ip },
    });

    if (attempt?.blockedUntil && attempt.blockedUntil > new Date()) {
      throw new Error("Too many failed attempts. Try again later.");
    }

    const user = await prisma.user.findUnique({ where: { email } });

    const isPasswordValid =
      user && (await comparePassword(password, user.password));

    if (!isPasswordValid) {
      if (!attempt) {
        await prisma.loginAttempt.create({
          data: {
            ip,
            attempts: 1,
            lastTry: new Date(),
          },
        });
      } else {
        const newAttempts = attempt.attempts + 1;

        let blockedUntil: Date | null = null;

        if (newAttempts >= MAX_ATTEMPTS) {
          blockedUntil = new Date(Date.now() + BLOCK_TIME);
        }

        await prisma.loginAttempt.update({
          where: { ip },
          data: {
            attempts: newAttempts,
            blockedUntil,
            lastTry: new Date(),
          },
        });
      }

      throw new Error("Invalid credentials");
    }

    if (attempt) {
      await prisma.loginAttempt.delete({
        where: { ip },
      });
    }

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      authConfig.secret,
      {
        expiresIn: authConfig.secret_expires_in as any,
      }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, role: user.role },
      authConfig.refresh_secret,
      {
        expiresIn: authConfig.refresh_secret_expires_in as any,
      }
    );

    await prisma.user.update({
      where: { email },
      data: { refreshToken },
    });

    return { user, accessToken, refreshToken };
  }

  static async logout(userId: string) {
    await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
  }

  static async refreshToken(userId: string, refreshToken: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.refreshToken !== refreshToken) {
      throw new Error("Invalid refresh token");
    }

    const newAccessToken = jwt.sign({ userId: user.id }, authConfig.secret, {
      expiresIn: authConfig.secret_expires_in as any,
    });

    return newAccessToken;
  }
}
