import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(3, 'Full name must be at least 3 characters').max(60),
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phoneNumber: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(60).optional(),
  phoneNumber: z.string().optional(),
  avatar: z.string().url().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export const addAddressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().default('India'),
  isDefault: z.boolean().optional(),
});
