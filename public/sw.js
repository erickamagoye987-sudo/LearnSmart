// LearnSmart Progressive Web App (PWA) Service Worker for GitHub Pages
const CACHE_NAME = 'learnsmart-ghpages-v1.0.0';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './pwa-192x192.png',
  './pwa-512x512.png',
  './pwa-maskable-512x512.png',
  './icon-192x192.png',
  './icon-512x512.png',
  './apple-touch-icon.png',
  './icon.svg'
];

// Install event: Precache core application shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[LearnSmart SW] Precaching application shell on scope:', self.registration.scope);
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[LearnSmart SW] Precache partial error (non-fatal):', err);
      });
    })
  );
});

// Activate event: Clean up previous caches and take control of all clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[LearnSmart SW] Removing obsolete cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: Serve cached assets offline and update cache in background
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignore non-GET requests or unsupported schemes
  if (req.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Navigation requests (HTML pages): Network-first with cache fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(async () => {
          const cachedRes = await caches.match(req);
          if (cachedRes) return cachedRes;
          return caches.match('./') || caches.match('./index.html');
        })
    );
    return;
  }

  // Google Fonts & static images: Cache-first
  if (
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    req.destination === 'image' ||
    req.destination === 'font'
  ) {
    event.respondWith(
      caches.match(req).then((cachedRes) => {
        if (cachedRes) return cachedRes;
        return fetch(req).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        });
      })
    );
    return;
  }

  // Default: Stale-while-revalidate
  event.respondWith(
    caches.match(req).then((cachedRes) => {
      const fetchPromise = fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(() => cachedRes);

      return cachedRes || fetchPromise;
    })
  );
});
