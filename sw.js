// TWatched service worker — app-shell caching so the installed app opens
// instantly and works offline. It does not do background push; see README.

const CACHE_VERSION = 'twatched-v70';
const SHELL_FILES = [
  './',
  './index.html',
  './app.js?v=224',
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
  if (event.request.headers.has('X-App-Key')) return; // notification Worker calls: straight to the network, never cached

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

// Notifications (v2.16): your Cloudflare Worker sends a push when an episode airs.
self.addEventListener('push', (event) => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch (e) { d = { body: event.data ? event.data.text() : '' }; }
  event.waitUntil(self.registration.showNotification(d.title || 'TWatched', {
    body: d.body || 'A new episode is out', tag: d.tag || undefined, icon: 'icon-192.png', badge: 'icon-192.png', data: { url: d.url || './' }
  }));
});
// Tapping it opens TWatched on that show (or brings the open app forward and switches to it).
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = new URL((event.notification.data && event.notification.data.url) || './', self.registration.scope).href;
  const id = new URL(url).searchParams.get('show');
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
    for (const c of list) {
      if (c.url.indexOf(self.registration.scope) === 0) { if (id) c.postMessage({ type: 'open-show', id: id }); return c.focus(); }
    }
    return self.clients.openWindow(url);
  }));
});
