import BaseRouter, { RouteConfig } from "util/router";
import MaterialsController from "./materials.controller";
import { validateBody } from "util/validation";
import { materialCreateSchema, materialUpdateSchema } from "./materials.schema";
import AuthMiddleware from "auth/auth.middleware";

/**
 * @swagger
 * tags:
 *   name: Materials
 *   description: Learning materials management APIs
 *
 * /api/materials:
 *   get:
 *     summary: Get all materials (enrolled students only)
 *     tags: [Materials]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of materials
 *   post:
 *     summary: Create learning material (Teacher only)
 *     tags: [Materials]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [classId, title, type, url]
 *             properties:
 *               classId:
 *                 type: string
 *               title:
 *                 type: string
 *                 example: HTML Basics
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [PDF, VIDEO, LINK, DOC]
 *               url:
 *                 type: string
 *                 example: https://example.com/materials/html.pdf
 *     responses:
 *       201:
 *         description: Material created successfully
 *
 * /api/materials/{id}:
 *   get:
 *     summary: Get a material by ID
 *     tags: [Materials]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Material details
 *   put:
 *     summary: Update a material (Teacher only)
 *     tags: [Materials]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [PDF, VIDEO, LINK, DOC]
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Material updated successfully
 *   delete:
 *     summary: Delete a material (Teacher only)
 *     tags: [Materials]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Material deleted successfully
 */
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
