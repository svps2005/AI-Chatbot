import { Request, Response, NextFunction } from 'express';
import { AppError, ApiResponse } from '../types';
import { logger } from '../utils/logger';

export const errorHandler = (
  error: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Error caught by error handler:', error);

  let statusCode = 500;
  let message = 'Internal Server Error';
  let code = 'INTERNAL_SERVER_ERROR';

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    code = error.code || code;
  } else if (error instanceof SyntaxError) {
    statusCode = 400;
    message = 'Invalid request format';
    code = 'INVALID_REQUEST';
  }

  const response: ApiResponse = {
    success: false,
    message,
    code,
  };

  res.status(statusCode).json(response);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
