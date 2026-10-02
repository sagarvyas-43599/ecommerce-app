import { Router } from 'express';
import * as prodCtrl from '../controllers/product.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from '../validations/product.validation.js';

const router = Router();

// Public routes
router.get('/', validateRequest({ query: productQuerySchema }), prodCtrl.getProducts);
router.get('/:identifier', prodCtrl.getProductBySlugOrId);

// Protected Admin / Seller routes
router.post(
  '/',
  authenticate,
  authorize('admin', 'seller'),
  validateRequest({ body: createProductSchema }),
  prodCtrl.createProduct
);

router.put(
  '/:id',
  authenticate,
  authorize('admin', 'seller'),
  validateRequest({ body: updateProductSchema }),
  prodCtrl.updateProduct
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  prodCtrl.deleteProduct
);

export default router;
