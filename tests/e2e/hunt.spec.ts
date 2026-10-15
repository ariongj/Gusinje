import { expect, test, trackWrites } from "./fixtures";

test.describe("Treasure hunt", () => {
  test("clues reveal places, stamps by hand fill the passport, and nothing leaves the device", async ({ page, errors }) => {
    void errors;
    const writes = trackWrites(page);
    await page.goto("/en/hunt/");
    await expect(page.getByRole("heading", { level: 1, name: "Treasure hunt" })).toBeVisible();
    await page.getByRole("link", { name: /Waters of the valley/ }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Waters of the valley" })).toBeVisible();
    const clues = page.getByTestId("clue");
    await expect(clues).toHaveCount(5);
    await expect(clues.first()).toHaveAttribute("data-state", "hidden");
    // The clue names no place until revealed.
    await expect(clues.first()).not.toContainText("Ali Pasha");
    await clues.first().getByRole("button", { name: "Reveal the place" }).click();
    await expect(clues.first()).toHaveAttribute("data-state", "revealed");
    await expect(clues.first().getByRole("heading", { name: "Ali Pasha's Springs" })).toBeVisible();
    await expect(clues.first().getByRole("link", { name: "Show on map" })).toHaveAttribute("href", /explore\/\?place=ali-pashas-springs/);
    await clues.first().getByRole("button", { name: /Mark as found/ }).click();
    await expect(clues.first()).toHaveAttribute("data-state", "found");
    await expect(clues.first().getByText(/marked by hand/)).toBeVisible();
    await expect(page.getByText("1 of 5 found")).toBeVisible();

    // The passport shows the stamp and the first badge; a reload keeps it.
    await page.goto("/en/hunt/passport/");
    await expect(page.getByTestId("passport-progress")).toHaveText(/1 of \d+ treasures found/);
    const first = page.getByTestId("badge").filter({ hasText: "First find" });
    await expect(first).toHaveAttribute("data-earned", "true");
    await expect(page.getByTestId("badge").filter({ hasText: "Whole valley" })).toHaveAttribute("data-earned", "false");
    expect(writes, "the passport is never sent").toEqual([]);
  });

  test("on site, “I'm here” stamps the place; far away it says how far", async ({ page, context, errors }) => {
    void errors;
    await context.grantPermissions(["geolocation"]);
    // Standing at the Grlja waterfall.
    await context.setGeolocation({ latitude: 42.52283, longitude: 19.84138, accuracy: 20 });
    await page.goto("/en/places/grlja/");
    await page.getByRole("button", { name: /I'm here — stamp it/ }).click();
    await expect(page.getByText("Stamped — you were there!")).toBeVisible();
    await expect(page.getByTestId("stamp")).toHaveAttribute("data-how", "here");
    await expect(page.getByText(/stamped on site/)).toBeVisible();

    // Ali Pasha's Springs are about 3 km away.
    await page.goto("/en/places/ali-pashas-springs/");
    await page.getByRole("button", { name: /I'm here — stamp it/ }).click();
    await expect(page.getByText(/You're about \d[.,]?\d* km from it/)).toBeVisible();
    await expect(page.getByTestId("stamp")).toHaveAttribute("data-how", "none");

    // The map shows the found place with a tick: its pin image carries the mark.
    await page.goto("/en/explore/");
    await page.waitForFunction(() => {
      const m = (window as unknown as { __valleyMap?: { listImages(): string[]; getLayer(id: string): unknown } }).__valleyMap;
      return !!m?.getLayer("guide-place-pins") && m.listImages().some((id) => id.endsWith("|found"));
    }, null, { timeout: 45_000 });
  });

  test("“Guide me” shows how far and which way a sealed clue is, without naming the place", async ({ page, context, errors }) => {
    void errors;
    await context.grantPermissions(["geolocation"]);
    // Standing at the Grlja waterfall.
    await context.setGeolocation({ latitude: 42.52283, longitude: 19.84138, accuracy: 15 });
    await page.goto("/en/hunt/waters-of-the-valley/");
    await page.getByRole("button", { name: /Guide me/ }).click();
    const clues = page.getByTestId("clue");
    // Clue 2 is the waterfall: we're there, but it stays sealed until stamped.
    await expect(clues.nth(1).getByTestId("hot-cold")).toHaveAttribute("data-level", "here");
    await expect(clues.nth(1)).toContainText("You're here");
    await expect(clues.nth(1)).toHaveAttribute("data-state", "hidden");
    await expect(clues.nth(1)).not.toContainText("Grlja waterfall");
    // Clue 1 (the springs) is about 3 km away: warm, with the distance.
    await expect(clues.first().getByTestId("hot-cold")).toHaveAttribute("data-level", "warm");
    await expect(clues.first()).toContainText(/km away/);
    // Standing there, the stamp is offered straight away; the clue opens as found.
    await clues.nth(1).getByRole("button", { name: /I'm here/ }).click();
    await expect(clues.nth(1)).toHaveAttribute("data-state", "found");
    await expect(clues.nth(1).getByRole("heading", { name: "Grlja waterfall" })).toBeVisible();
    await page.getByRole("button", { name: "Stop guiding" }).click();
    await expect(page.getByTestId("hot-cold")).toHaveCount(0);
  });

  test("the explore card offers the stamp for places only", async ({ page, errors }) => {
    void errors;
    await page.goto("/en/explore/?view=list");
    await page.locator('li[data-key="place:grlja"]').getByRole("button", { name: "Show on map" }).click();
    const panel = page.getByTestId("info-panel");
    await expect(panel.getByRole("heading", { name: "Grlja waterfall" })).toBeVisible();
    await expect(panel.getByRole("button", { name: /Mark as found/ })).toBeVisible();
    await panel.getByRole("button", { name: /Mark as found/ }).click();
    await expect(panel.getByTestId("stamp")).toHaveAttribute("data-how", "hand");
  });
});
