import { apiClient } from './api';
import {
  ChatMessageRequest,
  ChatMessageResponse,
  Conversation,
  ConversationsListResponse,
} from '../types';

export const chatService = {
  /**
   * Send a message and get AI response
   */
  async sendMessage(request: ChatMessageRequest): Promise<ChatMessageResponse> {
    return apiClient.post<ChatMessageResponse>('/chat/message', {
      message: request.message,
      conversationId: request.conversationId,
    });
  },

  /**
   * Get all conversations for the user
   */
  async getConversations(
    page = 1,
    limit = 50
  ): Promise<ConversationsListResponse> {
    return apiClient.get<ConversationsListResponse>(
      '/chat/conversations',
      {
        params: { page, limit },
      }
    );
  },

  /**
   * Get a specific conversation with all messages
   */
  async getConversation(conversationId: string): Promise<Conversation> {
    return apiClient.get<Conversation>(
      `/chat/conversations/${conversationId}`
    );
  },

  /**
   * Create a new conversation
   */
  async createConversation(): Promise<{ conversationId: string }> {
    return apiClient.post<{ conversationId: string }>('/chat/conversations');
  },

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(
      `/chat/conversations/${conversationId}`
    );
  },
};
