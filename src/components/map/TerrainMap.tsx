"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import type { Map as MLMap, Marker, Popup, StyleSpecification } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";

import type { CameraTarget, ExploreItem } from "@/components/explore/types";
import { useI18n } from "@/i18n/client";
import { fill } from "@/i18n/localize";
import { cx } from "@/lib/cx";
import imageLoader from "@/lib/image-loader";

import { iconSvg } from "./icons";
import { BASE_STYLE_URL, demSources, EXAGGERATION, HILLSHADE_LAYER, hillshadeLayer, MAX_BOUNDS, reliefStyle, SKY, TERRAIN_SOURCE } from "./mapStyle";
import styles from "./TerrainMap.module.css";

export type MapMode = "3d" | "2d";

/** Fly to an item, a camera target, or (key and camera both empty) the whole valley — whenever nonce changes. */
export type MapFocus = { key: string | null; nonce: number; camera?: CameraTarget };

type Insets = { left?: number; right?: number; bottom?: number };

type Props = {
  /** "explore": the interactive map. "showcase": a slow, hands-off flight (home page). */
  variant?: "explore" | "showcase";
  mode?: MapMode;
  items?: ExploreItem[];
  selectedKey?: string | null;
  onSelect?: (key: string) => void;
  focus?: MapFocus;
  /** A guided tour drives the camera: markers leave the tab order. */
  touring?: boolean;
  /** Panels covering the edges (px): the focus is centred in the open area. */
  insets?: Insets;
  /** WebGL could not start. */
  onFailed?: () => void;
  className?: string;
};

type Camera = { center: [number, number]; zoom: number; bearing: number; pitch: number };

const GUSINJE: [number, number] = [19.8339, 42.5619];
/** The whole valley, from above Gusinje looking south to the peaks on the border. */
const OVERVIEW: Camera = { center: [19.826, 42.512], zoom: 11.75, bearing: 198, pitch: 58 };
const OVERVIEW_FLAT: Camera = { center: [19.83, 42.52], zoom: 11.7, bearing: 0, pitch: 0 };
/** Low over Gusinje, up the valley towards Vusanje and the peaks. */
const VALLEY: Camera = { center: [19.836, 42.538], zoom: 12.7, bearing: 190, pitch: 72 };

const NO_ITEMS: ExploreItem[] = [];
const NO_FOCUS: MapFocus = { key: null, nonce: 0 };

/** Kilometres east/north between two points (good enough at this scale). */
function offsetKm(from: [number, number], to: [number, number]): [number, number] {
  const cos = Math.cos((from[1] * Math.PI) / 180);
  return [(to[0] - from[0]) * 111.32 * cos, (to[1] - from[1]) * 110.57];
}

/**
 * The camera for a mapped point. Unless a tour says otherwise, it faces away
 * from Gusinje — the way a visitor travels into the mountains — so each place
 * is seen with its own valley or slope behind it.
 */
function pointCamera(target: Extract<CameraTarget, { kind: "point" }>, mode: MapMode): Camera {
  const [east, north] = offsetKm(GUSINJE, [target.lng, target.lat]);
  const away = (Math.atan2(east, north) * 180) / Math.PI;
  const bearing = target.bearing ?? (Math.hypot(east, north) < 1.2 ? 190 : (away + 360) % 360);
  // Close and low: the camera goes into the village or up to the spot, never out.
  const zoom = target.zoom ?? (target.area ? 14.9 : 15.7);
  return mode === "3d"
    ? { center: [target.lng, target.lat], zoom, bearing, pitch: target.area ? 66 : 70 }
    : { center: [target.lng, target.lat], zoom: zoom - 0.4, bearing: 0, pitch: 0 };
}

function cameraFor(target: CameraTarget, mode: MapMode): Camera {
  if (target.kind === "point") return pointCamera(target, mode);
  if (mode === "2d") return OVERVIEW_FLAT;
  return target.kind === "valley" ? VALLEY : OVERVIEW;
}

