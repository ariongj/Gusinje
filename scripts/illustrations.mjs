// Illustrations made for this guide (used for the demo listings and the
// culture sections): node scripts/illustrations.mjs → public/illustrations/*.svg
//
// Every scene stands in front of the real outline of the peaks around Vusanje
// (src/content/skyline.ts, from elevation data), seen from a different
// direction for each picture, at a chosen time of day. Subjects: a wooden
// guest house, a stone kula, a katun, tents, a dinner terrace, coffee with a
// view, a hiker at a trail mark, a waterfall, food, honey and cheese …
// They are drawings, never presented as photos.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const OUT = join(ROOT, "public/illustrations");
mkdirSync(OUT, { recursive: true });

// The skyline layers (crest behind, nearer ridges in front), read from the generated module.
const src = readFileSync(join(ROOT, "src/content/skyline.ts"), "utf8");
const LAYERS = JSON.parse("[" + src.match(/layers: \[\n([\s\S]*?)\n  \],/)[1].replace(/,\s*$/, "") + "]");

const W = 1600;
const H = 1000;

/* ------------------------------------------------------------ randomness */

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* --------------------------------------------------------------- palette */

const TIMES = {
  day: { sky: ["#8fbfd8", "#cfe3ea", "#eef3ee"], sun: "#fff6d8", sunGlow: "#fff2c4", far: "#9fb6c4", mid: "#7f9a8c", near: "#5f7d62", hill: ["#86a86a", "#5e8550"], tree: "#2f4a35", light: false },
  golden: { sky: ["#e9b383", "#f4d3a8", "#f6ead2"], sun: "#fff1cf", sunGlow: "#ffd9a0", far: "#b3a3a6", mid: "#8f8a7a", near: "#6c7656", hill: ["#a4a45e", "#6f8048"], tree: "#33402a", light: false },
  dusk: { sky: ["#2f3f66", "#a8687a", "#f0b07e"], sun: "#ffd8a8", sunGlow: "#f7a26f", far: "#6d6a86", mid: "#4f5672", near: "#384a52", hill: ["#4f6650", "#34493b"], tree: "#1d2c26", light: true },
  dawn: { sky: ["#93a7cf", "#e7c6c4", "#f7e5d2"], sun: "#fff3e0", sunGlow: "#ffd2b8", far: "#a7aac0", mid: "#8a958f", near: "#68806a", hill: ["#8fa877", "#64845a"], tree: "#2f4436", light: false },
  night: { sky: ["#0d1b36", "#1f3358", "#3b4f73"], sun: "#f4f1e4", sunGlow: "#9fb3d8", far: "#3c4a68", mid: "#2b3a52", near: "#22303f", hill: ["#2a3d36", "#1c2b27"], tree: "#121c1a", light: true },
};

/* ------------------------------------------------------------- helpers */

const f = (n) => Math.round(n * 10) / 10;
const path = (pts) => "M" + pts.map(([x, y]) => `${f(x)},${f(y)}`).join(" L");

/** A slice of a skyline layer stretched over the width, between y0 (lowest) and y1 (highest). */
function ridge(layer, start, span, y0, y1) {
  const n = layer.length;
  const a = Math.floor(start * (n - 1));
  const b = Math.min(n - 1, a + Math.floor(span * (n - 1)));
  const slice = layer.slice(a, b + 1);
  const lo = Math.min(...LAYERS[LAYERS.length - 1]);
  const hi = Math.max(...LAYERS[0]);
  return slice.map((h, i) => [(i / (slice.length - 1)) * W, y0 - ((h - lo) / (hi - lo)) * (y0 - y1)]);
}

/** Above this line the far crest is white: caps that follow the ridge, thicker on the higher peaks. */
function snowClip(far, snowline) {
  const edge = far.map(([x, y]) => [x, y + Math.max(0, Math.min(95, (snowline - y) * 0.75 + (y < snowline ? 8 : 0)))]);
  return `${path([[0, 0], ...edge, [W, 0]])} Z`;
}

function closed(pts) {
  return `${path([[0, H], ...pts, [W, H]])} Z`;
}

/** Smooth rolling hill line. */
function hill(r, base, amp, waves) {
  const pts = [];
  const ph = r() * Math.PI * 2;
  const ph2 = r() * Math.PI * 2;
  for (let x = 0; x <= W; x += 20) {
    const y = base + Math.sin((x / W) * Math.PI * waves + ph) * amp + Math.sin((x / W) * Math.PI * waves * 2.3 + ph2) * amp * 0.35;
    pts.push([x, y]);
  }
  return pts;
}

function yAt(pts, x) {
  for (let i = 1; i < pts.length; i++) {
    if (pts[i][0] >= x) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0 || 1);
    }
  }
  return pts[pts.length - 1][1];
}

function pine(x, y, h, color) {
  const w = h * 0.42;
  return `<path d="M${f(x)},${f(y - h)} L${f(x + w * 0.55)},${f(y - h * 0.55)} L${f(x + w * 0.3)},${f(y - h * 0.55)} L${f(x + w * 0.75)},${f(y - h * 0.2)} L${f(x + w * 0.42)},${f(y - h * 0.2)} L${f(x + w)},${f(y)} L${f(x - w)},${f(y)} L${f(x - w * 0.42)},${f(y - h * 0.2)} L${f(x - w * 0.75)},${f(y - h * 0.2)} L${f(x - w * 0.3)},${f(y - h * 0.55)} L${f(x - w * 0.55)},${f(y - h * 0.55)} Z" fill="${color}"/>`;
}

