import { getPlace, recordPath } from "@/content";
import type { Business, Guide, Itinerary, Place, Route, VirtualTour } from "@/content/types";
import { href, type Locale } from "@/i18n/config";
import { loc, plural } from "@/i18n/localize";
import type { Messages } from "@/i18n/messages/en";
import ui from "@/styles/ui.module.css";

import { RecordCard } from "./RecordCard";
import { TripButton } from "./TripButton";

type Common = { lang: Locale; t: Messages; headingLevel?: 2 | 3 };

export function PlaceCard({ place, lang, t, headingLevel }: Common & { place: Place }) {
  return (
    <RecordCard
      href={href(lang, recordPath("place", place.slug))}
      title={loc(place.name, lang)}
      kicker={`${t.placeCategory[place.category]} · ${t.area[place.area]}`}
      text={loc(place.summary, lang)}
      photo={place.photos[0]}
      placeholder={t.common.noPhoto}
      lang={lang}
      headingLevel={headingLevel}
      badges={
        place.gem || !place.location ? (
          <>
            {place.gem && <span className={ui.badgeGold}>{t.common.gem}</span>}
            {!place.location && <span className={ui.badgeMuted}>{t.explore.noLocation}</span>}
          </>
        ) : undefined
      }
      footer={<TripButton kind="place" slug={place.slug} compact />}
    />
  );
}

export function BusinessCard({ business, lang, t, headingLevel }: Common & { business: Business }) {
  const selfReported = business.verification.status === "self-reported";
  return (
    <RecordCard
      href={href(lang, recordPath("business", business.slug))}
      title={business.name}
      kicker={`${business.categories.map((c) => t.businessCategory[c]).join(" · ")} · ${business.area ? t.area[business.area] : t.area.unknown}`}
      text={loc(business.summary, lang)}
      photo={business.photos[0]}
      placeholder={t.common.noPhoto}
      lang={lang}
      headingLevel={headingLevel}
      badges={
        <>
          {business.disclosure === "platform-creator" && <span className={ui.badgeGold}>{t.directory.rosiBadge}</span>}
          {selfReported && <span className={ui.badge}>{t.directory.selfReportedBadge}</span>}
          {business.origin ? (
            <span className={ui.badgeWarn}>{t.common.openData}</span>
          ) : (
            !business.claimed && <span className={ui.badgeMuted}>{t.directory.unclaimedBadge}</span>
          )}
        </>
      }
      footer={<TripButton kind="business" slug={business.slug} compact />}
    />
  );
}

export function RouteCard({ route, lang, t, headingLevel }: Common & { route: Route }) {
  // The photo of the place the route is about (the canyon shows the waterfall, never a guessed trail).
  const place = route.places[0] ?? route.start?.place;
  const photo = place ? getPlace(place).photos[0] : undefined;
  return (
    <RecordCard
      photo={photo}
      href={href(lang, recordPath("route", route.slug))}
      title={loc(route.name, lang)}
      kicker={`${t.hikes.type[route.type]} · ${t.area[route.area]}`}
      text={loc(route.summary, lang)}
      lang={lang}
      placeholder={t.hikes.type[route.type]}
      headingLevel={headingLevel}
      badges={
        <>
          {route.status === "awaiting-verification" ? <span className={ui.badgeWarn}>{t.hikes.awaitingShort}</span> : <span className={ui.badge}>{t.hikes.published}</span>}
          {(route.guide === "required" || route.guide === "strongly-recommended") && (
            <span className={ui.badgeMuted}>
              {t.hikes.guide}: {t.hikes.guideLevel[route.guide]}
            </span>
          )}
        </>
      }
      footer={<TripButton kind="route" slug={route.slug} compact />}
    />
  );
}

export function TipCard({ guide, lang, t, headingLevel }: Common & { guide: Guide }) {
  return (
    <RecordCard
      href={href(lang, recordPath("guide", guide.slug))}
      title={loc(guide.title, lang)}
      kicker={t.nav.tips}
      text={loc(guide.summary, lang)}
      lang={lang}
      placeholder={loc(guide.title, lang)}
      headingLevel={headingLevel}
      footer={<TripButton kind="guide" slug={guide.slug} compact />}
    />
  );
}

export function TourCard({ tour, lang, t, headingLevel }: Common & { tour: VirtualTour }) {
  const first = tour.stops.find((s) => s.ref?.kind === "place" && getPlace(s.ref.slug).photos.length);
  const photo = first?.ref ? getPlace(first.ref.slug).photos[0] : undefined;
  return (
    <RecordCard
      photo={photo}
      href={href(lang, recordPath("tour", tour.slug))}
      title={loc(tour.title, lang)}
      kicker={`${t.explore.guidedTour} · ${plural(lang, tour.stops.length, t.explore.stops)}`}
      text={loc(tour.intro, lang)}
      lang={lang}
      placeholder={t.explore.guidedTour}
      headingLevel={headingLevel}
    />
  );
}

export function ItineraryCard({ itinerary, lang, t, headingLevel }: Common & { itinerary: Itinerary }) {
  return (
    <RecordCard
      href={href(lang, recordPath("itinerary", itinerary.slug))}
      title={loc(itinerary.title, lang)}
      kicker={`${t.plan.length[itinerary.length]} · ${t.plan.level[itinerary.level]}`}
      text={loc(itinerary.summary, lang)}
      lang={lang}
      placeholder={t.plan.length[itinerary.length]}
      headingLevel={headingLevel}
    />
  );
}
