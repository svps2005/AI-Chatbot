import { Router } from 'express';
import * as chatController from '../controllers/chatController';
import { authenticate } from '../middleware/authMiddleware';
import { validateSendMessage } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// All chat routes require authentication
router.use(authenticate);

/**
 * POST /api/chat/message
 * Send a message and get AI response
 */
router.post(
  '/message',
  validateSendMessage,
  asyncHandler(chatController.sendMessage)
);

/**
 * GET /api/conversations
 * Get all conversations for the authenticated user
 */
router.get(
  '/conversations',
  asyncHandler(chatController.getConversations)
);

/**
 * POST /api/conversations
 * Create a new conversation
 */
router.post(
  '/conversations',
  asyncHandler(chatController.createConversation)
);

/**
 * GET /api/conversations/:conversationId
 * Get a specific conversation with all messages
 */
router.get(
  '/conversations/:conversationId',
  asyncHandler(chatController.getConversation)
);

/**
 * DELETE /api/conversations/:conversationId
 * Delete a conversation
 */
router.delete(
  '/conversations/:conversationId',
  asyncHandler(chatController.deleteConversation)
);

export default router;
