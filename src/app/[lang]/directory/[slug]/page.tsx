import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BusinessCard, PlaceCard } from "@/components/content/cards";
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
import { absoluteUrl } from "@/config/brand";
import { businesses, businessLocation, getBusiness, getPlace, hostedBy, inSection } from "@/content";
import type { Basis, Business, Feature } from "@/content/types";
import { getMessages, resolveLocale } from "@/i18n";
import { formatDate, href, intlLocale, locales, type Locale } from "@/i18n/config";
import { fill, loc } from "@/i18n/localize";
import type { Messages } from "@/i18n/messages/en";
import { jsonLd, pageMetadata } from "@/lib/seo";
import detail from "@/styles/detail.module.css";
import ui from "@/styles/ui.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => businesses.map((b) => ({ lang, slug: b.slug })));
}

function findBusiness(slug: string) {
  const business = businesses.find((b) => b.slug === slug);
  if (!business) notFound();
  return business;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/directory/[slug]">): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  const lang = resolveLocale(raw);
  const b = findBusiness(slug);
  return pageMetadata({ lang, path: `/directory/${slug}`, title: b.name, description: loc(b.summary, lang), image: b.photos[0] });
}

/** The directory section a listing belongs to, for the breadcrumb. */
function section(b: Business, t: Messages): [string, string] {
  if (inSection(b, "stay")) return [t.nav.stay, "/stay"];
  if (inSection(b, "eat-drink")) return [t.nav.eatDrink, "/eat-drink"];
  if (inSection(b, "guides-experiences")) return [t.nav.guides, "/guides-experiences"];
  return [t.footer.directory, "/directory"];
}

/** Language codes in the reader's language ("sq" → "Albanian" / "shqip" / "albanski"). */
function languageNames(codes: string[], lang: Locale): string {
  for (const tag of intlLocale[lang]) {
    try {
      const names = new Intl.DisplayNames([tag], { type: "language" });
      return codes.map((c) => names.of(c) ?? c).join(", ");
    } catch {
      // try the next tag
    }
  }
  return codes.join(", ");
}

function basisLabel(basis: Basis, t: Messages) {
  return <span className={basis === "verified" ? ui.badge : ui.badgeGold}>{t.verification.basis[basis]}</span>;
}

function featureValue(f: Feature | undefined, lang: Locale, t: Messages) {
  if (!f) return undefined;
  return (
    <span>
      {loc(f.label, lang)} {basisLabel(f.basis, t)}
    </span>
  );
}

const schemaType: Partial<Record<Business["categories"][number], string>> = {
  hotel: "Hotel",
  guesthouse: "LodgingBusiness",
  cabin: "LodgingBusiness",
  campsite: "Campground",
  restaurant: "Restaurant",
  cafe: "CafeOrCoffeeShop",
  "visitor-info": "TouristInformationCenter",
};

