export const COLORS = {
  primary: '#6366F1',      // Indigo
  secondary: '#8B5CF6',    // Purple
  background: '#FFFFFF',   // White
  cardBg: '#F3F4F6',       // Light gray
  textPrimary: '#1F2937',  // Dark gray
  textSecondary: '#6B7280', // Medium gray
  success: '#10B981',      // Green
  error: '#EF4444',        // Red
  warning: '#F59E0B',      // Amber
  userBubble: '#6366F1',   // Blue for user messages
  aiBubble: '#E5E7EB',     // Gray for AI messages
  border: '#D1D5DB',       // Light border
};

export const SIZES = {
  base: 8,
  small: 4,
  medium: 12,
  large: 16,
  xl: 24,
  xxl: 32,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const RADIUS = {
  small: 8,
  medium: 12,
  large: 16,
  xlarge: 24,
};

export const FONTS = {
  light: { fontWeight: '300' as const },
  regular: { fontWeight: '400' as const },
  medium: { fontWeight: '500' as const },
  semibold: { fontWeight: '600' as const },
  bold: { fontWeight: '700' as const },
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const AI_SUGGESTED_PROMPTS = [
  'Explain machine learning',
  'Help me write an email',
  'Give me project ideas',
  'Explain this concept simply',
  'How do I learn coding?',
  'Best productivity tips',
];

export const STORAGE_KEYS = {
  auth: {
    token: 'auth_token',
    user: 'auth_user',
  },
  chat: {
    lastConversationId: 'last_conversation_id',
  },
};

export const API_TIMEOUT = 30000; // 30 seconds

export const MESSAGES = {
  errors: {
    network: 'No internet connection. Please check your connection.',
    server: 'Server error. Please try again later.',
    unauthorized: 'Session expired. Please login again.',
    notFound: 'Resource not found.',
    badRequest: 'Invalid request. Please try again.',
    generic: 'Something went wrong. Please try again.',
  },
  loading: {
    sending: 'Sending message...',
    thinking: 'AI is thinking...',
    loading: 'Loading...',
  },
  empty: {
    noConversations: 'No conversations yet. Start a new chat!',
    noMessages: 'Start a conversation by sending a message.',
  },
};
