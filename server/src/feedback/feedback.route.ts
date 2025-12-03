import BaseRouter, { RouteConfig } from "util/router";
import FeedbackController from "./feedback.controller";
import { validateBody } from "util/validation";
import { feedbackCreateSchema, feedbackUpdateSchema } from "./feedback.schema";
import AuthMiddleware from "auth/auth.middleware";

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: Teacher feedback and grading APIs
 *
 * /api/feedback:
 *   get:
 *     summary: Get all feedback entries
 *     tags: [Feedback]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of feedback
 *   post:
 *     summary: Create feedback for submission (Teacher only)
 *     tags: [Feedback]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [submissionId, comment, score]
 *             properties:
 *               submissionId:
 *                 type: string
 *               comment:
 *                 type: string
 *                 example: Excellent work! Clean code.
 *               score:
 *                 type: integer
 *                 example: 95
 *     responses:
 *       201:
 *         description: Feedback created, submission marked as GRADED
 *
 * /api/feedback/{id}:
 *   get:
 *     summary: Get feedback by ID
 *     tags: [Feedback]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feedback details
 *   put:
 *     summary: Update feedback (Teacher only)
 *     tags: [Feedback]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *               score:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Feedback updated successfully
 *   delete:
 *     summary: Delete feedback (Teacher only)
 *     tags: [Feedback]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feedback deleted successfully
 */
class FeedbackRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: "get",
        path: "/",
        middlewares: [AuthMiddleware.authenticateUser],
        controller: FeedbackController.getFeedback,
      },
      {
        method: "get",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser],
        controller: FeedbackController.getFeedback,
      },
      {
        method: "post",
        path: "/",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireTeacher, validateBody(feedbackCreateSchema)],
        controller: FeedbackController.createFeedback,
      },
      {
        method: "put",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireTeacher, validateBody(feedbackUpdateSchema)],
        controller: FeedbackController.updateFeedback,
      },
      {
        method: "delete",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireTeacher],
        controller: FeedbackController.deleteFeedback,
      },
    ];
  }
}

export default new FeedbackRoutes().router;
