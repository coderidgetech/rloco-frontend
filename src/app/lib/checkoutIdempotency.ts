const STORAGE_KEY = 'rloco_checkout_idempotency_v1';

/** Stable per-tab key for POST /orders Idempotency-Key (checkout retries). */
export function checkoutIdempotencyKey(): string {
  try {
    let k = sessionStorage.getItem(STORAGE_KEY);
    if (!k) {
      k =
        typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function'
          ? globalThis.crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      sessionStorage.setItem(STORAGE_KEY, k);
    }
    return k;
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }
}
