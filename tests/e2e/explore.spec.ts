import { expect, test } from "./fixtures";

test.describe("Explore: 3D, map and list share the same records", () => {
  test("3D map renders markers at sourced positions; selecting one opens the info panel", async ({ page, errors }) => {
    void errors;
    await page.goto("/en/explore/");
    await expect(page.getByRole("region", { name: "Map of places and listings" })).toBeVisible();
    // Places without a verified location are listed, never placed on the map.
    await expect(page.locator('button[data-key="place:volusnica"]')).toHaveCount(0);
    const pin = page.locator('button[data-key="place:grlja"]');
    await expect(pin).toBeAttached({ timeout: 20_000 });
    // Pins are buttons: keyboard activation must work.
    await pin.focus();
    await page.keyboard.press("Enter");
    const panel = page.getByTestId("info-panel");
    await expect(panel.getByRole("heading", { name: "Grlja waterfall" })).toBeVisible();
    await expect(pin).toHaveAttribute("aria-pressed", "true");
    await expect(panel.getByText("Mapped point")).toBeVisible();
    await expect(page).toHaveURL(/place=grlja/);
    await panel.getByRole("link", { name: "Open page" }).click();
    await expect(page).toHaveURL(/\/en\/places\/grlja\/$/);
  });

  test("full-screen view: the place strip gives each place its own view; previous / next step through them", async ({ page, errors }) => {
    void errors;
    await page.goto("/en/explore/");
    const rail = page.getByRole("navigation", { name: "Places in this view" });
    const gusinje = rail.locator('[data-rail="place:gusinje"]');
    await expect(gusinje).toBeVisible({ timeout: 20_000 });
    // The view fills the screen: the strip sits at the bottom of the window.
    const box = await rail.boundingBox();
    expect(box!.y + box!.height).toBeGreaterThan(page.viewportSize()!.height - 40);

    await gusinje.click();
    const panel = page.getByTestId("info-panel");
    await expect(panel.getByRole("heading", { name: "Gusinje" })).toBeVisible();
    await expect(gusinje).toHaveAttribute("aria-current", "true");
    const order = await rail.locator("[data-rail]").evaluateAll((els) => els.map((el) => el.getAttribute("data-rail")));
    const index = order.indexOf("place:gusinje");
    await expect(panel.getByText(`${index + 1} of ${order.length}`)).toBeVisible();
    await expect(page.locator('button[data-key="place:gusinje"]')).toHaveAttribute("aria-pressed", "true");

    // Next goes to the next place along the strip (further up the valley).
    await panel.getByRole("button", { name: "Next place" }).click();
    await expect(rail.locator(`[data-rail="${order[index + 1]}"]`)).toHaveAttribute("aria-current", "true");
    await rail.getByRole("button", { name: "Previous place" }).click();
    await expect(panel.getByRole("heading", { name: "Gusinje" })).toBeVisible();
  });

  test("legend filters hide a category in every view", async ({ page, errors }) => {
    void errors;
    await page.goto("/en/explore/?view=list");
    await expect(page.locator('li[data-key="place:grlja"]')).toBeVisible();
    await page.locator('button[data-group="water"]').click();
    await expect(page.locator('button[data-group="water"]')).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator('li[data-key="place:grlja"]')).toHaveCount(0);
    await expect(page).toHaveURL(/groups=/);
    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(page.locator('li[data-key="place:grlja"]')).toBeVisible();
  });

  test("text filter works across languages and alternate names", async ({ page, errors }) => {
    void errors;
    await page.goto("/en/explore/?view=list");
    await page.getByPlaceholder("Filter by name…").fill("vuthaj");
    await expect(page.locator('li[data-key="place:vusanje"]')).toBeVisible();
    await expect(page.locator('li[data-key="place:grlja"]')).toHaveCount(0);
    await page.getByPlaceholder("Filter by name…").fill("alipasini");
    await expect(page.locator('li[data-key="place:ali-pashas-springs"]')).toBeVisible();
  });

  test("list → map keeps the selection and highlights its marker", async ({ page, errors }) => {
    void errors;
    await page.goto("/en/explore/?view=list");
    await page.locator('li[data-key="place:ali-pashas-springs"]').getByRole("button", { name: "Show on map" }).click();
    await expect(page.locator('[data-view="map"]')).toHaveAttribute("aria-pressed", "true");
    const marker = page.locator('button[data-key="place:ali-pashas-springs"]');
    await expect(marker).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByTestId("info-panel").getByRole("heading", { name: "Ali Pasha's Springs" })).toBeVisible();
    // Map tiles are blocked in tests: the map says so but keeps working.
    await expect(page.getByText("The map background couldn't load")).toBeVisible();
    await expect(page.getByText(/no verified location yet/)).toBeVisible();
  });

  test("deep link selects a listing and ROSI is disclosed", async ({ page, errors }) => {
    void errors;
    await page.goto("/en/explore/?view=map&listing=hotel-rosi");
    const panel = page.getByTestId("info-panel");
    await expect(panel.getByRole("heading", { name: "Hotel ROSI" })).toBeVisible();
    await expect(panel.getByText("Host of this guide")).toBeVisible();
    await expect(panel.getByText("Location supplied by the business")).toBeVisible();
  });

  test("a mouse click on a 3D marker selects that marker, not its neighbour", async ({ page, errors }) => {
    void errors;
    await page.goto("/en/explore/");
    const dot = page.locator('button[data-key="place:oko-skakavice"] [data-part="dot"]');
    await expect(dot).toBeAttached({ timeout: 20_000 });
    await page.waitForTimeout(1500);
    const box = await dot.boundingBox();
    await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await expect(page.getByTestId("info-panel").getByRole("heading", { name: "Oko Skakavice" })).toBeVisible();
  });

  test("map markers are reachable by keyboard", async ({ page, errors }) => {
    void errors;
    await page.goto("/en/explore/?view=map");
    const marker = page.locator('button[data-key="place:oko-skakavice"]');
    await expect(marker).toBeVisible();
    await marker.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("info-panel").getByRole("heading", { name: "Oko Skakavice" })).toBeVisible();
  });
});

