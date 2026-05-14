import BaseRouter, { RouteConfig } from "util/router";
import { prisma } from "util/db";
import { redisClient } from "middlewares/redis";
import { logger } from "util/logger";

class HealthRouter extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: "get",
        path: "/health",
        middlewares: [],
        controller: async (req, res) => {
          try {
            await prisma.$queryRaw`SELECT 1`;

            if (!redisClient.isOpen) {
              throw new Error("Redis is not connected");
            }

            const redisPing = await redisClient.ping();

            if (redisPing !== "PONG") {
              throw new Error("Redis ping failed");
            }

            logger.info({}, "Health check passed - all services are healthy");

            res.status(200).json({
              status: "ok",
              timestamp: new Date().toISOString(),
            });
          } catch (error: any) {
            logger.warn({ error: error?.message }, "Health check failed - some services are degraded");

            res.status(503).json({
              status: "degraded",
              timestamp: new Date().toISOString(),
              message: error?.message || "Health check failed",
            });
          }
        },
      },
    ];
  }
}

export default new HealthRouter().router;
