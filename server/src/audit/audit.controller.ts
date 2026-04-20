import { Request, Response } from "express";
import Send from "util/response";
import { queryAuditLogs } from "util/auditLogger";
import { logger } from "util/logger";

export default class AuditController {
  static async getLogs(req: Request, res: Response) {
    try {
      const { from, to, category, action, userId, limit } = req.query;

      const result = await queryAuditLogs({
        from: typeof from === "string" ? from : undefined,
        to: typeof to === "string" ? to : undefined,
        category: typeof category === "string" ? category : undefined,
        action: typeof action === "string" ? action : undefined,
        userId: typeof userId === "string" ? userId : undefined,
        limit: typeof limit === "string" ? Number(limit) : undefined,
      });

      return Send.success(res, result, "Audit logs retrieved successfully");
    } catch (error) {
      logger.error({ error }, "Failed to retrieve audit logs");
      return Send.error(res, null, "Failed to retrieve audit logs");
    }
  }
}