test.describe("Virtual tours", () => {
  test("intro, progress, previous/next, pause, restart and exit", async ({ page, errors }) => {
    void errors;
    await page.goto("/en/explore/");
    await page.locator('button[data-tour="springs-and-waterfalls"]').click();
    const intro = page.getByRole("dialog", { name: "Springs and waterfalls" });
    await expect(intro).toBeVisible();
    await expect(intro.getByText("not a walking or driving route")).toBeVisible();
    await intro.getByRole("button", { name: "Begin" }).click();

    const card = page.getByTestId("guide-card");
    await expect(card.getByText("Stop 1 of 6")).toBeVisible();
    await card.getByRole("button", { name: "Pause" }).click();
    await expect(card.getByRole("button", { name: "Play" })).toBeVisible();
    await card.getByRole("button", { name: "Next stop" }).click();
    await expect(card.getByText("Stop 2 of 6")).toBeVisible();
    await expect(card.getByRole("heading", { name: "Ali Pasha's Springs" })).toBeVisible();
    await expect(page.locator('button[data-key="place:ali-pashas-springs"]')).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.press("ArrowRight");
    await expect(card.getByText("Stop 3 of 6")).toBeVisible();
    await card.getByRole("button", { name: "Previous stop" }).click();
    await expect(card.getByText("Stop 2 of 6")).toBeVisible();
    await card.getByRole("button", { name: "Restart" }).click();
    await expect(card.getByText("Stop 1 of 6")).toBeVisible();
    await expect(card.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
    await card.getByRole("button", { name: "Exit tour" }).click();
    await expect(card).toHaveCount(0);
  });

  test("tour deep link opens the introduction; text version lists every stop", async ({ page, errors }) => {
    void errors;
    await page.goto("/en/explore/?tour=mountain-landscapes");
    await expect(page.getByRole("dialog", { name: "Mountain landscapes" })).toBeVisible();
    await page.goto("/en/tours/mountain-landscapes/");
    await expect(page.getByText("Stop 7 of 7")).toBeVisible();
  });
});

