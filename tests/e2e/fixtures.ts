import { test as base, expect, type Page } from "@playwright/test";

const PLACEHOLDER = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cfe3e6"/><stop offset="1" stop-color="#9fb8a0"/></linearGradient></defs><rect width="1200" height="800" fill="url(#g)"/></svg>`;

/**
 * Pages under test never reach third-party servers: remote photos get a
 * placeholder, map tiles and other remote requests are refused (the pages
 * must cope), and page errors fail the test.
 */
export const test = base.extend<{ errors: string[] }>({
  errors: async ({ page }, use) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.route(/^https?:\/\/(?!localhost)/, (route) => {
      const url = route.request().url();
      if (/upload\.wikimedia\.org|cf\.bstatic\.com/.test(url)) return route.fulfill({ status: 200, contentType: "image/svg+xml", body: PLACEHOLDER });
      return route.abort();
    });
    await use(errors);
    expect(errors, "uncaught page errors").toEqual([]);
  },
});

export { expect };

/** Requests that leave the browser for a server (anything but GET of local files). */
export function trackWrites(page: Page): string[] {
  const writes: string[] = [];
  page.on("request", (r) => {
    if (r.method() !== "GET" && r.method() !== "HEAD") writes.push(`${r.method()} ${r.url()}`);
  });
  return writes;
}
