import { Response } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types';
import { authService } from '../services/authService';
import { logger } from '../utils/logger';

export const register = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const user = await authService.register(name, email, password);

    const response: ApiResponse = {
      success: true,
      data: user,
      message: 'User registered successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    throw error;
  }
};

export const login = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const { token, user } = await authService.login(email, password);

    const response: ApiResponse = {
      success: true,
      data: { token, user },
      message: 'Login successful',
    };

    res.status(200).json(response);
  } catch (error) {
    throw error;
  }
};

export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in token');
    }

    const user = await authService.getUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const response: ApiResponse = {
      success: true,
      data: user,
    };

    res.status(200).json(response);
  } catch (error) {
    throw error;
  }
};
