// Service Worker for PWA
// Bump CACHE_NAME when changing caching rules so old entries are dropped.
const CACHE_NAME = 'rloco-v2';
// Do not precache / or index.html — hashed assets change every deploy; stale shell → 404 on JS/CSS.
const urlsToCache = ['/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((name) => (name !== CACHE_NAME ? caches.delete(name) : undefined))
        )
      )
      .then(() => self.clients.claim())
  );
});

function isHTMLShell(request, url) {
  return request.mode === 'navigate' || url.pathname === '/index.html';
}

// Fetch: network-first for HTML shell; cache-first for other same-origin GET. Skip /api/, /sw.js, non-GET.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || event.request.method !== 'GET') {
    return;
  }
  if (url.pathname.startsWith('/api')) {
    return;
  }
  if (url.pathname === '/sw.js') {
    return;
  }

  if (isHTMLShell(event.request, url)) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
      .catch(() => fetch(event.request))
      .catch(() => new Response('', { status: 503, statusText: 'Service Unavailable' }))
  );
});
