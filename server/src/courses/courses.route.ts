import BaseRouter, { RouteConfig } from "util/router";
import CoursesController from "./courses.controller";

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
        path: "/:id",
        controller: CoursesController.getCourses,
      },
      {
        method: "post",
        path: "/",
        controller: CoursesController.createCourse,
      },
      {
        method: "put",
        path: "/:id",
        controller: CoursesController.updateCourse,
      },
      {
        method: "delete",
        path: "/:id",
        controller: CoursesController.deleteCourse,
      },
    ];
  }
}

export default new CoursesRoutes().router;
