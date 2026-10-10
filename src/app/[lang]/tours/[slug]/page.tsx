import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageIntro } from "@/components/content/PageIntro";
import { ShareBox } from "@/components/content/ShareBox";
import { TranslationNotice } from "@/components/content/TranslationNotice";
import { Notice } from "@/components/ui/Notice";
import { PhotoFigure } from "@/components/ui/PhotoFigure";
import { getBusiness, getPlace, recordPath, tours } from "@/content";
import { getMessages, resolveLocale } from "@/i18n";
import { href, locales } from "@/i18n/config";
import { fill, loc, plural } from "@/i18n/localize";
import { pageMetadata } from "@/lib/seo";
import detail from "@/styles/detail.module.css";
import ui from "@/styles/ui.module.css";

import styles from "./tour.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => tours.map((tour) => ({ lang, slug: tour.slug })));
}

function findTour(slug: string) {
  const tour = tours.find((x) => x.slug === slug);
  if (!tour) notFound();
  return tour;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/tours/[slug]">): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  const lang = resolveLocale(raw);
  const tour = findTour(slug);
  return pageMetadata({ lang, path: `/tours/${slug}`, title: loc(tour.title, lang), description: loc(tour.intro, lang) });
}

export default async function TourPage({ params }: PageProps<"/[lang]/tours/[slug]">) {
  const { lang: raw, slug } = await params;
  const lang = resolveLocale(raw);
  const t = getMessages(lang);
  const tour = findTour(slug);
  const title = loc(tour.title, lang);
  return (
    <>
      <PageIntro
        lang={lang}
        t={t}
        crumbs={[
          [t.nav.home, href(lang)],
          [t.explore.toursTitle, href(lang, "/tours")],
        ]}
        kicker={`${t.explore.guidedTour} · ${plural(lang, tour.stops.length, t.explore.stops)}`}
        title={title}
        lead={loc(tour.intro, lang)}
      >
        <TranslationNotice status={tour.translations} lang={lang} t={t} />
        <div className={ui.actions}>
          <Link href={`${href(lang, "/explore")}?tour=${tour.slug}`} className={ui.button}>
            {t.explore.startTour}
          </Link>
        </div>
      </PageIntro>
      <div className={ui.wrap}>
        <div className={detail.layout}>
          <div className={detail.main}>
            <Notice tone="info">{t.explore.tourDisclaimer}</Notice>
            <ol className={styles.stops}>
              {tour.stops.map((stop, i) => {
                const record = stop.ref ? (stop.ref.kind === "place" ? getPlace(stop.ref.slug) : getBusiness(stop.ref.slug)) : undefined;
                const photo = record?.photos[0];
                return (
                  <li key={i} className={styles.stop}>
                    <p className={styles.position}>{fill(t.explore.stopOf, { i: i + 1, n: tour.stops.length })}</p>
                    <div className={styles.stopGrid}>
                      <div>
                        <p className={ui.kicker}>{loc(stop.kicker, lang)}</p>
                        <h2 className={styles.stopTitle}>{loc(stop.title, lang)}</h2>
                        <p className={styles.stopText}>{loc(stop.text, lang)}</p>
                        {stop.ref && (
                          <Link href={href(lang, recordPath(stop.ref.kind, stop.ref.slug))} className={ui.textLink}>
                            {t.common.openPage}
                          </Link>
                        )}
                      </div>
                      {photo && <PhotoFigure photo={photo} lang={lang} t={t} small sizes="(max-width: 700px) 100vw, 320px" />}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
          <aside className={detail.side}>
            <ShareBox lang={lang} t={t} path={`/tours/${slug}`} title={title} />
          </aside>
        </div>
      </div>
    </>
  );
}
