import { Router } from 'express';
import * as couponCtrl from '../controllers/coupon.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { createCouponSchema, updateCouponSchema } from '../validations/coupon.validation.js';

const router = Router();

// Public code inspection
router.get('/code/:code', couponCtrl.getCouponByCode);

// Admin-only management
router.use(authenticate, authorize('admin'));

router.get('/', couponCtrl.getAllCoupons);
router.post('/', validateRequest({ body: createCouponSchema }), couponCtrl.createCoupon);
router.put('/:id', validateRequest({ body: updateCouponSchema }), couponCtrl.updateCoupon);
router.delete('/:id', couponCtrl.deleteCoupon);

export default router;
