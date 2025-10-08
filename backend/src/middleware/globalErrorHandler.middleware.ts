import type { Request, Response, NextFunction } from 'express';
import logger from '@/lib/logger.lib';
import { APIError } from '@/lib/apiError.lib';
import {
  TokenExpiredError,
  JsonWebTokenError,
  NotBeforeError,
} from 'jsonwebtoken';

const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  void next;
  logger.error('GlobalErrorHandler Triggered:', err);

  let customError: APIError;

  if (err instanceof TokenExpiredError) {
    logger.error('JWT TokenExpiredError:', err.message);
    customError = new APIError(
      401,
      'Your token has expired. Please log in again.'
    );
  } else if (err instanceof JsonWebTokenError) {
    logger.error('JWT JsonWebTokenError:', err.message);
    customError = new APIError(401, 'Invalid token. Please log in again.');
  } else if (err instanceof NotBeforeError) {
    logger.error('JWT NotBeforeError:', err.message);
    customError = new APIError(401, 'Token not active. Please log in again.');
  } else if (err instanceof APIError) {
    logger.error('APIError:', {
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors || [],
      stack: err.stack,
    });
    customError = err;
  } else {
    const unknownError = err as Error;
    logger.error('Unknown error:', {
      message: unknownError?.message,
      stack: unknownError?.stack,
    });
    customError = new APIError(
      500,
      unknownError?.message || 'Something went wrong. Please try again later.'
    );
  }

  logger.error(`Error ${customError.statusCode}: ${customError.message}`);

  return res.status(customError.statusCode).json({
    ok: false,
    status: customError.status,
    message: customError.message,
    errors: customError.errors || [],
  });
};

export default globalErrorHandler;
