import { Router } from 'express';
import * as adminCtrl from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// Strict Admin-only guard
router.use(authenticate, authorize('admin'));

router.get('/dashboard-stats', adminCtrl.getAdminDashboardStats);
router.get('/users', adminCtrl.getAllUsersAdmin);
router.patch('/users/:id/role', adminCtrl.updateUserRoleAdmin);

export default router;
