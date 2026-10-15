import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageIntro } from "@/components/content/PageIntro";
import { TranslationNotice } from "@/components/content/TranslationNotice";
import styles from "@/components/hunt/Hunt.module.css";
import { HuntClues, type ClueCard } from "@/components/hunt/HuntClues";
import { getPlace, hunts } from "@/content";
import { getMessages, resolveLocale } from "@/i18n";
import { href, locales } from "@/i18n/config";
import { loc } from "@/i18n/localize";
import { placeIcon } from "@/lib/explore-data";
import { pageMetadata } from "@/lib/seo";
import ui from "@/styles/ui.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => hunts.map((h) => ({ lang, slug: h.slug })));
}

function findHunt(slug: string) {
  const hunt = hunts.find((h) => h.slug === slug);
  if (!hunt) notFound();
  return hunt;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/hunt/[slug]">): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  const lang = resolveLocale(raw);
  const hunt = findHunt(slug);
  const t = getMessages(lang);
  return pageMetadata({ lang, path: `/hunt/${slug}`, title: `${loc(hunt.title, lang)} · ${t.hunt.title}`, description: loc(hunt.intro, lang) });
}

/** One hunt: its clues, each hidden until solved or revealed. */
export default async function HuntDetailPage({ params }: PageProps<"/[lang]/hunt/[slug]">) {
  const { lang: raw, slug } = await params;
  const lang = resolveLocale(raw);
  const t = getMessages(lang);
  const hunt = findHunt(slug);
  const clues: ClueCard[] = hunt.clues.map((c) => {
    const place = getPlace(c.place);
    const photo = place.photos[0];
    return {
      place: c.place,
      clue: loc(c.clue, lang),
      name: loc(place.name, lang),
      categoryLabel: t.placeCategory[place.category],
      icon: placeIcon[place.category],
      href: href(lang, `/places/${place.slug}`),
      mapHref: `${href(lang, "/explore")}/?place=${place.slug}`,
      location: place.location ? { lat: place.location.lat, lng: place.location.lng } : null,
      photo: photo ? { src: photo.srcSmall ?? photo.src, alt: (lang !== "en" && photo.altLocalized?.[lang]) || photo.alt } : null,
    };
  });
  return (
    <>
      <PageIntro
        lang={lang}
        t={t}
        kicker={t.hunt.title}
        title={loc(hunt.title, lang)}
        lead={loc(hunt.intro, lang)}
        crumbs={[
          [t.nav.home, href(lang)],
          [t.hunt.title, href(lang, "/hunt")],
        ]}
      >
        <TranslationNotice status={hunt.translations} lang={lang} t={t} fallback={false} />
      </PageIntro>
      <div className={styles.expedition}>
        <div className={ui.wrap}>
          <section className={ui.section} aria-label={t.hunt.clues.replace("{n}", String(clues.length))}>
            <HuntClues hunt={hunt.slug} clues={clues} planHref={href(lang, "/plan")} />
          </section>
          <p className={ui.muted}>{t.hunt.passportIntro}</p>
        </div>
      </div>
    </>
  );
}
