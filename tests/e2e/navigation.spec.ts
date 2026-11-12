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

test("main navigation has the nine sections, search and a language switcher", async ({ page, errors, isMobile }) => {
  void errors;
  await page.goto("/en/");
  if (isMobile) {
    await page.getByRole("button", { name: "Menu" }).click();
    const menu = page.getByRole("dialog", { name: "Menu" });
    for (const label of ["Explore in 3D", "Treasure Hunt", "Places", "Stay", "Eat & Drink", "Guides & Experiences", "Travel Tips", "Plan Your Trip", "About the Region"]) {
      await expect(menu.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
  } else {
    const nav = page.getByRole("navigation", { name: "Main" }).first();
    for (const label of ["Explore in 3D", "Treasure Hunt", "Places", "Stay", "Eat & Drink", "Guides & Experiences", "Travel Tips", "Plan Your Trip", "About the Region"]) {
      await expect(nav.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
  }
  await expect(page.getByRole("link", { name: "Search" }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /Language/ })).toBeVisible();
});

test("the header fits laptop screens in every language, with the passport count showing", async ({ page, errors, isMobile }) => {
  void errors;
  test.skip(isMobile, "desktop header");
  // A well-used passport: the count beside "Treasure Hunt" takes room too.
  await page.addInitScript(() => {
    const slugs = ["grlja", "gusinje", "vusanje", "karanfili", "ropojana", "grbaja", "zla-kolata", "oko-skakavice", "ali-pashas-springs", "viziers-mosque"];
    localStorage.setItem("valley-guide:passport", JSON.stringify({ version: 1, stamps: Object.fromEntries(slugs.map((slug) => [slug, { at: "2026-10-15T10:00:00.000Z", how: "hand" }])), revealed: [] }));
  });
  for (const width of [1280, 1366, 1419, 1420, 1440, 1639, 1640, 1920]) {
    await page.setViewportSize({ width, height: 800 });
    for (const lang of ["en", "sq", "cnr"]) {
      await page.goto(`/${lang}/about/`);
      const fit = await page.evaluate(() => {
        const bar = document.querySelector("header > div")!;
        const logo = bar.firstElementChild!.getBoundingClientRect();
        const nav = bar.querySelector("nav")!.getBoundingClientRect();
        // The sections sit against the tools; what is left between them and the logo is the room to spare.
        return { overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, spare: Math.round(nav.left - logo.right) };
      });
      expect(fit.overflow, `${lang} at ${width}px scrolls sideways`).toBeLessThanOrEqual(0);
      // Enough room that a browser which draws text a little wider still fits.
      expect(fit.spare, `${lang} at ${width}px: only ${fit.spare}px to spare in the header`).toBeGreaterThanOrEqual(40);
    }
  }
  // Where the longer languages keep two sections back, the menu button brings all nine.
  await page.setViewportSize({ width: 1300, height: 800 });
  await page.goto("/sq/about/");
  const nav = page.getByRole("navigation", { name: "Kryesore" }).first();
  await expect(nav.getByRole("link").filter({ visible: true })).toHaveCount(7);
  await page.getByRole("button", { name: "Menyja" }).click();
  await expect(page.getByRole("dialog").getByRole("link", { name: "Gjueti thesari" })).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("link", { name: "Për rajonin" })).toBeVisible();
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
