import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError } from '../types/api';

const AUTH_TOKEN_KEY = 'auth_token';

const getStoredAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

const setStoredAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

const clearStoredAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

/** Persist JWT from auth responses (cookie may not be sent cross-origin). Idempotent. */
export function persistAuthToken(token: string | undefined | null): void {
  if (typeof token === 'string' && token.length > 0) {
    setStoredAuthToken(token);
  }
}

export function clearAuthToken(): void {
  clearStoredAuthToken();
}

function requestHasAuthorizationHeader(config: InternalAxiosRequestConfig): boolean {
  const h = config.headers;
  if (!h) return false;
  const raw =
    typeof (h as any).get === 'function'
      ? (h as any).get('Authorization')
      : (h as any).Authorization;
  return typeof raw === 'string' && raw.length > 0;
}

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
    // Prefer cookie auth; if cookie is unavailable cross-site, send stored bearer token.
    const token = getStoredAuthToken();
    if (token && !requestHasAuthorizationHeader(config)) {
      const h = config.headers;
      if (typeof (h as any).set === 'function') {
        (h as any).set('Authorization', `Bearer ${token}`);
      } else {
        (h as any).Authorization = `Bearer ${token}`;
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
    const token = (response.data as any)?.token;
    if (typeof token === 'string' && token.length > 0) {
      setStoredAuthToken(token);
    } else if (url.includes('/auth/logout')) {
      clearStoredAuthToken();
    }
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Suppress 401 errors for /auth/me endpoint (expected when not logged in)
    if (error.response?.status === 401 && originalRequest.url?.includes('/auth/me')) {
      // Only clear stored token when the server rejected a sent Bearer (expired/invalid).
      // Do not clear when a stale in-flight getMe (no auth header) loses a race with login.
      if (requestHasAuthorizationHeader(originalRequest)) {
        clearStoredAuthToken();
      }
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

        const data = refreshResponse.data as { token?: string } | undefined;
        if (data?.token) {
          persistAuthToken(data.token);
        }
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
