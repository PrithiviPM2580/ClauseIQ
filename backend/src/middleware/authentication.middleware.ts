// import type { Request, Response, NextFunction } from 'express';
// import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
// import logger from '@/lib/logger.lib';
// import { APIError } from '@/lib/apiError.lib';
// import { TokenPayload, verifyAccessToken } from '@/lib/jwt.lib';

// const authenticate =
//   (allowedRoles: string[] = []) =>
//   (req: Request, res: Response, next: NextFunction) => {
//     const { authorization } = req.headers;
//     if (!authorization) {
//       logger.error('No authorization header provided');
//       return next(new APIError(401, 'Unauthorized: AccessToken is missing'));
//     }

//     const [schema, accessToken] = authorization.split(' ');
//     if (!schema || schema !== 'Bearer' || !accessToken) {
//       logger.error('Invalid authorization header format');
//       return next(
//         new APIError(401, 'Unauthorized: Invalid authorization header format')
//       );
//     }

//     try {
//       const payload = verifyAccessToken(accessToken) as TokenPayload;

//       req.user = payload;

//       if (allowedRoles.length > 0 && !allowedRoles.includes(payload.role)) {
//         logger.error(`Access denied for role: ${payload.role}`);
//         throw new APIError(403, 'Forbidden - Insufficient role');
//       }
//     } catch (error) {
//       if (error instanceof TokenExpiredError) {
//         logger.error('AccessToken has expired');
//         throw new APIError(401, 'Unauthorized - AccessToken has expired');
//       }
//       if (error instanceof JsonWebTokenError) {
//         logger.error('Invalid AccessToken');
//         throw new APIError(401, 'Unauthorized - Invalid AccessToken');
//       }
//       logger.error('Error occurred while verifying AccessToken');
//       throw new APIError(500, 'Internal Server Error');
//     }
//   };

//   export default authenticate;
