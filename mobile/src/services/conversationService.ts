import { apiClient } from './api';
import {
  Conversation,
  ConversationsListResponse,
} from '../types';

export const conversationService = {
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
