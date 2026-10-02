import { z } from 'zod';

export const createOrderSchema = z.object({
  shippingAddress: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(3, 'Postal code is required'),
    country: z.string().default('India'),
  }),
  paymentMethod: z.enum(['stripe', 'razorpay', 'cod'], {
    errorMap: () => ({ message: 'Payment method must be stripe, razorpay, or cod' }),
  }),
  couponCode: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'placed',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'returned',
  ]),
  comment: z.string().optional(),
  trackingNumber: z.string().optional(),
});
