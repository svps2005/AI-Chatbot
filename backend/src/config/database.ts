import mongoose, { Connection } from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

let connection: Connection | null = null;

export const connectDatabase = async (): Promise<Connection> => {
  if (connection) {
    logger.info('Using existing database connection');
    return connection;
  }

  try {
    logger.info('Connecting to MongoDB...');

    const conn = await mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority',
    });

    connection = conn.connection;
    logger.info('MongoDB connected successfully');

    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
      connection = null;
    });

    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
      connection = null;
    });

    return connection;
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  if (connection) {
    try {
      await mongoose.disconnect();
      connection = null;
      logger.info('MongoDB disconnected');
    } catch (error) {
      logger.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }
};

export const getDatabase = (): Connection => {
  if (!connection) {
    throw new Error('Database connection not established. Call connectDatabase() first.');
  }
  return connection;
};
