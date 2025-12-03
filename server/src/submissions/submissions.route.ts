import BaseRouter, { RouteConfig } from "util/router";
import SubmissionsController from "./submissions.controller";
import { validateBody } from "util/validation";
import { submissionCreateSchema, submissionUpdateSchema } from "./submissions.schema";
import AuthMiddleware from "auth/auth.middleware";

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
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser],
        controller: SubmissionsController.getSubmissions,
      },
      {
        method: "post",
        path: "/",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireStudent, validateBody(submissionCreateSchema)],
        controller: SubmissionsController.createSubmission,
      },
      {
        method: "put",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireStudent, validateBody(submissionUpdateSchema)],
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
