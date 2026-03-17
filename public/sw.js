// Service Worker for PWA
const CACHE_NAME = 'rloco-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event - cache-first for same-origin GET; skip /api/ and non-GET so dev server and API work
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || event.request.method !== 'GET') {
    return;
  }
  // Never intercept API calls - let them go to the network (avoids SW rejections when backend is down)
  if (url.pathname.startsWith('/api')) {
    return;
  }
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
      .catch(() => fetch(event.request))
      .catch(() => new Response('', { status: 503, statusText: 'Service Unavailable' }))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
