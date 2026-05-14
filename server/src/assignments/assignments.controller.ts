import Send from "util/response";
import { Request, Response } from "express";
import { logger } from "util/logger";
import AssignmentsService from "./assignments.service";
import { getRequestIp, writeAuditLog } from "util/auditLogger";

export default class AssignmentsController {
  static async getAssignments(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { classId } = req.query;
      const userId = (req as any).userId;

      const result = await AssignmentsService.find(id, classId as string);

      if (!result) {
        return Send.notFound(res, {}, id ? "Assignment not found" : "Assignments not found");
      }

      await writeAuditLog({
        category: "FILE_ACCESS",
        action: id ? "ASSIGNMENT_READ_ONE" : "ASSIGNMENT_READ_LIST",
        success: true,
        userId: userId ? String(userId) : undefined,
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
        resourceType: "ASSIGNMENT",
        resourceId: id,
      });

      logger.info({ path: req.originalUrl, action: "getAssignments", assignmentId: id }, "Assignment fetched successfully");

      const response = id ? { assignment: result } : { assignments: result };
      return Send.success(res, response);
    } catch (error) {
      logger.error({ error }, "Error fetching assignments");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async getAssignmentsByStudent(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;

      const result = await AssignmentsService.findByStudent(userId);

      if (!result) {
        return Send.notFound(res, {}, userId ? "Assignment not found" : "Assignments not found");
      }

      await writeAuditLog({
        category: "FILE_ACCESS",
        action: "ASSIGNMENT_READ_BY_STUDENT",
        success: true,
        userId: userId ? String(userId) : undefined,
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
        resourceType: "ASSIGNMENT",
      });

      logger.info({ userId }, "Student assignments fetched successfully");

      const response = userId ? { assignment: result } : { assignments: result };
      return Send.success(res, response);
    } catch (error) {
      logger.error({ error }, "Error fetching assignments");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async createAssignment(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { title, description, classId, dueDate, maxScore } = req.body;

      if (!userId) {
        return Send.unauthorized(res, {}, "User not authenticated");
      }

      const assignment = await AssignmentsService.create({
        title,
        description,
        classId,
        createdBy: userId,
        dueDate: new Date(dueDate),
        maxScore,
      });

      await writeAuditLog({
        category: "ADMIN",
        action: "ASSIGNMENT_CREATE",
        success: true,
        userId: String(userId),
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
        resourceType: "ASSIGNMENT",
        resourceId: assignment.id,
        metadata: { classId, title },
      });

      logger.info({ userId, assignmentId: assignment.id, classId }, "Assignment created successfully");

      return Send.success(res, { assignment }, "Assignment created successfully");
    } catch (error: any) {
      logger.error({ error }, "Error creating assignment");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async updateAssignment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;
      const { title, description, dueDate, maxScore } = req.body;

      const assignment = await AssignmentsService.update(id, {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        maxScore,
      });

      await writeAuditLog({
        category: "ADMIN",
        action: "ASSIGNMENT_UPDATE",
        success: true,
        userId: userId ? String(userId) : undefined,
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
        resourceType: "ASSIGNMENT",
        resourceId: id,
      });

      logger.info({ userId, assignmentId: id }, "Assignment updated successfully");

      return Send.success(res, { assignment }, "Assignment updated successfully");
    } catch (error: any) {
      logger.error({ error }, "Error updating assignment");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async deleteAssignment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;

      await AssignmentsService.delete(id);

      await writeAuditLog({
        category: "ADMIN",
        action: "ASSIGNMENT_DELETE",
        success: true,
        userId: userId ? String(userId) : undefined,
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
        resourceType: "ASSIGNMENT",
        resourceId: id,
      });

      logger.info({ userId, assignmentId: id }, "Assignment deleted successfully");

      return Send.success(res, {}, "Assignment deleted successfully");
    } catch (error: any) {
      logger.error({ error }, "Error deleting assignment");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }
}