export default async function BusinessPage({ params }: PageProps<"/[lang]/directory/[slug]">) {
  const { lang: raw, slug } = await params;
  const lang = resolveLocale(raw);
  const t = getMessages(lang);
  const b = findBusiness(slug);
  const path = `/directory/${slug}`;
  const host = b.partOf ? getBusiness(b.partOf) : undefined;
  const location = businessLocation(b);
  const alsoHere = hostedBy(b.slug);
  const [sectionLabel, sectionPath] = section(b, t);
  const [lead, ...gallery] = b.photos;
  const mail = b.contact.email
    ? `mailto:${b.contact.email}?subject=${encodeURIComponent(`${t.business.enquirySubject} — ${b.name}`)}`
    : null;

  const structured = {
    "@context": "https://schema.org",
    "@type": schemaType[b.categories[0]] ?? "LocalBusiness",
    name: b.name,
    alternateName: b.altNames,
    description: loc(b.summary, lang),
    url: absoluteUrl(href(lang, path)),
    image: lead?.src,
    telephone: b.contact.phones?.[0]?.tel,
    email: b.contact.email,
    sameAs: [b.contact.website?.url, ...(b.contact.social ?? []).map((s) => s.url)].filter(Boolean),
    address: b.address ? { "@type": "PostalAddress", streetAddress: loc(b.address, "en"), addressCountry: "ME" } : undefined,
    geo: location ? { "@type": "GeoCoordinates", latitude: location.lat, longitude: location.lng } : undefined,
  };

  const attributes = b.attributes;
  const languages = attributes?.languages;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structured)} />
      <PageIntro
        lang={lang}
        t={t}
        crumbs={[
          [t.nav.home, href(lang)],
          [sectionLabel, href(lang, sectionPath)],
        ]}
        kicker={`${b.categories.map((c) => t.businessCategory[c]).join(" · ")} · ${b.area ? t.area[b.area] : t.area.unknown}`}
        title={b.name}
        lead={loc(b.summary, lang)}
        photo={lead}
      >
        {b.altNames && b.altNames.length > 0 && (
          <p className={detail.alt}>
            <strong>{t.place.alsoKnownAs}:</strong> {b.altNames.join(" · ")}
          </p>
        )}
        <div className={ui.chips}>
          {b.disclosure === "platform-creator" && <span className={ui.badgeGold}>{t.directory.rosiBadge}</span>}
          <span className={b.claimed ? ui.badge : ui.badgeMuted}>{b.claimed ? t.business.claimed : t.business.unclaimed}</span>
          {b.verification.status === "self-reported" && <span className={ui.badge}>{t.directory.selfReportedBadge}</span>}
        </div>
        <TranslationNotice status={b.translations} lang={lang} t={t} />
        <div className={ui.actions}>
          <TripButton kind="business" slug={b.slug} />
        </div>
      </PageIntro>

      <div className={ui.wrap}>
        <div className={detail.layout}>
          <div className={detail.main}>
            {b.disclosure === "platform-creator" && <Notice tone="info">{t.business.disclosureCreator}</Notice>}

            <section className={detail.block} aria-labelledby="contact">
              <h2 id="contact" className={ui.h2}>
                {t.business.contact}
              </h2>
              {b.contact.phones || b.contact.email || b.contact.website || location ? (
                <div className={ui.actions}>
                  {location && (
                    <a className={ui.button} href={`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`} target="_blank" rel="noopener noreferrer">
                      {t.common.directions}
                    </a>
                  )}
                  {b.contact.website && (
                    <a className={ui.buttonGhost} href={b.contact.website.url} target="_blank" rel="noopener noreferrer">
                      {t.common.website}
                    </a>
                  )}
                  {b.contact.phones?.map((p) => (
                    <a key={p.tel} className={ui.buttonGhost} href={`tel:${p.tel}`}>
                      {t.common.call} {p.display}
                    </a>
                  ))}
                  {b.contact.phones
                    ?.filter((p) => p.whatsapp?.approved)
                    .map((p) => (
                      <a key={`wa-${p.tel}`} className={ui.buttonGhost} href={`https://wa.me/${p.tel.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                        {t.common.whatsapp}
                      </a>
                    ))}
                  {mail && (
                    <a className={ui.buttonGhost} href={mail}>
                      {t.common.sendEnquiry}
                    </a>
                  )}
                </div>
              ) : (
                <p className={ui.muted}>{t.business.noContact}</p>
              )}
              {mail && <p className={ui.small + " " + ui.muted}>{t.business.enquiryNote}</p>}
              {b.contact.social && b.contact.social.length > 0 && (
                <ul className={detail.links}>
                  {b.contact.social.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className={ui.textLink}>
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              {b.contact.booking && b.contact.booking.length > 0 && (
                <p className={ui.small}>
                  {t.business.booking}:{" "}
                  {b.contact.booking.map((x, i) => (
                    <span key={x.url}>
                      {i > 0 && ", "}
                      <a href={x.url} target="_blank" rel="noopener noreferrer" className={ui.textLink}>
                        {x.label}
                      </a>
                    </span>
                  ))}
                </p>
              )}
            </section>

            {b.description && (
              <section className={ui.prose}>
                {loc(b.description, lang).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </section>
            )}

            {b.services && b.services.length > 0 && (
              <section className={detail.block} aria-labelledby="services">
                <h2 id="services" className={ui.h2}>
                  {t.business.services}
                </h2>
                <ul className={detail.list}>
                  {b.services.map((s) => (
                    <li key={s.label.en}>
                      {loc(s.label, lang)} {basisLabel(s.basis, t)}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className={detail.block} aria-labelledby="facts">
              <h2 id="facts" className={ui.h2}>
                {t.business.attributes}
              </h2>
              <FactList
                missing={t.common.notVerified}
                facts={[
                  {
                    label: t.business.hours,
                    value: b.hours ? (
                      <span>
                        {loc(b.hours.text, lang)} {basisLabel(b.hours.basis, t)}
                      </span>
                    ) : undefined,
                    note: b.hours ? fill(t.business.asOf, { date: formatDate(b.hours.asOf, lang, "month") }) : undefined,
                  },
                  { label: t.business.prices, value: b.prices ? loc(b.prices.text, lang) : t.business.pricesNone },
                  { label: t.business.parking, value: featureValue(attributes?.parking, lang, t) },
                  { label: t.business.family, value: featureValue(attributes?.family, lang, t) },
                  { label: t.business.accessibility, value: featureValue(attributes?.accessibility, lang, t) },
                  { label: t.business.payment, value: featureValue(attributes?.payment, lang, t) },
                  {
                    label: t.business.languages,
                    value: languages ? (
                      <span>
                        {languageNames(languages.value, lang)} {basisLabel(languages.basis, t)}
                      </span>
                    ) : undefined,
                  },
                ]}
              />
            </section>

            {b.listings && b.listings.length > 0 && (
              <section className={detail.block} aria-labelledby="listings">
                <h2 id="listings" className={ui.h2}>
                  {t.business.officialListings}
                </h2>
                <SourceList ids={b.listings} lang={lang} t={t} />
              </section>
            )}

            {gallery.length > 0 && (
              <section className={detail.gallery} aria-label={t.credits.photos}>
                {gallery.map((photo) => (
                  <PhotoFigure key={photo.src} photo={photo} lang={lang} t={t} small sizes="(max-width: 700px) 100vw, 320px" />
                ))}
              </section>
            )}

            {(alsoHere.length > 0 || host) && (
              <section className={detail.block} aria-labelledby="also-here">
                <h2 id="also-here" className={ui.h2}>
                  {t.business.alsoHere}
                </h2>
                <div className={ui.cards}>
                  {[...(host ? [host] : []), ...alsoHere].map((x) => (
                    <BusinessCard key={x.slug} business={x} lang={lang} t={t} />
                  ))}
                </div>
              </section>
            )}

            {b.nearby.length > 0 && (
              <section className={detail.block} aria-labelledby="nearby-places">
                <h2 id="nearby-places" className={ui.h2}>
                  {t.business.nearbyPlaces}
                </h2>
                <div className={ui.cards}>
                  {b.nearby.map((s) => (
                    <PlaceCard key={s} place={getPlace(s)} lang={lang} t={t} />
                  ))}
                </div>
              </section>
            )}

            <ReviewsSection t={t} lang={lang} kind="business" slug={b.slug} />

            <section className={detail.block}>
              <div className={ui.actions}>
                {!b.claimed && (
                  <Link className={ui.buttonGhost} href={`${href(lang, "/contribute")}?type=claim&listing=${b.slug}`}>
                    {t.business.claim}
                  </Link>
                )}
                <Link className={ui.buttonGhost} href={`${href(lang, "/contribute")}?type=correction&page=${encodeURIComponent(path)}`}>
                  {t.business.correct}
                </Link>
              </div>
            </section>
          </div>

          <aside className={detail.side}>
            <LocationBox
              lang={lang}
              t={t}
              location={location}
              exploreQuery={`listing=${b.slug}`}
              hostNote={host ? fill(t.business.partOf, { name: host.name }) : b.address ? loc(b.address, lang) : undefined}
            />
            <ShareBox lang={lang} t={t} path={path} title={b.name} />
            <VerificationPanel verification={b.verification} lang={lang} t={t} path={path} />
          </aside>
        </div>
      </div>
    </>
  );
}
