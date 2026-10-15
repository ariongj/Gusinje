/**
 * Map data sources for the 3D map. Everything is configurable at build time;
 * the defaults are free, keyless public services:
 *
 * - Base map (roads, trails, rivers, villages, peak names): OpenFreeMap's
 *   "liberty" style, from OpenStreetMap data. NEXT_PUBLIC_MAP_STYLE replaces it.
 * - Elevation: Mapzen terrain tiles on AWS Open Data (terrarium encoding).
 *   NEXT_PUBLIC_MAP_TERRAIN replaces it.
 *
 * When the base map can't load (offline, blocked), the map falls back to a
 * shaded-relief style drawn from the elevation alone, so the mountains and the
 * places are still there.
 */
import type {
  ColorReliefLayerSpecification,
  ExpressionSpecification,
  FilterSpecification,
  LayerSpecification,
  LineLayerSpecification,
  SkySpecification,
  StyleSpecification,
  SymbolLayerSpecification,
  VectorSourceSpecification,
} from "maplibre-gl";

export const BASE_STYLE_URL = process.env.NEXT_PUBLIC_MAP_STYLE || "https://tiles.openfreemap.org/styles/liberty";

export const TERRAIN_TILES = process.env.NEXT_PUBLIC_MAP_TERRAIN || "https://elevation-tiles-prod.s3.amazonaws.com/terrarium/{z}/{x}/{y}.png";

export const TERRAIN_ATTRIBUTION =
  'Terrain: <a href="https://github.com/tilezen/joerd/blob/master/docs/attribution.md" target="_blank" rel="noopener noreferrer">Mapzen terrain tiles</a> (SRTM and others) via AWS Open Data';

/** How much taller the mountains are drawn than they are (they read better a little steeper). */
export const EXAGGERATION = 1.35;

/** The valley, with room around it: the map doesn't wander off to the rest of the Balkans. */
export const MAX_BOUNDS: [[number, number], [number, number]] = [
  [19.45, 42.3],
  [20.2, 42.75],
];

export const TERRAIN_SOURCE = "valley-terrain";
export const HILLSHADE_SOURCE = "valley-hillshade";
export const HILLSHADE_LAYER = "valley-hillshade-shading";
export const RELIEF_LAYER = "valley-relief";
export const CONTOUR_SOURCE = "valley-contours";

function demSource(maxzoom: number) {
  return {
    type: "raster-dem" as const,
    tiles: [TERRAIN_TILES],
    tileSize: 256,
    maxzoom,
    encoding: "terrarium" as const,
    attribution: TERRAIN_ATTRIBUTION,
  };
}

/**
 * Elevation sources: one for the 3D surface, one for the shading (MapLibre
 * works best with two). The shading uses slightly coarser tiles: magnified,
 * the finest ones show stripes on the slopes.
 */
export function demSources() {
  return { [TERRAIN_SOURCE]: demSource(14), [HILLSHADE_SOURCE]: demSource(12) };
}

export const hillshadeLayer = {
  id: HILLSHADE_LAYER,
  type: "hillshade" as const,
  source: HILLSHADE_SOURCE,
  paint: {
    "hillshade-exaggeration": 0.42,
    "hillshade-shadow-color": "#2f4440",
    "hillshade-highlight-color": "#fffaf0",
    "hillshade-accent-color": "#4a5c55",
    "hillshade-illumination-direction": 315,
  },
};

/** Soft mountain air: a blue sky that fades to a pale haze on the horizon. */
export const SKY: SkySpecification = {
  "sky-color": "#7fa9c6",
  "horizon-color": "#e7eef0",
  "fog-color": "#e3ebec",
  "sky-horizon-blend": 0.55,
  "horizon-fog-blend": 0.7,
  "fog-ground-blend": 0.35,
  "atmosphere-blend": ["interpolate", ["linear"], ["zoom"], 9, 1, 13, 0.6, 15, 0.2],
};

/**
 * Height tint: green valley floors (Gusinje lies at about 900 m), pasture,
 * bare limestone and the highest tops pale. Full strength on its own; over
 * the base map it shows through the roads, water and names.
 */
