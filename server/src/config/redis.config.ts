const redisConfig = {
  // Redis port (default is 6379)
  port: process.env.REDIS_PORT as string,

  // Redis host (default is localhost)
  host: process.env.REDIS_HOST as string,
};

export default redisConfig;
