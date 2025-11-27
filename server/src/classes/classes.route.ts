import BaseRouter, { RouteConfig } from "util/router";
import ClassesController from "./classes.controller";

class ClassesRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: "get",
        path: "/",
        controller: ClassesController.getClasses,
      },
      {
        method: "get",
        path: "/:id",
        controller: ClassesController.getClasses,
      },
      {
        method: "post",
        path: "/",
        controller: ClassesController.createClass,
      },
      {
        method: "put",
        path: "/:id",
        controller: ClassesController.updateClass,
      },
      {
        method: "delete",
        path: "/:id",
        controller: ClassesController.deleteClass,
      },
      {
        method: "get",
        path: "/:id/students",
        controller: ClassesController.getClassStudents,
      },
    ];
  }
}

export default new ClassesRoutes().router;
