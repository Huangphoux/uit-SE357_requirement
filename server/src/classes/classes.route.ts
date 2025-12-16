import BaseRouter, { RouteConfig } from "util/router";
import ClassesController from "./classes.controller";
import AuthMiddleware from "auth/auth.middleware";
import { validateBody } from "util/validation";
import { classCreateSchema, classUpdateSchema } from "./classes.schema";

/**
 * @swagger
 * tags:
 *   name: Classes
 *   description: Class management APIs
 *
 * /api/classes:
 *   get:
 *     summary: Get all classes
 *     tags: [Classes]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all classes
 *   post:
 *     summary: Create a new class (Teacher only)
 *     tags: [Classes]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [courseId, teacherId, name, startDate, endDate, capacity]
 *             properties:
 *               courseId:
 *                 type: string
 *               teacherId:
 *                 type: string
 *               name:
 *                 type: string
 *                 example: Web Dev - Spring 2024
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               capacity:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       201:
 *         description: Class created successfully
 *
 * /api/classes/{id}:
 *   get:
 *     summary: Get a class by ID
 *     tags: [Classes]
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
 *         description: Class details
 *   put:
 *     summary: Update a class (Teacher only)
 *     tags: [Classes]
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
 *               name:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               capacity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Class updated successfully
 *   delete:
 *     summary: Delete a class (Teacher only)
 *     tags: [Classes]
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
 *         description: Class deleted successfully
 *
 * /api/classes/{id}/students:
 *   get:
 *     summary: Get students enrolled in a class
 *     tags: [Classes]
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
 *         description: List of enrolled students
 */
class ClassesRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: "get",
        path: "/",
        middlewares: [AuthMiddleware.authenticateUser],
        controller: ClassesController.getClasses,
      },
      {
        method: "get",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser],
        controller: ClassesController.getClasses,
      },
      {
        method: "post",
        path: "/",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireAdmin, validateBody(classCreateSchema)],
        controller: ClassesController.createClass,
      },
      {
        method: "put",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireAdmin, validateBody(classUpdateSchema)],
        controller: ClassesController.updateClass,
      },
      {
        method: "delete",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireAdmin],
        controller: ClassesController.deleteClass,
      },
      {
        method: "get",
        path: "/:id/students",
        middlewares: [AuthMiddleware.authenticateUser],
        controller: ClassesController.getClassStudents,
      },
    ];
  }
}

export default new ClassesRoutes().router;