function haystack(x, y, s) {
  return `<g><line x1="${f(x)}" y1="${f(y - s * 1.25)}" x2="${f(x)}" y2="${f(y)}" stroke="#4a3626" stroke-width="${f(s * 0.06)}"/><path d="M${f(x - s * 0.5)},${f(y)} C${f(x - s * 0.5)},${f(y - s * 0.7)} ${f(x - s * 0.18)},${f(y - s * 1.05)} ${f(x)},${f(y - s * 1.08)} C${f(x + s * 0.18)},${f(y - s * 1.05)} ${f(x + s * 0.5)},${f(y - s * 0.7)} ${f(x + s * 0.5)},${f(y)} Z" fill="#b99653"/><path d="M${f(x - s * 0.5)},${f(y)} C${f(x - s * 0.5)},${f(y - s * 0.7)} ${f(x - s * 0.18)},${f(y - s * 1.05)} ${f(x)},${f(y - s * 1.08)} L${f(x)},${f(y)} Z" fill="#cdae6a"/></g>`;
}

function sheep(x, y, s) {
  return `<g><ellipse cx="${f(x)}" cy="${f(y - s * 0.45)}" rx="${f(s * 0.62)}" ry="${f(s * 0.4)}" fill="#f4f1e8"/><ellipse cx="${f(x + s * 0.62)}" cy="${f(y - s * 0.55)}" rx="${f(s * 0.2)}" ry="${f(s * 0.16)}" fill="#3b3430"/><rect x="${f(x - s * 0.35)}" y="${f(y - s * 0.12)}" width="${f(s * 0.08)}" height="${f(s * 0.14)}" fill="#3b3430"/><rect x="${f(x + s * 0.28)}" y="${f(y - s * 0.12)}" width="${f(s * 0.08)}" height="${f(s * 0.14)}" fill="#3b3430"/></g>`;
}

/* ------------------------------------------------------------- subjects */

function chalet(x, y, s, t) {
  const glow = t.light ? "#ffd27a" : "#2b3a40";
  const w = s * 2.2;
  const h = s * 1.1;
  return `<g>
  <rect x="${f(x - w / 2)}" y="${f(y - h)}" width="${f(w)}" height="${f(h)}" fill="#8a5a3b"/>
  ${Array.from({ length: 6 }, (_, i) => `<line x1="${f(x - w / 2)}" y1="${f(y - h + (i + 1) * (h / 7))}" x2="${f(x + w / 2)}" y2="${f(y - h + (i + 1) * (h / 7))}" stroke="#734a30" stroke-width="2"/>`).join("")}
  <path d="M${f(x - w / 2 - s * 0.35)},${f(y - h + 4)} L${f(x)},${f(y - h - s * 1.05)} L${f(x + w / 2 + s * 0.35)},${f(y - h + 4)} Z" fill="#3a2a22"/>
  <path d="M${f(x - w / 2 - s * 0.35)},${f(y - h + 4)} L${f(x)},${f(y - h - s * 1.05)} L${f(x)},${f(y - h - s * 0.9)} L${f(x - w / 2 - s * 0.18)},${f(y - h + 4)} Z" fill="#4c372c"/>
  <rect x="${f(x - w * 0.36)}" y="${f(y - h * 0.72)}" width="${f(s * 0.36)}" height="${f(s * 0.36)}" fill="${glow}" stroke="#5a3b28" stroke-width="4"/>
  <rect x="${f(x + w * 0.2)}" y="${f(y - h * 0.72)}" width="${f(s * 0.36)}" height="${f(s * 0.36)}" fill="${glow}" stroke="#5a3b28" stroke-width="4"/>
  <rect x="${f(x - s * 0.18)}" y="${f(y - h * 0.62)}" width="${f(s * 0.36)}" height="${f(h * 0.62)}" fill="#4a3022"/>
  <rect x="${f(x - s * 0.12)}" y="${f(y - h - s * 0.62)}" width="${f(s * 0.24)}" height="${f(s * 0.3)}" fill="${glow}" stroke="#5a3b28" stroke-width="3"/>
  <rect x="${f(x + w * 0.22)}" y="${f(y - h - s * 0.95)}" width="${f(s * 0.16)}" height="${f(s * 0.45)}" fill="#5b4a40"/>
  <path d="M${f(x + w * 0.3)},${f(y - h - s * 1.0)} c 10,-30 -14,-40 4,-70 c 14,-24 -6,-40 10,-62" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="7" stroke-linecap="round"/>
  <line x1="${f(x - w / 2 - s * 0.6)}" y1="${f(y - s * 0.28)}" x2="${f(x + w / 2 + s * 0.6)}" y2="${f(y - s * 0.28)}" stroke="#6b4a33" stroke-width="5"/>
  ${Array.from({ length: 12 }, (_, i) => `<line x1="${f(x - w / 2 - s * 0.6 + i * ((w + s * 1.2) / 11))}" y1="${f(y - s * 0.4)}" x2="${f(x - w / 2 - s * 0.6 + i * ((w + s * 1.2) / 11))}" y2="${f(y)}" stroke="#6b4a33" stroke-width="5"/>`).join("")}
</g>`;
}

