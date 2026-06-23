const SW_VERSION = "1.0.2";
const CACHE_NAME = `weather-app-${SW_VERSION}`;

const PRECACHE_URLS = [
  "/",
  "/map",
  "/health",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// Install: take over immediately + cache the app shell
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
});

// Activate: claim all clients + clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      }),
    ])
  );
});

// Listen for SKIP_WAITING message from the page
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Fetch: cache-first for static, network-first for API
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // API requests - network first, fallback to cache
  if (url.hostname === "api.openweathermap.org" || url.hostname === "api.open-meteo.com") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Tile requests - cache first
  if (url.hostname === "tile.openweathermap.org") {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME + "-tiles").then((cache) => {
            cache.put(event.request, clone);
          });
          return response;
        });
      })
    );
    return;
  }

  // Static assets - cache first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        return response;
      });
    })
  );
});
