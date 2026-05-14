// ToucaBR / Edu Dok - Mundo Mágico Online
const CACHE_NAME='touca-mundo-magico-online-v9-ofuscado';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Firebase e Google Fonts ficam em rede para evitar cache antigo quebrando multiplayer.
  if (url.hostname.includes('firebase') || url.hostname.includes('gstatic') || url.hostname.includes('googleapis')) {
    event.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }

  // musica.mp3 é opcional: o usuário pode adicionar depois.
  if (url.pathname.endsWith('/musica.mp3')) {
    event.respondWith(fetch(req).catch(() => new Response('', { status: 204 })));
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
