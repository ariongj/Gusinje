/*
 * Illustrative 3D map of the Gusinje–Vusanje valley: Gusinje and Hotel ROSI
 * at the foot of the valley, the road up past Ali Pasha's Springs to Eko Katun
 * ROSI and Vusanje, the Grlja waterfall and Oko Skakavice, and the peaks of
 * the Prokletije, rendered with three.js. Not to scale. The React wrapper
 * (ResortMap.tsx) loads this module on demand and owns the overlay UI; this
 * class owns WebGL, the camera and the animation loop.
 */

import {
  ACESFilmicToneMapping,
  BackSide,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  ExtrudeGeometry,
  Fog,
  Group,
  HemisphereLight,
  IcosahedronGeometry,
  InstancedMesh,
  Line,
  Material,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Points,
  PointsMaterial,
  Quaternion,
  RepeatWrapping,
  RingGeometry,
  Scene,
  ShaderMaterial,
  Shape,
  SphereGeometry,
  SRGBColorSpace,
  Texture,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import type { PoiId } from "./pois";
import {
  FALLS,
  fbm,
  floorAt,
  heightAt,
  isReserved,
  PADS,
  padLevel,
  PLACES,
  POOLS,
  poolSurface,
  random,
  WORLD_SIZE,
  type Pool,
  type XZ,
} from "./terrain";

export type ViewId = PoiId | "overview" | "hero";
type Vec3 = [number, number, number];
type CameraView = { position: Vec3; target: Vec3 };

/** Screen position of a place marker, in % of the viewport. */
export type PinPosition = { id: PoiId; x: number; y: number; visible: boolean };

export type ResortEngineOptions = {
  reducedMotion: boolean;
  /** false: no dragging or zooming (the home hero) — the camera drifts on its own and the page scrolls freely. */
  interactive?: boolean;
  /** Where the camera starts. */
  initialView?: ViewId;
  /** Called after every rendered frame with the marker positions. */
  onPins?: (pins: PinPosition[]) => void;
  /** The visitor started dragging or zooming. */
  onInteract?: () => void;
};

const SKY_TOP = "#86aec8";
const SKY_HORIZON = "#e4edef";
const SKY_BOTTOM = "#d3dfe0";

const MONTH = new Date().getMonth();
/** Months (0 = January) when snow falls on the map. */
const SNOW_MONTHS = [10, 11, 0, 1, 2];
/** Snow lies low on the mountains from December to March; otherwise only on the highest tops. */
const SNOW_LINE = [11, 0, 1, 2].includes(MONTH) ? 30 : 70;
/** October and November turn the valley's broadleaf trees gold. */
const AUTUMN = MONTH === 9 || MONTH === 10;

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* ------------------------------------------------------------------ layout */

const hotelY = padLevel(PADS.hotel);
const townY = padLevel(PADS.gusinje);
const katunY = padLevel(PADS.katun);

const curve = (points: readonly [number, number][]) =>
  new CatmullRomCurve3(points.map(([x, z]) => new Vector3(x, 0, z)));

/** The road from Plav into Gusinje, past the hotel, and on up the valley to Vusanje. */
const ROAD = curve([
  [-84, 150],
  [-50, 126],
  [-22, 110],
  [-3, 100],
  [-1, 84],
  [-2, 70],
  [2, 50],
  [6, 24],
  [4, 0],
  [2, -20],
  [8, -40],
  [16, -52],
  [26, -62],
]);
/** The katun's gravel drive, from the road to the restaurant. */
const DRIVE = curve([
  [3, -27],
  [-1, -27],
  [-4, -27.5],
]);
/** Oko Skakavice down to the lip of the Grlja falls. */
const SKAKAVICA = curve([
  [PLACES.blueEye.x - 2.4, PLACES.blueEye.z + 2.8],
  [52, -75],
  [47, -70],
  [42.4, -64.6],
]);
/** From the pool under Grlja down to Ali Pasha's Springs. */
const VRUJA_UPPER = curve([
  [35.5, -57],
  [33, -46],
  [31, -26],
  [30, -4],
  [30, 16],
  [28.5, 27.5],
]);
/** From the springs through Gusinje and on towards Plav (as the Ljuča). */
const VRUJA = curve([
  [24, 41],
  [16, 58],
  [9, 72],
  [3, 86],
  [-8, 99],
  [-24, 114],
  [-44, 130],
  [-62, 146],
]);

const ROAD_SAMPLES = ROAD.getSpacedPoints(160);
const RIVER_SAMPLES = [...VRUJA.getSpacedPoints(110), ...VRUJA_UPPER.getSpacedPoints(70), ...SKAKAVICA.getSpacedPoints(20)];

const nearAny = (samples: readonly Vector3[], x: number, z: number, r: number) =>
  samples.some((p) => (p.x - x) ** 2 + (p.z - z) ** 2 < r * r);

/** Marker anchors (world space). */
const ANCHORS: Record<PoiId, Vector3> = {
  hotel: new Vector3(PLACES.hotel.x, hotelY + 17, PLACES.hotel.z),
  gusinje: new Vector3(PLACES.gusinje.x - 4, townY + 10, PLACES.gusinje.z - 2),
  springs: new Vector3(POOLS.springs.x, poolSurface(POOLS.springs) + 3.5, POOLS.springs.z),
  katun: new Vector3(-10, katunY + 8, -40),
  tower: new Vector3(PLACES.tower.x, katunY + 15, PLACES.tower.z),
  grlja: new Vector3(FALLS.x, heightAt(FALLS.x - FALLS.dir.x * 2, FALLS.z - FALLS.dir.z * 2) + 1.5, FALLS.z),
  blueEye: new Vector3(POOLS.blueEye.x, poolSurface(POOLS.blueEye) + 3.5, POOLS.blueEye.z),
  ropojana: new Vector3(PLACES.ropojana.x, heightAt(PLACES.ropojana.x, PLACES.ropojana.z) + 6, PLACES.ropojana.z),
  karanfili: new Vector3(106, heightAt(106, -74) + 4, -74),
  zlaKolata: new Vector3(-40, heightAt(-40, -116) + 4, -116),
};

/** A point `lift` units above the ground at (x, z). */
const above = (x: number, z: number, lift: number): Vec3 => [x, heightAt(x, z) + lift, z];

const karanfiliTop = heightAt(106, -74);
const zlaKolataTop = heightAt(-40, -116);

/** Camera views. +x is west and +z north: most views look south-west, up the valley. */
const VIEWS: Record<ViewId, CameraView> = {
  overview: { position: [-34, 134, 222], target: above(10, -12, 6) },
  // Home hero: in over the road from Plav, up the valley to the katun and the peaks.
  hero: { position: [-66, 40, 164], target: above(10, -32, 8) },
  hotel: { position: above(-22, 128, 20), target: [PLACES.hotel.x, hotelY + 5, PLACES.hotel.z - 2] },
  gusinje: { position: above(-48, 122, 44), target: above(2, 62, 2) },
  springs: { position: above(-2, 68, 24), target: [POOLS.springs.x, poolSurface(POOLS.springs) + 1, POOLS.springs.z - 2] },
  // From above the valley floor north of the katun (the slopes either side are wooded).
  katun: { position: above(-4, 22, 34), target: above(-12, -36, 0) },
  tower: { position: above(-34, -2, 14), target: [PLACES.tower.x, katunY + 8, PLACES.tower.z] },
  grlja: { position: above(10, -30, 24), target: [FALLS.x, poolSurface(POOLS.grlja) + 4, FALLS.z] },
  blueEye: { position: above(26, -50, 24), target: [POOLS.blueEye.x, poolSurface(POOLS.blueEye) + 1, POOLS.blueEye.z] },
  ropojana: { position: above(12, -48, 46), target: above(56, -116, 4) },
  // The mountains from well back, summits in frame.
  karanfili: { position: [20, karanfiliTop * 0.9, 62], target: [100, karanfiliTop * 0.68, -72] },
  zlaKolata: { position: [-20, zlaKolataTop * 0.9, 42], target: [-38, zlaKolataTop * 0.68, -112] },
};

/* --------------------------------------------------------------- materials */

/** Walls with a grid of windows; `lit` draws the emissive map (lit windows on black). */
function facadeTexture(opts: {
  cols: number;
  rows: number;
  seed: number;
  lit: boolean;
  wall: string;
  glass?: string;
}): CanvasTexture {
  const cw = 18;
  const rh = 24;
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, opts.cols) * cw;
  canvas.height = opts.rows * rh;
  const ctx = canvas.getContext("2d")!;
  const rand = random(opts.seed);
  ctx.fillStyle = opts.lit ? "#000000" : opts.wall;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let r = 0; r < opts.rows; r++) {
    for (let c = 0; c < opts.cols; c++) {
      const on = rand() < 0.35;
      if (opts.lit) {
        if (!on) continue;
        ctx.fillStyle = rand() < 0.5 ? "#ffcf87" : "#ffbf6e";
      } else {
        ctx.fillStyle = on ? "#efcf98" : (opts.glass ?? "#2f3a3c");
      }
      ctx.fillRect(c * cw + 5, r * rh + 6, cw - 10, rh - 11);
    }
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function facadeMaterial(width: number, rows: number, seed: number, wall: string): MeshStandardMaterial {
  const cols = Math.max(1, Math.round(width / 2.2));
  return new MeshStandardMaterial({
    map: facadeTexture({ cols, rows, seed, lit: false, wall }),
    emissiveMap: facadeTexture({ cols, rows, seed, lit: true, wall }),
    emissive: new Color("#ffb766"),
    emissiveIntensity: 0.7,
    roughness: 0.85,
  });
}

/** Rough-cut stone courses with a few narrow window slits (the kula and the old stone house). */
function stoneTexture(seed: number, slits: number): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const rand = random(seed);
  ctx.fillStyle = "#8f8676";
  ctx.fillRect(0, 0, 64, 128);
  for (let y = 0, row = 0; y < 128; y += 8, row++) {
    for (let x = row % 2 ? -6 : 0; x < 64; x += 12) {
      const shade = 168 + Math.floor(rand() * 46);
      ctx.fillStyle = `rgb(${shade}, ${shade - 8}, ${shade - 22})`;
      ctx.fillRect(x + 1, y + 1, 10 + Math.floor(rand() * 2), 6);
    }
  }
  ctx.fillStyle = "#2b2622";
  for (let i = 0; i < slits; i++) {
    const y = 18 + i * (100 / Math.max(1, slits));
    ctx.fillRect(28, y, 8, 14);
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/** White streaks for the falling water; scrolled every frame. */
function fallsTexture(): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const rand = random(15);
  ctx.fillStyle = "rgba(214, 238, 240, 0.55)";
  ctx.fillRect(0, 0, 64, 256);
  for (let i = 0; i < 26; i++) {
    const x = rand() * 64;
    const y = rand() * 256;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + rand() * 0.5})`;
    ctx.fillRect(x, y, 1.5 + rand() * 3, 40 + rand() * 90);
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(1, 1.4);
  return texture;
}

/** "HOTEL ROSI" in white on blue, for the sign over the hotel's ground floor. */
function signTexture(): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#24508c";
  ctx.fillRect(0, 0, 256, 64);
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 34px Arial, Helvetica, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("HOTEL ROSI", 128, 34);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/* ---------------------------------------------------------------- geometry */

/** Triangular prism with its ridge along x, sitting on y = 0. */
function gableRoofGeometry(width: number, depth: number, height: number): BufferGeometry {
  const shape = new Shape();
  shape.moveTo(-depth / 2, 0);
  shape.lineTo(depth / 2, 0);
  shape.lineTo(0, height);
  shape.closePath();
  const geometry = new ExtrudeGeometry(shape, { depth: width, bevelEnabled: false });
  geometry.rotateY(-Math.PI / 2);
  geometry.translate(width / 2, 0, 0);
  return geometry;
}

/** A flat strip laid over the terrain along a curve (roads and rivers). */
function ribbonGeometry(path: CatmullRomCurve3, halfWidth: number, samples: number, lift = 0.14): BufferGeometry {
  const positions: number[] = [];
  const indices: number[] = [];
  const point = new Vector3();
  const tangent = new Vector3();
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    path.getPointAt(t, point);
    path.getTangentAt(t, tangent);
    const px = -tangent.z;
    const pz = tangent.x;
    const length = Math.hypot(px, pz) || 1;
    for (const side of [-1, 1]) {
      const x = point.x + (px / length) * halfWidth * side;
      const z = point.z + (pz / length) * halfWidth * side;
      positions.push(x, heightAt(x, z) + lift, z);
    }
    if (i < samples) {
      const a = i * 2;
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function shadowed<T extends Object3D>(object: T): T {
  object.traverse((child) => {
    if (child instanceof Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return object;
}

/** Lowest ground under a rectangle — buildings start there so they never float on a slope. */
function groundUnder(x: number, z: number, w: number, d: number): number {
  let low = Infinity;
  for (const [dx, dz] of [
    [0, 0],
    [-w / 2, -d / 2],
    [w / 2, -d / 2],
    [-w / 2, d / 2],
    [w / 2, d / 2],
  ]) {
    low = Math.min(low, heightAt(x + dx, z + dz));
  }
  return low;
}

/* ---------------------------------------------------------------- houses */

type House = { x: number; z: number; w: number; d: number; h: number; roof: number; angle: number; wall: string; tile: string };

const WALLS = ["#f1ebe0", "#e9e1d2", "#ded4c2", "#f4f0e8", "#d8cab2", "#e6dccb"];
const ROOFS = ["#9d4b33", "#8c4530", "#a65a3b", "#7b3b2b", "#6d4a3a", "#5d5752"];
const STONE_WALLS = ["#c9bfae", "#bdb29f", "#d3cab9"];

/** Scatters village houses inside an ellipse, clear of the road, the rivers, the plots and each other. */
function scatterHouses(opts: {
  center: XZ;
  rx: number;
  rz: number;
  count: number;
  seed: number;
  taken: House[];
  /** Mostly two-storey town houses, or low stone farmhouses. */
  style: "town" | "village";
  keepClear?: readonly (XZ & { r: number })[];
}): House[] {
  const rand = random(opts.seed);
  const houses: House[] = [];
  for (let tries = 0; houses.length < opts.count && tries < opts.count * 60; tries++) {
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(rand());
    const x = opts.center.x + Math.cos(a) * opts.rx * r;
    const z = opts.center.z + Math.sin(a) * opts.rz * r;
    const w = 3.2 + rand() * 2.4;
    const d = 2.8 + rand() * 1.8;
    const size = Math.max(w, d) / 2;
    if (nearAny(ROAD_SAMPLES, x, z, 2.6 + size)) continue;
    if (nearAny(RIVER_SAMPLES, x, z, 2.2 + size)) continue;
    if (opts.keepClear?.some((c) => Math.hypot(x - c.x, z - c.z) < c.r + size)) continue;
    if ([...opts.taken, ...houses].some((h) => Math.hypot(h.x - x, h.z - z) < 1.2 + size + Math.max(h.w, h.d) / 2)) {
      continue;
    }
    const twoStorey = opts.style === "town" ? rand() < 0.6 : rand() < 0.25;
    houses.push({
      x,
      z,
      w,
      d,
      h: twoStorey ? 4.4 + rand() * 0.8 : 2.6 + rand() * 0.6,
      roof: 1.3 + rand() * 0.8,
      // Roughly square to the valley (north–south), as the old houses stand.
      angle: (rand() < 0.5 ? 0 : Math.PI / 2) + (rand() - 0.5) * 0.35,
      wall: opts.style === "village" && rand() < 0.5 ? STONE_WALLS[Math.floor(rand() * 3)] : WALLS[Math.floor(rand() * WALLS.length)],
      tile: ROOFS[Math.floor(rand() * ROOFS.length)],
    });
  }
  return houses;
}

/** Where the houses stand: Gusinje, the farms along the road, and Vusanje. */
const HOUSES: House[] = (() => {
  const all: House[] = [];
  const clear = [
    { x: PLACES.hotel.x, z: PLACES.hotel.z, r: 12 },
    { x: POOLS.springs.x, z: POOLS.springs.z, r: POOLS.springs.r + 3 },
    { x: PADS.katun.x, z: PADS.katun.z, r: 22 },
    // Open ground below the Grlja falls.
    { x: FALLS.x, z: FALLS.z, r: 13 },
  ];
  all.push(...scatterHouses({ center: PLACES.gusinje, rx: 26, rz: 22, count: 74, seed: 3, taken: all, style: "town", keepClear: clear }));
  all.push(...scatterHouses({ center: { x: 4, z: 102 }, rx: 22, rz: 10, count: 10, seed: 5, taken: all, style: "town", keepClear: clear }));
  // A few farms along the road between the town and the village.
  all.push(...scatterHouses({ center: { x: 2, z: 40 }, rx: 16, rz: 10, count: 5, seed: 7, taken: all, style: "village", keepClear: clear }));
  all.push(...scatterHouses({ center: { x: 6, z: 6 }, rx: 14, rz: 12, count: 3, seed: 9, taken: all, style: "village", keepClear: clear }));
  all.push(...scatterHouses({ center: PLACES.vusanje, rx: 15, rz: 11, count: 18, seed: 11, taken: all, style: "village", keepClear: clear }));
  return all;
})();

/* ------------------------------------------------------------------ engine */

export class ResortEngine {
  static isSupported(): boolean {
    try {
      const canvas = document.createElement("canvas");
      return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      return false;
    }
  }

  private container: HTMLElement;
  private options: ResortEngineOptions;
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera: PerspectiveCamera;
  private controls: OrbitControls;
  private sky: Mesh;
  private snow: Points | null = null;
  private falls: CanvasTexture | null = null;
  private ro: ResizeObserver | null = null;
  private io: IntersectionObserver | null = null;
  private onVisibility = () => this.updateRunning();
  /**
   * A plain wheel scrolls the page; ctrl + wheel (and trackpad pinch, which
   * arrives as one) or fullscreen zooms. Runs in the capture phase, before
   * OrbitControls sees the event.
   */
  private onWheelCapture = (e: WheelEvent) => {
    this.controls.enableZoom = e.ctrlKey || !!document.fullscreenElement;
  };
  /** Touch pinch zooms as usual. */
  private onPointerCapture = () => {
    this.controls.enableZoom = true;
  };
  private visible = true;
  private running = false;
  private lastTime = 0;
  private lastInteract = 0;
  private tourMode = false;
  private readonly interactive: boolean;
  /** Azimuth range the idle drift swings across, and its current direction. */
  private swing: [number, number] = [-0.9, 0.9];
  private swingDir = 1;
  private flight: {
    p0: Vector3;
    p1: Vector3;
    t0: Vector3;
    t1: Vector3;
    start: number;
    duration: number;
    lift: number;
  } | null = null;
  private readonly projected = new Vector3();
  private readonly pinIds = Object.keys(ANCHORS) as PoiId[];
  private readonly compact: boolean;

  constructor(container: HTMLElement, options: ResortEngineOptions) {
    this.container = container;
    this.options = options;
    this.interactive = options.interactive ?? true;
    this.compact = window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4;

    const renderer = new WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.compact ? 1.5 : 1.75));
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.shadowMap.enabled = !this.compact;
    renderer.shadowMap.type = PCFShadowMap;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);
    this.renderer = renderer;

    this.camera = new PerspectiveCamera(40, 1, 0.5, 1800);
    this.scene.fog = new Fog(new Color(SKY_HORIZON), 290, 860);

    this.sky = this.buildSky();
    this.scene.add(this.sky);
    this.buildEnvironment();
    this.buildLights();
    this.scene.add(this.buildTerrain());
    this.scene.add(this.buildWater());
    this.scene.add(this.buildRoads());
    this.scene.add(this.buildHouses());
    this.scene.add(this.buildHotel());
    this.scene.add(this.buildKatun());
    this.scene.add(this.buildHaystacks());
    this.scene.add(this.buildTrees());
    if (!options.reducedMotion && SNOW_MONTHS.includes(MONTH)) {
      this.snow = this.buildSnow();
      this.scene.add(this.snow);
    }

    const controls = new OrbitControls(this.camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.rotateSpeed = 0.6;
    controls.zoomSpeed = 0.8;
    controls.panSpeed = 0.6;
    controls.screenSpacePanning = false;
    controls.minDistance = 18;
    controls.maxDistance = 300;
    controls.minPolarAngle = 0.18;
    controls.maxPolarAngle = 1.36;
    // Look up the valley from the north side: the map's edges stay out of sight.
    controls.minAzimuthAngle = -1.5;
    controls.maxAzimuthAngle = 1.5;
    controls.enabled = this.interactive;
    controls.addEventListener("start", () => {
      this.lastInteract = performance.now();
      controls.autoRotate = false;
      this.options.onInteract?.();
    });
    controls.addEventListener("change", () => {
      const t = controls.target;
      t.x = clamp(t.x, -110, 110);
      t.z = clamp(t.z, -125, 125);
      t.y = clamp(t.y, 0, 70);
    });
    this.controls = controls;
    // OrbitControls claims every touch; the hero must let the page scroll.
    renderer.domElement.style.touchAction = this.interactive ? "none" : "pan-y";
    container.addEventListener("wheel", this.onWheelCapture, { capture: true, passive: true });
    container.addEventListener("pointerdown", this.onPointerCapture, { capture: true, passive: true });
    this.jumpTo(VIEWS[options.initialView ?? "overview"]);
    if (!this.interactive) {
      const base = controls.getAzimuthalAngle();
      this.swing = [base - 0.28, base + 0.28];
    }

    this.resize();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(container);
    this.io = new IntersectionObserver((entries) => {
      this.visible = !!entries[0]?.isIntersecting;
      this.updateRunning();
    });
    this.io.observe(container);
    document.addEventListener("visibilitychange", this.onVisibility);
    this.lastInteract = performance.now();
    this.updateRunning();
  }

  /* ------------------------------------------------------------ public API */

  flyTo(id: ViewId) {
    const view = VIEWS[id];
    const p1 = new Vector3(...view.position);
    const t1 = new Vector3(...view.target);
    if (this.options.reducedMotion) {
      this.jumpTo(view);
      return;
    }
    const p0 = this.camera.position.clone();
    const t0 = this.controls.target.clone();
    const distance = p0.distanceTo(p1) + t0.distanceTo(t1);
    this.flight = {
      p0,
      p1,
      t0,
      t1,
      start: performance.now(),
      duration: clamp(900 + distance * 7, 1500, 3000),
      lift: Math.min(30, distance * 0.12),
    };
    this.controls.enabled = false;
    this.controls.autoRotate = false;
  }

  /** Scale the distance to the focus point (0.8 = closer). */
  zoomBy(factor: number) {
    const offset = this.camera.position.clone().sub(this.controls.target);
    const length = clamp(offset.length() * factor, this.controls.minDistance, this.controls.maxDistance);
    this.camera.position.copy(this.controls.target).add(offset.setLength(length));
    this.lastInteract = performance.now();
    this.controls.autoRotate = false;
  }

  /** Show or hide the falling snow (there is none outside the winter months). */
  setSnow(on: boolean) {
    if (this.snow) this.snow.visible = on;
  }

  /** Guided tour: keep the camera gently orbiting the current stop. */
  setTourMode(on: boolean) {
    this.tourMode = on;
    if (!on) this.lastInteract = performance.now();
  }

  dispose() {
    this.renderer.setAnimationLoop(null);
    this.ro?.disconnect();
    this.io?.disconnect();
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.container.removeEventListener("wheel", this.onWheelCapture, { capture: true });
    this.container.removeEventListener("pointerdown", this.onPointerCapture, { capture: true });
    this.controls.dispose();
    const textures = new Set<Texture>();
    this.scene.traverse((object) => {
      if (object instanceof Mesh || object instanceof Points || object instanceof Line) {
        object.geometry.dispose();
        const materials: Material[] = Array.isArray(object.material) ? object.material : [object.material];
        for (const material of materials) {
          for (const value of Object.values(material)) if (value instanceof Texture) textures.add(value);
          material.dispose();
        }
      }
    });
    textures.forEach((texture) => texture.dispose());
    this.scene.environment?.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  /* ------------------------------------------------------------ internals */

  private jumpTo(view: CameraView) {
    this.flight = null;
    this.camera.position.set(...view.position);
    this.controls.target.set(...view.target);
    this.controls.enabled = this.interactive;
    this.controls.update();
    this.keepAboveGround();
  }

  /** The camera never dips into a hillside, whether flying between views or orbiting. */
  private keepAboveGround() {
    const position = this.camera.position;
    const ground = heightAt(position.x, position.z) + 4;
    if (position.y < ground) position.y = ground;
  }

  private updateRunning() {
    const shouldRun = this.visible && document.visibilityState === "visible";
    if (shouldRun === this.running) return;
    this.running = shouldRun;
    this.lastTime = performance.now();
    this.renderer.setAnimationLoop(shouldRun ? this.tick : null);
  }

  private resize() {
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    // Narrow screens see less of the valley; widen the lens a little.
    this.camera.fov = width / height < 0.8 ? 52 : 40;
    this.camera.updateProjectionMatrix();
  }

  private tick = (now: number) => {
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;

    const flight = this.flight;
    if (flight) {
      const t = clamp((now - flight.start) / flight.duration, 0, 1);
      const e = easeInOut(t);
      this.camera.position.lerpVectors(flight.p0, flight.p1, e);
      this.camera.position.y += Math.sin(Math.PI * e) * flight.lift;
      this.controls.target.lerpVectors(flight.t0, flight.t1, e);
      if (t >= 1) {
        this.flight = null;
        this.controls.enabled = this.interactive;
        this.lastInteract = now;
      }
    } else if (!this.options.reducedMotion) {
      if (this.tourMode || !this.interactive || now - this.lastInteract > 7000) {
        // Drift gently back and forth (positive speed turns azimuth down).
        const azimuth = this.controls.getAzimuthalAngle();
        if (azimuth >= this.swing[1]) this.swingDir = 1;
        else if (azimuth <= this.swing[0]) this.swingDir = -1;
        const speed = this.tourMode ? 0.6 : this.interactive ? 0.35 : 0.5;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = speed * this.swingDir;
      }
    }
    this.controls.update(dt);
    this.keepAboveGround();

    this.sky.position.copy(this.camera.position);
    if (this.falls && !this.options.reducedMotion) this.falls.offset.y += dt * 0.9;
    this.animateSnow(dt);

    this.renderer.render(this.scene, this.camera);
    this.emitPins();
  };

  private emitPins() {
    const onPins = this.options.onPins;
    if (!onPins) return;
    const pins: PinPosition[] = this.pinIds.map((id) => {
      const v = this.projected.copy(ANCHORS[id]).project(this.camera);
      const visible = v.z < 1 && Math.abs(v.x) < 1.04 && Math.abs(v.y) < 1.04;
      return { id, x: (v.x + 1) * 50, y: (1 - v.y) * 50, visible };
    });
    onPins(pins);
  }

  private animateSnow(dt: number) {
    const snow = this.snow;
    if (!snow?.visible) return;
    const positions = snow.geometry.attributes.position as BufferAttribute;
    const array = positions.array as Float32Array;
    const t = performance.now() / 1000;
    for (let i = 0; i < positions.count; i++) {
      const k = i * 3;
      array[k + 1] -= (2.2 + (i % 5) * 0.35) * dt;
      array[k] += Math.sin(t * 0.6 + i) * 0.6 * dt;
      if (array[k + 1] < 0) array[k + 1] += 110;
    }
    positions.needsUpdate = true;
  }

  /* ---------------------------------------------------------------- world */

  private buildSky(): Mesh {
    const material = new ShaderMaterial({
      uniforms: {
        topColor: { value: new Color(SKY_TOP) },
        horizonColor: { value: new Color(SKY_HORIZON) },
        bottomColor: { value: new Color(SKY_BOTTOM) },
      },
      vertexShader:
        "varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: `
        uniform vec3 topColor; uniform vec3 horizonColor; uniform vec3 bottomColor;
        varying vec3 vDir;
        void main() {
          float h = normalize(vDir).y;
          vec3 c = h >= 0.0
            ? mix(horizonColor, topColor, pow(clamp(h * 1.6, 0.0, 1.0), 0.7))
            : mix(horizonColor, bottomColor, pow(clamp(-h, 0.0, 1.0), 0.5));
          gl_FragColor = vec4(c, 1.0);
          #include <colorspace_fragment>
        }`,
      side: BackSide,
      depthWrite: false,
      fog: false,
      toneMapped: false,
    });
    const sky = new Mesh(new SphereGeometry(1000, 32, 16), material);
    sky.renderOrder = -1;
    sky.frustumCulled = false;
    return sky;
  }

  /** Soft image-based light from the sky gradient, for natural reflections. */
  private buildEnvironment() {
    const envScene = new Scene();
    envScene.add(this.buildSky());
    const pmrem = new PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(envScene, 0.04).texture;
    this.scene.environmentIntensity = 0.7;
    envScene.traverse((object) => {
      if (object instanceof Mesh) {
        object.geometry.dispose();
        (object.material as Material).dispose();
      }
    });
    pmrem.dispose();
  }

  private buildLights() {
    this.scene.add(new HemisphereLight("#e9f1f4", "#4a5a50", 0.9));
    // A high midday sun from the south-east: the valley floor stays out of the ridges' shadows.
    const sun = new DirectionalLight("#fff0da", 2.4);
    sun.position.set(-70, 240, -70);
    sun.target.position.set(10, 0, -10);
    if (!this.compact) {
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      const cam = sun.shadow.camera;
      cam.left = -150;
      cam.right = 150;
      cam.top = 150;
      cam.bottom = -150;
      cam.near = 20;
      cam.far = 520;
      sun.shadow.bias = -0.0004;
      sun.shadow.normalBias = 0.6;
    }
    this.scene.add(sun, sun.target);
  }

  private buildTerrain(): Mesh {
    const segments = this.compact ? 160 : 220;
    const geometry = new PlaneGeometry(WORLD_SIZE, WORLD_SIZE, segments, segments);
    geometry.rotateX(-Math.PI / 2);
    const position = geometry.attributes.position as BufferAttribute;
    for (let i = 0; i < position.count; i++) {
      position.setY(i, heightAt(position.getX(i), position.getZ(i)));
    }
    geometry.computeVertexNormals();

    const normal = geometry.attributes.normal as BufferAttribute;
    const colors = new Float32Array(position.count * 3);
    const meadow = new Color(AUTUMN ? "#8f9a55" : "#83a257");
    const meadowDeep = new Color(AUTUMN ? "#6f7d43" : "#62803f");
    const forest = new Color("#43593a");
    const rock = new Color("#a7a59c");
    const rockDark = new Color("#77776f");
    const snow = new Color("#f7f8f9");
    const c = new Color();
    const tmp = new Color();
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const z = position.getZ(i);
      const h = position.getY(i);
      const rel = h - floorAt(x, z);
      const slope = 1 - normal.getY(i);
      const n = fbm(x * 0.07, z * 0.07, 3);
      c.copy(meadow).lerp(meadowDeep, clamp(0.5 + n * 1.2, 0, 1));
      c.lerp(forest, smoothstep(2.5, 9, rel + n * 3) * 0.75);
      // Pale limestone on the high ground and the steep walls.
      const rockT = Math.max(smoothstep(22, 36, rel + n * 7), smoothstep(0.36, 0.58, slope));
      c.lerp(tmp.copy(rock).lerp(rockDark, clamp(0.45 - n, 0, 1)), rockT);
      const snowT = smoothstep(SNOW_LINE, SNOW_LINE + 9, h + n * 7) * (1 - smoothstep(0.42, 0.64, slope));
      c.lerp(snow, snowT);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    geometry.setAttribute("color", new BufferAttribute(colors, 3));

    const terrain = new Mesh(
      geometry,
      new MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.96, metalness: 0 }),
    );
    terrain.receiveShadow = true;
    return terrain;
  }

  /** The rivers, the three pools and the Grlja waterfall. */
  private buildWater(): Group {
    const group = new Group();
    const river = new MeshStandardMaterial({
      color: "#4f98a1",
      roughness: 0.12,
      metalness: 0.1,
      side: DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -3,
    });
    group.add(
      new Mesh(ribbonGeometry(VRUJA, 1.3, 200, 0.2), river),
      new Mesh(ribbonGeometry(VRUJA_UPPER, 0.75, 140, 0.2), river),
      new Mesh(ribbonGeometry(SKAKAVICA, 0.75, 50, 0.22), river),
    );

    const pool = (p: Pool, color: string, glow: number) => {
      const water = new Mesh(
        new CircleGeometry(p.r * 1.02, 48),
        new MeshStandardMaterial({
          color,
          emissive: new Color(color),
          emissiveIntensity: glow,
          roughness: 0.06,
          metalness: 0.12,
        }),
      );
      water.rotation.x = -Math.PI / 2;
      water.position.set(p.x, poolSurface(p), p.z);
      water.receiveShadow = true;
      return water;
    };
    group.add(
      pool(POOLS.springs, "#4e9fa6", 0.08),
      pool(POOLS.blueEye, "#1fb2b4", 0.3),
      pool(POOLS.grlja, "#46a8ae", 0.12),
    );

    // Grlja: white water over the rock step into its pool, with a ring of foam.
    this.falls = fallsTexture();
    const top = heightAt(FALLS.x - FALLS.dir.x * 2, FALLS.z - FALLS.dir.z * 2) + 0.35;
    const bottom = poolSurface(POOLS.grlja);
    const height = Math.max(2, top - bottom);
    const sheet = new Mesh(
      new PlaneGeometry(3.6, height),
      new MeshStandardMaterial({
        map: this.falls,
        transparent: true,
        emissive: new Color("#dff3f4"),
        emissiveIntensity: 0.25,
        roughness: 0.3,
        side: DoubleSide,
        depthWrite: false,
      }),
    );
    sheet.position.set(FALLS.x + FALLS.dir.x * 0.9, bottom + height / 2, FALLS.z + FALLS.dir.z * 0.9);
    sheet.rotation.y = Math.atan2(FALLS.dir.x, FALLS.dir.z);
    const foam = new Mesh(
      new RingGeometry(0.6, 2.2, 32),
      new MeshStandardMaterial({ color: "#ffffff", transparent: true, opacity: 0.7, roughness: 0.4 }),
    );
    foam.rotation.x = -Math.PI / 2;
    foam.position.set(FALLS.x + FALLS.dir.x * 1.8, bottom + 0.05, FALLS.z + FALLS.dir.z * 1.8);
    group.add(sheet, foam);
    return group;
  }

  private buildRoads(): Group {
    const asphalt = new MeshStandardMaterial({
      color: "#8f918d",
      roughness: 0.9,
      side: DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -2,
    });
    const gravel = new MeshStandardMaterial({
      color: "#cdbd9d",
      roughness: 1,
      side: DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -2,
    });
    const road = new Mesh(ribbonGeometry(ROAD, 1.6, 320), asphalt);
    const drive = new Mesh(ribbonGeometry(DRIVE, 1.1, 12), gravel);
    road.receiveShadow = true;
    drive.receiveShadow = true;
    const group = new Group();
    group.add(road, drive);
    return group;
  }

  /** Every village house as two instanced meshes: walls and pitched roofs. */
  private buildHouses(): Group {
    const wallGeometry = new BoxGeometry(1, 1, 1);
    wallGeometry.translate(0, 0.5, 0);
    const walls = new InstancedMesh(
      wallGeometry,
      new MeshStandardMaterial({ color: "#ffffff", roughness: 0.92 }),
      HOUSES.length,
    );
    const roofs = new InstancedMesh(
      gableRoofGeometry(1, 1, 1),
      new MeshStandardMaterial({ color: "#ffffff", roughness: 0.8, flatShading: true }),
      HOUSES.length,
    );
    const matrix = new Matrix4();
    const rotation = new Quaternion();
    const up = new Vector3(0, 1, 0);
    const at = new Vector3();
    const scale = new Vector3();
    const color = new Color();
    HOUSES.forEach((house, i) => {
      const base = groundUnder(house.x, house.z, house.w, house.d) - 0.3;
      const top = heightAt(house.x, house.z) + house.h;
      rotation.setFromAxisAngle(up, house.angle);
      matrix.compose(at.set(house.x, base, house.z), rotation, scale.set(house.w, top - base, house.d));
      walls.setMatrixAt(i, matrix);
      walls.setColorAt(i, color.set(house.wall));
      matrix.compose(at.set(house.x, top, house.z), rotation, scale.set(house.w + 0.6, house.roof, house.d + 0.6));
      roofs.setMatrixAt(i, matrix);
      roofs.setColorAt(i, color.set(house.tile));
    });
    const group = new Group();
    group.add(walls, roofs);
    return shadowed(group);
  }

  /** Hotel ROSI: a four-storey yellow block with a blue ground floor, balconies and a glass roof terrace. */
  private buildHotel(): Group {
    const hotel = new Group();
    hotel.position.set(PLACES.hotel.x, hotelY, PLACES.hotel.z);
    // The front faces the road, to the east (−x).
    const width = 9;
    const depth = 15;
    const ground = 3.2;
    const upper = 10;

    const blue = new MeshStandardMaterial({ color: "#2d5c9a", roughness: 0.6 });
    const shop = new MeshStandardMaterial({
      color: "#f2dcb0",
      emissive: new Color("#ffcf8a"),
      emissiveIntensity: 0.6,
      roughness: 0.3,
    });
    const base = new Mesh(new BoxGeometry(width, ground, depth), [blue, blue, blue, blue, blue, blue]);
    base.position.y = ground / 2;
    const shopWindow = new Mesh(new BoxGeometry(0.2, 1.6, depth - 4), shop);
    shopWindow.position.set(-width / 2 - 0.05, 1.2, 0);

    const front = facadeMaterial(depth, 4, 41, "#e9c35c");
    const side = facadeMaterial(width, 4, 47, "#e9c35c");
    const plain = new MeshStandardMaterial({ color: "#e9c35c", roughness: 0.85 });
    // Box faces: +x, −x, +y, −y, +z, −z.
    const body = new Mesh(new BoxGeometry(width, upper, depth), [front, front, plain, plain, side, side]);
    body.position.y = ground + upper / 2;

    // Blue balcony rails along the front, one per floor.
    const rail = new MeshStandardMaterial({ color: "#2d5c9a", roughness: 0.5 });
    const slab = new MeshStandardMaterial({ color: "#e4ddd0", roughness: 0.8 });
    for (let floor = 0; floor < 4; floor++) {
      const y = ground + 0.15 + floor * 2.5;
      const balcony = new Mesh(new BoxGeometry(1.2, 0.2, depth - 2), slab);
      balcony.position.set(-width / 2 - 0.6, y, 0);
      const railing = new Mesh(new BoxGeometry(0.1, 0.9, depth - 2), rail);
      railing.position.set(-width / 2 - 1.15, y + 0.55, 0);
      hotel.add(balcony, railing);
    }

    const roof = new Mesh(new BoxGeometry(width + 0.6, 0.45, depth + 0.6), new MeshStandardMaterial({ color: "#4a4d4c" }));
    roof.position.y = ground + upper + 0.22;
    // The glass-walled terrace on the roof.
    const glass = new Mesh(
      new BoxGeometry(width - 2.4, 2.2, depth * 0.55),
      new MeshStandardMaterial({ color: "#d8e6e4", roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.45 }),
    );
    glass.position.set(0.6, ground + upper + 1.5, -depth * 0.12);
    const lid = new Mesh(new BoxGeometry(width - 1.8, 0.3, depth * 0.55 + 0.6), new MeshStandardMaterial({ color: "#3e4241" }));
    lid.position.set(0.6, ground + upper + 2.75, -depth * 0.12);

    // The name stands on the roof edge, facing the road.
    const sign = new Mesh(new PlaneGeometry(5.2, 1.3), new MeshStandardMaterial({ map: signTexture(), roughness: 0.5 }));
    sign.position.set(-width / 2 + 0.3, ground + upper + 1.1, depth * 0.22);
    sign.rotation.y = -Math.PI / 2;

    // Forecourt and parking towards the road.
    const forecourt = new Mesh(new BoxGeometry(7, 0.16, depth + 4), new MeshStandardMaterial({ color: "#a9a8a2" }));
    forecourt.position.set(-width / 2 - 3.6, 0.08, 0);
    forecourt.receiveShadow = true;

    hotel.add(base, shopWindow, body, roof, glass, lid, forecourt);
    shadowed(hotel);
    hotel.add(sign);
    return hotel;
  }

  /** Eko Katun ROSI: wooden bungalows, the restaurant house, the old stone house, the kula, tents and animals. */
  private buildKatun(): Group {
    const katun = new Group();
    const y = katunY;
    const wood = ["#9a6a43", "#a7774e", "#8d5f3b"].map((hex) => new MeshStandardMaterial({ color: hex, roughness: 0.85 }));
    const shingle = new MeshStandardMaterial({ color: "#4a3326", roughness: 0.8, flatShading: true });

    // Bungalows in an arc on the meadow, gables to the valley.
    const bungalows: [number, number, number][] = [
      [-3, -37, 0.2],
      [-7, -41.5, 0.35],
      [-11.5, -44.5, 0.1],
      [-16.5, -46, 0],
      [-21.5, -45.5, -0.15],
      [-26, -43, -0.4],
      [-4, -47, 0.25],
    ];
    bungalows.forEach(([x, z, angle], i) => {
      const b = new Group();
      const body = new Mesh(new BoxGeometry(3.2, 2.3, 3.8), wood[i % wood.length]);
      body.position.y = 1.15;
      const roof = new Mesh(gableRoofGeometry(4, 4.4, 2.3), shingle);
      roof.rotation.y = Math.PI / 2;
      roof.position.y = 2.3;
      const porch = new Mesh(new BoxGeometry(3.2, 0.2, 1.2), wood[(i + 1) % wood.length]);
      porch.position.set(0, 0.25, 2.5);
      b.add(body, roof, porch);
      b.position.set(x, groundUnder(x, z, 3.2, 3.8), z);
      b.rotation.y = angle;
      katun.add(b);
    });

    // The restaurant house with its terrace towards the road, lanterns along the edge.
    const restaurant = new Group();
    const rw = 8;
    const rd = 6.5;
    const front = facadeMaterial(rd, 2, 53, "#8f603b");
    const side = facadeMaterial(rw, 2, 59, "#8f603b");
    // Box faces: +x, −x, +y, −y, +z, −z. The terrace side (+x) faces the road.
    const body = new Mesh(new BoxGeometry(rw, 4.6, rd), [front, front, wood[0], wood[0], side, side]);
    body.position.y = 2.3;
    const roof = new Mesh(gableRoofGeometry(rw + 1, rd + 1.2, 2.6), shingle);
    roof.position.y = 4.6;
    const deck = new Mesh(new BoxGeometry(4.2, 0.35, rd + 3), wood[1]);
    deck.position.set(rw / 2 + 2.1, 0.18, 0);
    restaurant.add(body, roof, deck);
    const post = new CylinderGeometry(0.08, 0.1, 1.6, 6);
    const bulb = new SphereGeometry(0.24, 12, 8);
    const postMaterial = new MeshStandardMaterial({ color: "#2b2721", roughness: 0.6 });
    const bulbMaterial = new MeshStandardMaterial({ color: "#ffe2b0", emissive: new Color("#ffb45e"), emissiveIntensity: 2.4 });
    for (let i = 0; i < 4; i++) {
      const z = -rd / 2 - 1 + i * ((rd + 2) / 3);
      const p = new Mesh(post, postMaterial);
      p.position.set(rw / 2 + 4, 1.15, z);
      const b = new Mesh(bulb, bulbMaterial);
      b.position.set(rw / 2 + 4, 2.05, z);
      restaurant.add(p, b);
    }
    restaurant.position.set(-9, y, -25);
    katun.add(restaurant);

    // The kula: three storeys of stone with narrow windows and a pyramid roof.
    const kula = new Group();
    const stone = new MeshStandardMaterial({ map: stoneTexture(61, 3), roughness: 0.95 });
    const tower = new Mesh(new BoxGeometry(4.6, 10, 4.6), stone);
    tower.position.y = 5;
    const cap = new Mesh(new ConeGeometry(3.9, 3.4, 4), new MeshStandardMaterial({ color: "#5a463a", flatShading: true }));
    cap.rotation.y = Math.PI / 4;
    cap.position.y = 11.7;
    kula.add(tower, cap);
    kula.position.set(PLACES.tower.x, groundUnder(PLACES.tower.x, PLACES.tower.z, 4.6, 4.6), PLACES.tower.z);

    // The old stone house with the family rooms.
    const house = new Group();
    const houseStone = new MeshStandardMaterial({ map: stoneTexture(67, 1), roughness: 0.95 });
    const houseBody = new Mesh(new BoxGeometry(7, 4, 5), houseStone);
    houseBody.position.y = 2;
    const houseRoof = new Mesh(gableRoofGeometry(7.8, 5.8, 2.2), new MeshStandardMaterial({ color: "#6b4c3b", flatShading: true }));
    houseRoof.position.y = 4;
    house.add(houseBody, houseRoof);
    house.position.set(-25, groundUnder(-25, -33, 7, 5), -33);
    house.rotation.y = 0.1;

    // Tents on the camping meadow.
    const tents = new Group();
    const tentGeometry = gableRoofGeometry(2.6, 2.2, 1.5);
    (
      [
        [0, -51, "#d9772b", 0.4],
        [3.5, -48.5, "#5b8a3a", -0.2],
        [-1, -55, "#3d6fa8", 0.1],
      ] as const
    ).forEach(([x, z, color, angle]) => {
      const tent = new Mesh(tentGeometry, new MeshStandardMaterial({ color, roughness: 0.7, flatShading: true }));
      tent.position.set(x, heightAt(x, z), z);
      tent.rotation.y = angle;
      tents.add(tent);
    });

    katun.add(kula, house, tents);
    shadowed(katun);
    katun.add(this.buildAnimals());
    return katun;
  }

  /** Sheep on the meadow below the katun and ponies by the stone house. */
  private buildAnimals(): Group {
    const group = new Group();
    const rand = random(77);
    const body = new SphereGeometry(0.5, 10, 8);
    const sheep = new InstancedMesh(body, new MeshStandardMaterial({ color: "#f2efe6", roughness: 1 }), 14);
    const heads = new InstancedMesh(new SphereGeometry(0.2, 8, 6), new MeshStandardMaterial({ color: "#3a332d" }), 14);
    const matrix = new Matrix4();
    const rotation = new Quaternion();
    const up = new Vector3(0, 1, 0);
    const at = new Vector3();
    const scale = new Vector3();
    for (let i = 0; i < 14; i++) {
      const x = -22 + rand() * 18;
      const z = -60 + rand() * 9;
      const angle = rand() * Math.PI * 2;
      const ground = heightAt(x, z);
      rotation.setFromAxisAngle(up, angle);
      matrix.compose(at.set(x, ground + 0.45, z), rotation, scale.set(0.9, 0.75, 1.3));
      sheep.setMatrixAt(i, matrix);
      matrix.compose(
        at.set(x + Math.sin(angle) * 0.7, ground + 0.62, z + Math.cos(angle) * 0.7),
        rotation,
        scale.set(1, 1, 1.2),
      );
      heads.setMatrixAt(i, matrix);
    }
    sheep.castShadow = true;
    group.add(sheep, heads);

    const coat = new MeshStandardMaterial({ color: "#6b4a32", roughness: 0.9 });
    const legGeometry = new BoxGeometry(0.16, 0.8, 0.16);
    (
      [
        [-32, -26, 0.6],
        [-34, -29.5, 2.2],
        [-31.5, -33.5, -0.8],
      ] as const
    ).forEach(([x, z, angle]) => {
      const pony = new Group();
      const torso = new Mesh(new BoxGeometry(0.75, 0.7, 1.7), coat);
      torso.position.y = 1.15;
      const neck = new Mesh(new BoxGeometry(0.4, 0.9, 0.45), coat);
      neck.position.set(0, 1.6, 0.85);
      neck.rotation.x = 0.5;
      const head = new Mesh(new BoxGeometry(0.34, 0.34, 0.7), coat);
      head.position.set(0, 2.0, 1.25);
      pony.add(torso, neck, head);
      for (const [lx, lz] of [
        [-0.25, -0.65],
        [0.25, -0.65],
        [-0.25, 0.65],
        [0.25, 0.65],
      ]) {
        const leg = new Mesh(legGeometry, coat);
        leg.position.set(lx, 0.4, lz);
        pony.add(leg);
      }
      pony.position.set(x, heightAt(x, z), z);
      pony.rotation.y = angle;
      group.add(shadowed(pony));
    });
    return group;
  }

  /** Conical haystacks on poles in the meadows, as in the fields around Gusinje. */
  private buildHaystacks(): InstancedMesh {
    const count = 34;
    const geometry = new ConeGeometry(1, 1, 9);
    geometry.translate(0, 0.5, 0);
    const stacks = new InstancedMesh(
      geometry,
      new MeshStandardMaterial({ color: AUTUMN ? "#a88a54" : "#b59b62", roughness: 1, flatShading: true }),
      count,
    );
    const rand = random(41);
    const matrix = new Matrix4();
    const rotation = new Quaternion();
    const at = new Vector3();
    const scale = new Vector3();
    let placed = 0;
    for (let tries = 0; placed < count && tries < count * 80; tries++) {
      const x = -30 + rand() * 70;
      const z = -20 + rand() * 128;
      const h = heightAt(x, z);
      if (h - floorAt(x, z) > 1.4) continue;
      if (isReserved(x, z, 5)) continue;
      if (nearAny(ROAD_SAMPLES, x, z, 5) || nearAny(RIVER_SAMPLES, x, z, 4)) continue;
      if (HOUSES.some((house) => Math.hypot(house.x - x, house.z - z) < 5.5)) continue;
      const size = 0.9 + rand() * 0.35;
      matrix.compose(at.set(x, h - 0.1, z), rotation, scale.set(size, size * 2.3, size));
      stacks.setMatrixAt(placed, matrix);
      placed++;
    }
    stacks.count = placed;
    stacks.castShadow = true;
    stacks.receiveShadow = true;
    return stacks;
  }

  /** Pines on the slopes, broadleaf trees along the rivers and meadows (gold in autumn). */
  private buildTrees(): Group {
    const group = new Group();
    const matrix = new Matrix4();
    const rotation = new Quaternion();
    const scale = new Vector3();
    const at = new Vector3();
    const clearOf = (x: number, z: number, houseGap: number) =>
      !isReserved(x, z, 5) &&
      !nearAny(ROAD_SAMPLES, x, z, 3.6) &&
      !HOUSES.some((house) => Math.hypot(house.x - x, house.z - z) < houseGap);

    const pineCount = this.compact ? 800 : 1300;
    const coneGeometry = new ConeGeometry(1, 1, 7);
    coneGeometry.translate(0, 0.5, 0);
    const pines = new InstancedMesh(
      coneGeometry,
      new MeshStandardMaterial({ color: "#ffffff", roughness: 0.9, flatShading: true }),
      pineCount,
    );
    const pinePalette = ["#2d4535", "#355140", "#27392e", "#3d5a44"].map((hex) => new Color(hex));
    let rand = random(20261003);
    let placed = 0;
    for (let tries = 0; placed < pineCount && tries < pineCount * 40; tries++) {
      const x = (rand() - 0.5) * (WORLD_SIZE - 12);
      const z = (rand() - 0.5) * (WORLD_SIZE - 12);
      const h = heightAt(x, z);
      const rel = h - floorAt(x, z);
      if (rel < 1.6 || rel > 30 || h > 46) continue;
      const slope = Math.abs(heightAt(x + 1, z) - h) + Math.abs(heightAt(x, z + 1) - h);
      if (slope > 2.6) continue;
      // Denser forest on the slopes than at their foot.
      if (rand() > 0.22 + 0.7 * smoothstep(2, 12, rel)) continue;
      if (!clearOf(x, z, 4) || nearAny(RIVER_SAMPLES, x, z, 2.5)) continue;
      const height = 4.2 + rand() * 4.5;
      const radius = height * (0.24 + rand() * 0.08);
      matrix.compose(at.set(x, h - 0.3, z), rotation, scale.set(radius, height, radius));
      pines.setMatrixAt(placed, matrix);
      pines.setColorAt(placed, pinePalette[Math.floor(rand() * pinePalette.length)]);
      placed++;
    }
    pines.count = placed;

    const leafCount = this.compact ? 160 : 260;
    const blobGeometry = new IcosahedronGeometry(1, 0);
    blobGeometry.translate(0, 1.1, 0);
    const broadleaf = new InstancedMesh(
      blobGeometry,
      new MeshStandardMaterial({ color: "#ffffff", roughness: 0.9, flatShading: true }),
      leafCount,
    );
    const leafPalette = (AUTUMN ? ["#c98a2e", "#b5652a", "#d9a441", "#8f7a3a", "#6f7f3c"] : ["#5f8a3e", "#6e9a45", "#557c39", "#4c7036"]).map(
      (hex) => new Color(hex),
    );
    rand = random(5150);
    placed = 0;
    for (let tries = 0; placed < leafCount && tries < leafCount * 60; tries++) {
      const x = -60 + rand() * 120;
      const z = -100 + rand() * 230;
      const h = heightAt(x, z);
      if (h - floorAt(x, z) > 2.4) continue;
      // Mostly along the water, some scattered over the meadows.
      const byRiver = nearAny(RIVER_SAMPLES, x, z, 9);
      if (!byRiver && rand() > 0.18) continue;
      if (nearAny(RIVER_SAMPLES, x, z, 2)) continue;
      if (!clearOf(x, z, 3.5)) continue;
      const size = 1.2 + rand() * 1.1;
      matrix.compose(at.set(x, h - 0.2, z), rotation, scale.set(size, size * (1.1 + rand() * 0.4), size));
      broadleaf.setMatrixAt(placed, matrix);
      broadleaf.setColorAt(placed, leafPalette[Math.floor(rand() * leafPalette.length)]);
      placed++;
    }
    broadleaf.count = placed;

    for (const trees of [pines, broadleaf]) {
      trees.castShadow = true;
      trees.receiveShadow = true;
      group.add(trees);
    }
    return group;
  }

  private buildSnow(): Points {
    const count = this.compact ? 800 : 1600;
    const rand = random(7);
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 260;
      positions[i * 3 + 1] = rand() * 110;
      positions[i * 3 + 2] = (rand() - 0.5) * 260;
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    const snow = new Points(
      geometry,
      new PointsMaterial({ color: "#ffffff", size: 0.5, transparent: true, opacity: 0.8, depthWrite: false }),
    );
    snow.frustumCulled = false;
    return snow;
  }
}
