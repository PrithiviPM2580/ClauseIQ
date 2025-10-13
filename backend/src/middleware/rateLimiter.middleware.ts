import type { Request, Response, NextFunction } from 'express';
import logger from '@/lib/logger.lib';
import { APIError } from '@/lib/apiError.lib';
import {
  RateLimiterMemory,
  IRateLimiterOptions,
  RateLimiterRes,
} from 'rate-limiter-flexible';

const globalOptions: IRateLimiterOptions = {
  points: 200,
  duration: 60,
  blockDuration: 60,
};
const apiOptions: IRateLimiterOptions = {
  points: 100,
  duration: 60,
  blockDuration: 120,
};
const authOptions: IRateLimiterOptions = {
  points: 10,
  duration: 60,
  blockDuration: 300,
};
const adminOptions: IRateLimiterOptions = {
  points: 500,
  duration: 60,
  blockDuration: 60,
};

export const limiters = {
  global: new RateLimiterMemory(globalOptions),
  api: new RateLimiterMemory(apiOptions),
  auth: new RateLimiterMemory(authOptions),
  admin: new RateLimiterMemory(adminOptions),
};

export function defaultFn(req: Request): string {
  if (req.user && req.user.userId) {
    return `user:${req.user.userId.toString()}`;
  }
  return `ip:${req.ip}`;
}

export function rateLimiter(
  limiter: RateLimiterMemory,
  keyFn: (req: Request) => string = defaultFn
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rateRes: RateLimiterRes = await limiter.consume(keyFn(req));

      res.setHeader('X-RateLimit-Limit', limiter.points.toString());
      res.setHeader(
        'X-RateLimit-Remaining',
        rateRes.remainingPoints.toString()
      );
      res.setHeader(
        'X-RateLimit-Reset',
        new Date(Date.now() + rateRes.msBeforeNext).toISOString()
      );

      next();
    } catch (error) {
      if (error instanceof RateLimiterRes) {
        res.setHeader(
          'Retry-After',
          Math.ceil(error.msBeforeNext / 1000).toString()
        );
        res.setHeader('X-RateLimit-Limit', limiter.points.toString());
        res.setHeader('X-RateLimit-Remaining', '0');
        res.setHeader(
          'X-RateLimit-Reset',
          new Date(Date.now() + error.msBeforeNext).toISOString()
        );

        logger.warn(
          `Rate limit exceeded: key=${keyFn(req)}, limit=${limiter.points}, resetIn=${error.msBeforeNext}ms`
        );
        return next(
          new APIError(429, 'Too Many Requests - Please try again later')
        );
      }
      logger.error('Rate Limit Error', error);
      next(error);
    }
  };
}