function kula(x, y, s, t) {
  const glow = t.light ? "#ffd27a" : "#3a3a3a";
  const w = s * 1.25;
  const h = s * 2.6;
  const win = (wx, wy) => `<rect x="${f(wx)}" y="${f(wy)}" width="${f(s * 0.16)}" height="${f(s * 0.26)}" rx="${f(s * 0.08)}" fill="${glow}"/>`;
  return `<g>
  <rect x="${f(x - w / 2)}" y="${f(y - h)}" width="${f(w)}" height="${f(h)}" fill="#d8ccb6"/>
  <rect x="${f(x - w / 2)}" y="${f(y - h)}" width="${f(w * 0.28)}" height="${f(h)}" fill="#c4b69c"/>
  ${Array.from({ length: 9 }, (_, i) => `<line x1="${f(x - w / 2)}" y1="${f(y - h + (i + 1) * (h / 10))}" x2="${f(x + w / 2)}" y2="${f(y - h + (i + 1) * (h / 10))}" stroke="#bfb196" stroke-width="2"/>`).join("")}
  <path d="M${f(x - w / 2 - s * 0.2)},${f(y - h)} L${f(x)},${f(y - h - s * 0.75)} L${f(x + w / 2 + s * 0.2)},${f(y - h)} Z" fill="#7b3f2c"/>
  ${win(x - s * 0.36, y - h * 0.82)}${win(x + s * 0.2, y - h * 0.82)}${win(x - s * 0.08, y - h * 0.58)}${win(x - s * 0.36, y - h * 0.36)}${win(x + s * 0.2, y - h * 0.36)}
  <path d="M${f(x - s * 0.2)},${f(y)} L${f(x - s * 0.2)},${f(y - s * 0.4)} Q${f(x)},${f(y - s * 0.62)} ${f(x + s * 0.2)},${f(y - s * 0.4)} L${f(x + s * 0.2)},${f(y)} Z" fill="#4a3022"/>
  <rect x="${f(x + w / 2)}" y="${f(y - s * 0.95)}" width="${f(s * 1.5)}" height="${f(s * 0.95)}" fill="#cfc2a9"/>
  <path d="M${f(x + w / 2 - 6)},${f(y - s * 0.95)} L${f(x + w / 2 + s * 0.75)},${f(y - s * 1.45)} L${f(x + w / 2 + s * 1.6)},${f(y - s * 0.95)} Z" fill="#8a4a33"/>
  ${win(x + w / 2 + s * 0.35, y - s * 0.68)}${win(x + w / 2 + s * 0.95, y - s * 0.68)}
</g>`;
}

function hut(x, y, s, roof) {
  return `<g><rect x="${f(x - s * 0.7)}" y="${f(y - s * 0.75)}" width="${f(s * 1.4)}" height="${f(s * 0.75)}" fill="#7d5536"/><path d="M${f(x - s * 0.95)},${f(y - s * 0.7)} L${f(x)},${f(y - s * 1.55)} L${f(x + s * 0.95)},${f(y - s * 0.7)} Z" fill="${roof}"/><rect x="${f(x - s * 0.14)}" y="${f(y - s * 0.48)}" width="${f(s * 0.28)}" height="${f(s * 0.48)}" fill="#3e2a1d"/></g>`;
}

function tent(x, y, s, color, t) {
  return `<g><path d="M${f(x - s)},${f(y)} L${f(x)},${f(y - s * 1.2)} L${f(x + s)},${f(y)} Z" fill="${color}"/><path d="M${f(x)},${f(y - s * 1.2)} L${f(x + s)},${f(y)} L${f(x + s * 0.3)},${f(y)} Z" fill="rgba(0,0,0,0.18)"/><path d="M${f(x - s * 0.22)},${f(y)} L${f(x)},${f(y - s * 0.55)} L${f(x + s * 0.22)},${f(y)} Z" fill="${t.light ? "#ffcf7a" : "#2b2b2b"}"/></g>`;
}

