import "server-only";

import type { ExploreTour, ExploreTourStop } from "@/components/explore/Explorer";
import type { CameraTarget, ExploreItem } from "@/components/explore/types";
import { creditText } from "@/components/ui/PhotoCredit";
import { placeholderPicture } from "@/content/demo";
import { photoAlt } from "@/components/ui/PhotoFigure";
import { businesses, businessLegendGroup, getBusiness, getPlace, getRoute, itineraries, places, placeGroup, recordPath, tours } from "@/content";
import type { MapIcon } from "@/components/map/icons";
import type { Business, BusinessCategory, MapCamera, Photo, Place, PlaceCategory } from "@/content/types";

const placeIcon: Record<PlaceCategory, MapIcon> = {
  town: "town",
  village: "house",
  waterfall: "waterfall",
  spring: "drop",
  lake: "lake",
  valley: "valley",
  viewpoint: "view",
  mountain: "mountain",
  culture: "landmark",
};

const businessIcon: Record<BusinessCategory, MapIcon> = {
  hotel: "bed",
  guesthouse: "bed",
  cabin: "cabin",
  campsite: "tent",
  restaurant: "fork",
  cafe: "cup",
  shop: "bag",
  guide: "compass",
  activity: "compass",
  transport: "bus",
  rental: "bag",
  "visitor-info": "info",
  pharmacy: "cross",
  atm: "cash",
  fuel: "fuel",
};
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
    icon: placeIcon[place.category],
    area: t.area[place.area],
    summary: loc(place.summary, lang),
    search: fold([place.name.en, place.name.sq, place.name.cnr, ...place.altNames.map((a) => a.name), t.placeCategory[place.category]].filter(Boolean).join(" ")),
    href: href(lang, recordPath("place", place.slug)),
    photo: photoData(place.photos[0] ?? placeholderPicture(place.category), lang),
    photos: place.photos.slice(0, 5).map((p) => photoData(p, lang)!),
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
    icon: businessIcon[business.categories[0]],
    area: business.area ? t.area[business.area] : t.area.unknown,
    summary: loc(business.summary, lang),
    search: fold([business.name, ...(business.altNames ?? []), ...business.categories.map((c) => t.businessCategory[c])].join(" ")),
    href: href(lang, recordPath("business", business.slug)),
    photo: photoData(business.photos[0], lang),
    photos: business.photos.slice(0, 5).map((p) => photoData(p, lang)!),
    location: location ? { lat: location.lat, lng: location.lng, precision: location.precision, status: location.status } : undefined,
    hostKey: host ? `business:${host.slug}` : undefined,
    hostName: host?.name,
    disclosure: business.disclosure === "platform-creator" ? t.directory.rosiBadge : undefined,
    openData: business.origin?.kind === "open-data" ? true : undefined,
    demo: business.origin?.kind === "demo" ? true : undefined,
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

/**
 * Journeys: the itinerary templates flown on the 3D map, day by day. Each
 * mapped stop gets its own camera; a walk is shown at its starting place.
 * Stops without a verified position (and travel tips) stay in the written
 * plan only.
 */
export function exploreJourneys(lang: Locale): ExploreTour[] {
  const t = getMessages(lang);
  return itineraries.map((it) => {
    const stops: ExploreTourStop[] = [];
    for (const day of it.days) {
      const dayLabel = loc(day.title, lang);
      for (const stop of day.stops) {
        if (stop.ref.kind === "guide") continue;
        if (stop.ref.kind === "route") {
          const route = getRoute(stop.ref.slug);
          const at = route.start?.place ?? route.places[0];
          const place = at ? getPlace(at) : undefined;
          if (!place?.location) continue;
          stops.push({
            camera: cameraTarget({ place: place.slug }),
            key: `place:${place.slug}`,
            kicker: `${dayLabel} · ${t.search.kind.route}`,
            title: loc(route.name, lang),
            text: stop.note ? loc(stop.note, lang) : loc(route.summary, lang),
            photo: photoData(place.photos[0], lang),
            href: href(lang, recordPath("route", route.slug)),
          });
          continue;
        }
        const record = stop.ref.kind === "place" ? getPlace(stop.ref.slug) : getBusiness(stop.ref.slug);
        const location = record.kind === "place" ? record.location : (record.location ?? (record.partOf ? getBusiness(record.partOf).location : null));
        if (!location) continue;
        stops.push({
          camera: { kind: "point", lng: location.lng, lat: location.lat, area: location.precision === "area" },
          key: `${stop.ref.kind}:${stop.ref.slug}`,
          kicker: dayLabel,
          title: record.kind === "place" ? loc(record.name, lang) : record.name,
          text: stop.note ? loc(stop.note, lang) : loc(record.summary, lang),
          photo: photoData(record.photos[0], lang),
          href: href(lang, recordPath(stop.ref.kind, stop.ref.slug)),
        });
      }
    }
    return {
      slug: it.slug,
      title: loc(it.title, lang),
      intro: loc(it.summary, lang),
      textHref: href(lang, recordPath("itinerary", it.slug)),
      stops: [
        { camera: { kind: "overview" }, kicker: `${t.plan.length[it.length]} · ${t.plan.level[it.level]}`, title: loc(it.title, lang), text: loc(it.summary, lang) },
        ...stops,
      ],
    };
  });
}
