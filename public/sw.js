// Service Worker for PWA + Firebase Cloud Messaging background messages
// Bump CACHE_NAME when changing caching rules so old entries are dropped.

// Firebase compat SDKs (imported via CDN — work in SW context without bundler)
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// The app sends FIREBASE_CONFIG once after the SW becomes active.
// We initialise Firebase messaging on receipt so background FCM push works.
let _fcmReady = false;
self.addEventListener('message', (event) => {
  if (event.data?.type === 'FIREBASE_CONFIG' && !_fcmReady) {
    try {
      if (!firebase.apps.length) firebase.initializeApp(event.data.config);
      const messaging = firebase.messaging();
      messaging.onBackgroundMessage((payload) => {
        const n = payload.notification ?? {};
        self.registration.showNotification(n.title ?? 'Rloko', {
          body: n.body ?? '',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          data: payload.data ?? {},
        });
      });
      _fcmReady = true;
    } catch (_) {}
  }
});

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

self.addEventListener('push', (event) => {
  if (!event.data) return;
  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { notification: { title: 'Rloko', body: event.data.text() } };
  }
  const { title, body, data } = payload.notification ?? payload;
  event.waitUntil(
    self.registration.showNotification(title ?? 'Rloko', {
      body: body ?? '',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      data: data ?? {},
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const orderId = event.notification.data?.order_id;
  const url = orderId ? `/orders/${orderId}` : '/orders';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.navigate(url);
          return;
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
