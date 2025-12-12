import Send from "util/response";
import { Request, Response } from "express";
import { logger } from "util/logger";
import MaterialsService from "./materials.service";

export default class MaterialsController {
  static async getMaterials(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { classId } = req.params;
      const userId = (req as any).userId;

      const result = await MaterialsService.find(id, classId as string, userId);

      if (!result) {
        return Send.notFound(res, {}, id ? "Material not found" : "Materials not found");
      }

      const response = id ? { material: result } : { materials: result };
      return Send.success(res, response);
    } catch (error: any) {
      logger.error({ error }, "Error fetching materials");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async getEnrollments(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;

      const result = await MaterialsService.findEnrollments(userId);

      if (!result) {
        return Send.notFound(res, {}, id ? "Enrollment not found" : "Enrollments not found");
      }

      const response = id ? { enrollment: result } : { enrollments: result };
      return Send.success(res, response);
    } catch (error: any) {
      logger.error({ error }, "Error fetching materials");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async getEnrollmentsByAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await MaterialsService.findEnrollmentsByAdmin();

      if (!result) {
        return Send.notFound(res, {}, id ? "Enrollment not found" : "Enrollments not found");
      }

      const response = id ? { enrollment: result } : { enrollments: result };
      return Send.success(res, response);
    } catch (error: any) {
      logger.error({ error }, "Error fetching materials");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async createMaterial(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { title, description, type, url, classId } = req.body;

      if (!userId) {
        return Send.unauthorized(res, {}, "User not authenticated");
      }

      const material = await MaterialsService.create({
        title,
        description,
        type,
        url,
        classId,
        createdBy: userId,
      });

      return Send.success(res, { material }, "Material created successfully");
    } catch (error: any) {
      logger.error({ error }, "Error creating material");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async updateMaterial(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, type, url } = req.body;

      const material = await MaterialsService.update(id, {
        title,
        description,
        type,
        url,
      });

      return Send.success(res, { material }, "Material updated successfully");
    } catch (error: any) {
      logger.error({ error }, "Error updating material");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }

  static async deleteMaterial(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await MaterialsService.delete(id);

      return Send.success(res, {}, "Material deleted successfully");
    } catch (error: any) {
      logger.error({ error }, "Error deleting material");
      return Send.error(res, {}, error.message || "Internal server error");
    }
  }
}
