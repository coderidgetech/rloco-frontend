import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError } from '../types/api';

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 30000, // 30 seconds
  withCredentials: true, // Important for HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add any request modifications here
    // Auth token will be sent via HttpOnly cookie automatically
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Suppress 401 errors for /auth/me endpoint (expected when not logged in)
    if (error.response?.status === 401 && originalRequest.url?.includes('/auth/me')) {
      // Silently reject - this is expected when user is not authenticated
      // Create a silent error that won't trigger console logs
      const silentError = new Error('Unauthorized');
      (silentError as any).isSilent = true;
      (silentError as any).response = error.response;
      return Promise.reject(silentError);
    }

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh token if refresh endpoint exists
      try {
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (refreshResponse.data) {
          // Retry original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle network errors
    if (!error.response) {
      const networkError: ApiError = {
        error: 'Network Error',
        message: 'Unable to connect to the server. Please check your internet connection.',
      };
      return Promise.reject(networkError);
    }

    // Handle timeout
    if (error.code === 'ECONNABORTED') {
      const timeoutError: ApiError = {
        error: 'Request Timeout',
        message: 'The request took too long. Please try again.',
      };
      return Promise.reject(timeoutError);
    }

    // Extract error message from response
    const apiError: ApiError = {
      error: error.response.data?.error || 'An error occurred',
      message: error.response.data?.message || error.message,
      code: error.response.data?.code,
    };

    return Promise.reject(apiError);
  }
);

export default api;