/** The base map's style, or null when it can't be had quickly (offline, blocked). */
async function fetchBaseStyle(): Promise<StyleSpecification | null> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(BASE_STYLE_URL, { signal: controller.signal });
    return res.ok ? ((await res.json()) as StyleSpecification) : null;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Padding = { left: number; right: number; bottom: number; top: number };
type Shot = { center: [number, number]; zoom: number; bearing: number; pitch: number; padding: Padding };

/** A padding MapLibre accepts: finite, never negative. */
const px = (value: number | undefined) => (value !== undefined && Number.isFinite(value) ? Math.max(0, value) : 0);

const paddingOf = (map: MLMap): Padding => {
  const p = map.getPadding();
  return { left: px(p.left), right: px(p.right), bottom: px(p.bottom), top: px(p.top) };
};

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Fly the camera as a sequence of jumps. Each jump lets MapLibre read the
 * ground height under the new centre, so the camera rises with the
 * mountains instead of carrying the valley's height up to a 2,500 m summit
 * (its own animated flights keep the starting height). Longer hops pull back
 * a little in the middle. Returns a function that stops the flight.
 */
function fly(map: MLMap, to: Shot, duration: number, done?: () => void): () => void {
  const from = map.getCenter();
  const startZoom = map.getZoom();
  const startBearing = map.getBearing();
  const startPitch = map.getPitch();
  const startPadding = paddingOf(map);
  const turn = ((to.bearing - startBearing + 540) % 360) - 180;
  const [east, north] = offsetKm([from.lng, from.lat], to.center);
  // Only a long hop rises a little in the middle; a short one goes straight in.
  const pullBack = Math.max(0, Math.min(1.2, (Math.hypot(east, north) - 2.5) / 5));
  const start = performance.now();
  let frame = 0;
  let stopped = false;
  const step = (now: number) => {
    if (stopped) return;
    const k = Math.min(1, (now - start) / duration);
    const e = easeInOut(k);
    map.jumpTo({
      center: [lerp(from.lng, to.center[0], e), lerp(from.lat, to.center[1], e)],
      zoom: lerp(startZoom, to.zoom, e) - pullBack * Math.sin(Math.PI * e),
      bearing: startBearing + turn * e,
      pitch: lerp(startPitch, to.pitch, e),
      padding: {
        left: px(lerp(startPadding.left, to.padding.left, e)),
        right: px(lerp(startPadding.right, to.padding.right, e)),
        bottom: px(lerp(startPadding.bottom, to.padding.bottom, e)),
        top: px(lerp(startPadding.top, to.padding.top, e)),
      },
    });
    if (k < 1) frame = requestAnimationFrame(step);
    else done?.();
  };
  frame = requestAnimationFrame(step);
  return () => {
    stopped = true;
    cancelAnimationFrame(frame);
  };
}

/**
 * The real valley in 3D: elevation tiles for the mountains, OpenStreetMap for
 * roads, trails, rivers and names, and the guide's places as markers at their
 * sourced coordinates. The same map lies flat for the 2D view.
 */
