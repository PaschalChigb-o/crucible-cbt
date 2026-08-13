// CRUCIBLE service worker — cache app shell + question data for offline use.
// Registered only from published production origin (see src/lib/pwa.ts).
const CACHE = "crucible-v2";
const DATA_PREFIX = "/data/";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        cache.addAll([
          "/",
          "/manifest.json",
          "/assets/logo.png",
          "/data/GST121.json",
          "/data/MTH121.json",
          "/data/PHY121.json",
          "/data/CHM121.json",
          "/data/STAT122.json",
          "/data/BIO121.json",
          "/data/PHY128.json",
          "/data/CHM128.json",
          "/data/BIO128.json",
        ]),
      )
      .catch(() => {}),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.filter((n) => n !== CACHE).map((n) => caches.delete(n)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // Cache-first for /data/ files
  if (url.pathname.startsWith(DATA_PREFIX)) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(req, clone));
            return res;
          }),
      ),
    );
    return;
  }

  // Network-first with cache fallback
  event.respondWith(
    fetch(req)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE).then((c) => c.put(req, clone)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || Response.error())),
  );
});
