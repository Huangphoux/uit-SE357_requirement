import { createClient, RedisClientType } from "redis";
import redisConfig from "../config/redis.config";

export const redisClient: RedisClientType = createClient({
  socket: {
    host: redisConfig.host,
    port: parseInt(redisConfig.port, 10),
  },
});

redisClient.on("error", (error) => {
  console.error("Redis client error", error);
});

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

export default redisClient;