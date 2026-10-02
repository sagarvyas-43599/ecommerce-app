import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters').max(150),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().max(200).optional(),
  price: z.number().positive('Price must be greater than 0'),
  compareAtPrice: z.number().positive().optional(),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Category ID'),
  brand: z.string().min(1, 'Brand is required'),
  images: z
    .array(
      z.object({
        url: z.string().url('Invalid image URL'),
        publicId: z.string().optional(),
        isMain: z.boolean().optional(),
      })
    )
    .min(1, 'At least one image is required'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  lowStockThreshold: z.number().int().min(0).optional(),
  sku: z.string().min(2, 'SKU is required'),
  isFeatured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  attributes: z
    .array(
      z.object({
        name: z.string(),
        value: z.string(),
      })
    )
    .optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  sort: z.string().optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
  maxPrice: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
  rating: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
  inStock: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
  isFeatured: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
});
