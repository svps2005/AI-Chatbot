import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, AppError } from '../types';

export const validateRegister = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new AppError(
        'Name, email, and password are required',
        400,
        'MISSING_FIELDS'
      );
    }

    if (typeof name !== 'string' || name.trim().length < 2) {
      throw new AppError(
        'Name must be at least 2 characters',
        400,
        'INVALID_NAME'
      );
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      throw new AppError('Invalid email format', 400, 'INVALID_EMAIL');
    }

    if (typeof password !== 'string' || password.length < 6) {
      throw new AppError(
        'Password must be at least 6 characters',
        400,
        'WEAK_PASSWORD'
      );
    }

    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        code: error.code,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
      });
    }
  }
};

export const validateLogin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(
        'Email and password are required',
        400,
        'MISSING_FIELDS'
      );
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      throw new AppError('Invalid email format', 400, 'INVALID_EMAIL');
    }

    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        code: error.code,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
      });
    }
  }
};

export const validateSendMessage = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      throw new AppError('Message is required and must be a string', 400, 'INVALID_MESSAGE');
    }

    if (message.trim().length === 0) {
      throw new AppError(
        'Message cannot be empty',
        400,
        'EMPTY_MESSAGE'
      );
    }

    if (message.length > 10000) {
      throw new AppError(
        'Message must not exceed 10000 characters',
        400,
        'MESSAGE_TOO_LONG'
      );
    }

    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        code: error.code,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
      });
    }
  }
};
