"use client";

import { useEffect } from "react";

import { brand } from "@/config/brand";

/**
 * Registers the service worker (public/sw.js) so pages already opened keep
 * working without signal in the mountains. Production builds only. On the
 * first visit the worker isn't in control yet, so it is handed the files this
 * page has already loaded.
 */
export function OfflineSupport() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const base = brand.basePath;
    const firstVisit = !navigator.serviceWorker.controller;
    navigator.serviceWorker
      .register(`${base}/sw.js`, { scope: `${base}/` })
      .then(() => navigator.serviceWorker.ready)
      .then((registration) => {
        if (!firstVisit) return;
        // This page and its files (scripts, styles, fonts, page data) — not
        // the other pages the links merely checked, to spare mobile data.
        const urls = [
          window.location.href,
          ...performance
            .getEntriesByType("resource")
            .map((entry) => entry.name)
            .filter((url) => url.startsWith(`${window.location.origin}${base}/`) && !new URL(url).pathname.endsWith("/")),
        ];
        registration.active?.postMessage({ type: "save", urls });
      })
      .catch(() => {
        // Offline support is an extra; the site works without it.
      });
  }, []);
  return null;
}
