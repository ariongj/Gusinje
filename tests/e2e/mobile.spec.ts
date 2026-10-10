import { expect, test } from "./fixtures";

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
  const pin = page.locator('button[data-key="place:vusanje"]');
  await expect(pin).toBeAttached({ timeout: 20_000 });
  await pin.tap({ force: true });
  await expect(page.getByTestId("info-panel").getByRole("heading", { name: "Vusanje" })).toBeInViewport();
});
