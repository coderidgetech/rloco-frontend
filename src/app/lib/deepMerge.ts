/** Deep-merge plain objects; arrays and primitives from `source` replace `target`. */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Record<string, unknown> | null | undefined
): T {
  if (!source || typeof source !== 'object') return target;
  const out = { ...target } as Record<string, unknown>;
  for (const key of Object.keys(source)) {
    const sk = source[key];
    const tk = out[key];
    if (
      sk !== null &&
      typeof sk === 'object' &&
      !Array.isArray(sk) &&
      tk !== null &&
      typeof tk === 'object' &&
      !Array.isArray(tk)
    ) {
      out[key] = deepMerge(tk as Record<string, unknown>, sk as Record<string, unknown>);
    } else if (sk !== undefined) {
      out[key] = sk;
    }
  }
  return out as T;
}