function terrace(x, y, s, t) {
  const bulbs = Array.from({ length: 14 }, (_, i) => {
    const bx = x - s * 3.2 + i * ((s * 6.4) / 13);
    const by = y - s * 2.15 + Math.sin((i / 13) * Math.PI) * s * 0.35;
    return `<circle cx="${f(bx)}" cy="${f(by)}" r="${f(s * 0.07)}" fill="#ffe1a0"/><circle cx="${f(bx)}" cy="${f(by)}" r="${f(s * 0.18)}" fill="#ffd27a" opacity="${t.light ? 0.35 : 0.12}"/>`;
  }).join("");
  const table = (tx) =>
    `<rect x="${f(tx - s * 0.8)}" y="${f(y - s * 0.62)}" width="${f(s * 1.6)}" height="${f(s * 0.1)}" fill="#6b4a33"/><rect x="${f(tx - s * 0.7)}" y="${f(y - s * 0.52)}" width="${f(s * 0.08)}" height="${f(s * 0.52)}" fill="#5a3d2a"/><rect x="${f(tx + s * 0.62)}" y="${f(y - s * 0.52)}" width="${f(s * 0.08)}" height="${f(s * 0.52)}" fill="#5a3d2a"/><ellipse cx="${f(tx - s * 0.35)}" cy="${f(y - s * 0.66)}" rx="${f(s * 0.16)}" ry="${f(s * 0.04)}" fill="#f4efe6"/><ellipse cx="${f(tx + s * 0.3)}" cy="${f(y - s * 0.66)}" rx="${f(s * 0.16)}" ry="${f(s * 0.04)}" fill="#f4efe6"/><rect x="${f(tx - s * 0.04)}" y="${f(y - s * 0.86)}" width="${f(s * 0.08)}" height="${f(s * 0.2)}" fill="#a8432c"/>`;
  return `<g>
  <rect x="${f(x - s * 3.6)}" y="${f(y - s * 0.05)}" width="${f(s * 7.2)}" height="${f(s * 0.12)}" fill="#5a3d2a"/>
  <line x1="${f(x - s * 3.3)}" y1="${f(y)}" x2="${f(x - s * 3.3)}" y2="${f(y - s * 2.3)}" stroke="#4a3022" stroke-width="${f(s * 0.08)}"/>
  <line x1="${f(x + s * 3.3)}" y1="${f(y)}" x2="${f(x + s * 3.3)}" y2="${f(y - s * 2.3)}" stroke="#4a3022" stroke-width="${f(s * 0.08)}"/>
  <path d="M${f(x - s * 3.3)},${f(y - s * 2.15)} Q${f(x)},${f(y - s * 1.6)} ${f(x + s * 3.3)},${f(y - s * 2.15)}" fill="none" stroke="#2b2b2b" stroke-width="2"/>
  ${bulbs}${table(x - s * 1.6)}${table(x + s * 1.6)}
</g>`;
}

function coffee(x, y, s) {
  return `<g>
  <rect x="${f(x - s * 3)}" y="${f(y)}" width="${f(s * 6)}" height="${f(s * 0.25)}" fill="#6b4a33"/>
  <path d="M${f(x - s * 1.3)},${f(y)} L${f(x - s * 1.45)},${f(y - s * 0.95)} L${f(x - s * 0.45)},${f(y - s * 0.95)} L${f(x - s * 0.6)},${f(y)} Z" fill="#b87333"/>
  <path d="M${f(x - s * 0.5)},${f(y - s * 0.85)} L${f(x + s * 0.25)},${f(y - s * 1.05)}" stroke="#7a4a22" stroke-width="${f(s * 0.12)}" stroke-linecap="round"/>
  <path d="M${f(x + s * 0.5)},${f(y)} L${f(x + s * 0.42)},${f(y - s * 0.5)} L${f(x + s * 1.18)},${f(y - s * 0.5)} L${f(x + s * 1.1)},${f(y)} Z" fill="#f6f1e7"/>
  <path d="M${f(x + s * 1.15)},${f(y - s * 0.4)} q ${f(s * 0.32)},${f(s * 0.05)} 0,${f(s * 0.3)}" fill="none" stroke="#f6f1e7" stroke-width="${f(s * 0.07)}"/>
  <ellipse cx="${f(x + s * 0.8)}" cy="${f(y + 2)}" rx="${f(s * 0.55)}" ry="${f(s * 0.08)}" fill="#e9e2d4"/>
  <rect x="${f(x + s * 0.46)}" y="${f(y - s * 0.5)}" width="${f(s * 0.68)}" height="${f(s * 0.08)}" fill="#a8432c"/>
  <path d="M${f(x + s * 0.75)},${f(y - s * 0.62)} c 8,-20 -10,-28 2,-48 M${f(x + s * 0.92)},${f(y - s * 0.62)} c 8,-20 -10,-28 2,-48" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="5" stroke-linecap="round"/>
  <path d="M${f(x + s * 1.6)},${f(y)} c 0,-${f(s * 0.3)} ${f(s * 0.8)},-${f(s * 0.3)} ${f(s * 0.8)},0 Z" fill="#d9a35b"/>
</g>`;
}

function hiker(x, y, s) {
  return `<g fill="#1f2a2a">
  <circle cx="${f(x)}" cy="${f(y - s * 1.75)}" r="${f(s * 0.16)}"/>
  <path d="M${f(x - s * 0.18)},${f(y - s * 1.55)} L${f(x + s * 0.2)},${f(y - s * 1.55)} L${f(x + s * 0.24)},${f(y - s * 0.85)} L${f(x - s * 0.2)},${f(y - s * 0.85)} Z"/>
  <path d="M${f(x - s * 0.42)},${f(y - s * 1.6)} L${f(x - s * 0.12)},${f(y - s * 1.62)} L${f(x - s * 0.12)},${f(y - s * 0.95)} L${f(x - s * 0.46)},${f(y - s * 1.0)} Z" fill="#a8432c"/>
  <path d="M${f(x - s * 0.15)},${f(y - s * 0.88)} L${f(x - s * 0.35)},${f(y)} L${f(x - s * 0.2)},${f(y)} L${f(x)},${f(y - s * 0.6)} L${f(x + s * 0.22)},${f(y)} L${f(x + s * 0.38)},${f(y)} L${f(x + s * 0.16)},${f(y - s * 0.88)} Z"/>
  <line x1="${f(x + s * 0.22)}" y1="${f(y - s * 1.3)}" x2="${f(x + s * 0.62)}" y2="${f(y)}" stroke="#1f2a2a" stroke-width="${f(s * 0.05)}"/>
</g>`;
}

