import analizeContractController from '@/controllers/contract/analyzeContract.controller';
import detectTypeController from '@/controllers/contract/detectType.controller';
import getContractByIdController from '@/controllers/contract/getContractById.controller';
import getUserContractController from '@/controllers/contract/getUserContract.controller';
import asyncHandler from '@/middleware/asyncHandler.middleware';
import authenticate from '@/middleware/authentication.middleware';
import { uploadSingle } from '@/middleware/multer.middleware';
import { limiters, rateLimiter } from '@/middleware/rateLimiter.middleware';
import validateRequest from '@/middleware/validateRequest.middleware';
import {
  analyzeContractValidationSchema,
  getContractByIdValidationSchema,
} from '@/validation/contract.validation';
import { Router } from 'express';

const router = Router();

router.route('/detect-type').post(
  authenticate(),
  rateLimiter(limiters.api, req => req.user!.userId!.toString()),
  uploadSingle,
  asyncHandler(detectTypeController)
);

router.route('/analyze').post(
  authenticate(),
  rateLimiter(limiters.api, req => req.user!.userId!.toString()),
  uploadSingle,
  validateRequest({ body: analyzeContractValidationSchema }),
  asyncHandler(analizeContractController)
);

router.route('/user-contracts').get(
  authenticate(),
  rateLimiter(limiters.api, req => req.user!.userId!.toString()),
  asyncHandler(getUserContractController)
);

router.route('/:id').get(
  authenticate(),
  rateLimiter(limiters.api, req => req.user!.userId!.toString()),
  validateRequest({ params: getContractByIdValidationSchema }),
  asyncHandler(getContractByIdController)
);
export default router;
