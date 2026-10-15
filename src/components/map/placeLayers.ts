/**
 * The guide's places drawn by the map itself (WebGL symbol layers) instead of
 * one HTML element each: hundreds of places stay smooth, labels make room for
 * each other (the map hides a label that would overlap one ranked higher),
 * and businesses gather into numbered bubbles until you zoom in.
 *
 * Pins, labels and bubbles are drawn on a canvas when the map first needs
 * them (`styleimagemissing`), so no font or sprite has to be downloaded —
 * they work offline and with any base map.
 */

import type { GeoJSONSource, Map as MLMap, SymbolLayerSpecification } from "maplibre-gl";

import { groupColor, type ExploreItem, type LegendGroup } from "@/components/explore/types";
import imageLoader from "@/lib/image-loader";

import { MAP_ICONS, type MapIcon } from "./icons";

export const SOURCE_PLACES = "guide-places";
export const SOURCE_BUSINESSES = "guide-businesses";
export const SOURCE_SELECTED = "guide-selected";
export const SOURCE_ME = "guide-me";

export const LAYER_CLUSTERS = "guide-clusters";
export const LAYER_BUSINESS_PINS = "guide-business-pins";
export const LAYER_PLACE_PINS = "guide-place-pins";
/** Close up, places with a photo show it in their pin: from this zoom. */
export const PHOTO_ZOOM = 13.5;
export const LAYER_BUSINESS_PINS_NEAR = "guide-business-pins-near";
export const LAYER_PLACE_PINS_NEAR = "guide-place-pins-near";
export const LAYER_VILLAGE_LABELS = "guide-village-labels";
export const LAYER_PLACE_LABELS = "guide-place-labels";
export const LAYER_BUSINESS_LABELS = "guide-business-labels";
export const LAYER_SELECTED = "guide-selected-pin";
export const LAYER_SELECTED_LABEL = "guide-selected-label";
export const LAYER_ME_ACCURACY = "guide-me-accuracy";
export const LAYER_ME = "guide-me-dot";

/** Layers a tap can pick a place from. */
export const PICKABLE = [
  LAYER_SELECTED,
  LAYER_SELECTED_LABEL,
  LAYER_PLACE_PINS,
  LAYER_PLACE_PINS_NEAR,
  LAYER_BUSINESS_PINS,
  LAYER_BUSINESS_PINS_NEAR,
  LAYER_VILLAGE_LABELS,
  LAYER_PLACE_LABELS,
  LAYER_BUSINESS_LABELS,
];

const PR = 2; // drawn at twice the size for sharp screens

type Style = "point" | "area" | "open" | "selected";

/* ------------------------------------------------------------- features */

function styleOf(item: ExploreItem): Exclude<Style, "selected"> {
  if (item.openData) return "open";
  return item.location?.precision === "area" ? "area" : "point";
}

const photoId = (key: string) => `photo|${key}`;

function feature(item: ExploreItem, selected: boolean, photos: ReadonlySet<string>, found: ReadonlySet<string>) {
  const style: Style = selected ? "selected" : styleOf(item);
  const icon = item.icon ?? "info";
  const pin = `pin|${icon}|${item.group}|${style}${!selected && found.has(item.key) ? "|found" : ""}`;
  const photoPin = !selected && photos.has(item.key);
  return {
    type: "Feature" as const,
    geometry: { type: "Point" as const, coordinates: [item.location!.lng, item.location!.lat] },
    properties: {
      key: item.key,
      pin,
      // Close up: the place's photo once it has loaded, else the same pin.
      near: photoPin ? photoId(item.key) : pin,
      photoPin,
      label: `label|${selected ? "selected" : item.group === "villages" ? "village" : "normal"}|${item.name}`,
      // Lower draws first and wins label space: villages, places, listings, open data.
      rank: selected ? 0 : item.group === "villages" ? 1 : item.kind === "place" ? 2 : item.openData ? 4 : 3,
    },
  };
}

