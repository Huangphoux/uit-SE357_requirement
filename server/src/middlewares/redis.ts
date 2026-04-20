import { createClient, RedisClientType } from "redis";
import redisConfig from "../config/redis.config";

export let redisClient: RedisClientType;

(async () => {
  redisClient = createClient({
    socket: {
      host: redisConfig.host,
      port: parseInt(redisConfig.port, 10),
    },
  });
})();

export default redisClient;