import { NextFunction, Request, Response } from "express";
import {redisClient} from './redis';

interface RateLimitRule {
  endpoint: string;
  rate_limit: {
    time: number,
    limit: number
  };
}

export const rateLimiter = (rule : RateLimitRule) => {
  const { endpoint, rate_limit } = rule;
  return async (request: Request, response: Response, next: NextFunction) => {
    const ipAddress = request.ip;
    const redisId = `${endpoint}/${ipAddress}`;

    const requests = await redisClient.incr(redisId);

    if (requests === 1) {
      await redisClient.pExpire(redisId, rate_limit.time);
    }

    if (requests > rate_limit.limit) {
      return response.status(429).json({ message: "Too many requests. Please try again later." });
    }
    next();
  }
}