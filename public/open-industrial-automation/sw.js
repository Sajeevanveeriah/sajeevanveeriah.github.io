const CACHE = 'oia-suite-v2.2';
const CORE = [
  "./",
  "./index.html",
  "./styles.css",
  "./dub.css",
  "./runtime-bootstrap.js",
  "./data.js",
  "./app.js",
  "./quality.js",
  "./product-shell.js",
  "./icon.svg",
  "./manifest.webmanifest",
  "./model.json",
  "./README.md",
  "./LICENSE",
  "./products/",
  "./products/operations/",
  "./products/control/",
  "./products/hmi/",
  "./products/alarms/",
  "./products/historian/",
  "./products/performance/",
  "./products/integration/",
  "./products/mes/",
  "./products/materials/",
  "./products/assets/",
  "./products/quality/",
  "./products/security/",
  "./products/identity/",
  "./products/deployment/",
  "./products/migration/",
  "./docs/Architecture.md",
  "./docs/Capability-Matrix.md",
  "./docs/Deployment-Guide.md",
  "./docs/Safety-And-Regulatory-Boundary.md",
  "./docs/Product-And-Desktop-Architecture.md",
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request).then((response) => {
        if (response.ok && new URL(event.request.url).origin === self.location.origin) {
          const copy = response.clone();
          void caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      });
      return cached || network.catch(() => caches.match('./index.html'));
    }),
  );
});
