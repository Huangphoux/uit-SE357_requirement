import Send from "util/response";
import { Request, Response } from "express";
import { logger } from "util/logger";
import ClassesService from "./classes.service";
import { getRequestIp, writeAuditLog } from "util/auditLogger";

export default class ClassesController {
  static async getClasses(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { q } = req.query;
      const userId = (req as any).userId;

      const result = await ClassesService.find(id, q as string);

      if (!result) {
        return Send.notFound(res, {}, id ? "Class not found" : "Classes not found");
      }

      await writeAuditLog({
        category: "FILE_ACCESS",
        action: id ? "CLASS_READ_ONE" : "CLASS_READ_LIST",
        success: true,
        userId: userId ? String(userId) : undefined,
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
        resourceType: "CLASS",
        resourceId: id,
      });

      logger.info({ userId, classId: id, query: q }, "Class fetched successfully");

      const response = id ? { class: result } : { classes: result };
      return Send.success(res, response);
    } catch (error) {
      logger.error({ error }, "Error fetching classes");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async createClass(req: Request, res: Response) {
    try {
      const { courseId, title, teacherId } = req.body;
      const userId = (req as any).userId;

      const classData = await ClassesService.create({
        courseId,
        title,
        teacherId,
      });

      await writeAuditLog({
        category: "ADMIN",
        action: "CLASS_CREATE",
        success: true,
        userId: userId ? String(userId) : undefined,
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
        resourceType: "CLASS",
        resourceId: classData.id,
        metadata: { courseId, title, teacherId },
      });

      logger.info({ userId, classId: classData.id, courseId }, "Class created successfully");

      return Send.success(res, { class: classData }, "Class created successfully");
    } catch (error: any) {
      logger.error({ error }, "Error creating class");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async updateClass(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;
      const { courseId, title, teacherId } = req.body;

      const classData = await ClassesService.update(id, {
        courseId,
        title,
        teacherId,
      });

      await writeAuditLog({
        category: "ADMIN",
        action: "CLASS_UPDATE",
        success: true,
        userId: userId ? String(userId) : undefined,
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
        resourceType: "CLASS",
        resourceId: id,
      });

      logger.info({ userId, classId: id }, "Class updated successfully");

      return Send.success(res, { class: classData }, "Class updated successfully");
    } catch (error: any) {
      logger.error({ error }, "Error updating class");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async deleteClass(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;

      await ClassesService.delete(id);

      await writeAuditLog({
        category: "ADMIN",
        action: "CLASS_DELETE",
        success: true,
        userId: userId ? String(userId) : undefined,
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
        resourceType: "CLASS",
        resourceId: id,
      });

      logger.info({ userId, classId: id }, "Class deleted successfully");

      return Send.success(res, {}, "Class deleted successfully");
    } catch (error: any) {
      logger.error({ error }, "Error deleting class");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async getClassStudents(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;

      const students = await ClassesService.getStudents(id);

      await writeAuditLog({
        category: "FILE_ACCESS",
        action: "CLASS_STUDENTS_READ",
        success: true,
        userId: userId ? String(userId) : undefined,
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
        resourceType: "CLASS",
        resourceId: id,
      });

      logger.info({ userId, classId: id }, "Class students fetched successfully");

      return Send.success(res, { students });
    } catch (error: any) {
      logger.error({ error }, "Error fetching class students");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }
}
