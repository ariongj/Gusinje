import AxeBuilder from "@axe-core/playwright";

import { expect, test, trackWrites } from "./fixtures";

test("place page: sources, last check, missing facts, share + QR, nearby, no reviews", async ({ page, errors }) => {
  void errors;
  await page.goto("/en/places/oko-skakavice/");
  await expect(page.getByRole("heading", { level: 1, name: "Oko Skakavice" })).toBeVisible();
  await expect(page.getByText("Checked against published sources (not yet on site)").first()).toBeVisible();
  await expect(page.getByText(/Last checked 10 October 2026/)).toBeVisible();
  await expect(page.getByText("Not yet verified — check locally before you go.").first()).toBeVisible();
  await expect(page.getByRole("img", { name: /QR code linking to/ })).toBeVisible();
  await expect(page.getByText("No reviews yet.")).toBeVisible();
  await expect(page.getByText(/42\.51187, 19\.83479/)).toBeVisible();
  await expect(page.locator('a[href*="openstreetmap.org/?mlat=42.51187"]')).toBeVisible();
});

test("routes separate the waterfall walk from the canyon and give no GPS track", async ({ page, errors }) => {
  void errors;
  await page.goto("/en/hikes/grlja-canyon/");
  await expect(page.getByText("Awaiting verification — don't use this page to navigate.")).toBeVisible();
  await expect(page.getByText("Not a family walk")).toBeVisible();
  await expect(page.getByText("Required — technical activity")).toBeVisible();
  await expect(page.getByText(/No GPS track/)).toBeVisible();
  await page.goto("/en/hikes/vusanje-theth/");
  await expect(page.getByRole("note").filter({ hasText: "Border permission" })).toBeVisible();
  await expect(page.getByText(/reported by Peaks of the Balkans/).first()).toBeVisible();
  // Figures follow the reader's number format and language.
  await page.goto("/sq/hikes/grlja-oko-skakavice-walk/");
  await expect(page.getByText("3,4 km (rrugë rrethore)")).toBeVisible();
  await page.goto("/en/hikes/grlja-oko-skakavice-walk/");
  await expect(page.getByText("3.4 km (loop)")).toBeVisible();
});

test("directory: honest coverage, A–Z, filters and a map; ROSI not first", async ({ page, errors }) => {
  void errors;
  await page.goto("/en/stay/");
  await expect(page.getByText(/This directory has just started/)).toBeVisible();
  const names = await page.locator("article h2 a").allTextContents();
  const sorted = [...names].sort((a, b) => new Intl.Collator("en", { sensitivity: "base", ignorePunctuation: true }).compare(a, b));
  expect(names).toEqual(sorted);
  expect(names[0]).not.toContain("ROSI");
  await page.locator('select[data-facet="type"]').selectOption("campsite");
  await expect(page.locator("article")).toHaveCount(2);
  await expect(page).toHaveURL(/type=campsite/);
  await page.getByRole("button", { name: "Map", exact: true }).click();
  await expect(page.locator(".leaflet-container")).toBeVisible();
});

test("listing page: contact actions, self-reported labels, enquiry by the visitor's own email, claim/correct", async ({ page, errors }) => {
  void errors;
  await page.goto("/en/directory/hotel-rosi/");
  await expect(page.getByText("This business belongs to ROSI, which created and hosts this guide.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Get directions" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Visit website" })).toBeVisible();
  await expect(page.getByRole("link", { name: /^Call / })).toHaveAttribute("href", "tel:+38269610999");
  await expect(page.getByRole("link", { name: "Send enquiry" })).toHaveAttribute("href", /^mailto:/);
  await expect(page.getByRole("link", { name: "WhatsApp" })).toHaveCount(0);
  await expect(page.getByText("Upper floors by stairs only — no lift")).toBeVisible();
  await expect(page.getByText("No prices are published here.")).toBeVisible();
  await page.goto("/en/directory/metro-hotel/");
  await expect(page.getByText("Not yet claimed by the business").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Claim this listing" })).toHaveAttribute("href", /type=claim&listing=metro-hotel/);
});

test("guides & experiences shows an honest empty state for guides", async ({ page, errors }) => {
  void errors;
  await page.goto("/en/guides-experiences/");
  await expect(page.getByText(/No independent mountain guides or activity providers are listed yet/)).toBeVisible();
});

test("search finds places by any of their names", async ({ page, errors }) => {
  void errors;
  await page.goto("/en/search/?q=Kollata");
  await expect(page.getByRole("link", { name: "Zla Kolata", exact: true })).toBeVisible();
  await page.getByLabel("Search the guide").fill("gerbaja");
  await expect(page.getByRole("link", { name: "Grbaja valley" })).toBeVisible();
  await page.getByLabel("Search the guide").fill("zzzzqqq");
  await expect(page.getByText("No results for “zzzzqqq”.")).toBeVisible();
});

test("travel tips: searchable, with section status and sources", async ({ page, errors }) => {
  void errors;
  await page.goto("/en/travel-tips/");
  await page.getByLabel("Search travel tips").fill("euro");
  await expect(page.getByRole("link", { name: "Money, connectivity and visitor services" })).toBeVisible();
  await page.goto("/en/travel-tips/safety-and-emergencies/");
  await expect(page.getByText("112 — emergency")).toBeVisible();
  await expect(page.getByText("Checked against sources").first()).toBeVisible();
  await page.goto("/en/travel-tips/seasons-and-packing/");
  await expect(page.getByText("General advice — awaiting local review")).toBeVisible();
});

test("preview forms validate but never send anything", async ({ page, errors }) => {
  void errors;
  const writes = trackWrites(page);
  await page.goto("/en/contribute/?type=correction&page=/places/grlja");
  await expect(page.getByText("Preview only — submissions are not open yet")).toBeVisible();
  await expect(page.getByRole("tab", { name: "Suggest a correction" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByLabel("Which page? *")).toHaveValue("/places/grlja");
  await expect(page.getByLabel("Your email (to confirm your submission)")).toBeDisabled();
  await page.getByRole("button", { name: "Check form" }).click();
  await expect(page.getByText("This field is required.")).toBeVisible();
  await page.getByLabel("What should change? *").fill("The waterfall viewpoint path is closed after the flood.");
  await page.getByRole("button", { name: "Check form" }).click();
  await expect(page.getByText(/Submissions open soon — nothing has been sent/)).toBeVisible();

  await page.goto("/en/places/grlja/");
  await page.getByRole("button", { name: /Write a review/ }).click();
  await page.getByRole("button", { name: "Check my review" }).click();
  await expect(page.getByText("This field is required.").first()).toBeVisible();
  await page.getByRole("radio", { name: "4 stars" }).check();
  await page.getByLabel("Your review").fill("A short, clear walk to the waterfall from the parking area.");
  await page.getByLabel("When did you visit?").fill("2026-08");
  await page.getByRole("button", { name: "Check my review" }).click();
  await expect(page.getByText(/Nothing has been sent/)).toBeVisible();
  expect(writes).toEqual([]);
});

test("accessibility: no serious axe violations on key pages", async ({ page, errors }) => {
  void errors;
  for (const path of ["/en/", "/en/places/grlja/", "/en/directory/eko-katun-rosi/", "/en/hikes/zla-kolata-from-vusanje/", "/en/plan/", "/sq/travel-tips/getting-here/", "/en/explore/?view=list", "/en/services/", "/cnr/about/history/"]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).exclude(".leaflet-container").analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${path}: ${v.id} (${v.nodes.length}) ${v.nodes[0]?.target}`)).toEqual([]);
  }
});
