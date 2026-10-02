import { z } from 'zod';

export const stripeCheckoutSchema = z.object({
  orderId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Order ID'),
});

export const razorpayOrderSchema = z.object({
  orderId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Order ID'),
});

export const verifyRazorpaySchema = z.object({
  orderId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Order ID'),
  razorpayOrderId: z.string().min(1, 'Razorpay Order ID is required'),
  razorpayPaymentId: z.string().min(1, 'Razorpay Payment ID is required'),
  razorpaySignature: z.string().min(1, 'Razorpay Signature is required'),
});

export const adjustInventorySchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID'),
  quantity: z.number().int().min(0, 'Quantity must be non-negative'),
  notes: z.string().optional(),
});
