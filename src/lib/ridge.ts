import { skyline } from "@/content/skyline";

/**
 * A slice of the real skyline around Vusanje (src/content/skyline.ts) as an
 * SVG path: decoration drawn from the mountains' own outline, never invented.
 *
 * @param layer  0 = the far crest … 2 = the nearest ridge
 * @param from   where the slice starts along the skyline, 0–1
 * @param span   how much of the skyline it covers, 0–1
 * @param top    the y the highest point of the slice reaches
 * @param base   the y the lowest point reaches (the shape is still filled down to `height`)
 */
export function ridgePath(layer: 0 | 1 | 2, from: number, span: number, width: number, height: number, top = 0, base = height): string {
  const data = skyline.layers[layer];
  const start = Math.max(0, Math.min(data.length - 2, Math.floor(from * (data.length - 1))));
  const end = Math.max(start + 1, Math.min(data.length - 1, Math.ceil((from + span) * (data.length - 1))));
  const slice = data.slice(start, end + 1);
  const low = Math.min(...slice);
  const high = Math.max(...slice);
  const y = (h: number) => base - ((h - low) / Math.max(1, high - low)) * (base - top);
  const points = slice.map((h, i) => `L${((i / (slice.length - 1)) * width).toFixed(1)},${y(h).toFixed(1)}`).join(" ");
  return `M0,${height} ${points} L${width},${height} Z`;
}

/** A stable number in [0, 1) from a string (so each record gets its own slice of the skyline). */
export function seed(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return ((h >>> 0) % 1000) / 1000;
}
