import { expect, pinPoint, test } from "./fixtures";

const PAGES = ["/en/", "/sq/", "/cnr/", "/en/explore/", "/en/places/", "/en/places/zla-kolata/", "/en/stay/", "/en/directory/eko-katun-rosi/", "/en/hikes/vusanje-theth/", "/en/travel-tips/", "/en/plan/", "/en/contribute/", "/en/partners/", "/cnr/about/"];

test("no horizontal scrolling at phone width", async ({ page, errors, isMobile }) => {
  void errors;
  test.skip(!isMobile, "phone layout");
  for (const path of PAGES) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});

test("touch: tap a 3D marker, then the panel scrolls into view", async ({ page, errors, isMobile }) => {
  void errors;
  test.skip(!isMobile, "phone layout");
  await page.goto("/en/explore/");
  const { x, y } = await pinPoint(page, "place:vusanje");
  await page.touchscreen.tap(x, y);
  await expect(page.getByTestId("info-panel").getByRole("heading", { name: "Vusanje" })).toBeInViewport();
});

test("data saver: Explore opens on the map, 3D stays one tap away", async ({ page, errors, isMobile }) => {
  void errors;
  test.skip(!isMobile, "phone layout");
  await page.addInitScript(() => Object.defineProperty(navigator, "connection", { value: { saveData: true, effectiveType: "4g" } }));
  await page.goto("/en/explore/");
  await expect(page.locator('button[data-view="map"]')).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("To save data, the map is shown first.")).toBeVisible();
  await page.locator('button[data-view="3d"]').tap();
  await expect(page.locator('button[data-view="3d"]')).toHaveAttribute("aria-pressed", "true");
});

test("touch targets are at least 44px on the Explore page", async ({ page, errors, isMobile }) => {
  void errors;
  test.skip(!isMobile, "phone layout");
  await page.goto("/en/explore/");
  await page.getByRole("button", { name: "Legend & filters" }).tap();
  await expect(page.locator("[data-group]").first()).toBeVisible();
  const controls = page.locator('[data-view], [data-group], [data-rail], nav[aria-label="Places in this view"] button, button[aria-controls="explore-legend"], header a:visible, header button:visible');
  await expect(controls.first()).toBeVisible();
  for (const box of await controls.evaluateAll((els) => els.map((el) => ({ name: el.textContent?.trim() || el.getAttribute("aria-label"), height: el.getBoundingClientRect().height })))) {
    expect(box.height, `${box.name}`).toBeGreaterThanOrEqual(44);
  }
  // The legend is a row of chips under the model on phones.
  const chips = await page.locator("[data-group]").evaluateAll((els) => els.map((el) => el.getBoundingClientRect().top));
  expect(new Set(chips.map(Math.round)).size).toBeLessThan(chips.length);
});