/** The red-and-white trail blaze painted on rocks along marked paths. */
function blaze(x, y, s) {
  return `<g><path d="M${f(x - s * 1.1)},${f(y)} Q${f(x - s * 1.2)},${f(y - s * 1.1)} ${f(x - s * 0.2)},${f(y - s * 1.25)} Q${f(x + s * 1.2)},${f(y - s * 1.3)} ${f(x + s * 1.25)},${f(y)} Z" fill="#9b9890"/><path d="M${f(x - s * 1.1)},${f(y)} Q${f(x - s * 1.2)},${f(y - s * 1.1)} ${f(x - s * 0.2)},${f(y - s * 1.25)} L${f(x - s * 0.1)},${f(y)} Z" fill="#b1aea6"/><circle cx="${f(x)}" cy="${f(y - s * 0.62)}" r="${f(s * 0.36)}" fill="#c0392b"/><circle cx="${f(x)}" cy="${f(y - s * 0.62)}" r="${f(s * 0.2)}" fill="#fbfaf7"/></g>`;
}

function waterfall(x, y, s, t) {
  const strands = Array.from({ length: 7 }, (_, i) => {
    const sx = x - s * 0.45 + i * s * 0.15;
    return `<path d="M${f(sx)},${f(y - s * 3)} C${f(sx + 6)},${f(y - s * 2)} ${f(sx - 6)},${f(y - s * 1)} ${f(sx + 4)},${f(y - s * 0.1)}" fill="none" stroke="${i % 2 ? "#e8f4f7" : "#cfe6ee"}" stroke-width="${f(s * 0.09)}" stroke-linecap="round" opacity="0.92"/>`;
  }).join("");
  return `<g>
  <path d="M${f(x - s * 2.6)},${f(y)} L${f(x - s * 2.2)},${f(y - s * 3.3)} L${f(x - s * 0.55)},${f(y - s * 3.1)} L${f(x - s * 0.5)},${f(y)} Z" fill="#6f6d68"/>
  <path d="M${f(x + s * 0.5)},${f(y)} L${f(x + s * 0.55)},${f(y - s * 3.0)} L${f(x + s * 2.3)},${f(y - s * 3.4)} L${f(x + s * 2.7)},${f(y)} Z" fill="#5d5b56"/>
  ${strands}
  <ellipse cx="${f(x)}" cy="${f(y + s * 0.15)}" rx="${f(s * 1.6)}" ry="${f(s * 0.32)}" fill="${t.light ? "#2c5b6e" : "#3b8fa8"}"/>
  <ellipse cx="${f(x)}" cy="${f(y + s * 0.05)}" rx="${f(s * 0.7)}" ry="${f(s * 0.14)}" fill="#e8f4f7" opacity="0.7"/>
</g>`;
}

/** A mountain lake with the peaks mirrored in it. */
function lake(x, y, s, t) {
  return `<g>
  <ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(s * 5.2)}" ry="${f(s * 0.95)}" fill="${t.light ? "#2c5b6e" : "#4f9bb5"}"/>
  <ellipse cx="${f(x)}" cy="${f(y - s * 0.05)}" rx="${f(s * 4.6)}" ry="${f(s * 0.7)}" fill="${t.light ? "#356b80" : "#6db3c9"}"/>
  <path d="M${f(x - s * 2.4)},${f(y - s * 0.3)} L${f(x - s * 1.6)},${f(y + s * 0.35)} L${f(x - s * 0.8)},${f(y - s * 0.3)} Z" fill="rgba(255,255,255,0.25)"/>
  <path d="M${f(x + s * 0.4)},${f(y - s * 0.35)} L${f(x + s * 1.5)},${f(y + s * 0.45)} L${f(x + s * 2.6)},${f(y - s * 0.35)} Z" fill="rgba(255,255,255,0.22)"/>
  ${Array.from({ length: 6 }, (_, i) => `<line x1="${f(x - s * 3.5 + i * s * 1.3)}" y1="${f(y + s * 0.15 + (i % 2) * 14)}" x2="${f(x - s * 2.9 + i * s * 1.3)}" y2="${f(y + s * 0.15 + (i % 2) * 14)}" stroke="rgba(255,255,255,0.55)" stroke-width="4" stroke-linecap="round"/>`).join("")}
</g>`;
}

