"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import type { GeoJSONSource, Map as MLMap, MapGeoJSONFeature, PointLike, Popup, StyleSpecification } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";

import type { CameraTarget, ExploreItem } from "@/components/explore/types";
import { useI18n } from "@/i18n/client";
import { fill } from "@/i18n/localize";
import { cx } from "@/lib/cx";
import imageLoader from "@/lib/image-loader";

import { contourTiles } from "./contours";
import { BASE_STYLE_URL, decorateBaseStyle, demSources, EXAGGERATION, HILLSHADE_LAYER, hillshadeLayer, MAX_BOUNDS, reliefStyle, SKY, TERRAIN_SOURCE } from "./mapStyle";
import {
  addMissingImage,
  addPlaceLayers,
  LAYER_CLUSTERS,
  loadPhotoPins,
  type MyPosition,
  PHOTO_ZOOM,
  PICKABLE,
  placeData,
  setLabelFont,
  setMyPosition,
  setPlaceData,
  SOURCE_BUSINESSES,
  SOURCE_PLACES,
} from "./placeLayers";
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
  /** Keys stamped in the explorer's passport: their pins carry a tick. */
  found?: ReadonlySet<string>;
  /** WebGL could not start. */
  onFailed?: () => void;
  /** The visitor moved the map themselves. */
  onInteract?: () => void;
  className?: string;
};

type Camera = { center: [number, number]; zoom: number; bearing: number; pitch: number };

const GUSINJE: [number, number] = [19.8339, 42.5619];
/** The whole valley, from above Gusinje looking south to the peaks on the border. */
const OVERVIEW: Camera = { center: [19.826, 42.512], zoom: 11.75, bearing: 198, pitch: 58 };
const OVERVIEW_FLAT: Camera = { center: [19.83, 42.52], zoom: 11.7, bearing: 0, pitch: 0 };
/** Low over Gusinje, up the valley towards Vusanje and the peaks. */
const VALLEY: Camera = { center: [19.836, 42.538], zoom: 12.7, bearing: 190, pitch: 72 };
/** High above the Prokletije: where the first visit begins before descending into the valley. */
const ABOVE: Camera = { center: [19.83, 42.53], zoom: 10.2, bearing: OVERVIEW.bearing, pitch: 28 };

const NO_ITEMS: ExploreItem[] = [];
const HINT_SEEN = "gusinje:map-tip-seen";
const INTRO_SEEN = "gusinje:map-intro-seen";
const NO_FOCUS: MapFocus = { key: null, nonce: 0 };
const NO_FOUND: ReadonlySet<string> = new Set();

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

