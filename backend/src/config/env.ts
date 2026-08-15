import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

interface EnvConfig {
  port: number;
  nodeEnv: string;
  mongodbUri: string;
  geminiApiKey: string;
  jwtSecret: string;
  jwtExpiration: string;
  frontendUrl: string;
  logLevel: string;
}

const getEnvConfig = (): EnvConfig => {
  const port = parseInt(process.env.PORT || '5000', 10);
  const nodeEnv = process.env.NODE_ENV || 'development';
  const mongodbUri = process.env.MONGODB_URI || '';
  const geminiApiKey = process.env.GEMINI_API_KEY || '';
  const jwtSecret = process.env.JWT_SECRET || '';
  const jwtExpiration = process.env.JWT_EXPIRATION || '7d';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8081';
  const logLevel = process.env.LOG_LEVEL || 'info';

  // Validate required environment variables
  if (!mongodbUri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  return {
    port,
    nodeEnv,
    mongodbUri,
    geminiApiKey,
    jwtSecret,
    jwtExpiration,
    frontendUrl,
    logLevel,
  };
};

export const env = getEnvConfig();
