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

test("guided tour on a phone: \"Next stop\" sits above the tab bar; swipe the card to move on", async ({ page, errors, isMobile }) => {
  void errors;
  test.skip(!isMobile, "phone layout");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en/explore/");
  await page.locator('button[data-tour="springs-and-waterfalls"]').tap();
  await page.getByRole("button", { name: "Begin" }).tap();
  const card = page.getByTestId("guide-card");
  await expect(card.getByText("Stop 1 of 6")).toBeVisible();
  // One screen: the model on top, the card below, the big button clear of the tab bar.
  const next = (await card.getByRole("button", { name: /Next stop/ }).boundingBox())!;
  const tabs = (await page.getByRole("navigation", { name: "Quick links" }).boundingBox())!;
  expect(next.y + next.height).toBeLessThanOrEqual(tabs.y);
  expect(next.y).toBeGreaterThan(0);

  // Swipe left: next stop; swipe right: back.
  const box = (await card.boundingBox())!;
  const swipe = async (from: number, to: number) => {
    const y = box.y + 30;
    await card.dispatchEvent("touchstart", { touches: [{ identifier: 1, clientX: from, clientY: y }] });
    await card.dispatchEvent("touchend", { changedTouches: [{ identifier: 1, clientX: to, clientY: y + 6 }] });
  };
  await swipe(box.x + box.width - 30, box.x + 40);
  await expect(card.getByText("Stop 2 of 6")).toBeVisible();
  await swipe(box.x + 40, box.x + box.width - 30);
  await expect(card.getByText("Stop 1 of 6")).toBeVisible();
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
