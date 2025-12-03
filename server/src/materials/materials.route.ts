import BaseRouter, { RouteConfig } from "util/router";
import MaterialsController from "./materials.controller";
import { validateBody } from "util/validation";
import { materialCreateSchema, materialUpdateSchema } from "./materials.schema";
import AuthMiddleware from "auth/auth.middleware";

class MaterialsRoutes extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: "get",
        path: "/",
        middlewares: [AuthMiddleware.authenticateUser],
        controller: MaterialsController.getMaterials,
      },
      {
        method: "get",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser],
        controller: MaterialsController.getMaterials,
      },
      {
        method: "post",
        path: "/",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireTeacher, validateBody(materialCreateSchema)],
        controller: MaterialsController.createMaterial,
      },
      {
        method: "put",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireTeacher, validateBody(materialUpdateSchema)],
        controller: MaterialsController.updateMaterial,
      },
      {
        method: "delete",
        path: "/:id",
        middlewares: [AuthMiddleware.authenticateUser, AuthMiddleware.requireTeacher],
        controller: MaterialsController.deleteMaterial,
      },
    ];
  }
}

export default new MaterialsRoutes().router;
