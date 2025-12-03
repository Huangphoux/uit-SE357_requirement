import Send from "util/response";
import { Request, Response } from "express";
import { logger } from "util/logger";
import FeedbackService from "./feedback.service";

export default class FeedbackController {
  static async getFeedback(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { submissionId } = req.query;

      const result = await FeedbackService.find(id, submissionId as string);

      if (!result) {
        return Send.notFound(res, {}, id ? "Feedback not found" : "Feedback not found");
      }

      const response = id ? { feedback: result } : { feedback: result };
      return Send.success(res, response);
    } catch (error) {
      logger.error({ error }, "Error fetching feedback");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async createFeedback(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { submissionId, comment, score } = req.body;

      if (!userId) {
        return Send.unauthorized(res, {}, "User not authenticated");
      }

      const feedback = await FeedbackService.create({
        submissionId,
        createdBy: userId,
        comment,
        score,
      });

      return Send.success(res, { feedback }, "Feedback created successfully");
    } catch (error: any) {
      logger.error({ error }, "Error creating feedback");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async updateFeedback(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { comment, score } = req.body;

      const feedback = await FeedbackService.update(id, {
        comment,
        score,
      });

      return Send.success(res, { feedback }, "Feedback updated successfully");
    } catch (error: any) {
      logger.error({ error }, "Error updating feedback");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async deleteFeedback(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await FeedbackService.delete(id);

      return Send.success(res, {}, "Feedback deleted successfully");
    } catch (error: any) {
      logger.error({ error }, "Error deleting feedback");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }
}
