import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageIntro } from "@/components/content/PageIntro";
import { ShareBox } from "@/components/content/ShareBox";
import { TranslationNotice } from "@/components/content/TranslationNotice";
import { AddTemplateButton } from "@/components/plan/AddTemplateButton";
import { Notice } from "@/components/ui/Notice";
import { itineraries, recordPath } from "@/content";
import { getMessages, resolveLocale } from "@/i18n";
import { href, locales } from "@/i18n/config";
import { loc } from "@/i18n/localize";
import { catalogue } from "@/lib/catalogue";
import { pageMetadata } from "@/lib/seo";
import type { Trip } from "@/lib/trip";
import detail from "@/styles/detail.module.css";
import ui from "@/styles/ui.module.css";

import styles from "./itinerary.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => itineraries.map((i) => ({ lang, slug: i.slug })));
}

function findItinerary(slug: string) {
  const it = itineraries.find((i) => i.slug === slug);
  if (!it) notFound();
  return it;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/plan/itineraries/[slug]">): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  const lang = resolveLocale(raw);
  const it = findItinerary(slug);
  return pageMetadata({ lang, path: `/plan/itineraries/${slug}`, title: loc(it.title, lang), description: loc(it.summary, lang) });
}

export default async function ItineraryPage({ params }: PageProps<"/[lang]/plan/itineraries/[slug]">) {
  const { lang: raw, slug } = await params;
  const lang = resolveLocale(raw);
  const t = getMessages(lang);
  const it = findItinerary(slug);
  const names = catalogue(lang);
  const title = loc(it.title, lang);
  const asTrip: Trip = {
    version: 1,
    days: it.days.length,
    items: it.days.flatMap((d, i) => d.stops.map((s) => ({ kind: s.ref.kind, slug: s.ref.slug, day: i + 1, note: s.note ? loc(s.note, lang) : "" }))),
  };
  return (
    <>
      <PageIntro
        lang={lang}
        t={t}
        crumbs={[
          [t.nav.home, href(lang)],
          [t.nav.plan, href(lang, "/plan")],
        ]}
        kicker={`${t.plan.length[it.length]} · ${t.plan.level[it.level]}`}
        title={title}
        lead={loc(it.summary, lang)}
      >
        <p className={detail.alt}>
          <strong>{t.plan.interests}:</strong> {loc(it.interests, lang)}
        </p>
        <TranslationNotice status={it.translations} lang={lang} t={t} />
        <AddTemplateButton trip={asTrip} />
      </PageIntro>
      <div className={ui.wrap}>
        <div className={detail.layout}>
          <div className={detail.main}>
            <Notice tone="info">{t.plan.noRouting}</Notice>
            {it.days.map((day, i) => (
              <section key={i} className={styles.day} aria-labelledby={`d${i}`}>
                <h2 id={`d${i}`} className={ui.h2}>
                  {loc(day.title, lang)}
                </h2>
                <ol className={styles.stops}>
                  {day.stops.map((stop) => {
                    const entry = names[`${stop.ref.kind}:${stop.ref.slug}`];
                    return (
                      <li key={`${stop.ref.kind}:${stop.ref.slug}`} className={styles.stop}>
                        <p className={styles.kind}>{entry.kindLabel}</p>
                        <Link href={href(lang, recordPath(stop.ref.kind, stop.ref.slug))} className={styles.title}>
                          {entry.title}
                        </Link>
                        {stop.note && <p className={styles.note}>{loc(stop.note, lang)}</p>}
                      </li>
                    );
                  })}
                </ol>
              </section>
            ))}
          </div>
          <aside className={detail.side}>
            <ShareBox lang={lang} t={t} path={`/plan/itineraries/${slug}`} title={title} />
          </aside>
        </div>
      </div>
    </>
  );
}
