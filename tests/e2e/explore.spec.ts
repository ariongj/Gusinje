import type { Locator } from "@playwright/test";

import { expect, pinPoint, test, trackWrites } from "./fixtures";

// The 3D map draws with software WebGL on CI runners, where one of these tests
// can take 40 seconds; they get twice the usual time.
test.describe.configure({ timeout: 90_000 });

/** Tours go one stop at a time until the visitor presses play: the first stop, waiting. */
async function atFirstStop(card: Locator) {
  await expect(card.getByText(/^Stop 1 of \d+$/)).toBeVisible();
  await expect(card.getByRole("button", { name: "Play the tour" })).toBeVisible();
}

test.describe("Explore: 3D, map and list share the same records", () => {
  test("3D map renders markers at sourced positions; selecting one opens the info panel", async ({ page, errors }) => {
    void errors;
    await page.goto("/en/explore/");
    await expect(page.getByRole("region", { name: "Map of places and listings" })).toBeVisible();
    // Places without a verified location are listed, never placed on the map.
    await expect(page.locator('button[data-key="place:volusnica"]')).toHaveCount(0);
    // The map draws its pins; each also has a button in the map's place list, for keyboards and screen readers.
    const pin = page.getByRole("list", { name: "Places on the map" }).locator('button[data-key="place:grlja"]');
    await expect(pin).toBeAttached({ timeout: 20_000 });
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
    // The legend starts closed; it says what the map leaves out.
    await page.getByRole("button", { name: "Legend & filters" }).click();
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
    const { x, y } = await pinPoint(page, "place:oko-skakavice");
    await page.mouse.click(x, y);
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
  // Camera moves are instant: flights are covered by the place-strip test, and
  // with software WebGL each one would hold up the clicks that follow.
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("intro, progress, previous/next, pause, restart and exit", async ({ page, errors }) => {
    void errors;
    await page.goto("/en/explore/");
    await page.locator('button[data-tour="springs-and-waterfalls"]').click();
    const intro = page.getByRole("dialog", { name: "Springs and waterfalls" });
    await expect(intro).toBeVisible();
    await expect(intro.getByText("not a walking or driving route")).toBeVisible();
    // Started from the list below the map: the page comes back up so the whole map is in view.
    await expect
      .poll(() =>
        page.getByTestId("explore-stage").evaluate((el) => {
          const { top, bottom } = el.getBoundingClientRect();
          const header = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
          return top >= header - 1 && bottom <= window.innerHeight + 1;
        }),
      )
      .toBe(true);
    await expect(intro.getByRole("button", { name: "Begin" })).toBeFocused();
    await intro.getByRole("button", { name: "Begin" }).click();

    const card = page.getByTestId("guide-card");
    await atFirstStop(card);
    await card.getByRole("button", { name: "Next stop" }).click();
    await expect(card.getByText("Stop 2 of 6")).toBeVisible();
    await expect(card.getByRole("heading", { name: "Ali Pasha's Springs" })).toBeVisible();
    await expect(page.locator('button[data-key="place:ali-pashas-springs"]')).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.press("ArrowRight");
    await expect(card.getByText("Stop 3 of 6")).toBeVisible();
    await card.getByRole("button", { name: "Previous stop" }).click();
    await expect(card.getByText("Stop 2 of 6")).toBeVisible();
    // Play moves on by itself; stopping keeps the stop.
    await card.getByRole("button", { name: "Play the tour" }).click();
    await card.getByRole("button", { name: "Stop playing" }).click();
    await expect(card.getByRole("button", { name: "Play the tour" })).toBeVisible();
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


test.describe("Journeys", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("a trip plan flies day by day on the map, and its page links to it", async ({ page, errors }) => {
    void errors;
    await page.goto("/en/plan/itineraries/weekend-in-the-prokletije/");
    await page.getByRole("link", { name: "Fly this journey in 3D" }).click();
    const intro = page.getByRole("dialog", { name: "A weekend in the Prokletije" });
    await expect(intro).toBeVisible();
    await intro.getByRole("button", { name: "Begin" }).click();
    const card = page.getByTestId("guide-card");
    await atFirstStop(card);
    await card.getByRole("button", { name: "Next stop" }).click();
    await expect(card.getByText(/Stop 2 of \d+/)).toBeVisible();
    await expect(card.getByText("Day 1", { exact: false }).first()).toBeVisible();
    await expect(card.getByRole("heading", { name: "Gusinje" })).toBeVisible();
  });
});

// A flat terrain tile at 1,000 m (terrarium encoding: red 131, green 232).
const FLAT_1000M = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAB/klEQVR42u3TQQ0AAAgDsXnHLDL2xwJNquCSy2zgLQkwABgADAAGAAOAAcAAYAAwABgADAAGAAOAAcAAYAAwABgADAAGAAOAAcAAYAAwABgADAAGAAOAAcAAYAAwABgADAAGAAOAAcAAYAAwABgADAAGAAOAAcAAYAAwABgADIABVMAAYAAwABgADAAGAAOAAcAAYAAwABgADAAGAAOAAcAAYAAwABgADAAGAAOAAcAAYAAwABgADAAGAAOAAcAAYAAwABgADAAGAAOAAcAAYAAwABgADAAGAAOAAcAAYAAwAAYAA4ABwABgADAAGAAMAAYAA4ABwABgADAAGAAMAAYAA4ABwABgADAAGAAMAAYAA4ABwABgADAAGAAMAAYAA4ABwABgADAAGAAMAAYAA4ABwABgADAAGAAMAAYAA4ABMIAEGAAMAAYAA4ABwABgADAAGAAMAAYAA4ABwABgADAAGAAMAAYAA4ABwABgADAAGAAMAAYAA4ABwABgADAAGAAMAAYAA4ABwABgADAAGAAMAAYAA4ABwABgADAAGAAMAAbAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHgKAqmFUbhKHd7AAAAAElFTkSuQmCC",
  "base64",
);

test.describe("Map tools", () => {
  test("photo card on hover, compass and orbit, and the ground's height from elevation data", async ({ page, errors }) => {
    void errors;
    await page.route(/elevation-tiles-prod/, (route) => route.fulfill({ status: 200, contentType: "image/png", body: FLAT_1000M }));
    await page.goto("/en/explore/");
    // A photo card on hover.
    const { x, y } = await pinPoint(page, "place:ali-pashas-springs");
    await page.mouse.move(x, y);
    const preview = page.locator('.maplibregl-popup [data-part="preview"]');
    await expect(preview).toBeVisible();
    await expect(preview).toContainText("Spring");

    // Orbit on, then any touch of the map turns it off; the compass faces north.
    const orbit = page.getByRole("button", { name: "Circle around this view" });
    await orbit.click();
    await expect(orbit).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Face north" }).click();
    await expect(orbit).toHaveAttribute("aria-pressed", "false");

    // Tap the ground: about 1,000 m here (the drawing's ×1.35 height is taken out).
    const stage = page.getByTestId("explore-stage");
    const box = (await stage.boundingBox())!;
    // (Open slopes on the left, away from any pin: a tap near a pin picks the place.)
    await page.mouse.move(box.x + box.width * 0.15, box.y + box.height * 0.55);
    await page.mouse.click(box.x + box.width * 0.15, box.y + box.height * 0.55);
    await expect(page.locator(".maplibregl-popup")).toContainText("≈ 1,000 m above sea level");
  });
});

test.describe("Show where I am", () => {
  test("the position is drawn on this screen only; inside the valley the map flies there", async ({ page, context, errors }) => {
    void errors;
    const writes = trackWrites(page);
    await context.grantPermissions(["geolocation"]);
    await context.setGeolocation({ latitude: 42.5294, longitude: 19.8403, accuracy: 30 });
    await page.goto("/en/explore/");
    await page.getByRole("button", { name: "Show where I am" }).click();
    await expect(page.getByText("shown on this screen only")).toBeVisible();
    const stop = page.getByRole("button", { name: "Stop showing where I am" });
    await expect(stop).toHaveAttribute("aria-pressed", "true");
    type Probe = { getCenter(): { lng: number; lat: number }; getSource(id: string): { getData(): Promise<{ features: unknown[] }> } };
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { __valleyMap: Probe }).__valleyMap.getCenter()), { timeout: 30_000 })
      .toMatchObject({ lng: expect.closeTo(19.8403, 2), lat: expect.closeTo(42.5294, 2) });
    const dots = () => page.evaluate(async () => (await (window as unknown as { __valleyMap: Probe }).__valleyMap.getSource("guide-me").getData()).features.length);
    expect(await dots()).toBe(1);

    // Off again: the dot goes.
    await stop.click();
    await expect(page.getByRole("button", { name: "Show where I am" })).toHaveAttribute("aria-pressed", "false");
    expect(await dots()).toBe(0);

    // Far from the valley: a note, and the map stays put.
    await context.setGeolocation({ latitude: 42.4304, longitude: 19.2594 });
    await page.getByRole("button", { name: "Show where I am" }).click();
    await expect(page.getByText("You're outside the valley")).toBeVisible();
    expect(writes, "the position is never sent").toEqual([]);
  });
});

test("useful services and history pages: sourced, with tap-to-call emergency numbers", async ({ page, errors }) => {
  void errors;
  await page.goto("/en/services/");
  await expect(page.getByRole("heading", { level: 1, name: "Useful services" })).toBeVisible();
  await expect(page.locator('a[href="tel:112"]')).toBeVisible();
  await expect(page.getByText("Čaršijska 62, Gusinje")).toBeVisible();
  await page.goto("/en/about/history/");
  await expect(page.getByRole("heading", { level: 1, name: "History & culture" })).toBeVisible();
  await expect(page.getByText("Accounts of this period differ sharply")).toBeVisible();
});
