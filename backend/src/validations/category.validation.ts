import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters').max(50),
  description: z.string().max(300).optional(),
  image: z.string().url().optional().or(z.literal('')),
  parentCategory: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid parent category ID').optional().nullable(),
  isActive: z.boolean().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();
