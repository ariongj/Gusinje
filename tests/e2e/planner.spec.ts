import { expect, test } from "./fixtures";

test("My Trip: save, schedule, reorder, note, share read-only, print-ready, clear", async ({ page, errors, isMobile }) => {
  void errors;
  await page.goto("/en/places/grlja/");
  await page.getByRole("button", { name: "Add to My Trip" }).first().click();
  await expect(page.getByRole("button", { name: "In My Trip" }).first()).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("link", { name: "My Trip (1)" })).toBeVisible();
  await page.goto("/en/hikes/grlja-oko-skakavice-walk/");
  await page.getByRole("button", { name: "Add to My Trip" }).first().click();

  await page.goto("/en/plan/");
  await expect(page.getByText("Saved only in this browser on this device.")).toBeVisible();
  await expect(page.getByText(/We don't calculate travel times/)).toBeVisible();
  const grlja = page.locator('li[data-key="place:grlja"]');
  const walk = page.locator('li[data-key="route:grlja-oko-skakavice-walk"]');
  await grlja.getByRole("combobox").selectOption("1");
  await walk.getByRole("combobox").selectOption("1");
  const day1 = page.locator("section", { has: page.getByRole("heading", { name: "Day 1" }) });
  await expect(day1.locator("li")).toHaveCount(2);
  await walk.getByRole("button", { name: /Move up/ }).click();
  await expect(day1.locator("li").first()).toHaveAttribute("data-key", "route:grlja-oko-skakavice-walk");
  await grlja.getByLabel(/Notes for/).fill("Early morning light");
  await page.waitForTimeout(600);
  await page.reload();
  await expect(page.locator('li[data-key="place:grlja"] textarea')).toHaveValue("Early morning light");

  await page.getByRole("button", { name: "Share a read-only link" }).click();
  await expect(page.getByText(/Anyone you give it to can read it/)).toBeVisible();
  const link = await page.getByTestId("share-url").inputValue();
  expect(link).toContain("/en/plan/shared/#");

  // A different visitor opens the link: read-only, nothing fetched from a server.
  const other = await page.context().browser()!.newContext(isMobile ? { viewport: { width: 412, height: 915 } } : {});
  const reader = await other.newPage();
  await reader.goto(link);
  const shared = reader.getByTestId("shared-trip");
  await expect(shared.getByRole("link", { name: "Grlja waterfall", exact: true })).toBeVisible();
  await expect(shared.getByText("Early morning light")).toBeVisible();
  await reader.getByRole("button", { name: "Copy into My Trip" }).click();
  await expect(reader.getByText("Added to My Trip")).toBeVisible();
  await other.close();

  await page.emulateMedia({ media: "print" });
  await expect(page.getByRole("heading", { name: "My trip to Gusinje & Vusanje" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Share a read-only link" })).toBeHidden();
  await page.emulateMedia({ media: "screen" });

  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Clear My Trip" }).click();
  await expect(page.getByTestId("trip-empty")).toBeVisible();
});

test("itinerary template can be copied into My Trip", async ({ page, errors }) => {
  void errors;
  await page.goto("/en/plan/itineraries/weekend-in-the-prokletije/");
  await expect(page.getByText(/We don't calculate travel times/)).toBeVisible();
  await page.getByRole("button", { name: "Add these stops to My Trip" }).click();
  await expect(page.getByText("Added to My Trip")).toBeVisible();
  await page.goto("/en/plan/");
  await expect(page.getByRole("heading", { name: "Day 2" })).toBeVisible();
  await expect(page.locator('li[data-key="route:volusnica-from-grbaja"]')).toBeVisible();
});
