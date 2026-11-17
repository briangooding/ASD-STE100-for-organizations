// Service worker: makes the app work offline after the first visit.
// App files: served from the cache, then updated in the background, so a
// new version appears the next time the app opens.
// Organization files (org-config.json, ste-dictionary.json): network first,
// so that administrator changes arrive at once.
// Change VERSION when you add or rename files in APP_FILES.

const VERSION = "v1";
const CACHE = `ste-coach-${VERSION}`;
const APP_FILES = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/styles.css",
  "js/app.js",
  "js/store.js",
  "js/checker.js",
  "js/data/dictionary.js",
  "js/data/exercises.js",
  "js/data/lessons.js",
  "js/data/reference.js",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
];
const NETWORK_FIRST = ["org-config.json", "ste-dictionary.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(APP_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("ste-coach-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin) return;

  if (NETWORK_FIRST.some((f) => url.pathname.endsWith("/" + f))) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone()));
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || new Response("", { status: 404 })))
    );
    return;
  }

  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      const update = fetch(req)
        .then((res) => {
          if (res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone()));
          return res;
        })
        .catch(() => hit);
      return hit || update;
    })
  );
});
