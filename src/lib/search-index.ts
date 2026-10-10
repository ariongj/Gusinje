import "server-only";

import { businesses, guides, itineraries, places, recordPath, routes, tours } from "@/content";
import type { RecordKind } from "@/content/types";
import { href, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n";
import { fold, loc } from "@/i18n/localize";

export type SearchDoc = {
  key: string;
  kind: RecordKind;
  kindLabel: string;
  title: string;
  summary: string;
  href: string;
  /** Folded names in every language plus alternate names. */
  names: string;
  /** Folded body text in this language and English. */
  text: string;
};

/** The search index for one language, built at build time and shipped with the search page. */
export function searchIndex(lang: Locale): SearchDoc[] {
  const t = getMessages(lang);
  const doc = (kind: RecordKind, slug: string, title: string, summary: string, names: string[], text: string[]): SearchDoc => ({
    key: `${kind}:${slug}`,
    kind,
    kindLabel: t.search.kind[kind],
    title,
    summary,
    href: href(lang, recordPath(kind, slug)),
    names: fold(names.filter(Boolean).join(" ")),
    text: fold(text.filter(Boolean).join(" ")),
  });
  return [
    ...places.map((p) =>
      doc(
        "place",
        p.slug,
        loc(p.name, lang),
        loc(p.summary, lang),
        [p.name.en, p.name.sq ?? "", p.name.cnr ?? "", ...p.altNames.map((a) => a.name)],
        [loc(p.summary, lang), ...loc(p.description, lang), p.summary.en, t.placeCategory[p.category], t.area[p.area]],
      ),
    ),
    ...businesses.map((b) =>
      doc(
        "business",
        b.slug,
        b.name,
        loc(b.summary, lang),
        [b.name, ...(b.altNames ?? [])],
        [loc(b.summary, lang), b.summary.en, ...b.categories.map((c) => t.businessCategory[c]), b.area ? t.area[b.area] : ""],
      ),
    ),
    ...routes.map((r) =>
      doc("route", r.slug, loc(r.name, lang), loc(r.summary, lang), [r.name.en, r.name.sq ?? "", r.name.cnr ?? ""], [loc(r.summary, lang), r.summary.en, t.hikes.type[r.type]]),
    ),
    ...guides.map((g) =>
      doc(
        "guide",
        g.slug,
        loc(g.title, lang),
        loc(g.summary, lang),
        [g.title.en, g.title.sq ?? "", g.title.cnr ?? ""],
        [loc(g.summary, lang), ...g.sections.flatMap((s) => [loc(s.heading, lang), ...loc(s.body, lang)]), g.summary.en],
      ),
    ),
    ...tours.map((x) => doc("tour", x.slug, loc(x.title, lang), loc(x.intro, lang), [x.title.en, x.title.sq ?? "", x.title.cnr ?? ""], [loc(x.intro, lang)])),
    ...itineraries.map((i) =>
      doc("itinerary", i.slug, loc(i.title, lang), loc(i.summary, lang), [i.title.en, i.title.sq ?? "", i.title.cnr ?? ""], [loc(i.summary, lang), loc(i.interests, lang)]),
    ),
  ];
}
