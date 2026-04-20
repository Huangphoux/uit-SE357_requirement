import Send from "util/response";
import { Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.schema";
import { z } from "zod";
import AuthService from "./auth.service";
import { logger } from "util/logger";
import { getRequestIp, writeAuditLog } from "util/auditLogger";

const ONE_MINUTE: number = 60 * 1000; // one minute in milliseconds

export default class AuthController {
  static async register(req: Request, res: Response) {
    const { name, email, password } = req.body as z.infer<typeof registerSchema>;

    try {
      const newUser = await AuthService.register(name, email, password);

      await writeAuditLog({
        category: "AUTH",
        action: "REGISTER_SUCCESS",
        success: true,
        userId: newUser.id,
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
        resourceType: "USER",
        resourceId: newUser.id,
      });

      return Send.success(
        res,
        { id: newUser.id, name: newUser.name, email: newUser.email },
        "User successfully registered."
      );
    } catch (error: any) {
      await writeAuditLog({
        category: "AUTH",
        action: "REGISTER_FAILED",
        success: false,
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 500,
        message: error?.message,
        metadata: { email },
      });

      if (error.code === "P2002") {
        // P2002 Prisma error code: unique constraint violation
        return Send.error(res, null, "Email already exists.");
      }

      logger.error({ error }, "Registration failed");
      return Send.error(res, null, "Registration failed.");
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body as z.infer<typeof loginSchema>;

    // lấy IP chuẩn (support proxy)
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
      req.socket.remoteAddress ||
      "";

    try {
      const { user, accessToken, refreshToken } = await AuthService.login(
        email,
        password,
        ip
      );

      await writeAuditLog({
        category: "AUTH",
        action: "LOGIN_SUCCESS",
        success: true,
        userId: user.id,
        ip,
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * ONE_MINUTE,
        sameSite: "strict",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * ONE_MINUTE,
        sameSite: "strict",
      });

      return Send.success(res, {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (error: any) {
      await writeAuditLog({
        category: "AUTH",
        action: "LOGIN_FAILED",
        success: false,
        ip,
        method: req.method,
        path: req.originalUrl,
        statusCode: 500,
        message: error?.message,
        metadata: { email },
      });

      logger.error({ error }, "Login Failed");

      return Send.error(
        res,
        null,
        error.message || "Login failed."
      );
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const userId = (req as any).userId || (req as any).user?.userId;
      if (userId) {
        await AuthService.logout(userId);
      }

      await writeAuditLog({
        category: "AUTH",
        action: "LOGOUT_SUCCESS",
        success: true,
        userId: userId ? String(userId) : undefined,
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
      });

      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      return Send.success(res, null, "Logged out successfully.");
    } catch (error) {
      await writeAuditLog({
        category: "AUTH",
        action: "LOGOUT_FAILED",
        success: false,
        userId: (req as any).userId ? String((req as any).userId) : undefined,
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 500,
      });

      logger.error({ error }, "Logout failed");
      return Send.error(res, null, "Logout failed.");
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const refreshToken = req.cookies.refreshToken;

      const newAccessToken = await AuthService.refreshToken(userId, refreshToken);

      await writeAuditLog({
        category: "AUTH",
        action: "REFRESH_TOKEN_SUCCESS",
        success: true,
        userId: userId ? String(userId) : undefined,
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
      });

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * ONE_MINUTE,
        sameSite: "strict",
      });

      return Send.success(res, {
        message: "Access token refreshed successfully",
      });
    } catch (error) {
      await writeAuditLog({
        category: "AUTH",
        action: "REFRESH_TOKEN_FAILED",
        success: false,
        userId: (req as any).userId ? String((req as any).userId) : undefined,
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 500,
      });

      logger.error({ error }, "Refresh Token failed");
      return Send.error(res, null, "Failed to refresh token");
    }
  }
}
