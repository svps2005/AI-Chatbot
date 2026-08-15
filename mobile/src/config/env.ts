// Environment configuration for the mobile app
// Uses EXPO_PUBLIC_ prefix for client-side variables

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';
const APP_NAME = process.env.EXPO_PUBLIC_APP_NAME || 'AI Assistant';
const LOG_LEVEL = process.env.EXPO_PUBLIC_LOG_LEVEL || 'info';

export const env = {
  api: {
    baseUrl: API_URL,
    timeout: 30000, // 30 seconds
  },
  app: {
    name: APP_NAME,
  },
  logging: {
    level: LOG_LEVEL,
  },
  features: {
    enableDebugLogging: LOG_LEVEL === 'debug',
  },
};

// Validate required environment variables
if (!API_URL) {
  console.warn('EXPO_PUBLIC_API_URL is not set. Using default localhost URL.');
}
