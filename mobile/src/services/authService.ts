import { apiClient } from './api';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '../types';

export const authService = {
  /**
   * Register a new user
   */
  async register(request: RegisterRequest): Promise<User> {
    const response = await apiClient.post<AuthResponse>('/auth/register', {
      name: request.name,
      email: request.email,
      password: request.password,
    });
    return response.user;
  },

  /**
   * Login user and get auth token
   */
  async login(request: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', {
      email: request.email,
      password: request.password,
    });
  },

  /**
   * Get authenticated user profile
   */
  async getProfile(): Promise<User> {
    return apiClient.get<User>('/auth/profile');
  },
};
