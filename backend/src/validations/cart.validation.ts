import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
});

export const applyCouponSchema = z.object({
  code: z.string().min(2, 'Coupon code is required').trim().toUpperCase(),
});
