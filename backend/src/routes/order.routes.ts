import { Router } from 'express';
import * as orderCtrl from '../controllers/order.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { orderLimiter } from '../middlewares/rateLimit.middleware.js';
import { createOrderSchema, updateOrderStatusSchema } from '../validations/order.validation.js';

const router = Router();

router.use(authenticate);

// Customer endpoints
router.post('/', orderLimiter, validateRequest({ body: createOrderSchema }), orderCtrl.createOrder);
router.get('/my-orders', orderCtrl.getMyOrders);
router.get('/:id', orderCtrl.getOrderById);
router.post('/:id/cancel', orderCtrl.cancelOrder);

// Admin endpoints
router.get('/admin/all', authorize('admin'), orderCtrl.getAllOrdersAdmin);
router.put(
  '/admin/:id/status',
  authorize('admin'),
  validateRequest({ body: updateOrderStatusSchema }),
  orderCtrl.updateOrderStatusAdmin
);

export default router;
