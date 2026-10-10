import { spawn, type ChildProcess } from "node:child_process";

import { expect, test } from "./fixtures";

// These tests need the service worker (blocked in the other tests).
test.use({ serviceWorkers: "allow" });

test("can be added to the home screen (manifest and icons)", async ({ page, request, errors }) => {
  void errors;
  await page.goto("/en/");
  const href = await page.locator('link[rel="manifest"]').getAttribute("href");
  const manifest = await (await request.get(href!)).json();
  expect(manifest).toMatchObject({ display: "standalone", start_url: "/", scope: "/", theme_color: "#0f3b3f" });
  expect(manifest.icons.some((icon: { purpose?: string }) => icon.purpose === "maskable")).toBe(true);
  for (const icon of manifest.icons) expect((await request.get(icon.src)).ok(), icon.src).toBe(true);
  const apple = await page.locator('link[rel="apple-touch-icon"]').getAttribute("href");
  expect((await request.get(apple!)).ok()).toBe(true);
});

/** Its own server, so the test can take the network away — service workers aren't affected by offline emulation. */
function startServer(port: number): Promise<ChildProcess> {
  return new Promise((resolve, reject) => {
    const server = spawn(process.execPath, ["scripts/serve-static.mjs"], { env: { ...process.env, PORT: String(port) } });
    server.stdout?.once("data", () => resolve(server));
    server.once("error", reject);
  });
}

test("pages already opened keep working without signal", async ({ page, errors }, testInfo) => {
  void errors;
  const origin = `http://localhost:${4180 + testInfo.parallelIndex}`;
  const server = await startServer(4180 + testInfo.parallelIndex);
  try {
    await page.goto(`${origin}/en/`);
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
    });
    // On the first visit the worker saves this page once it's in control.
    await expect
      .poll(() => page.evaluate(async () => !!(await (await caches.open("valley-guide-v1")).match(location.href))), { timeout: 15_000 })
      .toBe(true);
    await page.goto(`${origin}/en/travel-tips/`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Travel Tips");
  } finally {
    server.kill();
  }

  // No signal.
  await page.goto(`${origin}/en/`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("The valleys of Gusinje and Vusanje");
  await page.goto(`${origin}/en/travel-tips/`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Travel Tips");

  // A page never opened: the offline page, in the page's language, lists what is saved.
  await page.goto(`${origin}/sq/hikes/`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Jeni jashtë linje");
  await expect(page.locator("html")).toHaveAttribute("lang", "sq");
  await page.getByRole("link", { name: "Travel Tips" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Travel Tips");
});
