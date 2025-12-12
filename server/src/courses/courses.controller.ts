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
      console.log(req.body);

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

  static async getEnrolledCourses(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;

      if (!userId) {
        return Send.unauthorized(res, {}, "User not authenticated");
      }

      const courses = await CoursesService.getEnrolledCourses(userId);

      return Send.success(res, { courses });
    } catch (error) {
      logger.error({ error }, "Error fetching enrolled courses");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async enrollInClass(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { classId } = req.body;

      if (!userId) {
        return Send.unauthorized(res, {}, "User not authenticated");
      }

      if (!classId) {
        return Send.badRequest(res, {}, "Class ID is required");
      }

      const enrollment = await CoursesService.enrollInClass(userId, classId);

      return Send.success(res, { enrollment }, "Enrolled successfully");
    } catch (error: any) {
      logger.error({ error }, "Error enrolling in class");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async unenrollFromClass(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { classId } = req.body;

      if (!userId) {
        return Send.unauthorized(res, {}, "User not authenticated");
      }

      if (!classId) {
        return Send.badRequest(res, {}, "Class ID is required");
      }

      const enrollment = await CoursesService.unenrollFromClass(userId, classId);

      return Send.success(res, { enrollment }, "Unenrolled successfully");
    } catch (error: any) {
      logger.error({ error }, "Error unenrolling from class");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async unenrollFromClassStudent(req: Request, res: Response) {
    try {
      const { classId, userId } = req.body;

      if (!userId) {
        return Send.unauthorized(res, {}, "User not join class");
      }

      if (!classId) {
        return Send.badRequest(res, {}, "Class ID is required");
      }

      const enrollment = await CoursesService.unenrollFromClass(userId, classId);

      return Send.success(res, { enrollment }, "Unenrolled successfully");
    } catch (error: any) {
      logger.error({ error }, "Error unenrolling from class");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }
}
