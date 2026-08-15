import { Request } from 'express';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
  error?: string;
}

// User Types
export interface IUser {
  _id?: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Conversation Types
export interface IConversation {
  _id?: string;
  userId: string;
  title: string;
  messageCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Message Types
export interface IMessage {
  _id?: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  status?: 'sent' | 'failed';
}

// Chat Request/Response Types
export interface ChatMessageRequest {
  conversationId?: string;
  message: string;
}

export interface ChatMessageResponse {
  conversationId: string;
  userMessage: IMessage;
  assistantMessage: IMessage;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

// JWT Payload Type
export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Custom Express Request with User
export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

// Error Types
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Gemini Message Type
export interface GeminiMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

// Gemini Response Type
export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
  }>;
}
