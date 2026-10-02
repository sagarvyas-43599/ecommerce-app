import { Router } from 'express';
import * as cartCtrl from '../controllers/cart.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { addToCartSchema, updateCartItemSchema, applyCouponSchema } from '../validations/cart.validation.js';

const router = Router();

// All cart operations require authentication
router.use(authenticate);

router.get('/', cartCtrl.getCart);
router.post('/items', validateRequest({ body: addToCartSchema }), cartCtrl.addToCart);
router.put('/items/:productId', validateRequest({ body: updateCartItemSchema }), cartCtrl.updateCartItem);
router.delete('/items/:productId', cartCtrl.removeCartItem);
router.post('/coupon', validateRequest({ body: applyCouponSchema }), cartCtrl.applyCartCoupon);
router.delete('/coupon', cartCtrl.removeCartCoupon);
router.delete('/clear', cartCtrl.clearCart);

export default router;
