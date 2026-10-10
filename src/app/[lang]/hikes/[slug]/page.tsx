import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PlaceCard } from "@/components/content/cards";
import { FactList } from "@/components/content/FactList";
import { PageIntro } from "@/components/content/PageIntro";
import { ReviewsSection } from "@/components/content/ReviewsSection";
import { ShareBox } from "@/components/content/ShareBox";
import { SourceList } from "@/components/content/SourceList";
import { TranslationNotice } from "@/components/content/TranslationNotice";
import { TripButton } from "@/components/content/TripButton";
import { VerificationPanel } from "@/components/content/VerificationPanel";
import { Notice } from "@/components/ui/Notice";
import { getPlace, routes } from "@/content";
import { getSource } from "@/content/sources";
import type { Reported } from "@/content/types";
import { getMessages, resolveLocale } from "@/i18n";
import { href, locales, type Locale } from "@/i18n/config";
import { fill, loc } from "@/i18n/localize";
import type { Messages } from "@/i18n/messages/en";
import { pageMetadata } from "@/lib/seo";
import detail from "@/styles/detail.module.css";
import ui from "@/styles/ui.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => routes.map((r) => ({ lang, slug: r.slug })));
}

function findRoute(slug: string) {
  const route = routes.find((r) => r.slug === slug);
  if (!route) notFound();
  return route;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/hikes/[slug]">): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  const lang = resolveLocale(raw);
  const route = findRoute(slug);
  const place = route.places[0] ? getPlace(route.places[0]) : undefined;
  return pageMetadata({ lang, path: `/hikes/${slug}`, title: loc(route.name, lang), description: loc(route.summary, lang), image: place?.photos[0] });
}

/** A reported figure: the value, who reported it, and any note on other sources. */
function reported(r: Reported<string> | undefined, unit: string, lang: Locale, t: Messages) {
  if (!r) return {};
  return {
    value: (
      <span>
        {r.value}
        {unit && ` ${unit}`}
      </span>
    ),
    note: (
      <>
        {fill(t.hikes.reportedBy, { source: getSource(r.source).publisher })}
        {r.note && <> — {loc(r.note, lang)}</>}
      </>
    ),
  };
}

