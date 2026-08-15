// Authentication Types
export interface User {
  userId: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Chat Types
export interface Message {
  _id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sent' | 'failed';
}

export interface Conversation {
  _id: string;
  title: string;
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
  messages?: Message[];
}

export interface ChatMessageRequest {
  message: string;
  conversationId?: string;
}

export interface ChatMessageResponse {
  conversationId: string;
  userMessage: Message;
  assistantMessage: Message;
}

export interface ConversationsListResponse {
  conversations: Conversation[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface ChatState extends LoadingState {
  messages: Message[];
  conversationId: string | null;
  hasMore: boolean;
}

export interface AuthState extends LoadingState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
