import { Router } from 'express';
import * as invCtrl from '../controllers/inventory.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { adjustInventorySchema } from '../validations/payment.validation.js';

const router = Router();

// Inventory management is restricted to Admin / Seller
router.use(authenticate, authorize('admin', 'seller'));

router.get('/logs', invCtrl.getInventoryLogs);
router.get('/low-stock', invCtrl.getLowStockProducts);
router.post('/adjust', validateRequest({ body: adjustInventorySchema }), invCtrl.adjustProductStock);

export default router;
