import { defineConfig, devices } from "@playwright/test";

/**
 * Tests run against the static export (npm run build → out/), served locally.
 * Remote photos and map tiles are blocked in tests so they never depend on
 * third-party servers; the pages must stay usable without them.
 */
export default defineConfig({
  testDir: "tests",
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:4173",
    trace: "off",
    launchOptions: {
      // Software WebGL so the 3D view can be tested headless.
      args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"],
    },
  },
  webServer: {
    command: "node scripts/serve-static.mjs",
    url: "http://localhost:4173/en/",
    reuseExistingServer: true,
    timeout: 30_000,
  },
  projects: [
    { name: "content", testMatch: /content\.spec\.ts/ },
    { name: "desktop", testMatch: /e2e\/.*\.spec\.ts/, use: { ...devices["Desktop Chrome"], viewport: { width: 1366, height: 900 } } },
    { name: "mobile", testMatch: /e2e\/(mobile|planner|navigation)\.spec\.ts/, use: { ...devices["Pixel 7"] } },
  ],
});
