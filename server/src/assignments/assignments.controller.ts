import Send from "util/response";
import { Request, Response } from "express";
import { logger } from "util/logger";
import AssignmentsService from "./assignments.service";

export default class AssignmentsController {
  static async getAssignments(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { classId } = req.query;

      const result = await AssignmentsService.find(id, classId as string);

      if (!result) {
        return Send.notFound(res, {}, id ? "Assignment not found" : "Assignments not found");
      }

      const response = id ? { assignment: result } : { assignments: result };
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

      return Send.success(res, { assignment }, "Assignment created successfully");
    } catch (error: any) {
      logger.error({ error }, "Error creating assignment");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async updateAssignment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, dueDate, maxScore } = req.body;

      const assignment = await AssignmentsService.update(id, {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        maxScore,
      });

      return Send.success(res, { assignment }, "Assignment updated successfully");
    } catch (error: any) {
      logger.error({ error }, "Error updating assignment");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async deleteAssignment(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await AssignmentsService.delete(id);

      return Send.success(res, {}, "Assignment deleted successfully");
    } catch (error: any) {
      logger.error({ error }, "Error deleting assignment");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }
}
