// Monfly Service Worker
const CACHE_VERSION = "v2";
const CACHE_NAME = `monfly-${CACHE_VERSION}`;
const OFFLINE_URL = "/offline.html";

// Static shell assets to pre-cache on install
const PRECACHE_ASSETS = ["/", OFFLINE_URL];

// ─── Install ────────────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

// ─── Activate ───────────────────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((n) => n.startsWith("monfly-") && n !== CACHE_NAME)
            .map((n) => caches.delete(n)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// ─── Message (allows client to trigger skipWaiting) ─────────────────────────
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// ─── Fetch ───────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests
  if (url.origin !== self.location.origin) return;
  if (request.method !== "GET") return;

  // ── Navigation: stale-while-revalidate + offline fallback ────────────────
  if (request.mode === "navigate") {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) => {
          const network = fetch(request)
            .then((response) => {
              if (response.ok) cache.put(request, response.clone());
              return response;
            })
            .catch(() => cached || caches.match(OFFLINE_URL));

          // Return cached immediately if available, otherwise wait for network
          return cached || network;
        }),
      ),
    );
    return;
  }

  // ── Server functions & API: network-only ─────────────────────────────────
  if (url.pathname.startsWith("/_server") || url.pathname.startsWith("/api/")) {
    return; // Let the browser handle it normally
  }

  // ── Static assets (JS, CSS, fonts, images): cache-first ──────────────────
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "font" ||
    request.destination === "image"
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          });
        }),
      ),
    );
  }
});
