import { Router } from 'express';
import * as userCtrl from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { authLimiter } from '../middlewares/rateLimit.middleware.js';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  updateProfileSchema,
  changePasswordSchema,
  addAddressSchema,
} from '../validations/user.validation.js';

const router = Router();

// Public auth routes with rate limiting
router.post('/register', authLimiter, validateRequest({ body: registerSchema }), userCtrl.registerUser);
router.post('/login', authLimiter, validateRequest({ body: loginSchema }), userCtrl.loginUser);
router.post('/refresh-token', validateRequest({ body: refreshTokenSchema }), userCtrl.refreshAccessToken);

// Protected routes (require JWT)
router.use(authenticate);

router.post('/logout', userCtrl.logoutUser);
router.get('/me', userCtrl.getCurrentUserProfile);
router.put('/me', validateRequest({ body: updateProfileSchema }), userCtrl.updateUserProfile);
router.put('/change-password', validateRequest({ body: changePasswordSchema }), userCtrl.changeUserPassword);
router.post('/address', validateRequest({ body: addAddressSchema }), userCtrl.addUserAddress);
router.delete('/address/:addressId', userCtrl.deleteUserAddress);

export default router;