function shelf(x, y, s) {
  const jar = (jx) => `<rect x="${f(jx)}" y="${f(y - s * 0.8)}" width="${f(s * 0.5)}" height="${f(s * 0.62)}" rx="${f(s * 0.08)}" fill="#d9952b"/><rect x="${f(jx - 2)}" y="${f(y - s * 0.92)}" width="${f(s * 0.54)}" height="${f(s * 0.14)}" fill="#a8432c"/><rect x="${f(jx + s * 0.08)}" y="${f(y - s * 0.6)}" width="${f(s * 0.34)}" height="${f(s * 0.22)}" fill="#f6eedd"/>`;
  return `<g>
  <rect x="${f(x - s * 3)}" y="${f(y - s * 0.18)}" width="${f(s * 6)}" height="${f(s * 0.2)}" fill="#6b4a33"/>
  ${jar(x - s * 2.6)}${jar(x - s * 1.9)}${jar(x - s * 1.2)}
  <ellipse cx="${f(x + s * 0.9)}" cy="${f(y - s * 0.2)}" rx="${f(s * 1.1)}" ry="${f(s * 0.22)}" fill="#e9cf8f"/>
  <rect x="${f(x - s * 0.2)}" y="${f(y - s * 0.75)}" width="${f(s * 2.2)}" height="${f(s * 0.55)}" fill="#f0d898"/>
  <ellipse cx="${f(x + s * 0.9)}" cy="${f(y - s * 0.75)}" rx="${f(s * 1.1)}" ry="${f(s * 0.22)}" fill="#f7e6b0"/>
  <path d="M${f(x + s * 0.9)},${f(y - s * 0.75)} L${f(x + s * 2)},${f(y - s * 0.75)} L${f(x + s * 2)},${f(y - s * 0.2)} Z" fill="#e2c378"/>
</g>`;
}

