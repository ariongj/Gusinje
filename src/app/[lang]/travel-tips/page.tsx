import type { Metadata } from "next";

import { ItineraryCard, TipCard } from "@/components/content/cards";
import { PageIntro } from "@/components/content/PageIntro";
import { SearchableList } from "@/components/content/SearchableList";
import { Notice } from "@/components/ui/Notice";
import { guides, itineraries } from "@/content";
import { getMessages, resolveLocale } from "@/i18n";
import { href } from "@/i18n/config";
import { fold, loc } from "@/i18n/localize";
import { pageMetadata } from "@/lib/seo";
import ui from "@/styles/ui.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/travel-tips">): Promise<Metadata> {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return pageMetadata({ lang, path: "/travel-tips", title: t.tips.title, description: t.tips.intro });
}

export default async function TipsPage({ params }: PageProps<"/[lang]/travel-tips">) {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return (
    <>
      <PageIntro lang={lang} t={t} title={t.tips.title} lead={t.tips.intro} crumbs={[[t.nav.home, href(lang)]]} />
      <div className={ui.wrap}>
        <div className={ui.section}>
          <SearchableList
            label={t.tips.searchLabel}
            placeholder={t.tips.searchPlaceholder}
            noResults={t.tips.noResults}
            entries={guides.map((g) => ({
              id: g.slug,
              // Search the guide in this language and in English (place names, terms).
              text: fold(
                [loc(g.title, lang), loc(g.summary, lang), ...g.sections.flatMap((s) => [loc(s.heading, lang), ...loc(s.body, lang)]), g.title.en, g.summary.en].join(" "),
              ),
              node: <TipCard guide={g} lang={lang} t={t} headingLevel={2} />,
            }))}
          />
        </div>
        <div className={ui.sectionTight}>
          <Notice tone="info">{t.tips.community}</Notice>
        </div>
        <section className={ui.section} aria-labelledby="itineraries">
          <h2 id="itineraries" className={ui.h2}>
            {t.tips.itineraries}
          </h2>
          <p className={ui.muted}>{t.plan.templatesIntro}</p>
          <div className={ui.cards}>
            {itineraries.map((i) => (
              <ItineraryCard key={i.slug} itinerary={i} lang={lang} t={t} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
