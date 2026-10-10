/*
 * Offline support for the Valley Guide. Signal is patchy in the valley, so
 * pages a visitor has opened stay readable without a connection.
 *
 * - Pages and page data: network first; the saved copy only when offline.
 * - Build files under _next/static (content-hashed, never change): saved copy first.
 * - Other files from this site (icons, manifest): saved copy, refreshed in the background.
 * - Other websites (map tiles, photos) are not touched or stored.
 *
 * Only public pages of this site are stored, never anything a visitor types.
 * Changing VERSION drops every older copy.
 */
const VERSION = "valley-guide-v1";
const BASE = new URL(self.registration.scope).pathname; // e.g. "/Gusinje/"
const OFFLINE_PAGE = `${BASE}offline.html`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.add(OFFLINE_PAGE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("valley-guide-") && key !== VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

/** Static pages are the same whatever the query string, so copies are kept by path. Page data gets its own key. */
function keyFor(request) {
  const url = new URL(request.url);
  const isData = request.headers.get("RSC") === "1" || url.searchParams.has("_rsc");
  return `${url.origin}${url.pathname}${isData ? "?_rsc" : ""}`;
}

function inScope(url) {
  return url.origin === self.location.origin && url.pathname.startsWith(BASE);
}

/** Keep only complete, same-site answers that weren't redirects (a redirect can't stand in for a page). */
async function save(key, response) {
  if (!response.ok || response.redirected || response.type !== "basic") return;
  const cache = await caches.open(VERSION);
  await cache.put(key, response);
}

async function saved(key) {
  const cache = await caches.open(VERSION);
  return cache.match(key, { ignoreVary: true });
}

async function networkFirst(request, fallback) {
  const key = keyFor(request);
  try {
    const response = await fetch(request);
    save(key, response.clone());
    return response;
  } catch (error) {
    const copy = (await saved(key)) ?? (fallback ? await saved(fallback) : undefined);
    if (copy) return copy;
    throw error;
  }
}

async function savedFirst(request) {
  const key = keyFor(request);
  const copy = await saved(key);
  if (copy) return copy;
  const response = await fetch(request);
  save(key, response.clone());
  return response;
}

async function savedThenRefresh(request, event) {
  const key = keyFor(request);
  const copy = await saved(key);
  const refresh = fetch(request).then((response) => {
    save(key, response.clone());
    return response;
  });
  if (copy) {
    event.waitUntil(refresh.catch(() => undefined));
    return copy;
  }
  return refresh;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (!inScope(url) || url.pathname === `${BASE}sw.js`) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, OFFLINE_PAGE));
  } else if (url.pathname.startsWith(`${BASE}_next/static/`)) {
    event.respondWith(savedFirst(request));
  } else if (keyFor(request).endsWith("?_rsc")) {
    event.respondWith(networkFirst(request));
  } else {
    event.respondWith(savedThenRefresh(request, event));
  }
});

/** First visit: the page hands over what it loaded before this worker was in control. */
self.addEventListener("message", (event) => {
  if (event.data?.type !== "save" || !Array.isArray(event.data.urls)) return;
  const urls = event.data.urls.slice(0, 200).filter((href) => {
    try {
      return inScope(new URL(href));
    } catch {
      return false;
    }
  });
  event.waitUntil(
    Promise.all(
      urls.map((href) =>
        fetch(href)
          .then((response) => save(keyFor(new Request(href)), response))
          .catch(() => undefined),
      ),
    ),
  );
});
