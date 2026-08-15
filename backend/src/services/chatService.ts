import { Conversation, Message } from '../models';
import { geminiService } from './geminiService';
import { logger } from '../utils/logger';
import { AppError, IMessage } from '../types';

class ChatService {
  /**
   * Get or create a conversation
   */
  async getOrCreateConversation(
    userId: string,
    conversationId?: string
  ): Promise<string> {
    try {
      if (conversationId) {
        // Verify that the conversation belongs to the user
        const conversation = await Conversation.findOne({
          _id: conversationId,
          userId,
        });

        if (!conversation) {
          throw new AppError(
            'Conversation not found',
            404,
            'CONVERSATION_NOT_FOUND'
          );
        }

        return conversationId;
      }

      // Create a new conversation
      const newConversation = new Conversation({
        userId,
        title: 'New Conversation',
        messageCount: 0,
      });

      await newConversation.save();
      logger.info('New conversation created', {
        conversationId: newConversation._id,
      });

      return newConversation._id!.toString();
    } catch (error) {
      logger.error('Error in getOrCreateConversation:', error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        'Failed to get or create conversation',
        500,
        'CONVERSATION_ERROR'
      );
    }
  }

  /**
   * Save a message to the database
   */
  private async saveMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string
  ): Promise<IMessage> {
    try {
      const message = new Message({
        conversationId,
        role,
        content,
        status: 'sent',
      });

      await message.save();

      // Increment message count in conversation
      await Conversation.findByIdAndUpdate(
        conversationId,
        { $inc: { messageCount: 1 } },
        { new: true }
      );

      return {
        _id: message._id!.toString(),
        conversationId: message.conversationId.toString(),
        role: message.role,
        content: message.content,
        timestamp: message.timestamp,
        status: message.status,
      };
    } catch (error) {
      logger.error('Error saving message:', error);
      throw new AppError('Failed to save message', 500, 'MESSAGE_SAVE_ERROR');
    }
  }

  /**
   * Send a message and get AI response
   */
  async sendMessage(
    userId: string,
    userMessage: string,
    conversationId?: string
  ): Promise<{
    conversationId: string;
    userMessage: IMessage;
    assistantMessage: IMessage;
  }> {
    try {
      // Validate input
      if (!userMessage || userMessage.trim().length === 0) {
        throw new AppError('Message cannot be empty', 400, 'EMPTY_MESSAGE');
      }

      // Get or create conversation
      const finalConversationId = await this.getOrCreateConversation(
        userId,
        conversationId
      );

      // Save user message
      const savedUserMessage = await this.saveMessage(
        finalConversationId,
        'user',
        userMessage.trim()
      );

      // Get conversation history for context
      const history = await Message.find({
        conversationId: finalConversationId,
      })
        .sort({ timestamp: 1 })
        .select('role content');

      // Format for Gemini
      const geminiHistory = geminiService.formatMessagesForGemini(
        history as any
      );

      // Get AI response
      let assistantResponse: string;
      try {
        assistantResponse = await geminiService.sendMessage(
          userMessage,
          geminiHistory
        );
      } catch (error) {
        logger.error('Error getting AI response:', error);
        throw new AppError(
          'Failed to get AI response. Please try again.',
          500,
          'AI_ERROR'
        );
      }

      // Update conversation title if this is the first message
      const conversation = await Conversation.findById(finalConversationId);
      if (conversation && conversation.title === 'New Conversation') {
        try {
          const newTitle = await geminiService.generateConversationTitle(
            userMessage
          );
          await Conversation.findByIdAndUpdate(finalConversationId, {
            title: newTitle,
          });
        } catch (error) {
          logger.warn('Error generating conversation title:', error);
        }
      }

      // Save assistant response
      const savedAssistantMessage = await this.saveMessage(
        finalConversationId,
        'assistant',
        assistantResponse
      );

      return {
        conversationId: finalConversationId,
        userMessage: savedUserMessage,
        assistantMessage: savedAssistantMessage,
      };
    } catch (error) {
      logger.error('Error in sendMessage:', error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError('Failed to send message', 500, 'SEND_MESSAGE_ERROR');
    }
  }

  /**
   * Get conversation with all messages
   */
  async getConversation(userId: string, conversationId: string) {
    try {
      const conversation = await Conversation.findOne({
        _id: conversationId,
        userId,
      });

      if (!conversation) {
        throw new AppError(
          'Conversation not found',
          404,
          'CONVERSATION_NOT_FOUND'
        );
      }

      const messages = await Message.find({
        conversationId,
      }).sort({ timestamp: 1 });

      return {
        _id: conversation._id!.toString(),
        title: conversation.title,
        messageCount: conversation.messageCount,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        messages: messages.map((msg) => ({
          _id: msg._id!.toString(),
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
        })),
      };
    } catch (error) {
      logger.error('Error fetching conversation:', error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        'Failed to fetch conversation',
        500,
        'FETCH_ERROR'
      );
    }
  }

  /**
   * Get all conversations for a user
   */
  async getUserConversations(userId: string, limit = 50, page = 1) {
    try {
      const skip = (page - 1) * limit;

      const conversations = await Conversation.find({ userId })
        .sort({ updatedAt: -1 })
        .limit(limit)
        .skip(skip);

      const total = await Conversation.countDocuments({ userId });

      return {
        conversations: conversations.map((conv) => ({
          _id: conv._id!.toString(),
          title: conv.title,
          messageCount: conv.messageCount,
          createdAt: conv.createdAt,
          updatedAt: conv.updatedAt,
        })),
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching user conversations:', error);

      throw new AppError(
        'Failed to fetch conversations',
        500,
        'FETCH_ERROR'
      );
    }
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(userId: string, conversationId: string) {
    try {
      // Verify ownership
      const conversation = await Conversation.findOne({
        _id: conversationId,
        userId,
      });

      if (!conversation) {
        throw new AppError(
          'Conversation not found',
          404,
          'CONVERSATION_NOT_FOUND'
        );
      }

      // Delete all messages in the conversation
      await Message.deleteMany({ conversationId });

      // Delete the conversation
      await Conversation.findByIdAndDelete(conversationId);

      logger.info('Conversation deleted', { conversationId });

      return { success: true };
    } catch (error) {
      logger.error('Error deleting conversation:', error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        'Failed to delete conversation',
        500,
        'DELETE_ERROR'
      );
    }
  }
}

export const chatService = new ChatService();
