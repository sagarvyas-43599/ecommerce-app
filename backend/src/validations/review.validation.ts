import { z } from 'zod';

export const createReviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be between 1 and 5').max(5),
  title: z.string().min(2, 'Title must be at least 2 characters').max(100),
  comment: z.string().min(5, 'Review comment must be at least 5 characters').max(1000),
});

export const updateReviewSchema = createReviewSchema.partial();
