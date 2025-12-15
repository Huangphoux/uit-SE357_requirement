import BaseRouter, { RouteConfig } from "util/router";
import AuthMiddleware from "auth/auth.middleware";
import UserController from "./user.controller";

class UserRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: "get",
        path: "/info", // api/user/info
        middlewares: [AuthMiddleware.authenticateUser],
        controller: UserController.getUser,
      },
      {
        method: "get",
        path: "/listTeachers", // api/user/listTeachers
        middlewares: [AuthMiddleware.authenticateUser],
        controller: UserController.listTeachers,
      },
      {
        method: "get",
        path: "/listStudents", // api/user/listStudents
        middlewares: [AuthMiddleware.authenticateUser],
        controller: UserController.listStudents,
      },
      {
        method: "get",
        path: "/", // api/user/listTeachers
        middlewares: [AuthMiddleware.authenticateUser],
        controller: UserController.listUsers,
      },
    ];
  }
}

export default new UserRoutes().router;
