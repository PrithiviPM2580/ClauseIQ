import { Router } from 'express';

const router = Router();

router.route('/detect-type').post();

router.route('/analize').post();

router.route('/user-contracts').get();

router.route('/:id').get();

export default router;
