const CACHE_NAME = 'app-cache-v3'

const CACHE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.svg']

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  )
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  if (CACHE_EXTENSIONS.some((ext) => url.pathname.endsWith(ext))) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request)
        if (cached) return cached
        try {
          const response = await fetch(event.request)

          if (response.ok) {
            cache.put(event.request, response.clone())
          }

          return response
        } catch (error) {
          console.error('SW Fetch failed. Returning nothing.', error)
        }
      }),
    )
  }
})