export function reliefLayer(opacity: number): ColorReliefLayerSpecification {
  return {
    id: RELIEF_LAYER,
    type: "color-relief",
    source: HILLSHADE_SOURCE,
    paint: {
      "color-relief-color": [
        "interpolate",
        ["linear"],
        ["elevation"],
        300,
        "#9dba86",
        850,
        "#a9c48f",
        1200,
        "#bccb98",
        1600,
        "#c8c6a0",
        1900,
        "#c4b9a2",
        2200,
        "#cdc8c0",
        2500,
        "#ecebe7",
        2700,
        "#ffffff",
      ],
      "color-relief-opacity": opacity,
    },
  };
}

/* ------------------------------------------------------------- contours */

export function contourSource(tiles: string): VectorSourceSpecification {
  return { type: "vector", tiles: [tiles], maxzoom: 15 };
}

/** Thin brown lines; every fifth a little stronger. */
export function contourLineLayer(): LineLayerSpecification {
  return {
    id: "valley-contour-lines",
    type: "line",
    source: CONTOUR_SOURCE,
    "source-layer": "contours",
    minzoom: 11.5,
    paint: {
      "line-color": "#6e5538",
      "line-opacity": ["interpolate", ["linear"], ["zoom"], 11.5, 0.14, 13, 0.34],
      "line-width": ["case", [">", ["get", "level"], 0], 1.1, 0.55],
    },
  };
}

/** Heights along the stronger lines (needs the base map's fonts). */
export function contourLabelLayer(): SymbolLayerSpecification {
  return {
    id: "valley-contour-labels",
    type: "symbol",
    source: CONTOUR_SOURCE,
    "source-layer": "contours",
    minzoom: 13,
    filter: [">", ["get", "level"], 0],
    layout: {
      "symbol-placement": "line",
      "symbol-spacing": 320,
      "text-field": ["concat", ["to-string", ["get", "ele"]], " m"],
      "text-font": ["Noto Sans Regular"],
      "text-size": 10,
      "text-max-angle": 25,
      "text-letter-spacing": 0.05,
    },
    paint: { "text-color": "#5e4830", "text-halo-color": "rgba(255,255,255,0.85)", "text-halo-width": 1.2 },
  };
}

/* ------------------------------------------------- trails and peaks (OSM) */

const lines: ExpressionSpecification = ["match", ["geometry-type"], ["LineString", "MultiLineString"], true, false];

/**
 * Footpaths and farm tracks from OpenStreetMap, drawn the way hiking maps
 * do (red-brown and brown dashes) from far enough out to plan a walk. The
 * base map only shows them as faint white dashes from very close. They are
 * map data, not checked on the ground; the legend says so.
 */
export function trailLayers(source: string): LineLayerSpecification[] {
  const tracks: FilterSpecification = ["all", lines, ["==", ["get", "class"], "track"]];
  const paths: FilterSpecification = [
    "all",
    lines,
    ["==", ["get", "class"], "path"],
    ["any", ["!", ["has", "subclass"]], ["match", ["get", "subclass"], ["path", "footway", "bridleway"], true, false]],
  ];
  const width = (k: number): ExpressionSpecification => [
    "interpolate",
    ["linear"],
    ["zoom"],
    11.5,
    0.8 * k,
    14,
    1.7 * k,
    17,
    3.2 * k,
  ];
  const halo = (id: string, filter: FilterSpecification): LineLayerSpecification => ({
    id,
    type: "line",
    source,
    "source-layer": "transportation",
    minzoom: 11.5,
    filter,
    layout: { "line-join": "round", "line-cap": "round" },
    paint: { "line-color": "#ffffff", "line-opacity": 0.55, "line-width": width(2.4) },
  });
  return [
    halo("valley-tracks-halo", tracks),
    {
      id: "valley-tracks",
      type: "line",
      source,
      "source-layer": "transportation",
      minzoom: 11.5,
      filter: tracks,
      layout: { "line-join": "round" },
      paint: { "line-color": "#8c6a3f", "line-opacity": 0.9, "line-width": width(1), "line-dasharray": [4, 2] },
    },
    halo("valley-trails-halo", paths),
    {
      id: "valley-trails",
      type: "line",
      source,
      "source-layer": "transportation",
      minzoom: 11.5,
      filter: paths,
      layout: { "line-join": "round" },
      paint: { "line-color": "#b5412a", "line-opacity": 0.92, "line-width": width(1.05), "line-dasharray": [3, 1.6] },
    },
  ];
}

