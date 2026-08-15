import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';
import {
  validateRegister,
  validateLogin,
} from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post(
  '/register',
  validateRegister,
  asyncHandler(authController.register)
);

/**
 * POST /api/auth/login
 * Login user and get JWT token
 */
router.post('/login', validateLogin, asyncHandler(authController.login));

/**
 * GET /api/auth/profile
 * Get authenticated user profile
 */
router.get(
  '/profile',
  authenticate,
  asyncHandler(authController.getProfile)
);

export default router;
