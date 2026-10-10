// Takes review screenshots of the built site (npm run build && npm run serve).
// Remote photos are replaced by a neutral placeholder and base-map tiles are
// not loaded, so the 3D view uses its built-in relief style. Elevation tiles
// are let through (TERRAIN=0 blocks them too) so the 3D shots show the real
// mountains.
import { chromium, devices } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:4173";
const OUT = new URL("../docs/screenshots/", import.meta.url).pathname;
const TERRAIN = process.env.TERRAIN !== "0" ? /elevation-tiles-prod\.s3\.amazonaws\.com/ : /^$/;
const PLACEHOLDER = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cfe3e6"/><stop offset="1" stop-color="#9fb8a0"/></linearGradient></defs><rect width="1200" height="800" fill="url(#g)"/></svg>`;

const shots = [
  { name: "01-home-desktop", path: "/en/", full: true },
  { name: "02-explore-3d", path: "/en/explore/?place=ali-pashas-springs", wait: 15000 },
  { name: "03-explore-list", path: "/en/explore/?view=list", wait: 1500 },
  { name: "04-place-grlja", path: "/en/places/grlja/", full: true },
  { name: "05-stay-directory", path: "/en/stay/", full: true },
  { name: "06-listing-hotel-rosi", path: "/en/directory/hotel-rosi/", full: true },
  { name: "07-hike-zla-kolata", path: "/en/hikes/zla-kolata-from-vusanje/", full: true },
  { name: "08-travel-tip-sq", path: "/sq/travel-tips/safety-and-emergencies/", full: true },
  { name: "09-partners", path: "/en/partners/", full: true },
  { name: "10-admin", path: "/en/admin/" },
  { name: "11-explore-phone", path: "/en/explore/", device: "Pixel 7", wait: 20000 },
  { name: "12-home-phone-cnr", path: "/cnr/", device: "Pixel 7" },
  { name: "16-services", path: "/en/services/", full: true },
  { name: "17-history-sq", path: "/sq/about/history/", full: true },
  { name: "18-journey-3d", path: "/en/explore/?tour=weekend-in-the-prokletije", wait: 9000 },
];

const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
// ONLY=02,18 retakes just those screenshots.
const only = process.env.ONLY?.split(",");
for (const shot of shots.filter((s) => !only || only.some((n) => s.name.startsWith(n)))) {
  const context = await browser.newContext(shot.device ? devices[shot.device] : { viewport: { width: 1366, height: 900 } });
  const page = await context.newPage();
  await page.route(/^https?:\/\/(?!localhost)/, (route) =>
    /upload\.wikimedia\.org|cf\.bstatic\.com/.test(route.request().url())
      ? route.fulfill({ status: 200, contentType: "image/svg+xml", body: PLACEHOLDER })
      : TERRAIN.test(route.request().url())
        ? route.continue()
        : route.abort(),
  );
  await page.goto(BASE + shot.path, { waitUntil: "load" });
  await page.waitForTimeout(shot.wait ?? 1200);
  await page.screenshot({ path: `${OUT}${shot.name}.jpg`, type: "jpeg", quality: 72, fullPage: !!shot.full });
  console.log("saved", shot.name);
  await context.close();
}

// A guided tour in progress, and the no-WebGL fallback.
if (!only) {
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await context.newPage();
  await page.route(/^https?:\/\/(?!localhost)/, (r) => (TERRAIN.test(r.request().url()) ? r.continue() : r.abort()));
  await page.goto(`${BASE}/en/explore/`, { waitUntil: "load" });
  await page.locator('button[data-tour="springs-and-waterfalls"]').click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}13-tour-intro.jpg`, type: "jpeg", quality: 72 });
  await page.getByRole("button", { name: "Begin" }).click();
  await page.getByRole("button", { name: "Pause" }).click();
  await page.getByRole("button", { name: "Next stop" }).click();
  await page.waitForTimeout(8000);
  await page.screenshot({ path: `${OUT}14-tour-running.jpg`, type: "jpeg", quality: 72 });
  console.log("saved tour");
  await context.close();
}
await browser.close();
const noGl = await chromium.launch({ args: ["--disable-webgl", "--disable-3d-apis", "--disable-gpu"] });
if (!only) {
  const page = await noGl.newPage({ viewport: { width: 1366, height: 900 } });
  await page.route(/^https?:\/\/(?!localhost)/, (route) =>
    /upload\.wikimedia\.org/.test(route.request().url()) ? route.fulfill({ status: 200, contentType: "image/svg+xml", body: PLACEHOLDER }) : route.abort(),
  );
  await page.goto(`${BASE}/en/explore/`, { waitUntil: "load" });
  await page.locator('button[data-tour="valley-highlights"]').click();
  await page.getByRole("button", { name: "Begin" }).click();
  await page.getByRole("button", { name: "Pause" }).click();
  await page.getByRole("button", { name: "Next stop" }).click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}15-no-webgl-fallback.jpg`, type: "jpeg", quality: 72 });
  console.log("saved no-webgl");
}
await noGl.close();
