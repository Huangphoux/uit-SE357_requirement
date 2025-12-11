import BaseRouter, { RouteConfig } from "util/router";
import SubmissionsController from "./submissions.controller";
import { validateBody } from "util/validation";
import { submissionCreateSchema, submissionUpdateSchema } from "./submissions.schema";
import AuthMiddleware from "auth/auth.middleware";
import { z } from "zod";

/**
 * @swagger
 * tags:
 *   name: Submissions
 *   description: Assignment submission APIs (Student only)
 *
 * /api/submissions:
 *   get:
 *     summary: Get all submissions (student's own)
 *     tags: [Submissions]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of submissions
 *   post:
 *     summary: Submit an assignment (Student only)
 *     tags: [Submissions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [assignmentId, content]
 *             properties:
 *               assignmentId:
 *                 type: string
 *               content:
 *                 type: string
 *                 example: https://github.com/student/project
 *     responses:
 *       201:
 *         description: Submission created successfully
 *       200:
 *         description: Submission updated (auto-resubmit)
 *
 * /api/submissions/{id}:
 *   get:
 *     summary: Get a submission by ID (includes feedback)
 *     tags: [Submissions]
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
 *         description: Submission details with feedback
 *   put:
 *     summary: Update a submission (Student only)
 *     tags: [Submissions]
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
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Submission updated successfully
 *   delete:
 *     summary: Delete a submission (Student only)
 *     tags: [Submissions]
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
 *         description: Submission deleted successfully
 */
class SubmissionsRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: "get",
        path: "/",
        middlewares: [AuthMiddleware.authenticateUser],
        controller: SubmissionsController.getSubmissions,
      },
      {
        method: "get",
        path: "/student",
        middlewares: [AuthMiddleware.authenticateUser],
        controller: SubmissionsController.getSubmissionsbyStudent,
      },
      {
        method: "post",
        path: "/",
        middlewares: [
          AuthMiddleware.authenticateUser,
          AuthMiddleware.requireStudent,
          validateBody(submissionCreateSchema),
        ],
        controller: SubmissionsController.createSubmission,
      },
      {
        method: "put",
        path: "/:id/grade",
        middlewares: [
          AuthMiddleware.authenticateUser,
          AuthMiddleware.requireTeacher,
          validateBody(
            z.object({
              grade: z.number().min(0, "Grade must be at least 0"),
              feedback: z.string().optional(),
            })
          ),
        ],
        controller: SubmissionsController.gradeSubmission,
      },
      {
        method: "get",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser],
        controller: SubmissionsController.getSubmissions,
      },
      {
        method: "put",
        path: "/:id",
        middlewares: [
          AuthMiddleware.authenticateUser,
          AuthMiddleware.requireStudent,
          validateBody(submissionUpdateSchema),
        ],
        controller: SubmissionsController.updateSubmission,
      },
      {
        method: "delete",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireStudent],
        controller: SubmissionsController.deleteSubmission,
      },
    ];
  }
}

export default new SubmissionsRoutes().router;
