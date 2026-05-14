import Send from "util/response";
import { Request, Response } from "express";
import { logger } from "util/logger";
import CoursesService from "./courses.service";
import { getRequestIp, writeAuditLog } from "util/auditLogger";

export default class CoursesController {
  static async getCourses(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { q } = req.query;
      const userId = (req as any).userId;

      const result = await CoursesService.find(id, q as string);

      if (!result) {
        return Send.notFound(res, {}, id ? "Course not found" : "Courses not found");
      }

      await writeAuditLog({
        category: "FILE_ACCESS",
        action: id ? "COURSE_READ_ONE" : "COURSE_READ_LIST",
        success: true,
        userId: userId ? String(userId) : undefined,
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
        resourceType: "COURSE",
        resourceId: id,
      });

      logger.info({ userId, courseId: id, query: q }, "Course fetched successfully");

      const response = id ? { course: result } : { courses: result };
      return Send.success(res, response);
    } catch (error) {
      logger.error({ error }, "Error fetching courses");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async createCourse(req: Request, res: Response) {
    try {
      logger.info({ body: req.body }, "Creating new course");

      const { title, description } = req.body;
      const userId = (req as any).userId;

      const course = await CoursesService.create({
        title,
        description,
      });

      await writeAuditLog({
        category: "ADMIN",
        action: "COURSE_CREATE",
        success: true,
        userId: userId ? String(userId) : undefined,
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
        resourceType: "COURSE",
        resourceId: course.id,
        metadata: { title },
      });

      logger.info({ userId, courseId: course.id, title }, "Course created successfully");

      return Send.success(res, { course }, "Course created successfully");
    } catch (error: any) {
      logger.error({ error }, "Error creating course");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async updateCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;
      const { title, description } = req.body;

      const course = await CoursesService.update(id, {
        title,
        description,
      });

      await writeAuditLog({
        category: "ADMIN",
        action: "COURSE_UPDATE",
        success: true,
        userId: userId ? String(userId) : undefined,
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
        resourceType: "COURSE",
        resourceId: id,
      });

      logger.info({ userId, courseId: id }, "Course updated successfully");

      return Send.success(res, { course }, "Course updated successfully");
    } catch (error: any) {
      logger.error({ error }, "Error updating course");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async deleteCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;

      await CoursesService.delete(id);

      await writeAuditLog({
        category: "ADMIN",
        action: "COURSE_DELETE",
        success: true,
        userId: userId ? String(userId) : undefined,
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
        resourceType: "COURSE",
        resourceId: id,
      });

      logger.info({ userId, courseId: id }, "Course deleted successfully");

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

      await writeAuditLog({
        category: "FILE_ACCESS",
        action: "ENROLLED_COURSES_READ",
        success: true,
        userId: String(userId),
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
        resourceType: "COURSE",
      });

      logger.info({ userId }, "Enrolled courses fetched successfully");

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

      await writeAuditLog({
        category: "ADMIN",
        action: "ENROLL_IN_CLASS",
        success: true,
        userId: String(userId),
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
        resourceType: "ENROLLMENT",
        resourceId: enrollment.id,
        metadata: { classId },
      });

      logger.info({ userId, classId }, "User enrolled in class successfully");

      return Send.success(res, { enrollment }, "Enrolled successfully");
    } catch (error: any) {
      logger.error({ error }, "Error enrolling in class");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async enrollInClassByAdmin(req: Request, res: Response) {
    try {
      const adminId = (req as any).userId;
      const { classId, userId } = req.body;

      if (!userId) {
        return Send.unauthorized(res, {}, "User not authenticated");
      }

      if (!classId) {
        return Send.badRequest(res, {}, "Class ID is required");
      }

      const enrollment = await CoursesService.enrollInClass(userId, classId);

      await writeAuditLog({
        category: "ADMIN",
        action: "ENROLL_IN_CLASS_BY_ADMIN",
        success: true,
        userId: adminId ? String(adminId) : undefined,
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
        resourceType: "ENROLLMENT",
        resourceId: enrollment.id,
        metadata: { classId, targetUserId: userId },
      });

      logger.info({ adminId, userId, classId }, "Admin enrolled user in class successfully");

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

      await writeAuditLog({
        category: "ADMIN",
        action: "UNENROLL_FROM_CLASS",
        success: true,
        userId: String(userId),
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
        resourceType: "ENROLLMENT",
        resourceId: enrollment.id,
        metadata: { classId },
      });

      logger.info({ userId, classId }, "User unenrolled from class successfully");

      return Send.success(res, { enrollment }, "Unenrolled successfully");
    } catch (error: any) {
      logger.error({ error }, "Error unenrolling from class");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async unenrollFromClassStudent(req: Request, res: Response) {
    try {
      const adminId = (req as any).userId;
      const { classId, userId } = req.body;

      if (!userId) {
        return Send.unauthorized(res, {}, "User not join class");
      }

      if (!classId) {
        return Send.badRequest(res, {}, "Class ID is required");
      }

      const enrollment = await CoursesService.unenrollFromClass(userId, classId);

      await writeAuditLog({
        category: "ADMIN",
        action: "UNENROLL_FROM_CLASS_BY_ADMIN",
        success: true,
        userId: adminId ? String(adminId) : undefined,
        ip: getRequestIp(req),
        method: req.method,
        path: req.originalUrl,
        statusCode: 200,
        resourceType: "ENROLLMENT",
        resourceId: enrollment.id,
        metadata: { classId, targetUserId: userId },
      });

      logger.info({ adminId, userId, classId }, "Admin unenrolled user from class successfully");

      return Send.success(res, { enrollment }, "Unenrolled successfully");
    } catch (error: any) {
      logger.error({ error }, "Error unenrolling from class");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }
}
