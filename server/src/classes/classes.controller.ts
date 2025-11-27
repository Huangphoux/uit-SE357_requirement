import Send from "util/response";
import { Request, Response } from "express";
import { logger } from "util/logger";
import ClassesService from "./classes.service";

export default class ClassesController {
  static async getClasses(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { q } = req.query;

      const result = await ClassesService.find(id, q as string);

      if (!result) {
        return Send.notFound(res, {}, id ? "Class not found" : "Classes not found");
      }

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

      const classData = await ClassesService.create({
        courseId,
        title,
        teacherId,
      });

      return Send.success(res, { class: classData }, "Class created successfully");
    } catch (error: any) {
      logger.error({ error }, "Error creating class");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async updateClass(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { courseId, title, teacherId } = req.body;

      const classData = await ClassesService.update(id, {
        courseId,
        title,
        teacherId,
      });

      return Send.success(res, { class: classData }, "Class updated successfully");
    } catch (error: any) {
      logger.error({ error }, "Error updating class");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async deleteClass(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await ClassesService.delete(id);

      return Send.success(res, {}, "Class deleted successfully");
    } catch (error: any) {
      logger.error({ error }, "Error deleting class");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async getClassStudents(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const students = await ClassesService.getStudents(id);

      return Send.success(res, { students });
    } catch (error: any) {
      logger.error({ error }, "Error fetching class students");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }
}
