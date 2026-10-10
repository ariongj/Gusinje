"use client";

import "leaflet/dist/leaflet.css";

import type { LayerGroup, Map as LMap, Marker } from "leaflet";
import { useEffect, useRef, useState } from "react";

import { useI18n } from "@/i18n/client";

import styles from "./LeafletMap.module.css";
import type { ExploreItem } from "./types";

/**
 * Map tiles. OpenStreetMap's standard tiles are fine for a low-traffic pilot
 * (with the attribution below); a public launch should use a tile provider
 * with a plan that fits the traffic — set both variables at build time.
 */
const TILE_URL = process.env.NEXT_PUBLIC_MAP_TILES || "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  process.env.NEXT_PUBLIC_MAP_ATTRIBUTION ||
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';

/** The valley from Plav to the border, used when nothing else sets the view. */
const DEFAULT_BOUNDS: [[number, number], [number, number]] = [
  [42.47, 19.74],
  [42.6, 19.93],
];

export type MapFocus = { key: string | null; nonce: number };

type Props = {
  items: ExploreItem[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
  /** Fly to an item (or back to everything when key is null) whenever nonce changes. */
  focus: MapFocus;
  /** Markers are not focusable while a guided tour drives the map. */
  touring?: boolean;
  /** Panels covering the edges (px): a focused marker lands in the middle of the open area. */
  insets?: { left?: number; right?: number; bottom?: number };
};

export function LeafletMap({ items, selectedKey, onSelect, focus, touring = false, insets }: Props) {
  const { t } = useI18n();
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const markersRef = useRef(new Map<string, Marker>());
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const onSelectRef = useRef(onSelect);
  const insetsRef = useRef(insets);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [tilesFailed, setTilesFailed] = useState(false);

  useEffect(() => {
    onSelectRef.current = onSelect;
    insetsRef.current = insets;
  });

  // Create the map once.
  useEffect(() => {
    let cancelled = false;
    let map: LMap | null = null;
    const markers = markersRef.current;
    import("leaflet")
      .then((L) => {
        const host = hostRef.current;
        if (cancelled || !host) return;
        leafletRef.current = L;
        map = L.map(host, { zoomControl: false, attributionControl: true, scrollWheelZoom: false });
        map.fitBounds(DEFAULT_BOUNDS);
        map.attributionControl.setPrefix(false);
        let errors = 0;
        L.tileLayer(TILE_URL, { attribution: TILE_ATTRIBUTION, maxZoom: 17, minZoom: 9 })
          .on("tileerror", () => {
            errors += 1;
            if (errors >= 4) setTilesFailed(true);
          })
          .on("tileload", () => setTilesFailed(false))
          .addTo(map);
        // Ctrl/⌘ + wheel zooms; a plain wheel keeps scrolling the page.
        host.addEventListener(
          "wheel",
          (e) => {
            if (!map) return;
            if (e.ctrlKey || e.metaKey) map.scrollWheelZoom.enable();
            else map.scrollWheelZoom.disable();
          },
          { capture: true, passive: true },
        );
        layerRef.current = L.layerGroup().addTo(map);
        mapRef.current = map;
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("failed");
      });
    return () => {
      cancelled = true;
      map?.remove();
      mapRef.current = null;
      layerRef.current = null;
      markers.clear();
    };
  }, []);

  // Markers follow the filtered items.
  useEffect(() => {
    const L = leafletRef.current;
    const layer = layerRef.current;
    const map = mapRef.current;
    if (status !== "ready" || !L || !layer || !map) return;
    layer.clearLayers();
    markersRef.current.clear();
    for (const item of items) {
      // Listings inside another listing share its marker.
      if (!item.location || item.hostKey) continue;
      const area = item.location.precision === "area";
      const icon = L.divIcon({
        className: styles.markerWrap,
        html: `<span class="${styles.marker} ${area ? styles.area : ""}" data-group="${item.group}"></span><span class="${styles.label}">${escapeHtml(item.name)}</span>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      const marker = L.marker([item.location.lat, item.location.lng], {
        icon,
        keyboard: true,
        title: item.name,
        riseOnHover: true,
      });
      marker.on("click", () => onSelectRef.current(item.key));
      marker.addTo(layer);
      const el = marker.getElement();
      if (el) {
        el.setAttribute("aria-label", `${item.name} — ${item.categoryLabel}`);
        el.dataset.key = item.key;
        el.dataset.group = item.group;
        // Leaflet 1.9 makes markers focusable but only opens popups on Enter: select on Enter/Space.
        el.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelectRef.current(item.key);
          }
        });
      }
      markersRef.current.set(item.key, marker);
    }
  }, [items, status]);

  // Highlight the selection (and keep its label visible).
  useEffect(() => {
    const selected = selectedKey ? items.find((i) => i.key === selectedKey) : undefined;
    const highlight = selected?.hostKey ?? selectedKey;
    for (const [key, marker] of markersRef.current) {
      const el = marker.getElement();
      if (!el) continue;
      const on = key === highlight;
      el.classList.toggle(styles.selected, on);
      el.setAttribute("aria-pressed", on ? "true" : "false");
      el.tabIndex = touring ? -1 : 0;
      marker.setZIndexOffset(on ? 1000 : 0);
    }
  }, [selectedKey, items, status, touring]);

  // Fly to the requested item, or show everything.
  useEffect(() => {
    const map = mapRef.current;
    if (status !== "ready" || !map) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = focus.key ? items.find((i) => i.key === focus.key) : null;
    const { left = 0, right = 0, bottom = 0 } = insetsRef.current ?? {};
    if (target?.location) {
      const zoom = target.location.precision === "area" ? 13 : 14;
      // Centre the marker in the part of the map the panels leave open.
      const point = map.project([target.location.lat, target.location.lng], zoom).add([(right - left) / 2, bottom / 2]);
      const center = map.unproject(point, zoom);
      if (reduce) map.setView(center, zoom);
      else map.flyTo(center, zoom, { duration: 1.2 });
    } else if (!focus.key) {
      const L = leafletRef.current!;
      const located = items.filter((i) => i.location);
      const bounds =
        located.length > 1 ? L.latLngBounds(located.map((i) => [i.location!.lat, i.location!.lng] as [number, number])).pad(0.15) : L.latLngBounds(DEFAULT_BOUNDS);
      map.fitBounds(bounds, { animate: !reduce, paddingTopLeft: [left, 0], paddingBottomRight: [right, bottom] });
    }
    // items intentionally omitted: refocusing only on an explicit request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus, status]);

  // The map container changes size when panels open: keep Leaflet in step.
  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => mapRef.current?.invalidateSize());
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={styles.wrap}>
      <div ref={hostRef} className={styles.map} role="region" aria-label={t.explore.mapLabel} />
      {status === "ready" && (
        <div className={styles.controls}>
          <button type="button" className={styles.control} aria-label={t.explore.zoomIn} onClick={() => mapRef.current?.zoomIn()}>
            +
          </button>
          <button type="button" className={styles.control} aria-label={t.explore.zoomOut} onClick={() => mapRef.current?.zoomOut()}>
            &minus;
          </button>
        </div>
      )}
      {status === "loading" && <div className={styles.notice}>{t.common.loading}</div>}
      {status === "failed" && (
        <div className={styles.notice} role="alert">
          {t.explore.mapFailed}
        </div>
      )}
      {tilesFailed && (
        <div className={styles.tilesFailed} role="status">
          {t.explore.tilesFailed}
        </div>
      )}
    </div>
  );
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
