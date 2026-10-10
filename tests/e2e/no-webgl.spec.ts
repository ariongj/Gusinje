import { expect, test } from "./fixtures";

// A browser with WebGL switched off.
test.use({ launchOptions: { args: ["--disable-webgl", "--disable-3d-apis", "--disable-gpu"] } });

test("explorer falls back to the map with the same places, and tours run on the map with photos", async ({ page, errors }) => {
  void errors;
  await page.goto("/en/explore/");
  await expect(page.getByText(/3D isn't available here/)).toBeVisible();
  await expect(page.locator('[data-view="3d"]')).toBeDisabled();
  await expect(page.locator('[data-view="map"]')).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator('.leaflet-marker-icon[data-key="place:gusinje"]')).toBeVisible();
  await page.locator('button[data-tour="valley-highlights"]').click();
  await page.getByRole("button", { name: "Begin" }).click();
  await page.getByRole("button", { name: "Next stop" }).click();
  const card = page.getByTestId("guide-card");
  await expect(card.getByRole("heading", { name: "Gusinje" })).toBeVisible();
  await expect(card.locator("figure img")).toBeVisible();
});
