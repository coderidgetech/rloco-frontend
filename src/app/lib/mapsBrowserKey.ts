/**
 * Google Maps browser key: prefer Vite build-time env; otherwise GET /api/auth/client-config
 * (backend reads GOOGLE_MAPS_BROWSER_KEY from server env — works on Droplets without rebuilding SPA).
 */
let runtimeKey: string | undefined;
let fetchDone = false;
let fetchPromise: Promise<void> | null = null;

function apiBase(): string {
  return (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/$/, '');
}

export async function getGoogleMapsBrowserKey(): Promise<string | undefined> {
  const buildKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined)?.trim();
  if (buildKey) return buildKey;
  if (fetchDone) return runtimeKey;
  if (!fetchPromise) {
    fetchPromise = fetch(`${apiBase()}/auth/client-config`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : {}))
      .then((data: { google_maps_api_key?: string }) => {
        const k = typeof data.google_maps_api_key === 'string' ? data.google_maps_api_key.trim() : '';
        if (k) runtimeKey = k;
      })
      .catch(() => {})
      .finally(() => {
        fetchDone = true;
      });
  }
  await fetchPromise;
  return runtimeKey;
}
