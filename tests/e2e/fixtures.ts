import { test as base, expect, type Page } from "@playwright/test";

const PLACEHOLDER = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cfe3e6"/><stop offset="1" stop-color="#9fb8a0"/></linearGradient></defs><rect width="1200" height="800" fill="url(#g)"/></svg>`;

/**
 * Pages under test never reach third-party servers: remote photos get a
 * placeholder, map tiles and other remote requests are refused (the pages
 * must cope), and page errors fail the test.
 */
export const test = base.extend<{ errors: string[] }>({
  errors: async ({ page }, use) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.route(/^https?:\/\/(?!localhost)/, (route) => {
      const url = route.request().url();
      if (/upload\.wikimedia\.org|cf\.bstatic\.com/.test(url)) return route.fulfill({ status: 200, contentType: "image/svg+xml", body: PLACEHOLDER });
      return route.abort();
    });
    await use(errors);
    expect(errors, "uncaught page errors").toEqual([]);
  },
});

export { expect };

/** Requests that leave the browser for a server (anything but GET of local files). */
export function trackWrites(page: Page): string[] {
  const writes: string[] = [];
  page.on("request", (r) => {
    if (r.method() !== "GET" && r.method() !== "HEAD") writes.push(`${r.method()} ${r.url()}`);
  });
  return writes;
}

type MapHandle = {
  getLayer(id: string): unknown;
  getContainer(): HTMLElement;
  project(lngLat: [number, number]): { x: number; y: number };
  queryRenderedFeatures(options: { layers: string[] }): { properties: { key?: string }; geometry: { type: string; coordinates: unknown } }[];
};

/**
 * Where a place's pin is on the 3D map, in window coordinates, once the camera
 * has settled. The map draws its pins itself (WebGL), so tests find them
 * through the map, which automated browsers can reach as `window.__valleyMap`.
 */
export async function pinPoint(page: Page, key: string): Promise<{ x: number; y: number }> {
  const locate = () =>
    page.evaluate((k) => {
      const m = (window as unknown as { __valleyMap?: MapHandle }).__valleyMap;
      if (!m?.getLayer("guide-place-pins")) return null;
      const hit = m
        .queryRenderedFeatures({ layers: ["guide-selected-pin", "guide-place-pins", "guide-place-pins-near", "guide-business-pins", "guide-business-pins-near"] })
        .find((f) => f.properties.key === k && f.geometry.type === "Point");
      if (!hit) return null;
      const p = m.project(hit.geometry.coordinates as [number, number]);
      const rect = m.getContainer().getBoundingClientRect();
      return { x: rect.left + p.x, y: rect.top + p.y };
    }, key);
  let last: { x: number; y: number } | null = null;
  await expect
    .poll(
      async () => {
        const now = await locate();
        const still = !!now && !!last && Math.hypot(now.x - last.x, now.y - last.y) < 1;
        last = now;
        return still;
      },
      { timeout: 45_000, intervals: [500] },
    )
    .toBe(true);
  return last!;
}
