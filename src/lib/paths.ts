import { businesses, guides, itineraries, places, routes, tours } from "@/content";

/** Every indexable page, without the language prefix — for the sitemap and tests. */
export function allPaths(): string[] {
  return [
    "/",
    "/explore",
    "/places",
    ...places.map((p) => `/places/${p.slug}`),
    "/stay",
    "/eat-drink",
    "/guides-experiences",
    "/directory",
    ...businesses.map((b) => `/directory/${b.slug}`),
    "/hikes",
    ...routes.map((r) => `/hikes/${r.slug}`),
    "/tours",
    ...tours.map((t) => `/tours/${t.slug}`),
    "/travel-tips",
    ...guides.map((g) => `/travel-tips/${g.slug}`),
    "/services",
    "/plan",
    ...itineraries.map((i) => `/plan/itineraries/${i.slug}`),
    "/about",
    "/about/platform",
    "/about/history",
    "/search",
    "/contribute",
    "/partners",
    "/credits",
  ];
}
