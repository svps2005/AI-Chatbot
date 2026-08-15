import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { env } from '../config/env';
import { getAuthToken } from '../store/asyncStorage';
import { ApiResponse } from '../types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.api.baseUrl,
      timeout: env.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to inject auth token
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiResponse>) => {
        const message = error.response?.data?.message || error.message;
        const code = error.response?.data?.code || 'UNKNOWN_ERROR';

        return Promise.reject({
          message,
          code,
          status: error.response?.status,
          error,
        });
      }
    );
  }

  async get<T = any>(url: string, config?: any): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data.data as T;
  }

  async post<T = any>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(
      url,
      data,
      config
    );
    return response.data.data as T;
  }

  async put<T = any>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data.data as T;
  }

  async delete<T = any>(url: string, config?: any): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data.data as T;
  }

  /**
   * Check if error is unauthorized
   */
  isUnauthorized(error: any): boolean {
    return error.status === 401 || error.code === 'INVALID_TOKEN';
  }

  /**
   * Check if error is network error
   */
  isNetworkError(error: any): boolean {
    return !error.status || error.code === 'ECONNABORTED';
  }
}

export const apiClient = new ApiClient();
