import { Router } from 'express';
import * as wishCtrl from '../controllers/wishlist.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', wishCtrl.getWishlist);
router.post('/toggle/:productId', wishCtrl.toggleWishlistItem);

export default router;
