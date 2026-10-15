/**
 * Contour lines, worked out in the browser from the same elevation tiles the
 * 3D terrain uses (maplibre-contour: isolines in a web worker, cached per
 * tile). No extra data source, nothing sent anywhere.
 */
import { TERRAIN_TILES } from "./mapStyle";

type DemSource = InstanceType<(typeof import("maplibre-contour"))["default"]["DemSource"]>;

/** Metres between lines at each zoom: [minor, major]. */
const THRESHOLDS: Record<number, [number, number]> = { 11: [200, 1000], 12: [100, 500], 13: [100, 500], 14: [50, 250], 15: [20, 100] };

let dem: DemSource | null = null;

/**
 * The tile URL for a contour vector source, after registering the contour
 * protocol with MapLibre (once per page). Null when the plugin can't start.
 */
export async function contourTiles(lib: { addProtocol: (id: string, protocol: never) => void }): Promise<string | null> {
  try {
    if (!dem) {
      const mlcontour = (await import("maplibre-contour")).default;
      dem = new mlcontour.DemSource({ url: TERRAIN_TILES, encoding: "terrarium", maxzoom: 14, worker: true, cacheSize: 120, timeoutMs: 12_000 });
      dem.setupMaplibre(lib as Parameters<DemSource["setupMaplibre"]>[0]);
    }
    return dem.contourProtocolUrl({ thresholds: THRESHOLDS, contourLayer: "contours", elevationKey: "ele", levelKey: "level", extent: 4096, buffer: 1 });
  } catch {
    return null;
  }
}
