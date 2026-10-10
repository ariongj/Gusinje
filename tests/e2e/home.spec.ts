import { expect, test } from "./fixtures";

test("home: the hero's photos name their places; pause, step and the peaks link to their pages", async ({ page, errors }) => {
  void errors;
  await page.goto("/en/");
  const photos = page.getByRole("region", { name: "Photos of the valley" });
  await expect(photos.getByRole("link", { name: /^Gusinje/ })).toHaveAttribute("href", /\/en\/places\/gusinje\/$/);
  await expect(photos.getByText("Planeti", { exact: false })).toBeVisible();

  // Choosing a photo stops the slideshow and names the new place.
  await photos.getByRole("button", { name: /^Photo 2:/ }).click();
  await expect(photos.getByRole("link", { name: /^Grlja/ })).toHaveAttribute("href", /\/en\/places\/grlja\/$/);
  await expect(photos.getByRole("button", { name: "Play the photos" })).toBeVisible();
  await expect(photos.getByRole("group", { name: "2 of 7" })).not.toHaveAttribute("aria-hidden", "true");

  // The ridge drawn from elevation data names real places, each linked.
  const ridge = page.getByRole("figure").filter({ hasText: "drawn from elevation data" });
  for (const [name, slug] of [
    ["Zla Kolata", "zla-kolata"],
    ["Karanfili", "karanfili"],
  ]) {
    await expect(ridge.getByRole("link", { name })).toHaveAttribute("href", new RegExp(`/en/places/${slug}/$`));
  }

  // How long do you have: every plan flies in 3D and opens as days.
  const time = page.locator("section", { has: page.getByRole("heading", { name: "How long do you have?" }) });
  const fly = time.getByRole("link", { name: "Fly this journey in 3D" });
  await expect(fly).toHaveCount(4);
  await expect(fly.first()).toHaveAttribute("href", /\/en\/explore\/\?tour=a-few-hours$/);
  await expect(time.getByRole("link", { name: "See the days" }).first()).toHaveAttribute("href", /\/en\/plan\/itineraries\/a-few-hours\/$/);
});
