import Send from "util/response";
import { prisma } from "util/db";
import { Request, Response } from "express";
import { logger } from "util/logger";
import { getRequestIp, writeAuditLog } from "util/auditLogger";

/**
 * Get the user information based on the authenticated user.
 * The userId is passed from the AuthMiddleware.
 */

export default class UserController {
  static async getUser(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return Send.notFound(res, {}, "User not found");
      }

      await writeAuditLog({
        category: "ADMIN",
        action: "USER_PROFILE_READ",
        success: true,
        userId: String(userId),
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
        resourceType: "USER",
        resourceId: userId,
      });

      logger.info({ userId }, "User profile fetched successfully");

      return Send.success(res, { user });
    } catch (error) {
      logger.error({ error }, "Error fetching user info");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async listTeachers(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;

      const user = await prisma.user.findMany({
        where: { role: "TEACHER" },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return Send.notFound(res, {}, "User not found");
      }

      await writeAuditLog({
        category: "ADMIN",
        action: "TEACHERS_LIST_READ",
        success: true,
        userId: userId ? String(userId) : undefined,
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
        resourceType: "USER",
      });

      logger.info({ userId }, "Teachers list fetched successfully");

      return Send.success(res, { user });
    } catch (error) {
      logger.error({ error }, "Error fetching user info");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async listStudents(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;

      const user = await prisma.user.findMany({
        where: { role: "STUDENT" },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return Send.notFound(res, {}, "User not found");
      }

      await writeAuditLog({
        category: "ADMIN",
        action: "STUDENTS_LIST_READ",
        success: true,
        userId: userId ? String(userId) : undefined,
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
        resourceType: "USER",
      });

      logger.info({ userId }, "Students list fetched successfully");

      return Send.success(res, { user });
    } catch (error) {
      logger.error({ error }, "Error fetching user info");
      return Send.error(res, {}, "Internal server error");
    }
  }
  static async listUsers(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;

      const user = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return Send.notFound(res, {}, "User not found");
      }

      await writeAuditLog({
        category: "ADMIN",
        action: "USERS_LIST_READ",
        success: true,
        userId: userId ? String(userId) : undefined,
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
        resourceType: "USER",
      });

      logger.info({ userId }, "All users list fetched successfully");

      return Send.success(res, { user });
    } catch (error) {
      logger.error({ error }, "Error fetching user info");
      return Send.error(res, {}, "Internal server error");
    }
  }
}