/** Summits with their height from OpenStreetMap: the main ones from far out, all of them closer. */
export function peakLayers(source: string): SymbolLayerSpecification[] {
  const peak = (id: string, extra: Partial<SymbolLayerSpecification>): SymbolLayerSpecification => ({
    id,
    type: "symbol",
    source,
    "source-layer": "mountain_peak",
    layout: {
      "icon-image": "peak",
      "icon-anchor": "bottom",
      "text-field": [
        "case",
        ["has", "name"],
        ["concat", ["coalesce", ["get", "name:latin"], ["get", "name"]], "\n", ["to-string", ["get", "ele"]], " m"],
        ["concat", ["to-string", ["get", "ele"]], " m"],
      ],
      "text-font": ["Noto Sans Regular"],
      "text-size": ["interpolate", ["linear"], ["zoom"], 11, 10, 14, 12],
      "text-anchor": "top",
      "text-offset": [0, 0.15],
      "text-max-width": 8,
      "text-optional": true,
      "symbol-sort-key": ["*", -1, ["coalesce", ["get", "ele"], 0]],
    },
    paint: { "text-color": "#4a3f2f", "text-halo-color": "rgba(255,255,255,0.85)", "text-halo-width": 1.2 },
    ...extra,
  });
  const isPeak: ExpressionSpecification[] = [["match", ["geometry-type"], ["Point", "MultiPoint"], true, false], ["==", ["get", "class"], "peak"], ["has", "ele"]];
  return [
    peak("valley-peaks-major", { minzoom: 10.5, maxzoom: 12.5, filter: ["all", ...isPeak, ["<=", ["coalesce", ["get", "rank"], 9], 2]] }),
    peak("valley-peaks", { minzoom: 12.5, filter: ["all", ...isPeak] }),
  ];
}

/* --------------------------------------------------------------- styles */

/**
 * The base map, made into a mountain map: height tint and contour lines
 * under the water and roads, footpaths and tracks over them, summits with
 * their height on top, and the base map's own shops and cafés hidden so the
 * guide's places stand alone (bus and train stops stay). Pure: the style
 * passed in is left as it was.
 */
export function decorateBaseStyle(style: StyleSpecification, contourTiles: string | null): StyleSpecification {
  const vector = Object.entries(style.sources).find(([, source]) => source.type === "vector")?.[0];
  const sources: StyleSpecification["sources"] = { ...style.sources, ...demSources() };
  const layers: LayerSpecification[] = style.layers.map((layer) =>
    layer.type === "symbol" && layer["source-layer"] === "poi" && layer.id !== "poi_transit" ? { ...layer, layout: { ...layer.layout, visibility: "none" } } : layer,
  );
  const at = (test: (layer: LayerSpecification) => boolean) => {
    const i = layers.findIndex(test);
    return i < 0 ? layers.length : i;
  };
  const under: LayerSpecification[] = [reliefLayer(0.5)];
  const over: LayerSpecification[] = vector ? trailLayers(vector) : [];
  if (contourTiles) {
    sources[CONTOUR_SOURCE] = contourSource(contourTiles);
    under.push(contourLineLayer());
    if (style.glyphs) over.push(contourLabelLayer());
  }
  // Under water, roads and buildings; over the land cover.
  layers.splice(at((l) => "source-layer" in l && ["waterway", "water", "transportation", "building"].includes(l["source-layer"] ?? "")), 0, ...under);
  // Over the roads, under every name.
  layers.splice(at((l) => l.type === "symbol"), 0, ...over);
  if (vector && style.glyphs) layers.push(...peakLayers(vector));
  return { ...style, sources, layers };
}

/**
 * The fallback: shaded relief tinted by height (with contour lines when the
 * plugin started), for when the base map can't be had.
 */
export function reliefStyle(contourTiles: string | null = null): StyleSpecification {
  const sources: StyleSpecification["sources"] = demSources();
  const layers: LayerSpecification[] = [{ id: "background", type: "background", paint: { "background-color": "#dfe6d6" } }, reliefLayer(1)];
  if (contourTiles) {
    sources[CONTOUR_SOURCE] = contourSource(contourTiles);
    layers.push(contourLineLayer());
  }
  layers.push(hillshadeLayer);
  return { version: 8, sources, layers, sky: SKY };
}
