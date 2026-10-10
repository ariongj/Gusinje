/*
 * Procedural terrain for the illustrative 3D map of the Gusinje–Vusanje
 * valley. Pure maths (no three.js) so it is cheap to import and
 * deterministic: the same valley is generated on every visit.
 *
 * Orientation (illustrative, not to scale): +z is north and +x is west, so a
 * camera standing north of the valley and looking south up it sees west on
 * its right — as on the ground. Gusinje lies at the north end of the valley
 * floor, the road climbs south past Ali Pasha's Springs to the katun and
 * Vusanje, and the Ropojana runs on south-west to the border. Karanfili rises
 * west of the Ropojana, Zla Kolata on the Bjelič ridge to the south-east, and
 * Visitor to the north-west.
 */

export const WORLD_SIZE = 280;

export type XZ = { x: number; z: number };

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

function hash(x: number, y: number): number {
  let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

function valueNoise(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/** Fractal noise in roughly −1…1. */
export function fbm(x: number, y: number, octaves = 5): number {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    sum += amp * (valueNoise(x * freq, y * freq) * 2 - 1);
    freq *= 2.03;
    amp *= 0.5;
  }
  return sum;
}

/* ------------------------------------------------------------------ places */

/** Where things stand on the map (world units, +x west, +z north). */
export const PLACES = {
  hotel: { x: 8, z: 98 },
  gusinje: { x: 2, z: 68 },
  springs: { x: 28, z: 34 },
  katun: { x: -12, z: -34 },
  tower: { x: -22, z: -24 },
  vusanje: { x: 18, z: -56 },
  grlja: { x: 40, z: -62 },
  blueEye: { x: 56, z: -80 },
  ropojana: { x: 58, z: -112 },
  karanfili: { x: 98, z: -70 },
  zlaKolata: { x: -40, z: -116 },
} satisfies Record<string, XZ>;

/** The valley floor's centre line, north to south, with its flat half-width. */
const VALLEY: readonly (XZ & { w: number })[] = [
  { x: -52, z: 150, w: 30 },
  { x: -14, z: 112, w: 40 },
  { x: 4, z: 72, w: 50 },
  { x: 10, z: 24, w: 40 },
  { x: 0, z: -26, w: 34 },
  { x: 22, z: -58, w: 26 },
  { x: 48, z: -86, w: 18 },
  { x: 58, z: -118, w: 15 },
  { x: 62, z: -150, w: 14 },
];

/** Grbaja: a side valley running west from Gusinje under Karanfili's north wall. */
const GRBAJA: readonly (XZ & { w: number })[] = [
  { x: 10, z: 64, w: 14 },
  { x: 54, z: 40, w: 11 },
  { x: 92, z: 14, w: 9 },
  { x: 116, z: -6, w: 7 },
];

/** Distance from (x, z) to a polyline, with the half-width interpolated along it. */
function polylineDistance(line: readonly (XZ & { w: number })[], x: number, z: number) {
  let best = { d: Infinity, w: 0, t: 0 };
  let along = 0;
  let total = 0;
  for (let i = 0; i < line.length - 1; i++) total += Math.hypot(line[i + 1].x - line[i].x, line[i + 1].z - line[i].z);
  for (let i = 0; i < line.length - 1; i++) {
    const a = line[i];
    const b = line[i + 1];
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const len2 = dx * dx + dz * dz;
    const len = Math.sqrt(len2);
    const t = clamp01(((x - a.x) * dx + (z - a.z) * dz) / len2);
    const px = a.x + dx * t;
    const pz = a.z + dz * t;
    const d = Math.hypot(x - px, z - pz);
    if (d < best.d) best = { d, w: a.w + (b.w - a.w) * t, t: (along + len * t) / total };
    along += len;
  }
  return best;
}

type Peak = XZ & { h: number; r: number; sharp?: boolean };

const PEAKS: readonly Peak[] = [
  // Karanfili: three sharp limestone summits west of the Ropojana.
  { x: 92, z: -58, h: 38, r: 15, sharp: true },
  { x: 106, z: -74, h: 42, r: 16, sharp: true },
  { x: 86, z: -86, h: 35, r: 14, sharp: true },
  { x: 116, z: -46, h: 31, r: 18, sharp: true },
  // Bjelič on the border: Zla Kolata, Dobra Kolata and Maja Rosit.
  { x: -40, z: -116, h: 45, r: 18, sharp: true },
  { x: -24, z: -124, h: 42, r: 16, sharp: true },
  { x: -6, z: -130, h: 39, r: 16, sharp: true },
  { x: -62, z: -104, h: 34, r: 20 },
  // Peaks beyond the border, closing off the Ropojana.
  { x: 40, z: -150, h: 38, r: 24, sharp: true },
  { x: 86, z: -134, h: 35, r: 22, sharp: true },
  // The ridge east of the valley, between Gusinje and Vusanje.
  { x: -72, z: -30, h: 31, r: 30 },
  { x: -84, z: 30, h: 25, r: 30 },
  { x: -104, z: -70, h: 32, r: 26 },
  // The ridge between the valley and Grbaja.
  { x: 58, z: -8, h: 24, r: 24 },
  { x: 70, z: -36, h: 28, r: 22 },
  // Visitor, rounded, to the north-west; low hills towards Plav.
  { x: 94, z: 112, h: 28, r: 38 },
  { x: 120, z: 66, h: 21, r: 30 },
  { x: -98, z: 118, h: 15, r: 32 },
];

/** Grlja: the Skakavica falls over a rock step into a pool; above it the stream runs from Oko Skakavice. */
export const FALLS = (() => {
  const dx = PLACES.grlja.x - PLACES.blueEye.x;
  const dz = PLACES.grlja.z - PLACES.blueEye.z;
  const len = Math.hypot(dx, dz);
  /** Downstream direction. */
  const dir = { x: dx / len, z: dz / len };
  return { ...PLACES.grlja, dir, height: 7, halfWidth: 7 };
})();

/** Pools: Ali Pasha's Springs, Oko Skakavice and the plunge pool under Grlja. */
export const POOLS = {
  springs: { x: PLACES.springs.x, z: PLACES.springs.z, r: 7 },
  blueEye: { x: PLACES.blueEye.x, z: PLACES.blueEye.z, r: 4.2 },
  grlja: { x: FALLS.x + FALLS.dir.x * 3.4, z: FALLS.z + FALLS.dir.z * 3.4, r: 3.4 },
} satisfies Record<string, Pool>;

/**
 * The rock step at Grlja: the valley above the falls line (towards Oko
 * Skakavice and the Ropojana) stands higher. A cliff where the water falls,
 * easing into a slope further across the valley.
 */
function fallsStep(x: number, z: number): number {
  const rx = x - FALLS.x;
  const rz = z - FALLS.z;
  const along = rx * FALLS.dir.x + rz * FALLS.dir.z; // > 0 downstream
  const across = Math.abs(rx * -FALLS.dir.z + rz * FALLS.dir.x);
  const width = 0.5 + smoothstep(FALLS.halfWidth, FALLS.halfWidth + 14, across) * 12;
  return FALLS.height * (1 - smoothstep(-width, width * 0.4, along));
}

/** Height of the valley floor: it climbs gently from Gusinje to Vusanje and on up the Ropojana. */
function floorHeight(z: number): number {
  return 0.6 + smoothstep(110, -150, z) * 9;
}

function rawHeight(x: number, z: number): number {
  const valley = polylineDistance(VALLEY, x, z);
  const grbaja = polylineDistance(GRBAJA, x, z);
  const floor = floorHeight(z);

  // Slopes rise away from the valley floor (and the Grbaja side valley).
  const wallMain = smoothstep(valley.w, valley.w + 34, valley.d);
  const wallSide = smoothstep(grbaja.w, grbaja.w + 22, grbaja.d);
  const wall = Math.min(wallMain, 0.35 + 0.65 * wallSide);
  let h = floor + wall * 24;

  for (const p of PEAKS) {
    const d = Math.hypot(x - p.x, z - p.z) / p.r;
    // Sharp limestone peaks: a cone on broad shoulders. Rounded tops: a plain bell.
    h += p.sharp ? p.h * (0.6 * Math.exp(-d * 1.5) + 0.55 * Math.exp(-d * d)) : p.h * Math.exp(-d * d);
  }

  // Rougher rock the higher the ground; the valley floor stays gentle.
  const alpine = clamp01((h - floor) / 30);
  const ridged = 1 - Math.abs(fbm(x * 0.024, z * 0.024, 4));
  h += fbm(x * 0.035, z * 0.035) * (0.6 + alpine * 6) + ridged * ridged * alpine * 9;
  h += fbm(x * 0.09, z * 0.09, 2) * 0.35 * (1 - alpine);

  // The Grlja step lifts the valley floor above the falls; it fades out up the mountainsides.
  h += fallsStep(x, z) * (1 - smoothstep(10, 24, h - floor));
  return h;
}

/* ----------------------------------------------------------------- plots */

/** Flat building plots: centre, half extents, blend distance. */
export type Pad = XZ & { hw: number; hd: number; blend: number };

export const PADS: Record<"hotel" | "gusinje" | "katun" | "vusanje", Pad> = {
  hotel: { x: PLACES.hotel.x, z: PLACES.hotel.z, hw: 10, hd: 9, blend: 6 },
  gusinje: { x: PLACES.gusinje.x, z: PLACES.gusinje.z, hw: 22, hd: 18, blend: 10 },
  katun: { x: -13, z: -35, hw: 14, hd: 15, blend: 8 },
  vusanje: { x: PLACES.vusanje.x, z: PLACES.vusanje.z, hw: 11, hd: 9, blend: 7 },
};

/** Distance outside a pad's rectangle (0 inside). */
function padDistance(pad: Pad, x: number, z: number): number {
  const dx = Math.max(0, Math.abs(x - pad.x) - pad.hw);
  const dz = Math.max(0, Math.abs(z - pad.z) - pad.hd);
  return Math.hypot(dx, dz);
}

const padLevels = new Map<Pad, number>();

export function padLevel(pad: Pad): number {
  let level = padLevels.get(pad);
  if (level === undefined) {
    level = rawHeight(pad.x, pad.z);
    padLevels.set(pad, level);
  }
  return level;
}

export type Pool = XZ & { r: number };

const poolLevels = new Map<Pool, number>();

/** The water surface of a pool: a little below the natural ground at its centre. */
export function poolSurface(pool: Pool): number {
  let level = poolLevels.get(pool);
  if (level === undefined) {
    level = rawHeight(pool.x, pool.z) - 0.3;
    poolLevels.set(pool, level);
  }
  return level;
}

/** Ground height at (x, z), with building plots levelled and pools hollowed out. */
export function heightAt(x: number, z: number): number {
  let h = rawHeight(x, z);
  for (const pad of Object.values(PADS)) {
    const d = padDistance(pad, x, z);
    if (d >= pad.blend) continue;
    const w = 1 - smoothstep(0, pad.blend, d);
    h += (padLevel(pad) - h) * w;
  }
  for (const pool of Object.values(POOLS)) {
    const d = Math.hypot(x - pool.x, z - pool.z);
    if (d >= pool.r * 1.3) continue;
    const w = 1 - smoothstep(pool.r * 0.6, pool.r * 1.3, d);
    h += (poolSurface(pool) - 0.8 - h) * w;
  }
  return h;
}

/** Height of the valley floor at (x, z), Grlja step included — used to tell meadow from mountainside. */
export function floorAt(x: number, z: number): number {
  return floorHeight(z) + fallsStep(x, z);
}

/** Deterministic pseudo-random sequence (mulberry32). */
export function random(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** True when (x, z) is on (or next to) a building plot or a pool. */
export function isReserved(x: number, z: number, margin = 3): boolean {
  for (const pool of Object.values(POOLS)) {
    if (Math.hypot(x - pool.x, z - pool.z) < pool.r + margin) return true;
  }
  return Object.values(PADS).some((pad) => padDistance(pad, x, z) < margin);
}
