import Send from "util/response";
import { Request, Response } from "express";
import { logger } from "util/logger";
import CoursesService from "./courses.service";

export default class CoursesController {
  static async getCourses(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { q } = req.query;

      const result = await CoursesService.find(id, q as string);

      if (!result) {
        return Send.notFound(res, {}, id ? "Course not found" : "Courses not found");
      }

      const response = id ? { course: result } : { courses: result };
      return Send.success(res, response);
    } catch (error) {
      logger.error({ error }, "Error fetching courses");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async createCourse(req: Request, res: Response) {
    try {
      const { title, description } = req.body;

      const course = await CoursesService.create({
        title,
        description,
      });

      return Send.success(res, { course }, "Course created successfully");
    } catch (error: any) {
      logger.error({ error }, "Error creating course");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async updateCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description } = req.body;

      const course = await CoursesService.update(id, {
        title,
        description,
      });

      return Send.success(res, { course }, "Course updated successfully");
    } catch (error: any) {
      logger.error({ error }, "Error updating course");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async deleteCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await CoursesService.delete(id);

      return Send.success(res, {}, "Course deleted successfully");
    } catch (error: any) {
      logger.error({ error }, "Error deleting course");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }
}

