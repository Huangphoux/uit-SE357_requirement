import Send from "util/response";
import { Request, Response } from "express";
import { logger } from "util/logger";
import UsersService from "./users.service";
import { getRequestIp, writeAuditLog } from "util/auditLogger";

export default class UsersController {
  static async getUsers(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { q, role } = req.query;
      const userId = (req as any).userId;

      const result = await UsersService.find(id, q as string, role as string);

      if (!result) {
        return Send.notFound(res, {}, id ? "User not found" : "Users not found");
      }

      await writeAuditLog({
        category: "ADMIN",
        action: id ? "USER_READ_ONE" : "USER_READ_LIST",
        success: true,
        userId: userId ? String(userId) : undefined,
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
        resourceType: "USER",
        resourceId: id,
      });

      logger.info({ userId, targetUserId: id, role }, "User fetched successfully");

      const response = id ? { user: result } : { users: result };
      return Send.success(res, response);
    } catch (error) {
      logger.error({ error }, "Error fetching users");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const adminId = (req as any).userId;
      const { username, email, password, role } = req.body;

      const user = await UsersService.create({
        username,
        email,
        password,
        role,
      });

      await writeAuditLog({
        category: "ADMIN",
        action: "USER_CREATE",
        success: true,
        userId: adminId ? String(adminId) : undefined,
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
        resourceType: "USER",
        resourceId: user.id,
        metadata: { email, role },
      });

      logger.info({ adminId, userId: user.id, email, role }, "User created successfully");

      return Send.success(res, { user }, "User created successfully");
    } catch (error: any) {
      logger.error({ error }, "Error creating user");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const adminId = (req as any).userId;
      const { username, email, password, role } = req.body;

      const user = await UsersService.update(id, {
        username,
        email,
        password,
        role,
      });

      await writeAuditLog({
        category: "ADMIN",
        action: "USER_UPDATE",
        success: true,
        userId: adminId ? String(adminId) : undefined,
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
        resourceType: "USER",
        resourceId: id,
      });

      logger.info({ adminId, userId: id }, "User updated successfully");

      return Send.success(res, { user }, "User updated successfully");
    } catch (error: any) {
      logger.error({ error }, "Error updating user");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const adminId = (req as any).userId;

      await UsersService.delete(id);

      await writeAuditLog({
        category: "ADMIN",
        action: "USER_DELETE",
        success: true,
        userId: adminId ? String(adminId) : undefined,
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
        resourceType: "USER",
        resourceId: id,
      });

      logger.info({ adminId, userId: id }, "User deleted successfully");

      return Send.success(res, {}, "User deleted successfully");
    } catch (error) {
      logger.error({ error }, "Error deleting user");
      return Send.error(res, {}, "Internal server error");
    }
  }
}