const collection = (features: ReturnType<typeof feature>[]) => ({ type: "FeatureCollection" as const, features });

const NO_PHOTOS: ReadonlySet<string> = new Set();

/**
 * Mapped items as the three sources' data. `photos`: keys whose photo pin the
 * map already has; `found`: keys stamped in the explorer's passport.
 */
export function placeData(items: readonly ExploreItem[], selectedKey: string | null, photos: ReadonlySet<string> = NO_PHOTOS, found: ReadonlySet<string> = NO_PHOTOS) {
  const mapped = items.filter((i) => i.location && !i.hostKey);
  const selected = mapped.find((i) => i.key === selectedKey);
  return {
    places: collection(mapped.filter((i) => i.kind === "place").map((i) => feature(i, false, photos, found))),
    businesses: collection(mapped.filter((i) => i.kind === "business").map((i) => feature(i, false, photos, found))),
    selected: collection(selected ? [feature(selected, true, photos, found)] : []),
  };
}

/* --------------------------------------------------------------- layers */

const pinLayout: SymbolLayerSpecification["layout"] = {
  "icon-image": ["get", "pin"],
  "icon-allow-overlap": true,
  "icon-ignore-placement": true,
  "symbol-sort-key": ["get", "rank"],
  "icon-pitch-alignment": "viewport",
};

const nearPinLayout: SymbolLayerSpecification["layout"] = { ...pinLayout, "icon-image": ["get", "near"] };

const labelLayout: SymbolLayerSpecification["layout"] = {
  "icon-image": ["get", "label"],
  "icon-anchor": "bottom",
  // Above the pin; a photo pin is bigger.
  "icon-offset": ["step", ["zoom"], ["literal", [0, -17]], PHOTO_ZOOM, ["case", ["get", "photoPin"], ["literal", [0, -29]], ["literal", [0, -17]]]],
  "icon-allow-overlap": false,
  "icon-ignore-placement": false,
  "icon-padding": 3,
  "symbol-sort-key": ["get", "rank"],
  "icon-pitch-alignment": "viewport",
};

