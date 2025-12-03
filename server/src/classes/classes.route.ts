import BaseRouter, { RouteConfig } from "util/router";
import ClassesController from "./classes.controller";
import AuthMiddleware from "auth/auth.middleware";
import { validateBody } from "util/validation";
import { classCreateSchema, classUpdateSchema } from "./classes.schema";

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
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireTeacher, validateBody(classCreateSchema)],
        controller: ClassesController.createClass,
      },
      {
        method: "put",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireTeacher, validateBody(classUpdateSchema)],
        controller: ClassesController.updateClass,
      },
      {
        method: "delete",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireTeacher],
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
