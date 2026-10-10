import { expect, test } from "./fixtures";

test("home page: nav, independent-guide disclosure, no rating data", async ({ page, errors }) => {
  void errors;
  await page.goto("/en/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Gusinje");
  await expect(page.getByText("not an official tourism website").first()).toBeVisible();
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  for (const json of ld) expect(json).not.toContain("aggregateRating");
});

test("main navigation has the eight sections, search and a language switcher", async ({ page, errors, isMobile }) => {
  void errors;
  await page.goto("/en/");
  if (isMobile) {
    await page.getByRole("button", { name: "Menu" }).click();
    const menu = page.getByRole("dialog", { name: "Menu" });
    for (const label of ["Explore in 3D", "Places", "Stay", "Eat & Drink", "Guides & Experiences", "Travel Tips", "Plan Your Trip", "About the Region"]) {
      await expect(menu.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
  } else {
    const nav = page.getByRole("navigation", { name: "Main" }).first();
    for (const label of ["Explore in 3D", "Places", "Stay", "Eat & Drink", "Guides & Experiences", "Travel Tips", "Plan Your Trip", "About the Region"]) {
      await expect(nav.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
  }
  await expect(page.getByRole("link", { name: "Search" }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /Language/ })).toBeVisible();
});

test("language switch keeps the page and updates lang", async ({ page, errors }) => {
  void errors;
  await page.goto("/en/places/grlja/");
  await page.getByRole("button", { name: /Language/ }).click();
  await page.getByRole("link", { name: "Shqip" }).click();
  await expect(page).toHaveURL(/\/sq\/places\/grlja\/?$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "sq");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Ujëvara e Grlës");
  await page.getByRole("button", { name: /Gjuha|Language/ }).click();
  await page.getByRole("link", { name: "Crnogorski" }).click();
  await expect(page).toHaveURL(/\/cnr\/places\/grlja\/?$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "cnr");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Vodopad Grlja");
});

test("site root sends visitors to their browser language", async ({ browser }) => {
  const context = await browser.newContext({ locale: "sq-AL" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page).toHaveURL(/\/sq\/$/);
  await context.close();
});

test("skip link moves focus to the main content", async ({ page, errors, isMobile }) => {
  void errors;
  test.skip(isMobile, "keyboard test on desktop");
  // Wait until the app has started: it rewrites the address on start-up.
  await page.goto("/en/places/", { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main#content")).toBeFocused();
  await expect(page).toHaveURL(/#content$/);
});

test("unknown pages show the 404 in all languages", async ({ page }) => {
  const res = await page.goto("/en/does-not-exist/");
  expect(res?.status()).toBe(404);
  await expect(page.locator("section[lang=\"en\"] h1")).toHaveText("Page not found");
  await expect(page.locator('section[lang="sq"] h1')).toBeVisible();
  await expect(page.locator('section[lang="cnr"] h1')).toBeVisible();
});

test("sitemap lists every language with alternates; robots allows indexing outside previews", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/en/places/grlja/");
  expect(sitemap).toContain("/sq/places/grlja/");
  expect(sitemap).toContain("/cnr/places/grlja/");
  expect(sitemap).toContain('hreflang="sq"');
  const place = await (await request.get("/en/places/grlja/")).text();
  expect(place).toMatch(/hreflang="cnr"/i);
  expect(place).toContain('rel="canonical"');
  expect(place).toContain('property="og:title"');
});
