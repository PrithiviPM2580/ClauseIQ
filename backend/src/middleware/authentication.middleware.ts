import type { Request, Response, NextFunction } from 'express';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import logger from '@/lib/logger.lib';
import { APIError } from '@/lib/apiError.lib';
import { verifyAccessToken } from '@/lib/jwt.lib';
import { TokenPayload } from '@/@types';

const authenticate =
  (allowedRoles: string[] = []) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization) {
      logger.error('No authorization header provided');
      return next(new APIError(401, 'Unauthorized: AccessToken is missing'));
    }

    const [schema, accessToken] = authorization.split(' ');
    if (!schema || schema !== 'Bearer' || !accessToken) {
      logger.error('Invalid authorization header format');
      return next(
        new APIError(401, 'Unauthorized: Invalid authorization header format')
      );
    }

    try {
      const payload = verifyAccessToken(accessToken) as TokenPayload;
      req.user = payload;

      if (allowedRoles.length > 0 && !allowedRoles.includes(payload.role)) {
        logger.error(`Access denied for role: ${payload.role}`);
        return next(new APIError(403, 'Forbidden - Insufficient role'));
      }

      return next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        logger.error('AccessToken has expired');
        return next(
          new APIError(401, 'Unauthorized - AccessToken has expired')
        );
      }
      if (error instanceof JsonWebTokenError) {
        logger.error('Invalid AccessToken');
        return next(new APIError(401, 'Unauthorized - Invalid AccessToken'));
      }
      logger.error('Error occurred while verifying AccessToken');
      return next(new APIError(500, 'Internal Server Error'));
    }
  };

export default authenticate;
