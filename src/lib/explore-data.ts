import "server-only";

import type { ExploreTour, ExploreTourStop } from "@/components/explore/Explorer";
import type { CameraTarget, ExploreItem } from "@/components/explore/types";
import { creditText } from "@/components/ui/PhotoCredit";
import { photoAlt } from "@/components/ui/PhotoFigure";
import { businesses, businessLegendGroup, getBusiness, getPlace, places, placeGroup, recordPath, tours } from "@/content";
import type { Business, MapCamera, Photo, Place } from "@/content/types";
import { href, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n";
import { fold, loc } from "@/i18n/localize";

function photoData(photo: Photo | undefined, lang: Locale) {
  if (!photo) return undefined;
  const t = getMessages(lang);
  return { src: photo.srcSmall ?? photo.src, alt: photoAlt(photo, lang), credit: creditText(photo.credit, t), creditHref: photo.credit.href };
}

export function placeItem(place: Place, lang: Locale): ExploreItem {
  const t = getMessages(lang);
  const name = loc(place.name, lang);
  return {
    key: `place:${place.slug}`,
    kind: "place",
    slug: place.slug,
    name,
    categoryLabel: t.placeCategory[place.category],
    group: placeGroup[place.category],
    area: t.area[place.area],
    summary: loc(place.summary, lang),
    search: fold([place.name.en, place.name.sq, place.name.cnr, ...place.altNames.map((a) => a.name), t.placeCategory[place.category]].filter(Boolean).join(" ")),
    href: href(lang, recordPath("place", place.slug)),
    photo: photoData(place.photos[0], lang),
    location: place.location ? { lat: place.location.lat, lng: place.location.lng, precision: place.location.precision, status: place.location.status } : undefined,
  };
}

export function businessItem(business: Business, lang: Locale): ExploreItem {
  const t = getMessages(lang);
  const host = business.partOf ? getBusiness(business.partOf) : undefined;
  const location = business.location ?? host?.location;
  return {
    key: `business:${business.slug}`,
    kind: "business",
    slug: business.slug,
    name: business.name,
    categoryLabel: business.categories.map((c) => t.businessCategory[c]).join(" · "),
    group: businessLegendGroup(business),
    area: business.area ? t.area[business.area] : t.area.unknown,
    summary: loc(business.summary, lang),
    search: fold([business.name, ...(business.altNames ?? []), ...business.categories.map((c) => t.businessCategory[c])].join(" ")),
    href: href(lang, recordPath("business", business.slug)),
    photo: photoData(business.photos[0], lang),
    location: location ? { lat: location.lat, lng: location.lng, precision: location.precision, status: location.status } : undefined,
    hostKey: host ? `business:${host.slug}` : undefined,
    hostName: host?.name,
    disclosure: business.disclosure === "platform-creator" ? t.directory.rosiBadge : undefined,
  };
}

/** Everything the explorer shows: places and listings. */
export function exploreItems(lang: Locale): ExploreItem[] {
  return [...places.map((p) => placeItem(p, lang)), ...businesses.map((b) => businessItem(b, lang))];
}

/** A tour stop's camera, resolved to a mapped position (never an invented one). */
function cameraTarget(view: MapCamera): CameraTarget {
  if (view === "overview" || view === "valley") return { kind: view };
  const place = getPlace(view.place);
  if (!place.location) throw new Error(`Tour camera points at "${view.place}", which has no verified location`);
  return { kind: "point", lng: place.location.lng, lat: place.location.lat, area: place.location.precision === "area", bearing: view.bearing, zoom: view.zoom };
}

export function exploreTours(lang: Locale): ExploreTour[] {
  return tours.map((tour) => ({
    slug: tour.slug,
    title: loc(tour.title, lang),
    intro: loc(tour.intro, lang),
    textHref: href(lang, recordPath("tour", tour.slug)),
    stops: tour.stops.map((stop): ExploreTourStop => {
      const record = stop.ref ? (stop.ref.kind === "place" ? getPlace(stop.ref.slug) : getBusiness(stop.ref.slug)) : undefined;
      return {
        camera: cameraTarget(stop.view),
        key: stop.ref ? `${stop.ref.kind}:${stop.ref.slug}` : undefined,
        kicker: loc(stop.kicker, lang),
        title: loc(stop.title, lang),
        text: loc(stop.text, lang),
        photo: photoData(record?.photos[0], lang),
        href: stop.ref ? href(lang, recordPath(stop.ref.kind, stop.ref.slug)) : undefined,
      };
    }),
  }));
}
