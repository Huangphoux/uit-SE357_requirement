import BaseRouter, { RouteConfig } from "util/router";
import CoursesController from "./courses.controller";
import { validateBody } from "util/validation";
import { courseCreateSchema, courseUpdateSchema, enrollSchema, unenrollSchema } from "./courses.schema";
import AuthMiddleware from "auth/auth.middleware";

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
        method: "get",
        path: "/:id",
        controller: CoursesController.getCourses,
      },
      {
        method: "post",
        path: "/",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireTeacher, validateBody(courseCreateSchema)],
        controller: CoursesController.createCourse,
      },
      {
        method: "put",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireTeacher, validateBody(courseUpdateSchema)],
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
