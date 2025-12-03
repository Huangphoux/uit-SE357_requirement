import BaseRouter, { RouteConfig } from "util/router";
import AssignmentsController from "./assignments.controller";
import { validateBody } from "util/validation";
import { assignmentCreateSchema, assignmentUpdateSchema } from "./assignments.schema";
import AuthMiddleware from "auth/auth.middleware";

/**
 * @swagger
 * tags:
 *   name: Assignments
 *   description: Assignment management APIs
 *
 * /api/assignments:
 *   get:
 *     summary: Get all assignments
 *     tags: [Assignments]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of assignments
 *   post:
 *     summary: Create an assignment (Teacher only)
 *     tags: [Assignments]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [classId, title, dueDate, maxScore]
 *             properties:
 *               classId:
 *                 type: string
 *               title:
 *                 type: string
 *                 example: Build a Portfolio Website
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               maxScore:
 *                 type: integer
 *                 example: 100
 *     responses:
 *       201:
 *         description: Assignment created successfully
 *
 * /api/assignments/{id}:
 *   get:
 *     summary: Get an assignment by ID
 *     tags: [Assignments]
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
 *         description: Assignment details
 *   put:
 *     summary: Update an assignment (Teacher only)
 *     tags: [Assignments]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               maxScore:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Assignment updated successfully
 *   delete:
 *     summary: Delete an assignment (Teacher only)
 *     tags: [Assignments]
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
 *         description: Assignment deleted successfully
 */
class AssignmentsRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: "get",
        path: "/",
        middlewares: [AuthMiddleware.authenticateUser],
        controller: AssignmentsController.getAssignments,
      },
      {
        method: "get",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser],
        controller: AssignmentsController.getAssignments,
      },
      {
        method: "post",
        path: "/",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireTeacher, validateBody(assignmentCreateSchema)],
        controller: AssignmentsController.createAssignment,
      },
      {
        method: "put",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireTeacher, validateBody(assignmentUpdateSchema)],
        controller: AssignmentsController.updateAssignment,
      },
      {
        method: "delete",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireTeacher],
        controller: AssignmentsController.deleteAssignment,
      },
    ];
  }
}

export default new AssignmentsRoutes().router;
