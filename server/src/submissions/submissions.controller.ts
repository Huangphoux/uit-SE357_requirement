import Send from "util/response";
import { Request, Response } from "express";
import { logger } from "util/logger";
import SubmissionsService from "./submissions.service";

export default class SubmissionsController {
  static async getSubmissions(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { assignmentId } = req.query;
      const userId = (req as any).userId;

      const result = await SubmissionsService.find(
        id,
        assignmentId as string,
        userId
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
}
