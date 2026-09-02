const CACHE = 'oia-suite-v2.1';
const ASSETS = ['./', './index.html', './styles.css', './data.js', './app.js', './icon.svg', './manifest.webmanifest', './model.json', './README.md', './LICENSE', './docs/Architecture.md', './docs/Capability-Matrix.md', './docs/Deployment-Guide.md', './docs/Safety-And-Regulatory-Boundary.md'];
self.addEventListener('install', (event) => event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS))));
self.addEventListener('activate', (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))));
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    const copy = response.clone();
    caches.open(CACHE).then((cache) => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match('./index.html'))));
});
