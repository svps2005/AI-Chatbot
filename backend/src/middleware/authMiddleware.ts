import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, AppError } from '../types';
import { authService } from '../services/authService';
import { logger } from '../utils/logger';

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        'Authorization header is missing or invalid',
        401,
        'MISSING_AUTH'
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer '

    const payload = authService.verifyToken(token);
    req.user = payload;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        code: error.code,
      });
    } else {
      logger.error('Authentication error:', error);
      res.status(401).json({
        success: false,
        message: 'Authentication failed',
        code: 'AUTH_ERROR',
      });
    }
  }
};
