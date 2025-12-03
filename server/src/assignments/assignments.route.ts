import BaseRouter, { RouteConfig } from "util/router";
import AssignmentsController from "./assignments.controller";
import { validateBody } from "util/validation";
import { assignmentCreateSchema, assignmentUpdateSchema } from "./assignments.schema";
import AuthMiddleware from "auth/auth.middleware";

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
