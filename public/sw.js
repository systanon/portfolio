const CACHE_NAME = "app-cache-v2";

const CACHE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".svg"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (CACHE_EXTENSIONS.some(ext => url.pathname.endsWith(ext))) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;

        const response = await fetch(event.request);

        cache.put(event.request, response.clone());

        return response;
      })
    );
  }
});