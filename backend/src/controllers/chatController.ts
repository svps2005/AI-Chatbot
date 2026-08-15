import { Response } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types';
import { chatService } from '../services/chatService';
import { logger } from '../utils/logger';

export const sendMessage = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { message, conversationId } = req.body;

    if (!userId) {
      throw new Error('User ID not found in token');
    }

    const result = await chatService.sendMessage(userId, message, conversationId);

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'Message sent and response received',
    };

    res.status(200).json(response);
  } catch (error) {
    throw error;
  }
};

export const getConversations = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    if (!userId) {
      throw new Error('User ID not found in token');
    }

    const result = await chatService.getUserConversations(userId, limit, page);

    const response: ApiResponse = {
      success: true,
      data: result,
    };

    res.status(200).json(response);
  } catch (error) {
    throw error;
  }
};

export const getConversation = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { conversationId } = req.params;

    if (!userId) {
      throw new Error('User ID not found in token');
    }

    const result = await chatService.getConversation(userId, conversationId);

    const response: ApiResponse = {
      success: true,
      data: result,
    };

    res.status(200).json(response);
  } catch (error) {
    throw error;
  }
};

export const createConversation = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in token');
    }

    const conversationId = await chatService.getOrCreateConversation(userId);

    const response: ApiResponse = {
      success: true,
      data: { conversationId },
      message: 'Conversation created',
    };

    res.status(201).json(response);
  } catch (error) {
    throw error;
  }
};

export const deleteConversation = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { conversationId } = req.params;

    if (!userId) {
      throw new Error('User ID not found in token');
    }

    const result = await chatService.deleteConversation(userId, conversationId);

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'Conversation deleted',
    };

    res.status(200).json(response);
  } catch (error) {
    throw error;
  }
};
