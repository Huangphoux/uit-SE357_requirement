const rateLimitConfig = {
  limitWindow: process.env.RATE_LIMIT_WINDOW_MS as string,

  limitMax: process.env.RATE_LIMIT_MAX as string,
};

export default rateLimitConfig;
