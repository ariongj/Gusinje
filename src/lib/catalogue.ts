import "server-only";

import { businesses, guides, itineraries, places, recordPath, routes, tours } from "@/content";
import type { RecordKind } from "@/content/types";
import { href, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n";
import { loc } from "@/i18n/localize";

export type CatalogueEntry = { title: string; href: string; kindLabel: string; detail: string };

/** Every record's title and link in one language — for My Trip and shared trips. */
export function catalogue(lang: Locale): Record<string, CatalogueEntry> {
  const t = getMessages(lang);
  const entry = (kind: RecordKind, slug: string, title: string, detail: string): [string, CatalogueEntry] => [
    `${kind}:${slug}`,
    { title, href: href(lang, recordPath(kind, slug)), kindLabel: t.search.kind[kind], detail },
  ];
  return Object.fromEntries([
    ...places.map((p) => entry("place", p.slug, loc(p.name, lang), `${t.placeCategory[p.category]} · ${t.area[p.area]}`)),
    ...businesses.map((b) => entry("business", b.slug, b.name, b.categories.map((c) => t.businessCategory[c]).join(" · "))),
    ...routes.map((r) => entry("route", r.slug, loc(r.name, lang), t.hikes.type[r.type])),
    ...guides.map((g) => entry("guide", g.slug, loc(g.title, lang), t.nav.tips)),
    ...tours.map((x) => entry("tour", x.slug, loc(x.title, lang), t.explore.guidedTour)),
    ...itineraries.map((i) => entry("itinerary", i.slug, loc(i.title, lang), t.plan.length[i.length])),
  ]);
}
