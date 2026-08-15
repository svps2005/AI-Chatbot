import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { AppError } from '../types';

interface ChatHistoryItem {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

class GeminiService {
  private client: GoogleGenAI;
  private modelName = 'gemini-3.6-flash';

  constructor() {
    this.client = new GoogleGenAI({
      apiKey: env.geminiApiKey,
    });
  }

  /**
   * System prompt for the AI assistant
   */
  private getSystemPrompt(): string {
    return `You are an intelligent and helpful AI assistant.

Your purpose is to:
- Answer questions clearly and concisely
- Provide accurate and useful information
- Admit when you are uncertain instead of guessing
- Break down complex topics into understandable parts
- Maintain context within the current conversation
- Be friendly and professional
- Use bullet points and numbered lists when appropriate
- Keep responses focused and relevant

When you don't know something, be honest about it.
When a question is unclear, ask a follow-up question.`;
  }

  /**
   * Send a message to Gemini and get an AI response
   */
  async sendMessage(
    userMessage: string,
    conversationHistory: ChatHistoryItem[] = []
  ): Promise<string> {
    try {
      // Validate message
      if (!userMessage || userMessage.trim().length === 0) {
        throw new AppError(
          'Message cannot be empty',
          400,
          'EMPTY_MESSAGE'
        );
      }

      logger.debug('Sending message to Gemini', {
        messageLength: userMessage.length,
        historyLength: conversationHistory.length,
      });

      // Create Gemini chat session
      const chat = this.client.chats.create({
        model: this.modelName,

        history: conversationHistory,

        config: {
          systemInstruction: this.getSystemPrompt(),
          maxOutputTokens: 1024,
          temperature: 0.7,
        },
      });

      // Send the current user message
      const response = await chat.sendMessage({
        message: userMessage.trim(),
      });

      // Extract response text
      const responseText = response.text?.trim();

      if (!responseText) {
        throw new AppError(
          'No response from AI model',
          500,
          'AI_NO_RESPONSE'
        );
      }

      logger.debug('Received response from Gemini', {
        responseLength: responseText.length,
      });

      return responseText;
    } catch (error) {
      logger.error('Error communicating with Gemini API:', error);

      // Re-throw our own application errors
      if (error instanceof AppError) {
        throw error;
      }

      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();

        // Authentication / API key error
        if (
          errorMessage.includes('api key') ||
          errorMessage.includes('api_key') ||
          errorMessage.includes('authentication') ||
          errorMessage.includes('unauthorized')
        ) {
          throw new AppError(
            'Gemini API authentication failed',
            500,
            'GEMINI_AUTH_ERROR'
          );
        }

        // Rate limit / quota error
        if (
          errorMessage.includes('rate') ||
          errorMessage.includes('quota') ||
          errorMessage.includes('429')
        ) {
          throw new AppError(
            'Rate limit exceeded. Please try again later.',
            429,
            'RATE_LIMIT_ERROR'
          );
        }

        // General Gemini error
        throw new AppError(
          'Unexpected error from Gemini API',
          500,
          'GEMINI_ERROR'
        );
      }

      throw new AppError(
        'Failed to communicate with AI service',
        500,
        'AI_SERVICE_ERROR'
      );
    }
  }

  /**
   * Generate a short title for a conversation
   */
  async generateConversationTitle(
    firstMessage: string
  ): Promise<string> {
    try {
      if (!firstMessage || firstMessage.trim().length === 0) {
        return 'New Conversation';
      }

      const prompt = `Generate a very short conversation title based on this user message.

User message:
"${firstMessage}"

Rules:
- Maximum 5 words
- Return ONLY the title
- Do not use quotation marks
- Do not add explanations
- Do not add punctuation unless necessary`;

      const response = await this.client.models.generateContent({
        model: this.modelName,
        contents: prompt,
      });

      const title = response.text?.trim();

      if (!title) {
        return 'New Conversation';
      }

      // Fallback if title is too long
      if (title.length > 50) {
        return `${firstMessage.substring(0, 50).trim()}...`;
      }

      return title;
    } catch (error) {
      logger.warn(
        'Failed to generate conversation title:',
        error
      );

      // Safe fallback
      const fallback = firstMessage.substring(0, 50).trim();

      if (!fallback) {
        return 'New Conversation';
      }

      return firstMessage.length > 50
        ? `${fallback}...`
        : fallback;
    }
  }

  /**
   * Convert database messages into Gemini chat history format
   */
  formatMessagesForGemini(
    messages: Array<{
      role: string;
      content: string;
    }>
  ): ChatHistoryItem[] {
    return messages
      .filter(
        (message) =>
          message.role === 'user' ||
          message.role === 'assistant'
      )
      .map((message) => ({
        role:
          message.role === 'assistant'
            ? 'model'
            : 'user',
        parts: [
          {
            text: message.content,
          },
        ],
      }));
  }
}

// Export a singleton instance
export const geminiService = new GeminiService();