// Page weight on a phone profile: bytes the browser downloads from this site
// (remote photos and tiles excluded — they depend on the device).
import { chromium, devices } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:4173";
const pages = process.argv.slice(2).length ? process.argv.slice(2) : ["/en/", "/en/explore/", "/en/places/grlja/", "/en/plan/"];
const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
for (const path of pages) {
  const context = await browser.newContext(devices["Pixel 7"]);
  const page = await context.newPage();
  // SAVE_DATA=1: the phone has data saver switched on.
  if (process.env.SAVE_DATA) await page.addInitScript(() => Object.defineProperty(navigator, "connection", { value: { saveData: true } }));
  await page.route(/^https?:\/\/(?!localhost)/, (r) => r.abort());
  const sizes = { js: 0, css: 0, font: 0, html: 0, other: 0 };
  page.on("response", async (res) => {
    try {
      const len = (await res.body()).length;
      const type = res.request().resourceType();
      const key = type === "script" ? "js" : type === "stylesheet" ? "css" : type === "font" ? "font" : type === "document" ? "html" : "other";
      sizes[key] += len;
    } catch {}
  });
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(path.includes("explore") ? 4000 : 800);
  const kb = (n) => `${Math.round(n / 1024)} KB`;
  const total = Object.values(sizes).reduce((a, b) => a + b, 0);
  console.log(`${path.padEnd(22)} total ${kb(total).padStart(8)} · js ${kb(sizes.js)} · css ${kb(sizes.css)} · fonts ${kb(sizes.font)} · html ${kb(sizes.html)} · other ${kb(sizes.other)}`);
  await context.close();
}
await browser.close();
