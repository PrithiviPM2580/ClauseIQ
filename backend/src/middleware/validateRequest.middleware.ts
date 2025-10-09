import type { Request, Response, NextFunction } from 'express';
import { APIError } from '@/lib/apiError.lib';
import { ValidateSchema } from '@/@types';
import { formatIssues } from '@/utils';
import logger from '@/lib/logger.lib';

const validateRequest =
  (schema: ValidateSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        const result = schema.body.safeParse(req.body);
        if (!result.success) {
          logger.error('Validation Error (body): ', {
            issues: result.error.issues,
          });
          return next(
            new APIError(
              400,
              'Validate Error (body)',
              formatIssues(result.error.issues)
            )
          );
        }
        req.body = result.data;
      }

      if (schema.query) {
        const result = schema.query.safeParse(req.query);
        if (!result.success) {
          logger.error('Validation Error (query): ', {
            issues: result.error.issues,
          });
          return next(
            new APIError(
              400,
              'Validate Error (query)',
              formatIssues(result.error.issues)
            )
          );
        }
        Object.assign(req.query, result.data);
      }

      if (schema.params) {
        const result = schema.params.safeParse(req.params);
        if (!result.success) {
          logger.error('Validation Error (params): ', {
            issues: result.error.issues,
          });
          return next(
            new APIError(
              400,
              'Validate Error (params)',
              formatIssues(result.error.issues)
            )
          );
        }
        Object.assign(req.params, result.data);
      }
      return next();
    } catch (error) {
      logger.error('Unexpected Validation Error: ', { error });
      next(error);
    }
  };

export default validateRequest;
