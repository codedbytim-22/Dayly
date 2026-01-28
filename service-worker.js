const CACHE_NAME = "year-progress-v1.1.0";
const ASSETS_TO_CACHE = [
  // Core files
  "./",
  "./index.html",
  "./styles.css",
  "./script.js",
  "./sw.js",

  // External resources (cache these too)
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
  "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600&display=swap",

  // Font Awesome fonts
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-regular-400.woff2",

  // Google Fonts
  "https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7SUc.woff2",
  "https://fonts.gstatic.com/s/spacegrotesk/v13/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7aUXskPM.woff2",
];

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching app shell and assets");
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
      .catch((error) => {
        console.error("Cache installation failed:", error);
      }),
  );
});

// Activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log("Deleting old cache:", cache);
              return caches.delete(cache);
            }
          }),
        );
      })
      .then(() => {
        console.log("Service worker activated");
        return self.clients.claim();
      }),
  );
});

// Fetch event with network-first strategy for HTML, cache-first for assets
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  // Skip chrome-extension requests
  if (event.request.url.startsWith("chrome-extension://")) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // For HTML requests, try network first
      if (event.request.headers.get("Accept").includes("text/html")) {
        return fetch(event.request)
          .then((networkResponse) => {
            // Cache the new version
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          })
          .catch(() => {
            // If network fails, return cached version
            return cachedResponse || caches.match("./index.html");
          });
      }

      // For assets, use cache-first strategy
      if (cachedResponse) {
        // Update cache in background
        fetch(event.request).then((networkResponse) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse);
          });
        });
        return cachedResponse;
      }

      // If not in cache, fetch from network
      return fetch(event.request)
        .then((networkResponse) => {
          // Cache the new resource
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          // Return offline fallback for images
          if (event.request.destination === "image") {
            return caches.match("./offline-image.svg");
          }
          return new Response("Offline content unavailable", {
            status: 503,
            statusText: "Service Unavailable",
            headers: new Headers({
              "Content-Type": "text/plain",
            }),
          });
        });
    }),
  );
});

// Background sync for offline data
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-version") {
    event.waitUntil(syncVersion());
  }
});

async function syncVersion() {
  try {
    const response = await fetch("/version.json");
    const data = await response.json();
    const cache = await caches.open(CACHE_NAME);
    await cache.put("/version.json", new Response(JSON.stringify(data)));
  } catch (error) {
    console.error("Background sync failed:", error);
  }
}
