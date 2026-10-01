import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError } from '../types/api';

const AUTH_TOKEN_KEY = 'auth_token';

const clearStoredAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

/** Web sessions use the HttpOnly cookie. Kept as a compatibility no-op for callers. */
export function persistAuthToken(_token: string | undefined | null): void {
  clearStoredAuthToken();
}

export function clearAuthToken(): void {
  clearStoredAuthToken();
}

const apiBase =
  import.meta.env.PROD
    ? (() => {
        const u = import.meta.env.VITE_API_URL?.trim();
        if (!u) {
          throw new Error('VITE_API_URL must be set for production builds.');
        }
        return u;
      })()
    : import.meta.env.VITE_API_URL?.trim() ||
      (typeof window !== 'undefined'
        ? `${window.location.protocol}//${window.location.hostname}:8080/api`
        : 'http://localhost:8080/api');

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: apiBase,
  timeout: 30000, // 30 seconds
  withCredentials: true, // Important for HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Let the browser set Content-Type (including the boundary) for multipart uploads.
    if (config.data instanceof FormData) {
      const h = config.headers;
      if (typeof (h as any).delete === 'function') {
        (h as any).delete('Content-Type');
      } else {
        delete (h as any)['Content-Type'];
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    const url = response.config.url || '';
    if (url.includes('/auth/logout')) {
      clearStoredAuthToken();
    }
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Suppress 401 errors for /auth/me endpoint (expected when not logged in)
    if (error.response?.status === 401 && originalRequest.url?.includes('/auth/me')) {
      clearStoredAuthToken();
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
          `${apiBase}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (refreshResponse.data) {
          return api(originalRequest);
        }
      } catch (refreshError) {
        clearStoredAuthToken();
        // Refresh failed — only send storefront users away from admin; never hijack /login or /otp-verification
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
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

    // Normalize server JSON into ApiError (interceptor rejects a plain object, not AxiosError).
    const raw = error.response.data as unknown;
    let primary = 'An error occurred';
    let detail: string | undefined;
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      const d = raw as Record<string, unknown>;
      const errStr = typeof d.error === 'string' ? d.error.trim() : '';
      const msgStr = typeof d.message === 'string' ? d.message.trim() : '';
      const detStr = typeof d.detail === 'string' ? d.detail.trim() : '';
      primary = errStr || msgStr || detStr || primary;
      detail = msgStr || errStr || undefined;
    } else if (typeof raw === 'string' && raw.trim()) {
      primary = raw.trim();
    }
    const code =
      raw && typeof raw === 'object' && !Array.isArray(raw) && typeof (raw as { code?: unknown }).code === 'string'
        ? (raw as { code: string }).code
        : undefined;
    const apiError: ApiError = {
      error: primary,
      message: detail || error.message,
      code,
    };

    return Promise.reject(apiError);
  }
);

export default api;
