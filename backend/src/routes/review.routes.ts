import { Router } from 'express';
import * as revCtrl from '../controllers/review.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { createReviewSchema } from '../validations/review.validation.js';

const router = Router();

// Public: Get reviews for product
router.get('/product/:productId', revCtrl.getProductReviews);

// Authenticated: Add review
router.post(
  '/product/:productId',
  authenticate,
  validateRequest({ body: createReviewSchema }),
  revCtrl.createProductReview
);

// Delete review (author or admin)
router.delete('/:id', authenticate, revCtrl.deleteReview);

export default router;
