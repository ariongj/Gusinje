/**
 * Image URLs per screen size (next/image custom loader — the static export
 * has no image server). Wikimedia Commons thumbnails are requested at the
 * standard widths Commons pre-renders, up to the size the catalogue links to
 * (the largest the original allows — see photos.ts); other images are used as
 * they are.
 */
const COMMONS_THUMB = /^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/thumb\/.+\/)(\d+)px-([^/]+)$/;
const STEPS = [250, 330, 500, 960, 1280, 1920, 3840];

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }): string {
  const match = src.match(COMMONS_THUMB);
  if (!match) return src;
  const max = Number(match[2]);
  const step = STEPS.find((s) => s >= width) ?? max;
  return `${match[1]}${Math.min(step, max)}px-${match[3]}`;
}
