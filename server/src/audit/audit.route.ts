import BaseRouter, { RouteConfig } from "util/router";
import AuditController from "./audit.controller";
import AuthMiddleware from "auth/auth.middleware";

class AuditRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: "get",
        path: "/logs",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireAdmin],
        controller: AuditController.getLogs,
      },
    ];
  }
}

export default new AuditRoutes().router;