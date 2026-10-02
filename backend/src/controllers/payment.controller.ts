import { Response } from 'express';
import { PaymentService } from '../services/payment.service.js';
import { Payment } from '../models/payment.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse, PaginationMeta } from '../utils/ApiResponse.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export const createStripeIntent = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { orderId } = req.body;
  const result = await PaymentService.createStripePaymentIntent(orderId, req.user!._id.toString());
  return ApiResponse.send(res, 200, result, 'Stripe payment intent created');
});

export const createRazorpayOrder = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { orderId } = req.body;
  const result = await PaymentService.createRazorpayOrder(orderId, req.user!._id.toString());
  return ApiResponse.send(res, 200, result, 'Razorpay order created');
});

export const verifyRazorpayPayment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  const result = await PaymentService.verifyRazorpayPayment(
    orderId,
    req.user!._id.toString(),
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
  );

  return ApiResponse.send(res, 200, result, 'Payment verified successfully');
});

export const getAllPaymentsAdmin = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit as string, 10) || 20, 100);
  const skip = (page - 1) * limit;

  const [payments, totalItems] = await Promise.all([
    Payment.find()
      .populate('user', 'name email')
      .populate('order', 'orderNumber totalAmount')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Payment.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalItems / limit) || 1;
  const meta: PaginationMeta = {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  return ApiResponse.send(res, 200, payments, 'Payments fetched successfully', meta);
});
