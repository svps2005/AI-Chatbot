import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models/User';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { AppError, JWTPayload } from '../types';

export interface TokenPayload {
  token: string;
  expiresIn: string;
}

class AuthService {
  /**
   * Register a new user
   */
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<{ userId: string; email: string; name: string }> {
    try {
      // Validate input
      if (!name || !email || !password) {
        throw new AppError('Missing required fields', 400, 'MISSING_FIELDS');
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        throw new AppError('Email already registered', 409, 'EMAIL_EXISTS');
      }

      // Create new user
      const user = new User({
        name: name.trim(),
        email: email.toLowerCase(),
        passwordHash: password,
      });

      await user.save();

      logger.info('New user registered', { userId: user._id, email: user.email });

      return {
        userId: user._id!.toString(),
        email: user.email,
        name: user.name,
      };
    } catch (error) {
      logger.error('Registration error:', error);

      if (error instanceof AppError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.message.includes('duplicate key')) {
          throw new AppError('Email already registered', 409, 'EMAIL_EXISTS');
        }
        throw new AppError(error.message, 400, 'REGISTRATION_ERROR');
      }

      throw new AppError('Registration failed', 500, 'REGISTRATION_ERROR');
    }
  }

  /**
   * Login user and return JWT token
   */
  async login(
    email: string,
    password: string
  ): Promise<{ token: string; user: { userId: string; email: string; name: string } }> {
    try {
      // Validate input
      if (!email || !password) {
        throw new AppError('Email and password required', 400, 'MISSING_FIELDS');
      }

      // Find user
      const user = await User.findOne({ email: email.toLowerCase() }).select(
        '+passwordHash'
      );

      if (!user) {
        throw new AppError(
          'Invalid email or password',
          401,
          'INVALID_CREDENTIALS'
        );
      }

      // Compare passwords
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        throw new AppError(
          'Invalid email or password',
          401,
          'INVALID_CREDENTIALS'
        );
      }

      // Generate JWT token
      const token = this.generateToken(user._id!.toString(), user.email);

      logger.info('User logged in', { userId: user._id, email: user.email });

      return {
        token,
        user: {
          userId: user._id!.toString(),
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      logger.error('Login error:', error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError('Login failed', 500, 'LOGIN_ERROR');
    }
  }

  /**
   * Generate JWT token
   */
  generateToken(userId: string, email: string): string {
    const payload: JWTPayload = {
      userId,
      email,
    };

  const options: SignOptions = {
  expiresIn: env.jwtExpiration as SignOptions['expiresIn'],
};

return jwt.sign(payload, env.jwtSecret, options);
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, env.jwtSecret) as JWTPayload;
      return decoded;
    } catch (error) {
      logger.error('Token verification failed:', error);

      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Token has expired', 401, 'TOKEN_EXPIRED');
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid token', 401, 'INVALID_TOKEN');
      }

      throw new AppError('Token verification failed', 401, 'TOKEN_ERROR');
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<{
    userId: string;
    email: string;
    name: string;
  } | null> {
    try {
      const user = await User.findById(userId);

      if (!user) {
        return null;
      }

      return {
        userId: user._id!.toString(),
        email: user.email,
        name: user.name,
      };
    } catch (error) {
      logger.error('Error fetching user:', error);
      return null;
    }
  }
}

export const authService = new AuthService();
