import { isAxiosError } from 'axios';
import type { ApiError } from '../types/api';

const GENERIC_AXIOS = /^Request failed with status code \d+$/;

function isPlainRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function pickString(...parts: unknown[]): string | undefined {
  for (const p of parts) {
    if (typeof p === 'string') {
      const t = p.trim();
      if (t) return t;
    }
  }
  return undefined;
}

function isRejectedApiError(err: unknown): err is ApiError {
  if (!isPlainRecord(err)) return false;
  return typeof err.error === 'string' || typeof err.message === 'string';
}

/**
 * Axios interceptor turns HTTP errors into plain `{ error, message?, code? }` objects (not AxiosError).
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

/**
 * Best-effort user-facing message from API failures (interceptor plain object, AxiosError, or Error).
 */
export function getApiErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
  if (isRejectedApiError(err)) {
    const fromApi = pickString(err.error, err.message);
    if (fromApi) return fromApi;
  }
  if (isPlainRecord(err)) {
    const nested = pickString(err.error, err.message, err.detail);
    if (nested) return nested;
  }
  if (isAxiosError(err)) {
    const d = err.response?.data;
    if (typeof d === 'string' && d.trim()) return d.trim();
    if (isPlainRecord(d)) {
      const m = pickString(d.error, d.message, d.detail);
      if (m) return m;
    }
    if (err.message?.trim() && !GENERIC_AXIOS.test(err.message)) return err.message.trim();
  }
  if (err instanceof Error && err.message.trim() && !GENERIC_AXIOS.test(err.message)) {
    return err.message.trim();
  }
  return fallback;
}