/** Food, seen from above: a round tray on a wooden table. */
function dish(kind, r) {
  const cx = W / 2;
  const cy = H / 2 + 20;
  const R = 300;
  let inner = "";
  if (kind === "flija") {
    inner = Array.from({ length: 9 }, (_, i) => `<circle cx="${cx}" cy="${cy}" r="${f(R * 0.92 - i * 28)}" fill="${i % 2 ? "#e2b46a" : "#cf9a4e"}"/>`).join("");
    inner += Array.from({ length: 8 }, (_, i) => `<line x1="${cx}" y1="${cy}" x2="${f(cx + Math.cos((i / 8) * Math.PI * 2) * R * 0.92)}" y2="${f(cy + Math.sin((i / 8) * Math.PI * 2) * R * 0.92)}" stroke="#a87436" stroke-width="3"/>`).join("");
  } else if (kind === "burek") {
    let d = "";
    for (let a = 0; a < Math.PI * 9; a += 0.08) {
      const rr = 14 + a * 9.8;
      d += `${a === 0 ? "M" : "L"}${f(cx + Math.cos(a) * rr)},${f(cy + Math.sin(a) * rr)} `;
    }
    inner = `<circle cx="${cx}" cy="${cy}" r="${f(R * 0.95)}" fill="#d9a85c"/><path d="${d}" fill="none" stroke="#b47a35" stroke-width="16" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#f0c77e" stroke-width="5" stroke-linecap="round"/>`;
  } else if (kind === "trout") {
    inner = `<ellipse cx="${cx}" cy="${cy}" rx="${f(R * 0.95)}" ry="${f(R * 0.95)}" fill="#f4efe6"/>
    <path d="M${cx - 220},${cy} C${cx - 120},${cy - 110} ${cx + 110},${cy - 100} ${cx + 170},${cy} C${cx + 110},${cy + 100} ${cx - 120},${cy + 110} ${cx - 220},${cy} Z" fill="#b9a07e"/>
    <path d="M${cx + 160},${cy} L${cx + 250},${cy - 70} L${cx + 240},${cy} L${cx + 250},${cy + 70} Z" fill="#a88e6b"/>
    ${Array.from({ length: 14 }, () => `<circle cx="${f(cx - 150 + r() * 280)}" cy="${f(cy - 40 + r() * 80)}" r="${f(3 + r() * 4)}" fill="#7a5d40"/>`).join("")}
    <circle cx="${cx - 175}" cy="${cy - 12}" r="9" fill="#2b2b2b"/>
    <path d="M${cx - 60},${cy + 150} q 40,-30 80,0 q 40,30 80,0" fill="none" stroke="#5e8550" stroke-width="12" stroke-linecap="round"/>
    <circle cx="${cx + 170}" cy="${cy + 150}" r="34" fill="#f3d36b"/><circle cx="${cx + 170}" cy="${cy + 150}" r="22" fill="#f7e49a"/>`;
  } else {
    // cheese, bread and honey board
    inner = `<rect x="${cx - 260}" y="${cy - 170}" width="520" height="340" rx="40" fill="#b8855a"/>
    <path d="M${cx - 200},${cy + 80} L${cx - 40},${cy - 100} L${cx - 10},${cy + 80} Z" fill="#f2dc8f"/>
    ${Array.from({ length: 6 }, () => `<circle cx="${f(cx - 120 + r() * 80)}" cy="${f(cy + r() * 60)}" r="${f(6 + r() * 6)}" fill="#e2c26a"/>`).join("")}
    <ellipse cx="${cx + 120}" cy="${cy - 40}" rx="100" ry="70" fill="#c98b45"/><ellipse cx="${cx + 120}" cy="${cy - 50}" rx="86" ry="55" fill="#dfa860"/>
    <circle cx="${cx + 150}" cy="${cy + 100}" r="44" fill="#d9952b"/><circle cx="${cx + 150}" cy="${cy + 100}" r="30" fill="#e8b04a"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs><linearGradient id="wood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7b5236"/><stop offset="1" stop-color="#5a3a26"/></linearGradient>
<radialGradient id="lamp" cx="0.5" cy="0.4" r="0.7"><stop offset="0" stop-color="#fff3d8" stop-opacity="0.35"/><stop offset="1" stop-color="#000" stop-opacity="0.25"/></radialGradient></defs>
<rect width="${W}" height="${H}" fill="url(#wood)"/>
${Array.from({ length: 9 }, (_, i) => `<line x1="0" y1="${i * 125 + 40}" x2="${W}" y2="${i * 125 + 40 + (r() - 0.5) * 30}" stroke="#4e3220" stroke-width="3" opacity="0.5"/>`).join("")}
<rect x="80" y="70" width="${W - 160}" height="${H - 140}" rx="28" fill="none" stroke="#a8432c" stroke-width="10" stroke-dasharray="26 14" opacity="0.45"/>
<circle cx="${cx + 8}" cy="${cy + 14}" r="${R + 10}" fill="rgba(0,0,0,0.25)"/>
<circle cx="${cx}" cy="${cy}" r="${R + 6}" fill="#f6f1e7"/>
${inner}
<rect width="${W}" height="${H}" fill="url(#lamp)"/>
</svg>`;
}

/* --------------------------------------------------------------- scenes */

function scene({ seed, time = "day", view = 0.3, subject, snow = true }) {
  const r = rng(seed);
  const t = TIMES[time];
  const span = 0.42 + r() * 0.12;
  const far = ridge(LAYERS[0], view, span, 560, 170);
  const mid = ridge(LAYERS[1], view, span, 620, 300);
  const near = ridge(LAYERS[2], view, span, 680, 420);
  const h1 = hill(r, 700, 26, 1.2 + r());
  const h2 = hill(r, 780, 18, 1.6 + r());
  const sunX = 200 + r() * 1200;
  const sunY = time === "day" ? 180 : time === "night" ? 160 : 330;
  const stars =
    time === "night"
      ? Array.from({ length: 70 }, () => `<circle cx="${f(r() * W)}" cy="${f(r() * 420)}" r="${f(0.8 + r() * 1.8)}" fill="#fff" opacity="${f(0.4 + r() * 0.6)}"/>`).join("")
      : "";
  const trees = [];
  for (let i = 0; i < 26; i++) {
    const x = r() * W;
    const onFar = i < 16;
    const line = onFar ? h1 : h2;
    const y = yAt(line, x) + (onFar ? 6 : 10);
    if (subject && Math.abs(x - subject.x) < subject.clear) continue;
    trees.push(pine(x, y, onFar ? 50 + r() * 40 : 80 + r() * 50, t.tree));
  }
  const extras = [];
  if (subject?.haystacks) for (let i = 0; i < subject.haystacks; i++) extras.push(haystack(120 + r() * 360 + (i % 2) * 980, yAt(h2, 300) + 40 + r() * 30, 70 + r() * 30));
  if (subject?.sheep) for (let i = 0; i < subject.sheep; i++) extras.push(sheep(subject.x + (r() - 0.5) * 700, 900 + r() * 50, 38 + r() * 10));
  const fg = subject ? subject.draw(subject.x, subject.y, t, r) : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.sky[0]}"/><stop offset="0.55" stop-color="${t.sky[1]}"/><stop offset="1" stop-color="${t.sky[2]}"/></linearGradient>
  <radialGradient id="glow" cx="${f(sunX / W)}" cy="${f(sunY / H)}" r="0.45"><stop offset="0" stop-color="${t.sunGlow}" stop-opacity="0.85"/><stop offset="1" stop-color="${t.sunGlow}" stop-opacity="0"/></radialGradient>
  <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="${t.sky[2]}" stop-opacity="0.55"/></linearGradient>
  <linearGradient id="meadow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.hill[0]}"/><stop offset="1" stop-color="${t.hill[1]}"/></linearGradient>
  <clipPath id="snow"><path d="${snowClip(far, 250 + r() * 40)}"/></clipPath>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0"/></filter>
</defs>
<rect width="${W}" height="${H}" fill="url(#sky)"/>
${stars}
<rect width="${W}" height="${H}" fill="url(#glow)"/>
<circle cx="${f(sunX)}" cy="${f(sunY)}" r="${time === "night" ? 38 : 54}" fill="${t.sun}"/>
<path d="${closed(far)}" fill="${t.far}"/>
${snow && time !== "night" ? `<path d="${closed(far)}" fill="#fbfaf7" opacity="0.88" clip-path="url(#snow)"/>` : ""}
<rect y="300" width="${W}" height="400" fill="url(#haze)"/>
<path d="${closed(mid)}" fill="${t.mid}"/>
<path d="${closed(near)}" fill="${t.near}"/>
<path d="${closed(h1)}" fill="url(#meadow)"/>
${trees.slice(0, 16).join("")}
<path d="${closed(h2)}" fill="${t.hill[1]}"/>
${trees.slice(16).join("")}
${extras.join("")}
${fg}
<rect y="${H - 60}" width="${W}" height="60" fill="${t.hill[1]}" opacity="0.6"/>
<rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.6"/>
</svg>`;
}

/* ----------------------------------------------------------- the set */

const at = (draw, x = 800, y = 900, clear = 380, more = {}) => ({ draw, x, y, clear, ...more });

const SCENES = {
  "guesthouse-dusk": { seed: 11, time: "dusk", view: 0.18, subject: at((x, y, t) => chalet(x, y, 150, t), 820, 905, 420, { sheep: 0 }) },
  "guesthouse-day": { seed: 12, time: "day", view: 0.48, subject: at((x, y, t) => chalet(x, y, 140, t), 700, 905, 400, { haystacks: 2 }) },
  "kula-golden": { seed: 21, time: "golden", view: 0.3, subject: at((x, y, t) => kula(x, y, 150, t), 700, 905, 420) },
  "kula-dusk": { seed: 22, time: "dusk", view: 0.55, subject: at((x, y, t) => kula(x, y, 140, t), 760, 905, 420) },
  "katun-day": {
    seed: 31,
    time: "day",
    view: 0.62,
    subject: at((x, y) => hut(x - 260, y - 10, 120, "#3a2a22") + hut(x + 40, y + 10, 140, "#4c372c") + hut(x + 330, y - 20, 110, "#3a2a22"), 760, 900, 560, { sheep: 5 }),
  },
  "katun-dawn": { seed: 32, time: "dawn", view: 0.08, subject: at((x, y) => hut(x - 150, y, 130, "#3a2a22") + hut(x + 170, y - 15, 115, "#4c372c"), 820, 900, 460, { sheep: 3, haystacks: 1 }) },
  "camp-night": {
    seed: 41,
    time: "night",
    view: 0.4,
    subject: at((x, y, t) => tent(x - 230, y, 110, "#c0612b", t) + tent(x + 40, y + 10, 130, "#1f7a9a", t) + tent(x + 300, y - 5, 100, "#b8894a", t) + `<circle cx="${x + 160}" cy="${y + 30}" r="90" fill="#ffb05c" opacity="0.18"/><path d="M${x + 135},${y + 40} L${x + 160},${y - 15} L${x + 185},${y + 40} Z" fill="#ffb05c"/>`, 760, 880, 520),
    snow: false,
  },
  "terrace-dusk": { seed: 51, time: "dusk", view: 0.25, subject: at((x, y, t) => terrace(x, y, 110, t), 800, 930, 520) },
  "terrace-golden": { seed: 52, time: "golden", view: 0.5, subject: at((x, y, t) => terrace(x, y, 105, t), 800, 930, 520) },
  "coffee-day": { seed: 61, time: "day", view: 0.35, subject: at((x, y) => coffee(x, y, 120), 820, 900, 460) },
  "coffee-dawn": { seed: 62, time: "dawn", view: 0.12, subject: at((x, y) => coffee(x, y, 115), 760, 900, 460) },
  "guide-dawn": { seed: 71, time: "dawn", view: 0.45, subject: at((x, y) => blaze(x - 200, y, 120) + hiker(x + 160, y - 30, 150), 760, 920, 420) },
  "guide-golden": { seed: 72, time: "golden", view: 0.15, subject: at((x, y) => hiker(x, y - 20, 160) + blaze(x + 300, y + 10, 100), 700, 920, 420) },
  "waterfall-day": { seed: 81, time: "day", view: 0.4, subject: at((x, y, t) => waterfall(x, y, 120, t), 800, 900, 420) },
  "shop-day": { seed: 91, time: "day", view: 0.28, subject: at((x, y) => shelf(x, y, 120), 800, 930, 520, { haystacks: 2 }) },
  "lake-day": { seed: 111, time: "day", view: 0.33, subject: at((x, y, t) => lake(x, y, 120, t), 800, 860, 700) },
  "lake-golden": { seed: 112, time: "golden", view: 0.58, subject: at((x, y, t) => lake(x, y, 110, t), 760, 870, 680) },
  "peak-dawn": { seed: 121, time: "dawn", view: 0.7, subject: at(() => "", 800, 900, 0) },
  "valley-golden": { seed: 101, time: "golden", view: 0.2, subject: at(() => "", 800, 900, 0, { haystacks: 3, sheep: 4 }) },
  "valley-winter": { seed: 102, time: "dawn", view: 0.5, subject: at(() => "", 800, 900, 0, { haystacks: 2 }) },
};

const DISHES = ["flija", "burek", "trout", "board"];

for (const [name, spec] of Object.entries(SCENES)) writeFileSync(join(OUT, `${name}.svg`), scene(spec));
DISHES.forEach((d, i) => writeFileSync(join(OUT, `dish-${d}.svg`), dish(d, rng(200 + i))));
console.log(`${Object.keys(SCENES).length + DISHES.length} illustrations → public/illustrations/`);
