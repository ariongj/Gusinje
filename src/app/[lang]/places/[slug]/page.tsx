import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BusinessCard, RouteCard, TourCard } from "@/components/content/cards";
import { FactList } from "@/components/content/FactList";
import { LocationBox } from "@/components/content/LocationBox";
import { PageIntro } from "@/components/content/PageIntro";
import { ReviewsSection } from "@/components/content/ReviewsSection";
import { ShareBox } from "@/components/content/ShareBox";
import { SourceList } from "@/components/content/SourceList";
import { TranslationNotice } from "@/components/content/TranslationNotice";
import { TripButton } from "@/components/content/TripButton";
import { VerificationPanel } from "@/components/content/VerificationPanel";
import { Notice } from "@/components/ui/Notice";
import { PhotoFigure } from "@/components/ui/PhotoFigure";
import { absoluteUrl, brand } from "@/config/brand";
import { businessesNear, places, routesForPlace, toursForPlace } from "@/content";
import { getMessages, resolveLocale } from "@/i18n";
import { href, locales } from "@/i18n/config";
import { isFallback, loc } from "@/i18n/localize";
import { jsonLd, pageMetadata } from "@/lib/seo";
import detail from "@/styles/detail.module.css";
import ui from "@/styles/ui.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => places.map((p) => ({ lang, slug: p.slug })));
}

function findPlace(slug: string) {
  const place = places.find((p) => p.slug === slug);
  if (!place) notFound();
  return place;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/places/[slug]">): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  const lang = resolveLocale(raw);
  const place = findPlace(slug);
  return pageMetadata({ lang, path: `/places/${slug}`, title: loc(place.name, lang), description: loc(place.summary, lang), image: place.photos[0] });
}

export default async function PlacePage({ params }: PageProps<"/[lang]/places/[slug]">) {
  const { lang: raw, slug } = await params;
  const lang = resolveLocale(raw);
  const t = getMessages(lang);
  const place = findPlace(slug);
  const path = `/places/${slug}`;
  const name = loc(place.name, lang);
  const nearby = businessesNear(slug);
  const placeRoutes = routesForPlace(slug);
  const placeTours = toursForPlace(slug);
  const [lead, ...gallery] = place.photos;

  const structured = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name,
    alternateName: place.altNames.map((a) => a.name),
    description: loc(place.summary, lang),
    url: absoluteUrl(href(lang, path)),
    inLanguage: lang,
    isAccessibleForFree: undefined,
    image: lead ? lead.src : undefined,
    geo: place.location ? { "@type": "GeoCoordinates", latitude: place.location.lat, longitude: place.location.lng } : undefined,
    containedInPlace: { "@type": "Place", name: "Gusinje, Montenegro" },
    publisher: { "@type": "Organization", name: brand.name[lang] },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structured)} />
      <PageIntro
        lang={lang}
        t={t}
        crumbs={[
          [t.nav.home, href(lang)],
          [t.nav.places, href(lang, "/places")],
        ]}
        kicker={`${t.placeCategory[place.category]} · ${t.area[place.area]}`}
        title={name}
        lead={loc(place.summary, lang)}
        photo={lead}
      >
        {place.altNames.length > 0 && (
          <p className={detail.alt}>
            <strong>{t.place.alsoKnownAs}:</strong> {place.altNames.map((a) => a.name + (a.note ? ` (${a.note})` : "")).join(" · ")}
          </p>
        )}
        <TranslationNotice status={place.translations} lang={lang} t={t} fallback={isFallback(place.summary, lang)} />
        <div className={ui.actions}>
          <TripButton kind="place" slug={place.slug} />
        </div>
      </PageIntro>

      <div className={ui.wrap}>
        <div className={detail.layout}>
          <div className={detail.main}>
            <section className={ui.prose}>
              {loc(place.description, lang).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>

            {place.highlights && (
              <section className={detail.block} aria-labelledby="highlights">
                <h2 id="highlights" className={ui.h2}>
                  {t.place.highlights}
                </h2>
                <ul className={detail.list}>
                  {loc(place.highlights, lang).map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </section>
            )}

            {place.warnings && place.warnings.length > 0 && (
              <Notice tone="safety" title={t.place.warnings}>
                {place.warnings.map((w) => (
                  <p key={w.en}>{loc(w, lang)}</p>
                ))}
              </Notice>
            )}

            <section className={detail.block} aria-labelledby="practical">
              <h2 id="practical" className={ui.h2}>
                {t.place.practical}
              </h2>
              <FactList
                missing={t.common.notVerifiedCheck}
                facts={[
                  { label: t.place.access, value: loc(place.access, lang) },
                  { label: t.place.seasonality, value: loc(place.seasonality, lang) },
                  { label: t.place.duration, value: loc(place.duration, lang) },
                  { label: t.place.fees, value: loc(place.fees, lang) },
                  { label: t.place.hours, value: loc(place.hours, lang) },
                  { label: t.place.accessibility, value: loc(place.accessibility, lang) },
                ]}
              />
            </section>

            {place.officialLinks && place.officialLinks.length > 0 && (
              <section className={detail.block} aria-labelledby="official">
                <h2 id="official" className={ui.h2}>
                  {t.place.official}
                </h2>
                <SourceList ids={place.officialLinks} lang={lang} t={t} />
              </section>
            )}

            {gallery.length > 0 && (
              <section className={detail.gallery} aria-label={t.credits.photos}>
                {gallery.map((photo) => (
                  <PhotoFigure key={photo.src} photo={photo} lang={lang} t={t} small sizes="(max-width: 700px) 100vw, 320px" />
                ))}
              </section>
            )}

            {placeRoutes.length > 0 && (
              <section className={detail.block} aria-labelledby="routes">
                <h2 id="routes" className={ui.h2}>
                  {t.place.routes}
                </h2>
                <div className={ui.cards}>
                  {placeRoutes.map((r) => (
                    <RouteCard key={r.slug} route={r} lang={lang} t={t} />
                  ))}
                </div>
              </section>
            )}

            <section className={detail.block} aria-labelledby="nearby">
              <h2 id="nearby" className={ui.h2}>
                {t.place.nearby}
              </h2>
              {nearby.length > 0 ? (
                <div className={ui.cards}>
                  {nearby.map((b) => (
                    <BusinessCard key={b.slug} business={b} lang={lang} t={t} />
                  ))}
                </div>
              ) : (
                <p className={ui.muted}>{t.place.nearbyNone}</p>
              )}
              <p className={ui.small}>
                {t.directory.order}{" "}
                <Link href={href(lang, "/contribute")} className={ui.textLink}>
                  {t.directory.submit}
                </Link>
              </p>
            </section>

            {placeTours.length > 0 && (
              <section className={detail.block} aria-labelledby="tours">
                <h2 id="tours" className={ui.h2}>
                  {t.place.tours}
                </h2>
                <div className={ui.cards}>
                  {placeTours.map((tour) => (
                    <TourCard key={tour.slug} tour={tour} lang={lang} t={t} />
                  ))}
                </div>
              </section>
            )}

            <ReviewsSection t={t} lang={lang} kind="place" slug={place.slug} />
          </div>

          <aside className={detail.side}>
            <LocationBox lang={lang} t={t} location={place.location} exploreQuery={`place=${place.slug}`} inScene={!!place.scene} />
            <ShareBox lang={lang} t={t} path={path} title={name} />
            <VerificationPanel verification={place.verification} lang={lang} t={t} path={path} extraSources={place.location?.sources} />
          </aside>
        </div>
      </div>
    </>
  );
}