/** Add the sources and layers (once per style). */
export function addPlaceLayers(map: MLMap) {
  if (map.getSource(SOURCE_PLACES)) return;
  const empty = collection([]);
  map.addSource(SOURCE_PLACES, { type: "geojson", data: empty });
  map.addSource(SOURCE_BUSINESSES, { type: "geojson", data: empty, cluster: true, clusterRadius: 46, clusterMaxZoom: 14 });
  map.addSource(SOURCE_SELECTED, { type: "geojson", data: empty });

  map.addLayer({
    id: LAYER_CLUSTERS,
    type: "symbol",
    source: SOURCE_BUSINESSES,
    filter: ["has", "point_count"],
    layout: { "icon-image": ["concat", "cluster|", ["get", "point_count"]], "icon-allow-overlap": true, "icon-ignore-placement": true },
  });
  const single: SymbolLayerSpecification["filter"] = ["!", ["has", "point_count"]];
  map.addLayer({ id: LAYER_BUSINESS_PINS, type: "symbol", source: SOURCE_BUSINESSES, maxzoom: PHOTO_ZOOM, filter: single, layout: pinLayout });
  map.addLayer({ id: LAYER_BUSINESS_PINS_NEAR, type: "symbol", source: SOURCE_BUSINESSES, minzoom: PHOTO_ZOOM, filter: single, layout: nearPinLayout });
  map.addLayer({ id: LAYER_PLACE_PINS, type: "symbol", source: SOURCE_PLACES, maxzoom: PHOTO_ZOOM, layout: pinLayout });
  map.addLayer({ id: LAYER_PLACE_PINS_NEAR, type: "symbol", source: SOURCE_PLACES, minzoom: PHOTO_ZOOM, layout: nearPinLayout });
  // Town and village names always; other places from a closer zoom; listings closer still.
  map.addLayer({ id: LAYER_VILLAGE_LABELS, type: "symbol", source: SOURCE_PLACES, filter: ["==", ["get", "rank"], 1], layout: labelLayout });
  map.addLayer({ id: LAYER_PLACE_LABELS, type: "symbol", source: SOURCE_PLACES, minzoom: 12.6, filter: ["!=", ["get", "rank"], 1], layout: labelLayout });
  map.addLayer({ id: LAYER_BUSINESS_LABELS, type: "symbol", source: SOURCE_BUSINESSES, minzoom: 14.2, filter: ["!", ["has", "point_count"]], layout: labelLayout });
  map.addLayer({ id: LAYER_SELECTED, type: "symbol", source: SOURCE_SELECTED, layout: pinLayout });
  map.addLayer({ id: LAYER_SELECTED_LABEL, type: "symbol", source: SOURCE_SELECTED, layout: { ...labelLayout, "icon-allow-overlap": true, "icon-offset": [0, -22] } });

  // The visitor's own position (only ever on their screen): a blue dot in a ring as wide as its accuracy.
  map.addSource(SOURCE_ME, { type: "geojson", data: empty });
  map.addLayer({
    id: LAYER_ME_ACCURACY,
    type: "circle",
    source: SOURCE_ME,
    paint: {
      // Metres on the ground: "r0" is the radius in pixels at zoom 0, doubling with each zoom level.
      "circle-radius": ["interpolate", ["exponential", 2], ["zoom"], 0, ["get", "r0"], 22, ["*", ["get", "r0"], 2 ** 22]],
      "circle-color": "#2a7de1",
      "circle-opacity": 0.12,
      "circle-stroke-color": "#2a7de1",
      "circle-stroke-opacity": 0.4,
      "circle-stroke-width": 1,
      "circle-pitch-alignment": "map",
      "circle-pitch-scale": "map",
    },
  });
  map.addLayer({ id: LAYER_ME, type: "symbol", source: SOURCE_ME, layout: { "icon-image": "me", "icon-allow-overlap": true, "icon-ignore-placement": true, "icon-pitch-alignment": "viewport" } });
}

export type MyPosition = { lng: number; lat: number; accuracy: number };

/** Show (or, with null, clear) the visitor's position. */
export function setMyPosition(map: MLMap, me: MyPosition | null) {
  const source = map.getSource(SOURCE_ME) as GeoJSONSource | undefined;
  if (!source) return;
  if (!me) {
    source.setData(collection([]));
    return;
  }
  const metresPerPixelAtZoom0 = (40075016.7 * Math.cos((me.lat * Math.PI) / 180)) / 512;
  source.setData({
    type: "FeatureCollection",
    features: [{ type: "Feature", geometry: { type: "Point", coordinates: [me.lng, me.lat] }, properties: { r0: Math.min(me.accuracy, 2000) / metresPerPixelAtZoom0 } }],
  });
}

export function setPlaceData(map: MLMap, data: ReturnType<typeof placeData>) {
  (map.getSource(SOURCE_PLACES) as GeoJSONSource | undefined)?.setData(data.places);
  (map.getSource(SOURCE_BUSINESSES) as GeoJSONSource | undefined)?.setData(data.businesses);
  (map.getSource(SOURCE_SELECTED) as GeoJSONSource | undefined)?.setData(data.selected);
}

/* --------------------------------------------------------------- images */

let fontFamily = "system-ui, sans-serif";

/** The page's text font (Manrope via next/font), for labels drawn on canvas. */
export function setLabelFont(element: Element) {
  fontFamily = getComputedStyle(element).fontFamily || fontFamily;
}

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = Math.ceil(w * PR);
  c.height = Math.ceil(h * PR);
  const ctx = c.getContext("2d")!;
  ctx.scale(PR, PR);
  return { c, ctx };
}

