import { Router } from 'express';
import * as payCtrl from '../controllers/payment.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
  stripeCheckoutSchema,
  razorpayOrderSchema,
  verifyRazorpaySchema,
} from '../validations/payment.validation.js';

const router = Router();

router.use(authenticate);

// Stripe Checkout
router.post('/stripe/create-intent', validateRequest({ body: stripeCheckoutSchema }), payCtrl.createStripeIntent);

// Razorpay Checkout
router.post('/razorpay/create-order', validateRequest({ body: razorpayOrderSchema }), payCtrl.createRazorpayOrder);
router.post('/razorpay/verify', validateRequest({ body: verifyRazorpaySchema }), payCtrl.verifyRazorpayPayment);

// Admin Payment logs
router.get('/admin/all', authorize('admin'), payCtrl.getAllPaymentsAdmin);

export default router;
