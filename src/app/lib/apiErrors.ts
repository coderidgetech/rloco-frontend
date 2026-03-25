import { isAxiosError } from 'axios';
import type { ApiError } from '../types/api';

function isRejectedApiError(err: unknown): err is ApiError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'error' in err &&
    typeof (err as ApiError).error === 'string'
  );
}

/**
 * Axios interceptor turns HTTP errors into plain `{ error, message }` objects (not AxiosError).
 * This helper must handle those first, or the UI always shows generic toasts.
 */
/** True when the request failed with HTTP 401 (session missing/expired). */
export function isUnauthorizedApiError(err: unknown): boolean {
  if (isAxiosError(err) && err.response?.status === 401) return true;
  if (typeof err === 'object' && err !== null && 'response' in err) {
    const r = (err as { response?: { status?: number } }).response;
    if (r?.status === 401) return true;
  }
  return false;
}

export function getApiErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
  if (isRejectedApiError(err)) {
    if (err.error?.trim()) return err.error.trim();
    if (err.message?.trim()) return err.message.trim();
  }
  if (isAxiosError(err) && err.response?.data && typeof err.response.data === 'object') {
    const d = err.response.data as { error?: string; message?: string };
    if (typeof d.error === 'string' && d.error.trim()) return d.error;
    if (typeof d.message === 'string' && d.message.trim()) return d.message;
  }
  return fallback;
}