export default async function RoutePage({ params }: PageProps<"/[lang]/hikes/[slug]">) {
  const { lang: raw, slug } = await params;
  const lang = resolveLocale(raw);
  const t = getMessages(lang);
  const route = findRoute(slug);
  const path = `/hikes/${slug}`;
  const name = loc(route.name, lang);
  const start = route.start?.place ? getPlace(route.start.place) : undefined;
  const demanding = route.type === "canyon" || route.type === "summit" || route.type === "cross-border";

  return (
    <>
      <PageIntro
        lang={lang}
        t={t}
        crumbs={[
          [t.nav.home, href(lang)],
          [t.nav.guides, href(lang, "/guides-experiences")],
          [t.hikes.title, href(lang, "/hikes")],
        ]}
        kicker={`${t.hikes.type[route.type]} · ${t.area[route.area]}`}
        title={name}
        lead={loc(route.summary, lang)}
      >
        <div className={ui.chips}>
          {route.status === "awaiting-verification" ? <span className={ui.badgeWarn}>{t.hikes.awaitingShort}</span> : <span className={ui.badge}>{t.hikes.published}</span>}
          {demanding && <span className={ui.badgeWarn}>{t.hikes.notForFamilies}</span>}
        </div>
        <TranslationNotice status={route.translations} lang={lang} t={t} />
        <div className={ui.actions}>
          <TripButton kind="route" slug={route.slug} />
        </div>
      </PageIntro>

      <div className={ui.wrap}>
        <div className={detail.layout}>
          <div className={detail.main}>
            {route.status === "awaiting-verification" && (
              <Notice tone="warning" title={t.hikes.awaiting}>
                <p>{t.hikes.awaitingText}</p>
              </Notice>
            )}

            <section className={detail.block} aria-labelledby="facts">
              <h2 id="facts" className={ui.h2}>
                {t.place.practical}
              </h2>
              <FactList
                missing={t.common.notVerified}
                facts={[
                  {
                    label: t.hikes.start,
                    value:
                      start || route.start?.text ? (
                        <span>
                          {start && (
                            <Link href={href(lang, `/places/${start.slug}`)} className={ui.textLink}>
                              {loc(start.name, lang)}
                            </Link>
                          )}
                          {start && route.start?.text && " — "}
                          {route.start?.text && loc(route.start.text, lang)}
                        </span>
                      ) : undefined,
                  },
                  { label: t.hikes.distance, ...reported(route.distanceKm, t.hikes.km, lang, t) },
                  { label: t.hikes.ascent, ...reported(route.ascentM, t.hikes.m, lang, t) },
                  {
                    label: t.hikes.duration,
                    value: route.duration ? loc(route.duration.value, lang) : undefined,
                    note: route.duration ? (
                      <>
                        {fill(t.hikes.reportedBy, { source: getSource(route.duration.source).publisher })}
                        {route.duration.note && <> — {loc(route.duration.note, lang)}</>}
                      </>
                    ) : undefined,
                  },
                  {
                    label: t.hikes.difficulty,
                    value: route.difficulty ? loc(route.difficulty.value, lang) : undefined,
                    note: route.difficulty ? fill(t.hikes.reportedBy, { source: getSource(route.difficulty.source).publisher }) : undefined,
                  },
                  {
                    label: t.hikes.season,
                    value: route.seasonality ? loc(route.seasonality.value, lang) : undefined,
                    note: route.seasonality ? fill(t.hikes.reportedBy, { source: getSource(route.seasonality.source).publisher }) : undefined,
                  },
                  {
                    label: t.hikes.equipment,
                    value: route.equipment ? (
                      <ul className={detail.list}>
                        {loc(route.equipment, lang).map((e) => (
                          <li key={e}>{e}</li>
                        ))}
                      </ul>
                    ) : undefined,
                  },
                  { label: t.hikes.guide, value: t.hikes.guideLevel[route.guide] },
                  { label: t.place.access, value: loc(route.access, lang) },
                ]}
              />
            </section>

            {route.description && (
              <section className={ui.prose}>
                {loc(route.description, lang).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </section>
            )}

            {route.permits && (
              <Notice tone="warning" title={t.hikes.permits}>
                <p>{loc(route.permits.text, lang)}</p>
                <SourceList ids={route.permits.sources} lang={lang} t={t} />
              </Notice>
            )}

            <Notice tone="safety" title={t.place.warnings}>
              {route.warnings.map((w) => (
                <p key={w.en}>{loc(w, lang)}</p>
              ))}
              <p>{t.hikes.checkConditions}</p>
              <p>{t.hikes.noTrack}</p>
            </Notice>

            {route.places.length > 0 && (
              <section className={detail.block} aria-labelledby="route-places">
                <h2 id="route-places" className={ui.h2}>
                  {t.hikes.places}
                </h2>
                <div className={ui.cards}>
                  {[...new Set([...(start ? [start.slug] : []), ...route.places])].map((s) => (
                    <PlaceCard key={s} place={getPlace(s)} lang={lang} t={t} />
                  ))}
                </div>
              </section>
            )}

            {route.officialLinks.length > 0 && (
              <section className={detail.block} aria-labelledby="official">
                <h2 id="official" className={ui.h2}>
                  {t.hikes.official}
                </h2>
                <SourceList ids={route.officialLinks} lang={lang} t={t} />
              </section>
            )}

            <ReviewsSection t={t} lang={lang} kind="route" slug={route.slug} />
          </div>

          <aside className={detail.side}>
            <ShareBox lang={lang} t={t} path={path} title={name} />
            <VerificationPanel verification={route.verification} lang={lang} t={t} path={path} />
          </aside>
        </div>
      </div>
    </>
  );
}
