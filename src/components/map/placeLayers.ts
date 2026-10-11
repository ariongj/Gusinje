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

import { MAP_ICONS, type MapIcon } from "./icons";

export const SOURCE_PLACES = "guide-places";
export const SOURCE_BUSINESSES = "guide-businesses";
export const SOURCE_SELECTED = "guide-selected";

export const LAYER_CLUSTERS = "guide-clusters";
export const LAYER_BUSINESS_PINS = "guide-business-pins";
export const LAYER_PLACE_PINS = "guide-place-pins";
export const LAYER_VILLAGE_LABELS = "guide-village-labels";
export const LAYER_PLACE_LABELS = "guide-place-labels";
export const LAYER_BUSINESS_LABELS = "guide-business-labels";
export const LAYER_SELECTED = "guide-selected-pin";
export const LAYER_SELECTED_LABEL = "guide-selected-label";

/** Layers a tap can pick a place from. */
export const PICKABLE = [LAYER_SELECTED, LAYER_SELECTED_LABEL, LAYER_PLACE_PINS, LAYER_BUSINESS_PINS, LAYER_VILLAGE_LABELS, LAYER_PLACE_LABELS, LAYER_BUSINESS_LABELS];

const PR = 2; // drawn at twice the size for sharp screens

type Style = "point" | "area" | "open" | "selected";

/* ------------------------------------------------------------- features */

function styleOf(item: ExploreItem): Exclude<Style, "selected"> {
  if (item.openData) return "open";
  return item.location?.precision === "area" ? "area" : "point";
}

function feature(item: ExploreItem, selected = false) {
  const style: Style = selected ? "selected" : styleOf(item);
  const icon = item.icon ?? "info";
  return {
    type: "Feature" as const,
    geometry: { type: "Point" as const, coordinates: [item.location!.lng, item.location!.lat] },
    properties: {
      key: item.key,
      pin: `pin|${icon}|${item.group}|${style}`,
      label: `label|${selected ? "selected" : item.group === "villages" ? "village" : "normal"}|${item.name}`,
      // Lower draws first and wins label space: villages, places, listings, open data.
      rank: selected ? 0 : item.group === "villages" ? 1 : item.kind === "place" ? 2 : item.openData ? 4 : 3,
    },
  };
}

const collection = (features: ReturnType<typeof feature>[]) => ({ type: "FeatureCollection" as const, features });

/** Mapped items as the three sources' data. */
export function placeData(items: readonly ExploreItem[], selectedKey: string | null) {
  const mapped = items.filter((i) => i.location && !i.hostKey);
  const selected = mapped.find((i) => i.key === selectedKey);
  return {
    places: collection(mapped.filter((i) => i.kind === "place").map((i) => feature(i))),
    businesses: collection(mapped.filter((i) => i.kind === "business").map((i) => feature(i))),
    selected: collection(selected ? [feature(selected, true)] : []),
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

const labelLayout: SymbolLayerSpecification["layout"] = {
  "icon-image": ["get", "label"],
  "icon-anchor": "bottom",
  "icon-offset": [0, -17],
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
  map.addLayer({ id: LAYER_BUSINESS_PINS, type: "symbol", source: SOURCE_BUSINESSES, filter: ["!", ["has", "point_count"]], layout: pinLayout });
  map.addLayer({ id: LAYER_PLACE_PINS, type: "symbol", source: SOURCE_PLACES, layout: pinLayout });
  // Town and village names always; other places from a closer zoom; listings closer still.
  map.addLayer({ id: LAYER_VILLAGE_LABELS, type: "symbol", source: SOURCE_PLACES, filter: ["==", ["get", "rank"], 1], layout: labelLayout });
  map.addLayer({ id: LAYER_PLACE_LABELS, type: "symbol", source: SOURCE_PLACES, minzoom: 12.6, filter: ["!=", ["get", "rank"], 1], layout: labelLayout });
  map.addLayer({ id: LAYER_BUSINESS_LABELS, type: "symbol", source: SOURCE_BUSINESSES, minzoom: 14.2, filter: ["!", ["has", "point_count"]], layout: labelLayout });
  map.addLayer({ id: LAYER_SELECTED, type: "symbol", source: SOURCE_SELECTED, layout: pinLayout });
  map.addLayer({ id: LAYER_SELECTED_LABEL, type: "symbol", source: SOURCE_SELECTED, layout: { ...labelLayout, "icon-allow-overlap": true, "icon-offset": [0, -22] } });
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

function pin(name: MapIcon, group: LegendGroup, style: Style) {
  const color = groupColor[group] ?? "#0f3b3f";
  const r = style === "open" ? 11 : style === "selected" ? 17 : 14;
  const pad = style === "selected" ? 6 : 4;
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

/** Draw a missing image by its id ("pin|…", "label|…", "cluster|…") and add it to the map. */
export function addMissingImage(map: MLMap, id: string) {
  if (map.hasImage(id)) return;
  const [type, a, b, c] = id.split("|");
  let drawn: HTMLCanvasElement | null = null;
  if (type === "pin") drawn = pin(a as MapIcon, b as LegendGroup, c as Style);
  else if (type === "label") drawn = label(a, id.slice(`label|${a}|`.length));
  else if (type === "cluster") drawn = cluster(Number(a));
  if (!drawn) return;
  const ctx = drawn.getContext("2d")!;
  map.addImage(id, ctx.getImageData(0, 0, drawn.width, drawn.height), { pixelRatio: PR });
}
