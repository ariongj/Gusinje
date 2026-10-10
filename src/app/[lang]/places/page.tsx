import type { Metadata } from "next";
import Link from "next/link";

import { PlaceCard } from "@/components/content/cards";
import { FilterGrid } from "@/components/content/FilterGrid";
import { PageIntro } from "@/components/content/PageIntro";
import { places, sortByName } from "@/content";
import { getMessages, resolveLocale } from "@/i18n";
import { href } from "@/i18n/config";
import { loc } from "@/i18n/localize";
import { placeItem } from "@/lib/explore-data";
import { pageMetadata } from "@/lib/seo";
import ui from "@/styles/ui.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/places">): Promise<Metadata> {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return pageMetadata({ lang, path: "/places", title: t.place.title, description: t.place.intro, image: places[0].photos[0] });
}

export default async function PlacesPage({ params }: PageProps<"/[lang]/places">) {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  const sorted = sortByName(places, (p) => loc(p.name, lang), lang);
  return (
    <>
      <PageIntro lang={lang} t={t} title={t.place.title} lead={t.place.intro} crumbs={[[t.nav.home, href(lang)]]}>
        <div className={ui.actions}>
          <Link href={href(lang, "/explore")} className={ui.button}>
            {t.nav.explore}
          </Link>
          <Link href={`${href(lang, "/explore")}?view=list`} className={ui.buttonGhost}>
            {t.common.showInList}
          </Link>
        </div>
      </PageIntro>
      <div className={ui.wrap}>
        <div className={ui.section}>
          <FilterGrid
            withMap
            facets={[
              {
                key: "type",
                label: t.place.filterCategory,
                allLabel: t.place.allTypes,
                options: [...new Set(places.map((p) => p.category))].map((c) => ({ value: c, label: t.placeCategory[c] })),
              },
              {
                key: "area",
                label: t.place.filterArea,
                allLabel: t.place.allAreas,
                options: [...new Set(places.map((p) => p.area))].map((a) => ({ value: a, label: t.area[a] })),
              },
            ]}
            entries={sorted.map((p) => ({
              id: p.slug,
              facets: { type: [p.category], area: [p.area] },
              node: <PlaceCard place={p} lang={lang} t={t} headingLevel={2} />,
              mapItem: placeItem(p, lang),
            }))}
            empty={<p>{t.explore.noMatches}</p>}
          />
        </div>
      </div>
    </>
  );
}
