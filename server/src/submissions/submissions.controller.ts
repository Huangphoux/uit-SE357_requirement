import Send from "util/response";
import { Request, Response } from "express";
import { logger } from "util/logger";
import SubmissionsService from "./submissions.service";
import { prisma } from "util/db";

export default class SubmissionsController {
  static async getSubmissions(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { assignmentId } = req.query;
      const userId = (req as any).userId;

      // Nếu có assignmentId, không filter theo userId (cho teacher xem tất cả)
      const result = await SubmissionsService.find(
        id,
        assignmentId as string,
        assignmentId ? undefined : userId // Chỉ filter userId khi KHÔNG có assignmentId
      );

      if (!result) {
        return Send.notFound(res, {}, id ? "Submission not found" : "Submissions not found");
      }

      const response = id ? { submission: result } : { submissions: result };
      return Send.success(res, response);
    } catch (error) {
      logger.error({ error }, "Error fetching submissions");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async getSubmissionsbyStudent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;

      // Nếu có assignmentId, không filter theo userId (cho teacher xem tất cả)
      const result = await SubmissionsService.findbyStudent(id, userId);

      if (!result) {
        return Send.notFound(res, {}, id ? "Submission not found" : "Submissions not found");
      }

      const response = id ? { submission: result } : { submissions: result };
      return Send.success(res, response);
    } catch (error) {
      logger.error({ error }, "Error fetching submissions");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async createSubmission(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { assignmentId, content, fileUrl } = req.body;

      if (!userId) {
        return Send.unauthorized(res, {}, "User not authenticated");
      }

      const submission = await SubmissionsService.create({
        assignmentId,
        userId,
        content,
        fileUrl,
      });

      return Send.success(res, { submission }, "Submission created successfully");
    } catch (error: any) {
      logger.error({ error }, "Error creating submission");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async updateSubmission(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { content, fileUrl } = req.body;

      const submission = await SubmissionsService.update(id, {
        content,
        fileUrl,
      });

      return Send.success(res, { submission }, "Submission updated successfully");
    } catch (error: any) {
      logger.error({ error }, "Error updating submission");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async deleteSubmission(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await SubmissionsService.delete(id);

      return Send.success(res, {}, "Submission deleted successfully");
    } catch (error: any) {
      logger.error({ error }, "Error deleting submission");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  // THÊM METHOD NÀY - GRADE SUBMISSION
  static async gradeSubmission(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { grade, feedback } = req.body;
      const teacherId = (req as any).userId;

      if (!teacherId) {
        return Send.unauthorized(res, {}, "User not authenticated");
      }

      // Kiểm tra submission có tồn tại không
      const submission = await SubmissionsService.findById(id);

      if (!submission) {
        return Send.notFound(res, {}, "Submission not found");
      }

      // Kiểm tra teacher có quyền grade submission này không
      const assignment = await prisma.assignment.findUnique({
        where: { id: submission.assignmentId },
        include: { class: true },
      });

      if (!assignment) {
        return Send.notFound(res, {}, "Assignment not found");
      }

      if (assignment.class.teacherId !== teacherId) {
        return Send.forbidden(res, {}, "You don't have permission to grade this submission");
      }

      // Validate grade
      if (typeof grade !== "number" || grade < 0) {
        return Send.error(res, {}, "Invalid grade value");
      }

      if (assignment.maxScore && grade > assignment.maxScore) {
        return Send.error(res, {}, `Grade cannot exceed ${assignment.maxScore}`);
      }

      // Grade submission
      const gradedSubmission = await SubmissionsService.grade(
        id,
        {
          grade,
          feedback,
        },
        teacherId
      );

      return Send.success(res, { submission: gradedSubmission }, "Submission graded successfully");
    } catch (error: any) {
      logger.error({ error }, "Error grading submission");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }
}