function icon(ctx: CanvasRenderingContext2D, name: MapIcon, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  ctx.translate(cx - size / 2, cy - size / 2);
  ctx.scale(size / 24, size / 24);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke(new Path2D(MAP_ICONS[name] ?? MAP_ICONS.info));
  ctx.restore();
}

function pin(name: MapIcon, group: LegendGroup, style: Style, found = false) {
  const color = groupColor[group] ?? "#0f3b3f";
  const r = style === "open" ? 11 : style === "selected" ? 17 : 14;
  const pad = style === "selected" ? 6 : found ? 7 : 4;
  const size = (r + pad) * 2;
  const { c, ctx } = canvas(size, size);
  const cx = size / 2;
  ctx.shadowColor = "rgba(10, 42, 45, 0.35)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;
  if (style === "selected") {
    ctx.beginPath();
    ctx.arc(cx, cx, r + 4, 0, Math.PI * 2);
    ctx.fillStyle = "#b8894a";
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(cx, cx, r, 0, Math.PI * 2);
  const hollow = style === "area" || style === "open";
  ctx.fillStyle = hollow ? "#ffffff" : color;
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.lineWidth = style === "open" ? 2 : hollow ? 3 : 2.5;
  ctx.strokeStyle = hollow ? color : "#ffffff";
  ctx.stroke();
  icon(ctx, name, cx, cx, style === "open" ? 12 : 15, hollow ? color : "#ffffff");
  if (found) {
    // A gold tick at the top right: stamped in the passport.
    const bx = cx + r * 0.72;
    const by = cx - r * 0.72;
    ctx.beginPath();
    ctx.arc(bx, by, 7, 0, Math.PI * 2);
    ctx.fillStyle = "#b8894a";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(bx - 3.2, by + 0.2);
    ctx.lineTo(bx - 0.8, by + 2.6);
    ctx.lineTo(bx + 3.4, by - 2.4);
    ctx.lineWidth = 1.9;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
  }
  return c;
}

function label(kind: string, text: string) {
  const font = `600 12.5px ${fontFamily}`;
  const measure = document.createElement("canvas").getContext("2d")!;
  measure.font = font;
  const w = Math.min(220, Math.ceil(measure.measureText(text).width)) + 24;
  const h = 26;
  const { c, ctx } = canvas(w, h);
  ctx.beginPath();
  ctx.roundRect(0.5, 0.5, w - 1, h - 1, h / 2);
  ctx.fillStyle = kind === "selected" ? "#b8894a" : kind === "village" ? "rgba(6, 26, 29, 0.82)" : "rgba(6, 26, 29, 0.7)";
  ctx.fill();
  ctx.font = font;
  ctx.fillStyle = kind === "selected" ? "#10201f" : "#f6f9f8";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  let shown = text;
  while (ctx.measureText(shown).width > w - 24 && shown.length > 4) shown = `${shown.slice(0, -2)}…`;
  ctx.fillText(shown, w / 2, h / 2 + 0.5);
  return c;
}

function cluster(count: number) {
  const r = count < 10 ? 16 : count < 30 ? 19 : 22;
  const size = (r + 6) * 2;
  const { c, ctx } = canvas(size, size);
  const cx = size / 2;
  ctx.beginPath();
  ctx.arc(cx, cx, r + 5, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(184, 137, 74, 0.28)";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cx, r, 0, Math.PI * 2);
  ctx.fillStyle = "#0f3b3f";
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
  ctx.font = `800 ${count < 100 ? 14 : 12}px ${fontFamily}`;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(count), cx, cx + 0.5);
  return c;
}

function meDot() {
  const size = 30;
  const { c, ctx } = canvas(size, size);
  ctx.shadowColor = "rgba(10, 42, 45, 0.35)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 1;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, 9, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, 6.5, 0, Math.PI * 2);
  ctx.fillStyle = "#2a7de1";
  ctx.fill();
  return c;
}

/** A summit mark for the base map's peaks. */
function peakMark() {
  const size = 14;
  const { c, ctx } = canvas(size, size);
  ctx.beginPath();
  ctx.moveTo(7, 1.5);
  ctx.lineTo(13, 12.5);
  ctx.lineTo(1, 12.5);
  ctx.closePath();
  ctx.fillStyle = "#4a3f2f";
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.stroke();
  return c;
}

/** The place's photo in a round white frame. */
function photoPin(img: HTMLImageElement) {
  const size = 50;
  const r = 21;
  const { c, ctx } = canvas(size, size);
  const cx = size / 2;
  ctx.shadowColor = "rgba(10, 42, 45, 0.4)";
  ctx.shadowBlur = 7;
  ctx.shadowOffsetY = 2;
  ctx.beginPath();
  ctx.arc(cx, cx, r + 2.5, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cx, r, 0, Math.PI * 2);
  ctx.clip();
  // Cover: the shorter side fills the circle.
  const scale = Math.max((r * 2) / img.naturalWidth, (r * 2) / img.naturalHeight);
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  ctx.drawImage(img, cx - w / 2, cx - h / 2, w, h);
  ctx.restore();
  return c;
}

/**
 * Load the photos of mapped items into the map as round pins, a few at a
 * time, and report as they arrive; nothing is loaded twice. Returns a
 * function that stops the loading, or null when there was nothing to load.
 */
export function loadPhotoPins(map: MLMap, items: readonly ExploreItem[], have: Set<string>, onLoaded: () => void): (() => void) | null {
  const queue = items.filter((i) => i.photo && i.location && !i.hostKey && !i.openData && !have.has(i.key) && !loading.has(i.key) && !map.hasImage(photoId(i.key)));
  if (!queue.length) return null;
  for (const item of queue) loading.add(item.key);
  let stopped = false;
  let active = 0;
  let pending = 0;
  const next = () => {
    if (stopped) return;
    while (active < 4 && queue.length) {
      const item = queue.shift()!;
      active += 1;
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.decoding = "async";
      const done = (ok: boolean) => {
        active -= 1;
        loading.delete(item.key);
        if (ok && !stopped && !map.hasImage(photoId(item.key))) {
          const drawn = photoPin(img);
          const ctx = drawn.getContext("2d")!;
          try {
            map.addImage(photoId(item.key), ctx.getImageData(0, 0, drawn.width, drawn.height), { pixelRatio: PR });
            have.add(item.key);
            pending += 1;
          } catch {
            // A photo the browser won't let the page read (no CORS): the pin stays an icon.
          }
        }
        if (active === 0 || pending >= 6) {
          if (pending) onLoaded();
          pending = 0;
        }
        next();
      };
      img.onload = () => done(true);
      img.onerror = () => done(false);
      img.src = imageLoader({ src: item.photo!.src, width: 250 });
    }
  };
  next();
  return () => {
    stopped = true;
    for (const item of queue) loading.delete(item.key);
    queue.length = 0;
  };
}

/** Photos on their way in (so two loaders never fetch the same one). */
const loading = new Set<string>();

/** Draw a missing image by its id ("pin|…", "label|…", "cluster|…", "me", "peak") and add it to the map. */
export function addMissingImage(map: MLMap, id: string) {
  if (map.hasImage(id)) return;
  const [type, a, b, c, d] = id.split("|");
  let drawn: HTMLCanvasElement | null = null;
  if (type === "pin") drawn = pin(a as MapIcon, b as LegendGroup, c as Style, d === "found");
  else if (type === "label") drawn = label(a, id.slice(`label|${a}|`.length));
  else if (type === "cluster") drawn = cluster(Number(a));
  else if (type === "me") drawn = meDot();
  else if (type === "peak") drawn = peakMark();
  if (!drawn) return;
  const ctx = drawn.getContext("2d")!;
  map.addImage(id, ctx.getImageData(0, 0, drawn.width, drawn.height), { pixelRatio: PR });
}
