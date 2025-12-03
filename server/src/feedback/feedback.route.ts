import BaseRouter, { RouteConfig } from "util/router";
import FeedbackController from "./feedback.controller";
import { validateBody } from "util/validation";
import { feedbackCreateSchema, feedbackUpdateSchema } from "./feedback.schema";
import AuthMiddleware from "auth/auth.middleware";

class FeedbackRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: "get",
        path: "/",
        middlewares: [AuthMiddleware.authenticateUser],
        controller: FeedbackController.getFeedback,
      },
      {
        method: "get",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser],
        controller: FeedbackController.getFeedback,
      },
      {
        method: "post",
        path: "/",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireTeacher, validateBody(feedbackCreateSchema)],
        controller: FeedbackController.createFeedback,
      },
      {
        method: "put",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireTeacher, validateBody(feedbackUpdateSchema)],
        controller: FeedbackController.updateFeedback,
      },
      {
        method: "delete",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireTeacher],
        controller: FeedbackController.deleteFeedback,
      },
    ];
  }
}

export default new FeedbackRoutes().router;
