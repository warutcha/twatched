// TWatched service worker — app-shell caching so the installed app opens
// instantly and works offline. It does not do background push; see README.

const CACHE_VERSION = 'twatched-v25';
const SHELL_FILES = [
  './',
  './index.html',
  './app.js?v=179',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(SHELL_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first for the app shell so a fresh deploy is always picked up immediately when
// online; the cache is only a fallback for when the device is offline. GitHub API calls are
// never cached at all. { cache: 'no-store' } on the outgoing fetch makes sure this actually
// reaches the network every time — without it, the *browser's* own HTTP cache could still
// quietly hand back a stale response (e.g. from GitHub Pages' caching headers) underneath
// this service worker, even though the SW logic itself is correctly "network-first".
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  if (url.indexOf('api.github.com') !== -1) return; // let sync calls always hit the network

  event.respondWith(
    fetch(event.request, { cache: 'no-store' }).catch(() => fetch(event.request)).then((response) => {
      if (event.request.method === 'GET' && response && response.status === 200) {
        const copy = response.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy));
      }
      return response;
    }).catch(() => caches.match(event.request))
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('./index.html');
    })
  );
});
