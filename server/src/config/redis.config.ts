const redisConfig = {
  // Redis port (default is 6379)
  port: process.env.REDIS_PORT || "6379",

  // Redis host (default is localhost)
  host: process.env.REDIS_HOST || "localhost",
};

export default redisConfig;
