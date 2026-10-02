import { Router } from 'express';
import * as catCtrl from '../controllers/category.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { createCategorySchema, updateCategorySchema } from '../validations/category.validation.js';

const router = Router();

// Public routes
router.get('/', catCtrl.getAllCategories);
router.get('/:slug', catCtrl.getCategoryBySlug);

// Admin-only routes
router.post('/', authenticate, authorize('admin'), validateRequest({ body: createCategorySchema }), catCtrl.createCategory);
router.put('/:id', authenticate, authorize('admin'), validateRequest({ body: updateCategorySchema }), catCtrl.updateCategory);
router.delete('/:id', authenticate, authorize('admin'), catCtrl.deleteCategory);

export default router;