export function TerrainMap({
  variant = "explore",
  mode = "3d",
  items = NO_ITEMS,
  selectedKey = null,
  onSelect,
  focus = NO_FOCUS,
  touring = false,
  insets,
  onFailed,
  className,
}: Props) {
  const { t } = useI18n();
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const libRef = useRef<typeof import("maplibre-gl") | null>(null);
  const markersRef = useRef(new Map<string, { marker: Marker; el: HTMLButtonElement }>());
  /** Stops the camera flight in progress, if any. */
  const flightRef = useRef<(() => void) | null>(null);
  const modeRef = useRef(mode);
  const insetsRef = useRef(insets);
  const onSelectRef = useRef(onSelect);
  const onFailedRef = useRef(onFailed);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [tilesFailed, setTilesFailed] = useState(false);
  const [orbiting, setOrbiting] = useState(false);
  const orbitingRef = useRef(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [hint, setHint] = useState(false);
  const needleRef = useRef<SVGSVGElement>(null);
  const popupRef = useRef<Popup | null>(null);
  const tRef = useRef(t);
  const [detail, setDetail] = useState(false);
  const detailRef = useRef(false);
  const selectedRef = useRef<string | null>(null);
  const showcase = variant === "showcase";

  useEffect(() => {
    onSelectRef.current = onSelect;
    onFailedRef.current = onFailed;
    insetsRef.current = insets;
    tRef.current = t;
  });

  // Create the map once.
  useEffect(() => {
    let cancelled = false;
    let map: MLMap | null = null;
    let observer: IntersectionObserver | null = null;
    const markers = markersRef.current;

    const fail = () => {
      if (cancelled) return;
      setStatus("failed");
      onFailedRef.current?.();
    };

    Promise.all([import("maplibre-gl"), fetchBaseStyle()])
      .then(([lib, base]) => {
        const host = hostRef.current;
        if (cancelled || !host) return;
        libRef.current = lib;
        const start = showcase ? VALLEY : modeRef.current === "3d" ? OVERVIEW : OVERVIEW_FLAT;
        try {
          map = new lib.Map({
            container: host,
            style: base ?? reliefStyle(),
            center: start.center,
            zoom: start.zoom,
            bearing: start.bearing,
            pitch: start.pitch,
            maxPitch: 78,
            minZoom: 9.5,
            maxZoom: 17,
            maxBounds: MAX_BOUNDS,
            interactive: !showcase,
            attributionControl: showcase
              ? false
              : { compact: true, customAttribution: '<a href="https://overturemaps.org" target="_blank" rel="noopener">Overture Maps</a> (businesses)' },
            fadeDuration: 150,
          });
        } catch {
          fail();
          return;
        }
        mapRef.current = map;
        const m = map;

        // Elevation, shading and sky go on top of whichever style loaded.
        m.on("style.load", () => {
          for (const [id, source] of Object.entries(demSources())) if (!m.getSource(id)) m.addSource(id, source);
          if (!m.getLayer(HILLSHADE_LAYER)) {
            // Under roads and labels, over land and water.
            const before = m.getStyle().layers.find((l) => l.type === "symbol" || /^(tunnel|road|bridge|highway|building|aeroway)/.test(l.id));
            m.addLayer(hillshadeLayer, before?.id);
          }
          m.setSky(SKY);
          m.setTerrain(showcase || modeRef.current === "3d" ? { source: TERRAIN_SOURCE, exaggeration: EXAGGERATION } : null);
          // Markers and controls need the style, not the tiles: with no signal the tiles may never come.
          if (!cancelled) setStatus("ready");
          // Phones: the credits start folded behind their (i) button.
          if (window.innerWidth < 600) host.querySelector(".maplibregl-ctrl-attrib")?.classList.remove("maplibregl-compact-show");
        });

        let failures = 0;
        m.on("error", (e) => {
          // Tiles that won't load (offline, blocked): say so, keep the markers.
          if ((e as { sourceId?: string }).sourceId || /tile|fetch|load/i.test(String(e.error?.message ?? ""))) {
            failures += 1;
            if (failures >= 3) setTilesFailed(true);
          }
        });
        m.on("data", (e) => {
          if ((e as { tile?: unknown }).tile) setTilesFailed(false);
        });
        m.on("webglcontextlost", fail);

        if (!showcase) {
          // Ctrl/⌘ + wheel (and trackpad pinch) zooms; a plain wheel scrolls the page.
          m.scrollZoom.disable();
          host.addEventListener(
            "wheel",
            (e) => {
              if (e.ctrlKey || e.metaKey) m.scrollZoom.enable();
              else m.scrollZoom.disable();
            },
            { capture: true, passive: true },
          );
          m.on("zoom", () => {
            detailRef.current = m.getZoom() >= 12.8;
            setDetail(detailRef.current);
          });
          // Labels never pile up: the selected place first, then towns and
          // villages, then the rest; a label that would overlap one already
          // shown waits for hover or focus. Checked a few times a second while
          // the camera moves, and when it stops.
          let last = 0;
          const widths = new WeakMap<HTMLElement, number>();
          const declutter = () => {
            const shown: [number, number, number, number][] = [];
            const entries = [...markersRef.current.entries()].map(([key, value]) => ({ key, ...value }));
            const rank = (e: (typeof entries)[number]) =>
              e.key === selectedRef.current ? 0 : e.el.dataset.group === "villages" ? 1 : e.el.dataset.precision === "area" ? 2 : 3;
            entries.sort((a, b) => rank(a) - rank(b));
            for (const { el, marker, key } of entries) {
              const candidate = key === selectedRef.current || detailRef.current || el.dataset.group === "villages";
              if (!candidate) {
                el.classList.remove(styles.crowded, styles.labelled);
                continue;
              }
              const label = el.querySelector<HTMLElement>('[data-part="label"]');
              let w = widths.get(el);
              if (w === undefined) {
                w = label?.offsetWidth || 110;
                widths.set(el, w);
              }
              const { x, y } = m.project(marker.getLngLat());
              const rect: [number, number, number, number] = [x - w / 2 - 4, y - 50, x + w / 2 + 4, y - 16];
              const clash = shown.some((r) => r[0] < rect[2] && rect[0] < r[2] && r[1] < rect[3] && rect[1] < r[3]);
              el.classList.toggle(styles.crowded, clash);
              // A marker with its label showing sits above its neighbours' dots.
              el.classList.toggle(styles.labelled, !clash);
              if (!clash) shown.push(rect);
            }
          };
          m.on("render", () => {
            const now = performance.now();
            if (now - last < 120) return;
            last = now;
            declutter();
          });
          m.on("moveend", declutter);
          // The visitor takes the controls: stop any flight or orbit.
          for (const type of ["mousedown", "touchstart", "wheel"] as const) {
            m.on(type, () => {
              flightRef.current?.();
              flightRef.current = null;
              if (orbitingRef.current) {
                orbitingRef.current = false;
                setOrbiting(false);
              }
              setHint(false);
            });
          }
          // The compass needle follows the bearing.
          m.on("rotate", () => {
            if (needleRef.current) needleRef.current.style.transform = `rotate(${-m.getBearing()}deg)`;
          });
          // Keep circling while the orbit is on.
          m.on("moveend", () => {
            if (orbitingRef.current) m.rotateTo(m.getBearing() - 60, { duration: 20000, easing: (x) => x });
          });
          // Tap the ground in 3D: its height, from the elevation data.
          m.on("click", (e) => {
            if (modeRef.current !== "3d") return;
            const raw = m.queryTerrainElevation(e.lngLat);
            if (raw === null || raw === undefined) return;
            const metres = Math.round(raw / EXAGGERATION / 10) * 10;
            const box = document.createElement("div");
            box.className = styles.heightBox;
            const value = document.createElement("strong");
            value.textContent = fill(tRef.current.explore.heightHere, { m: metres.toLocaleString(document.documentElement.lang || undefined) });
            const note = document.createElement("span");
            note.textContent = tRef.current.explore.heightNote;
            box.append(value, note);
            popupRef.current?.remove();
            popupRef.current = new lib.Popup({ closeButton: true, closeOnClick: true, className: styles.heightPopup, maxWidth: "240px", offset: 10 })
              .setLngLat(e.lngLat)
              .setDOMContent(box)
              .addTo(m);
            setHint(false);
          });
        } else if (!reducedMotion()) {
          // A slow turn around the valley while it's on screen.
          let turning = false;
          const turn = () => {
            if (!turning) return;
            m.rotateTo(m.getBearing() + 30, { duration: 30000, easing: (x) => x });
          };
          m.on("moveend", turn);
          observer = new IntersectionObserver((entries) => {
            const visible = entries.some((entry) => entry.isIntersecting);
            if (visible && !turning) {
              turning = true;
              turn();
            } else if (!visible && turning) {
              turning = false;
              m.stop();
            }
          });
          observer.observe(host);
        }

      })
      .catch(fail);

    return () => {
      cancelled = true;
      observer?.disconnect();
      for (const { marker } of markers.values()) marker.remove();
      markers.clear();
      map?.remove();
      mapRef.current = null;
    };
    // The map is created once; later changes go through the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Move the camera (instantly when the visitor prefers less motion). */
  const moveCamera = (map: MLMap, shot: Shot, duration: number) => {
    flightRef.current?.();
    if (reducedMotion() || duration === 0) {
      flightRef.current = null;
      map.jumpTo(shot);
      return;
    }
    flightRef.current = fly(map, shot, duration, () => {
      flightRef.current = null;
    });
  };

  const currentShot = (map: MLMap): Shot => {
    const c = map.getCenter();
    return { center: [c.lng, c.lat], zoom: map.getZoom(), bearing: map.getBearing(), pitch: map.getPitch(), padding: paddingOf(map) };
  };

  const stopOrbit = () => {
    orbitingRef.current = false;
    setOrbiting(false);
    mapRef.current?.stop();
  };

  const toggleOrbit = () => {
    const map = mapRef.current;
    if (!map) return;
    if (orbitingRef.current) {
      stopOrbit();
      return;
    }
    flightRef.current?.();
    flightRef.current = null;
    orbitingRef.current = true;
    setOrbiting(true);
    map.rotateTo(map.getBearing() - 60, { duration: 20000, easing: (x) => x });
  };

  const faceNorth = () => {
    const map = mapRef.current;
    if (!map) return;
    stopOrbit();
    moveCamera(map, { ...currentShot(map), bearing: 0 }, 700);
  };

  // Full screen: the whole stage (map, legend, card and strip), where the browser allows it.
  const stageOf = () => (hostRef.current?.closest("[data-map-stage]") as HTMLElement | null) ?? hostRef.current?.parentElement ?? null;
  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void stageOf()?.requestFullscreen?.().catch(() => undefined);
  };
  useEffect(() => {
    if (showcase) return;
    // Only known in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanFullscreen(!!document.fullscreenEnabled);
    const sync = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, [showcase]);

  // A short tip on what the map can do, until the visitor touches it.
  useEffect(() => {
    if (showcase || status !== "ready" || mode !== "3d") return;
    // Shown once the map is ready.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHint(true);
    const timer = window.setTimeout(() => setHint(false), 9000);
    return () => window.clearTimeout(timer);
  }, [showcase, status, mode]);

  // 3D or flat.
  useEffect(() => {
    modeRef.current = mode;
    const map = mapRef.current;
    if (!map || status !== "ready" || showcase) return;
    map.setTerrain(mode === "3d" ? { source: TERRAIN_SOURCE, exaggeration: EXAGGERATION } : null);
    const shot = currentShot(map);
    // Only an actual switch tilts the map (not the first render).
    if (mode === "3d" && shot.pitch < 30) moveCamera(map, { ...shot, pitch: 60, bearing: shot.bearing || OVERVIEW.bearing }, 900);
    else if (mode === "2d" && (shot.pitch > 0 || shot.bearing !== 0)) moveCamera(map, { ...shot, pitch: 0, bearing: 0 }, 900);
  }, [mode, status, showcase]);

  // Markers follow the (filtered) items. Listings inside another listing share its marker.
  useEffect(() => {
    const lib = libRef.current;
    const map = mapRef.current;
    if (!lib || !map || status !== "ready" || showcase) return;
    const markers = markersRef.current;
    const wanted = new Map(items.filter((i) => i.location && !i.hostKey).map((i) => [i.key, i]));
    for (const [key, { marker }] of markers) {
      if (!wanted.has(key)) {
        marker.remove();
        markers.delete(key);
      }
    }
    for (const item of wanted.values()) {
      if (markers.has(item.key)) continue;
      const el = document.createElement("button");
      el.type = "button";
      el.className = styles.marker;
      el.dataset.key = item.key;
      el.dataset.group = item.group;
      el.dataset.precision = item.location!.precision;
      if (item.openData) el.dataset.open = "true";
      el.setAttribute("aria-label", `${item.name} — ${item.categoryLabel}`);
      el.setAttribute("aria-pressed", "false");
      const dot = document.createElement("span");
      dot.className = styles.dot;
      dot.dataset.part = "dot";
      dot.setAttribute("aria-hidden", "true");
      if (item.icon) dot.innerHTML = iconSvg(item.icon);
      const label = document.createElement("span");
      label.className = styles.label;
      label.dataset.part = "label";
      label.textContent = item.name;
      label.setAttribute("aria-hidden", "true");
      el.append(dot, label);
      // A photo card on hover (mouse only); the photo loads on the first hover.
      if (item.photo) {
        const photo = item.photo;
        el.classList.add(styles.hasPreview);
        const preview = document.createElement("span");
        preview.className = styles.preview;
        preview.dataset.part = "preview";
        preview.setAttribute("aria-hidden", "true");
        const img = document.createElement("img");
        img.alt = "";
        img.decoding = "async";
        const name = document.createElement("span");
        name.className = styles.previewName;
        name.textContent = item.name;
        const meta = document.createElement("span");
        meta.className = styles.previewMeta;
        meta.textContent = item.categoryLabel;
        preview.append(img, name, meta);
        el.append(preview);
        el.addEventListener("pointerenter", (e) => {
          if (e.pointerType === "mouse" && !img.src) img.src = imageLoader({ src: photo.src, width: 330 });
        });
      }
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectRef.current?.(item.key);
      });
      // Close to the ground the terrain test fades markers that are in plain view; keep them clear.
      const marker = new lib.Marker({ element: el, anchor: "center", opacityWhenCovered: "0.85" })
        .setLngLat([item.location!.lng, item.location!.lat])
        .addTo(map);
      markers.set(item.key, { marker, el });
    }
  }, [items, status, showcase]);

  // The selection is highlighted (a hosted listing highlights its host); tours take markers out of the tab order.
  useEffect(() => {
    const selected = selectedKey ? items.find((i) => i.key === selectedKey) : undefined;
    const highlight = selected?.hostKey ?? selectedKey;
    selectedRef.current = highlight;
    for (const [key, { el }] of markersRef.current) {
      const on = key === highlight;
      el.classList.toggle(styles.selected, on);
      el.setAttribute("aria-pressed", on ? "true" : "false");
      el.setAttribute("tabindex", touring ? "-1" : "0");
    }
    // Re-rank the labels around the new selection.
    mapRef.current?.triggerRepaint();
  }, [selectedKey, items, status, touring]);

  // Fly to the requested place, tour camera or the whole valley.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== "ready" || showcase) return;
    let target: CameraTarget = focus.camera ?? { kind: "overview" };
    if (!focus.camera && focus.key) {
      const item = items.find((i) => i.key === focus.key);
      const host = item?.hostKey ? items.find((i) => i.key === item.hostKey) : undefined;
      const location = item?.location ?? host?.location;
      if (!location) return;
      target = { kind: "point", lng: location.lng, lat: location.lat, area: location.precision === "area" };
    }
    // A moment's delay: picking a place also opens its card, and the flight
    // should aim for the space the card leaves (measured on the next frame).
    const timer = window.setTimeout(() => {
      if (orbitingRef.current) stopOrbit();
      const camera = cameraFor(target, modeRef.current);
      // Summits are seen from further back than valley floors, so the whole massif is in view.
      if (target.kind === "point" && target.zoom === undefined && map.getTerrain()) {
        const ground = (map.queryTerrainElevation(camera.center) ?? 0) / EXAGGERATION;
        camera.zoom -= Math.min(1.6, Math.max(0, (ground - 1200) / 800));
      }
      const { left = 0, right = 0, bottom = 0 } = insetsRef.current ?? {};
      moveCamera(map, { ...camera, padding: { left, right, bottom, top: 0 } }, 2600);
    }, 80);
    return () => window.clearTimeout(timer);
    // Only an explicit request moves the camera.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus, status]);

  // Panels opening or closing: keep the centre in the open area.
  const left = insets?.left ?? 0;
  const right = insets?.right ?? 0;
  const bottom = insets?.bottom ?? 0;
  useEffect(() => {
    const map = mapRef.current;
    // A flight in progress already aims for the open area; never cut it short.
    if (!map || status !== "ready" || showcase || flightRef.current) return;
    moveCamera(map, { ...currentShot(map), padding: { left, right, bottom, top: 0 } }, 400);
  }, [left, right, bottom, status, showcase]);

  return (
    <div className={cx(styles.wrap, showcase && styles.showcase, detail && styles.detail, status === "ready" && styles.ready, className)}>
      <div
        ref={hostRef}
        className={styles.map}
        role={showcase ? undefined : "region"}
        aria-label={showcase ? undefined : t.explore.mapLabel}
        aria-hidden={showcase || undefined}
      />
      {!showcase && status === "ready" && (
        <div className={styles.controls}>
          <button type="button" className={styles.control} aria-label={t.explore.zoomIn} onClick={() => mapRef.current?.zoomIn()}>
            +
          </button>
          <button type="button" className={styles.control} aria-label={t.explore.zoomOut} onClick={() => mapRef.current?.zoomOut()}>
            &minus;
          </button>
          <button type="button" className={styles.control} aria-label={t.explore.faceNorth} title={t.explore.faceNorth} onClick={faceNorth}>
            <svg ref={needleRef} className={styles.needle} width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M10 2l3.2 8H6.8z" fill="#c0412b" />
              <path d="M10 18l-3.2-8h6.4z" fill="currentColor" opacity="0.45" />
            </svg>
          </button>
          {mode === "3d" && (
            <button type="button" className={cx(styles.control, styles.orbit)} aria-label={t.explore.orbit} title={t.explore.orbit} aria-pressed={orbiting} onClick={toggleOrbit}>
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                <ellipse cx="10" cy="11" rx="7.5" ry="3.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M15.6 7.2l2.4 1.4-2.6 1" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 10.5l3-5.5 3 5.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          {canFullscreen && (
            <button
              type="button"
              className={styles.control}
              aria-label={fullscreen ? t.explore.exitFullscreen : t.explore.fullscreen}
              title={fullscreen ? t.explore.exitFullscreen : t.explore.fullscreen}
              aria-pressed={fullscreen}
              onClick={toggleFullscreen}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                {fullscreen ? (
                  <path d="M6 2v4H2M12 2v4h4M6 16v-4H2M12 16v-4h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <path d="M2 6V2h4M16 6V2h-4M2 12v4h4M16 12v4h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                )}
              </svg>
            </button>
          )}
        </div>
      )}
      {!showcase && hint && status === "ready" && (
        <p className={styles.hint} role="status">
          {t.explore.mapTip}
        </p>
      )}
      {!showcase && status === "loading" && <div className={styles.notice}>{t.common.loading}</div>}
      {!showcase && status === "failed" && (
        <div className={styles.notice} role="alert">
          {t.explore.mapFailed}
        </div>
      )}
      {!showcase && tilesFailed && (
        <div className={styles.tilesFailed} role="status">
          {t.explore.tilesFailed}
        </div>
      )}
    </div>
  );
}
