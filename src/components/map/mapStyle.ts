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
import type { SkySpecification, StyleSpecification } from "maplibre-gl";

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
 * The fallback: shaded relief tinted by height — green valley floors (Gusinje
 * lies at about 900 m), pasture, bare limestone and the highest tops pale.
 */
export function reliefStyle(): StyleSpecification {
  return {
    version: 8,
    sources: demSources(),
    layers: [
      { id: "background", type: "background", paint: { "background-color": "#dfe6d6" } },
      {
        id: "valley-relief",
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
          "color-relief-opacity": 1,
        },
      },
      hillshadeLayer,
    ],
    sky: SKY,
  };
}