/** CSS "ease" (cubic-bezier(0.25, 0.1, 0.25, 1)): moves at once, settles slowly. */
function ease(t: number) {
  const [x1, y1, x2, y2] = [0.25, 0.1, 0.25, 1];
  const bez = (a: number, b: number, u: number) => 3 * a * u * (1 - u) ** 2 + 3 * b * u * u * (1 - u) + u ** 3;
  let u = t;
  for (let i = 0; i < 6; i++) {
    const dx = 3 * x1 * (1 - u) ** 2 + 6 * (x2 - x1) * u * (1 - u) + 3 * (1 - x2) * u * u;
    if (Math.abs(dx) < 1e-6) break;
    u = Math.min(1, Math.max(0, u - (bez(x1, x2, u) - t) / dx));
  }
  return bez(y1, y2, u);
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Fly the camera along one smooth curve: the path a viewer's eye finds
 * natural (van Wijk & Nuij), zooming out on long hops only as far as needed
 * to keep both ends in view. The height of the point looked at glides from
 * the ground at the start to the ground at the place — MapLibre would
 * otherwise lift and drop the camera over every ridge and with every finer
 * elevation tile, which is what made flights shake. Returns a function that
 * stops the flight.
 */
function fly(map: MLMap, to: Shot, duration: number, done?: () => void): () => void {
  const from = map.getCenter();
  const startZoom = map.getZoom();
  const startBearing = map.getBearing();
  const startPitch = map.getPitch();
  const startPadding = paddingOf(map);
  const startElevation = map.getCenterElevation();
  const turn = ((to.bearing - startBearing + 540) % 360) - 180;

  // The curve, in screen pixels at the starting zoom.
  const [east, north] = offsetKm([from.lng, from.lat], to.center);
  const metresPerPixel = (40075016.7 * Math.cos((from.lat * Math.PI) / 180)) / (512 * 2 ** startZoom);
  const u1 = (Math.hypot(east, north) * 1000) / metresPerPixel;
  const canvas = map.getCanvas();
  const w0 = Math.max(canvas.clientWidth, canvas.clientHeight, 1);
  const w1 = w0 / 2 ** (to.zoom - startZoom);
  const rho = 1.25;
  const rho2 = rho * rho;
  let width: (s: number) => number;
  let travelled: (s: number) => number;
  let length: number;
  if (u1 < 0.5) {
    // Turning or zooming on the spot.
    length = Math.abs(Math.log(w1 / w0)) / rho;
    width = (s) => Math.exp((w1 < w0 ? -1 : 1) * rho * s);
    travelled = () => 1;
  } else {
    const r = (i: 0 | 1) => {
      const w = i ? w1 : w0;
      const b = (w1 * w1 - w0 * w0 + (i ? -1 : 1) * rho2 * rho2 * u1 * u1) / (2 * w * rho2 * u1);
      return Math.log(Math.sqrt(b * b + 1) - b);
    };
    const r0 = r(0);
    length = (r(1) - r0) / rho;
    width = (s) => Math.cosh(r0) / Math.cosh(r0 + rho * s);
    travelled = (s) => (w0 * ((Math.cosh(r0) * Math.tanh(r0 + rho * s) - Math.sinh(r0)) / rho2)) / u1;
  }
  if (!Number.isFinite(length) || length <= 0) length = 0;
  // Short hops are quick; long ones take up to the given time.
  const ms = Math.round(Math.max(duration * 0.5, Math.min(duration, length * 750)));

  const clamped = map.getCenterClampedToGround();
  map.setCenterClampedToGround(false);
  let ground = map.queryTerrainElevation(to.center) ?? startElevation;
  const start = performance.now();
  let frame = 0;
  let stopped = false;
  const finish = () => {
    stopped = true;
    cancelAnimationFrame(frame);
    map.setCenterClampedToGround(clamped);
  };
  const step = (now: number) => {
    if (stopped) return;
    const k = Math.min(1, (now - start) / ms);
    const e = ease(k);
    const s = e * length;
    const u = length ? Math.min(1, travelled(s)) : e;
    const zoom = length ? startZoom - Math.log2(width(s)) : lerp(startZoom, to.zoom, e);
    // The place's ground sharpens as finer elevation tiles arrive: follow it gently.
    const latest = map.queryTerrainElevation(to.center);
    if (latest !== null) ground += (latest - ground) * (k < 1 ? 0.12 : 1);
    map.jumpTo({
      center: [lerp(from.lng, to.center[0], u), lerp(from.lat, to.center[1], u)],
      zoom: k < 1 ? zoom : to.zoom,
      bearing: startBearing + turn * e,
      pitch: lerp(startPitch, to.pitch, e),
      elevation: lerp(startElevation, ground, e),
      padding: {
        left: px(lerp(startPadding.left, to.padding.left, e)),
        right: px(lerp(startPadding.right, to.padding.right, e)),
        bottom: px(lerp(startPadding.bottom, to.padding.bottom, e)),
        top: px(lerp(startPadding.top, to.padding.top, e)),
      },
    });
    if (k < 1) frame = requestAnimationFrame(step);
    else {
      finish();
      done?.();
    }
  };
  frame = requestAnimationFrame(step);
  return finish;
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
  found = NO_FOUND,
  onFailed,
  onInteract,
  className,
}: Props) {
  const { t } = useI18n();
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const libRef = useRef<typeof import("maplibre-gl") | null>(null);
  /** What the place layers show now (read when the layers are (re)added). */
  const dataRef = useRef<ReturnType<typeof placeData> | null>(null);
  const itemsRef = useRef(items);
  const highlightRef = useRef<string | null>(null);
  const foundRef = useRef(found);
  /** Items whose photo pin the map has. */
  const photosRef = useRef(new Set<string>());
  const photoLoadRef = useRef<(() => void) | null>(null);
  /** Stops the camera flight in progress, if any. */
  const flightRef = useRef<(() => void) | null>(null);
  const modeRef = useRef(mode);
  const insetsRef = useRef(insets);
  const onSelectRef = useRef(onSelect);
  const onFailedRef = useRef(onFailed);
  const onInteractRef = useRef(onInteract);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [tilesFailed, setTilesFailed] = useState(false);
  const [orbiting, setOrbiting] = useState(false);
  const orbitingRef = useRef(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [hint, setHint] = useState(false);
  /** "Show where I am": on or off, and a short note about it. */
  const [locating, setLocating] = useState(false);
  const [locationNote, setLocationNote] = useState<"private" | "outside" | "denied" | "unavailable" | null>(null);
  const watchRef = useRef<number | null>(null);
  const meRef = useRef<MyPosition | null>(null);
  const needleRef = useRef<SVGSVGElement>(null);
  const popupRef = useRef<Popup | null>(null);
  const tRef = useRef(t);
  const previewRef = useRef<Popup | null>(null);
  const showcase = variant === "showcase";

  useEffect(() => {
    onSelectRef.current = onSelect;
    onFailedRef.current = onFailed;
    onInteractRef.current = onInteract;
    insetsRef.current = insets;
    tRef.current = t;
    itemsRef.current = items;
  });

  // Create the map once.
  useEffect(() => {
    let cancelled = false;
    let map: MLMap | null = null;
    let observer: IntersectionObserver | null = null;

    const fail = () => {
      if (cancelled) return;
      setStatus("failed");
      onFailedRef.current?.();
    };

    Promise.all([import("maplibre-gl"), fetchBaseStyle()])
      .then(async ([lib, base]) => [lib, base, showcase ? null : await contourTiles(lib)] as const)
      .then(([lib, base, contours]) => {
        const host = hostRef.current;
        if (cancelled || !host) return;
        libRef.current = lib;
        // The first visit (per tab) begins high above the mountains and descends into the valley.
        let intro = false;
        if (!showcase && modeRef.current === "3d" && !reducedMotion()) {
          try {
            intro = !sessionStorage.getItem(INTRO_SEEN);
            sessionStorage.setItem(INTRO_SEEN, "1");
          } catch {
            intro = true;
          }
        }
        const start = showcase ? VALLEY : intro ? ABOVE : modeRef.current === "3d" ? OVERVIEW : OVERVIEW_FLAT;
        try {
          map = new lib.Map({
            container: host,
            style: base ? decorateBaseStyle(base, contours) : reliefStyle(contours),
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
            // Phones with very sharp screens would draw the 3D scene at up to 3× its size; 2× looks the same and runs smoothly.
            pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
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
          // The guide's places, drawn by the map; labels use the page's font once it has loaded.
          if (!showcase) {
            const add = () => {
              if (cancelled || !m.getStyle()) return;
              setLabelFont(host);
              addPlaceLayers(m);
              if (dataRef.current) setPlaceData(m, dataRef.current);
              setMyPosition(m, meRef.current);
            };
            if (document.fonts?.status === "loaded") add();
            else void document.fonts?.ready.then(add);
          }
          // Markers and controls need the style, not the tiles: with no signal the tiles may never come.
          if (!cancelled) setStatus("ready");
          if (intro && !cancelled) {
            intro = false;
            // Once the first tiles are drawn (or soon anyway), descend — unless something else has moved the camera.
            let started = false;
            const descend = () => {
              if (started || cancelled || flightRef.current) return;
              started = true;
              flightRef.current = fly(m, { ...OVERVIEW, padding: paddingOf(m) }, 3200, () => {
                flightRef.current = null;
              });
            };
            m.once("idle", descend);
            window.setTimeout(descend, 2500);
          }
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
        m.on("styleimagemissing", (e) => addMissingImage(m, e.id));
        // Automated tests reach the map to find where a place is drawn.
        if (navigator.webdriver) (window as unknown as { __valleyMap?: MLMap }).__valleyMap = m;
        if (!showcase) {
          m.addControl(new lib.ScaleControl({ maxWidth: 120, unit: "metric" }), "bottom-left");
          // Close up, pins show the place's photo: loaded once the visitor comes near
          // (and again for new items after a filter or a search).
          const loadPhotos = () => {
            if (m.getZoom() < PHOTO_ZOOM - 0.6) return;
            const stop = loadPhotoPins(m, itemsRef.current, photosRef.current, () => {
              if (cancelled) return;
              dataRef.current = placeData(itemsRef.current, highlightRef.current, photosRef.current, foundRef.current);
              setPlaceData(m, dataRef.current);
            });
            if (!stop) return;
            const before = photoLoadRef.current;
            photoLoadRef.current = () => {
              before?.();
              stop();
            };
          };
          m.on("zoomend", loadPhotos);
          m.on("sourcedata", (e) => {
            if (e.sourceId === SOURCE_PLACES && e.dataType === "source") loadPhotos();
          });
        }

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
              onInteractRef.current?.();
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
          // A tap picks the nearest place within a finger's width; a bubble opens up; elsewhere in 3D,
          // the ground's height from the elevation data.
          const near = (point: { x: number; y: number }, layers: string[]) => {
            const box: [PointLike, PointLike] = [
              [point.x - 14, point.y - 14],
              [point.x + 14, point.y + 14],
            ];
            const hits = m.queryRenderedFeatures(box, { layers: layers.filter((id) => m.getLayer(id)) });
            const dist = (f: MapGeoJSONFeature) => {
              const [lng, lat] = (f.geometry as GeoJSON.Point).coordinates;
              const p = m.project([lng, lat]);
              return Math.hypot(p.x - point.x, p.y - point.y);
            };
            return hits.sort((a, b) => dist(a) - dist(b))[0];
          };
          m.on("click", (e) => {
            const hit = near(e.point, PICKABLE);
            if (hit) {
              previewRef.current?.remove();
              onSelectRef.current?.(String(hit.properties.key));
              return;
            }
            const bubble = near(e.point, [LAYER_CLUSTERS]);
            if (bubble) {
              const [lng, lat] = (bubble.geometry as GeoJSON.Point).coordinates;
              void (m.getSource(SOURCE_BUSINESSES) as GeoJSONSource)
                .getClusterExpansionZoom(Number(bubble.properties.cluster_id))
                .then((zoom) => m.easeTo({ center: [lng, lat], zoom: Math.min(16, zoom + 0.4), duration: reducedMotion() ? 0 : 900 }));
              return;
            }
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
          // Mouse over a place: pointer cursor and a small photo card.
          let hoverFrame = 0;
          let hovered: string | null = null;
          m.on("mousemove", (e) => {
            if (hoverFrame) return;
            hoverFrame = requestAnimationFrame(() => {
              hoverFrame = 0;
              const hit = near(e.point, PICKABLE);
              const key = hit ? String(hit.properties.key) : near(e.point, [LAYER_CLUSTERS]) ? "cluster" : null;
              m.getCanvas().style.cursor = key ? "pointer" : "";
              if (key === hovered) return;
              hovered = key;
              previewRef.current?.remove();
              previewRef.current = null;
              const item = key ? itemsRef.current.find((i) => i.key === key) : undefined;
              if (!item?.location || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
              const card = document.createElement("div");
              card.className = styles.previewCard;
              card.dataset.part = "preview";
              if (item.photo) {
                const img = document.createElement("img");
                img.alt = "";
                img.decoding = "async";
                img.src = imageLoader({ src: item.photo.src, width: 330 });
                card.append(img);
              }
              const name = document.createElement("strong");
              name.textContent = item.name;
              const meta = document.createElement("span");
              meta.textContent = item.categoryLabel;
              card.append(name, meta);
              previewRef.current = new lib.Popup({ closeButton: false, closeOnClick: false, className: styles.preview, offset: 22, maxWidth: "220px" })
                .setLngLat([item.location.lng, item.location.lat])
                .setDOMContent(card)
                .addTo(m);
            });
          });
          m.getCanvas().addEventListener("mouseleave", () => {
            hovered = null;
            previewRef.current?.remove();
            previewRef.current = null;
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
      flightRef.current?.();
      photoLoadRef.current?.();
      if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
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

  // "Show where I am": the browser's position, drawn on this screen only (nothing is sent anywhere).
  // The first fix flies there when it's in the valley; later fixes just move the dot.
  const stopLocating = () => {
    if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
    watchRef.current = null;
    meRef.current = null;
    setLocating(false);
    const map = mapRef.current;
    if (map) setMyPosition(map, null);
  };
  const toggleLocation = () => {
    if (watchRef.current !== null) {
      stopLocating();
      setLocationNote(null);
      return;
    }
    if (!("geolocation" in navigator)) {
      setLocationNote("unavailable");
      return;
    }
    setLocating(true);
    setHint(false);
    let first = true;
    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const me = { lng: pos.coords.longitude, lat: pos.coords.latitude, accuracy: pos.coords.accuracy };
        meRef.current = me;
        const map = mapRef.current;
        if (map) setMyPosition(map, me);
        if (!first || !map) return;
        first = false;
        const [[west, south], [east, north]] = MAX_BOUNDS;
        const inside = me.lng > west && me.lng < east && me.lat > south && me.lat < north;
        setLocationNote(inside ? "private" : "outside");
        if (!inside) return;
        if (orbitingRef.current) stopOrbit();
        const { left = 0, right = 0, bottom = 0 } = insetsRef.current ?? {};
        const camera = pointCamera({ kind: "point", lng: me.lng, lat: me.lat, area: false, zoom: 15 }, modeRef.current);
        moveCamera(map, { ...camera, padding: { left, right, bottom, top: 0 } }, 1800);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          stopLocating();
          setLocationNote("denied");
        } else if (first) {
          setLocationNote("unavailable");
        }
      },
      { enableHighAccuracy: true, maximumAge: 10_000, timeout: 20_000 },
    );
  };
  // Notes fade after a few seconds.
  useEffect(() => {
    if (!locationNote) return;
    const timer = window.setTimeout(() => setLocationNote(null), locationNote === "denied" ? 9000 : 6000);
    return () => window.clearTimeout(timer);
  }, [locationNote]);

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

  // A short tip on what the map can do: once per browser, until the visitor touches the map.
  useEffect(() => {
    if (showcase || status !== "ready" || mode !== "3d") return;
    try {
      if (localStorage.getItem(HINT_SEEN)) return;
      localStorage.setItem(HINT_SEEN, "1");
    } catch {
      // Storage blocked: show it each visit.
    }
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

  // The places follow the (filtered) items and the selection (a hosted listing highlights its host).
  const selectedItem = selectedKey ? items.find((i) => i.key === selectedKey) : undefined;
  const highlight = selectedItem?.hostKey ?? selectedKey;
  useEffect(() => {
    if (showcase) return;
    highlightRef.current = highlight;
    foundRef.current = found;
    dataRef.current = placeData(items, highlight, photosRef.current, found);
    const map = mapRef.current;
    if (map && status === "ready") setPlaceData(map, dataRef.current);
  }, [items, highlight, found, status, showcase]);

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
      moveCamera(map, { ...camera, padding: { left, right, bottom, top: 0 } }, 2000);
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
    <div className={cx(styles.wrap, showcase && styles.showcase, status === "ready" && styles.ready, className)}>
      <div
        ref={hostRef}
        className={styles.map}
        role={showcase ? undefined : "region"}
        aria-label={showcase ? undefined : t.explore.mapLabel}
        aria-hidden={showcase || undefined}
      />
      {/* Every mapped place as a button, for keyboards and screen readers (the map draws them as pictures). */}
      {!showcase && status === "ready" && (
        <ul className={styles.keyList} aria-label={t.explore.mapPlaces}>
          {items
            .filter((i) => i.location && !i.hostKey)
            .map((i) => (
              <li key={i.key}>
                <button
                  type="button"
                  data-key={i.key}
                  aria-pressed={i.key === highlight}
                  tabIndex={touring ? -1 : 0}
                  onClick={() => onSelectRef.current?.(i.key)}
                >
                  {i.name} — {i.categoryLabel}
                </button>
              </li>
            ))}
        </ul>
      )}
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
          <button
            type="button"
            className={styles.control}
            aria-label={locating ? t.explore.hideLocation : t.explore.myLocation}
            title={locating ? t.explore.hideLocation : t.explore.myLocation}
            aria-pressed={locating}
            onClick={toggleLocation}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="10" cy="10" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="10" cy="10" r="2" fill="currentColor" />
              <path d="M10 1.5v3M10 15.5v3M1.5 10h3M15.5 10h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
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
      {!showcase && locationNote && (
        <p className={styles.hint} role="status">
          {
            {
              private: t.explore.locationPrivate,
              outside: t.explore.locationOutside,
              denied: t.explore.locationDenied,
              unavailable: t.explore.locationUnavailable,
            }[locationNote]
          }
        </p>
      )}
      {!showcase && hint && !locationNote && status === "ready" && (
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
