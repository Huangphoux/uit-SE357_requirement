import BaseRouter, { RouteConfig } from "util/router";
import CoursesController from "./courses.controller";
import { validateBody } from "util/validation";
import { courseCreateSchema, courseUpdateSchema, enrollSchema, unenrollSchema } from "./courses.schema";
import AuthMiddleware from "auth/auth.middleware";

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management and enrollment APIs
 *
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of all courses
 *   post:
 *     summary: Create a new course (Teacher only)
 *     tags: [Courses]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, name, credits]
 *             properties:
 *               code:
 *                 type: string
 *                 example: CS101
 *               name:
 *                 type: string
 *                 example: Web Development
 *               description:
 *                 type: string
 *               credits:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Course created successfully
 *       403:
 *         description: Forbidden - Teacher role required
 *
 * /api/courses/enrolled:
 *   get:
 *     summary: Get courses student is enrolled in
 *     tags: [Courses]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of enrolled courses
 *
 * /api/courses/enroll:
 *   post:
 *     summary: Enroll in a class (Student only)
 *     tags: [Courses]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [classId]
 *             properties:
 *               classId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Enrolled successfully
 *
 * /api/courses/unenroll:
 *   post:
 *     summary: Unenroll from a class (Student only)
 *     tags: [Courses]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [classId]
 *             properties:
 *               classId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Unenrolled successfully
 *
 * /api/courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course details
 *   put:
 *     summary: Update a course (Teacher only)
 *     tags: [Courses]
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
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               credits:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Course updated successfully
 *   delete:
 *     summary: Delete a course (Teacher only)
 *     tags: [Courses]
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
 *         description: Course deleted successfully
 */
class CoursesRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: "get",
        path: "/",
        controller: CoursesController.getCourses,
      },
      {
        method: "get",
        path: "/enrolled",
        middlewares: [AuthMiddleware.authenticateUser],
        controller: CoursesController.getEnrolledCourses,
      },
      {
        method: "post",
        path: "/enroll",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireStudent, validateBody(enrollSchema)],
        controller: CoursesController.enrollInClass,
      },
      {
        method: "post",
        path: "/unenroll",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireStudent, validateBody(unenrollSchema)],
        controller: CoursesController.unenrollFromClass,
      },

       {
        method: "post",
        path: "/removeEnroll",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireStudent, validateBody(unenrollSchema)],
        controller: CoursesController.unenrollFromClassStudent,
      },
      {
        method: "get",
        path: "/:id",
        controller: CoursesController.getCourses,
      },
      {
        method: "post",
        path: "/",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireAdmin, validateBody(courseCreateSchema)],
        controller: CoursesController.createCourse,
      },
      {
        method: "put",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireAdmin, validateBody(courseUpdateSchema)],
        controller: CoursesController.updateCourse,
      },
      {
        method: "delete",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireTeacher],
        controller: CoursesController.deleteCourse,
      },
    ];
  }
}

export default new CoursesRoutes().router;
