import { z } from 'zod';

export const createCouponSchema = z.object({
  code: z.string().min(2, 'Coupon code must be at least 2 characters').toUpperCase(),
  discountType: z.enum(['percentage', 'fixed']),
  discountAmount: z.number().positive('Discount amount must be positive'),
  minOrderValue: z.number().min(0).default(0),
  maxDiscountAmount: z.number().positive().optional(),
  startDate: z.string().datetime().optional(),
  expiryDate: z.string().datetime(),
  usageLimit: z.number().int().positive().optional(),
  isActive: z.boolean().default(true),
});

export const updateCouponSchema = createCouponSchema.partial();
