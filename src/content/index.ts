/**
 * Lookups over the content records. Everything that lists, links or
 * cross-references records goes through here, so relations stay consistent.
 */

import type { LegendGroup } from "@/components/explore/types";

import { businesses } from "./businesses";
import { guides } from "./guides";
import { itineraries } from "./itineraries";
import { places } from "./places";
import { routes } from "./routes";
import { tours } from "./tours";
import type { AnyRecord, Business, BusinessCategory, Guide, Itinerary, Place, PlaceCategory, RecordKind, Route, VirtualTour } from "./types";

export { businesses, guides, itineraries, places, routes, tours };
export { getHunt, hunts, huntsForPlace, type Hunt, type HuntClue } from "./hunts";

function bySlug<T extends { slug: string }>(list: readonly T[], what: string) {
  const map = new Map(list.map((item) => [item.slug, item]));
  return (slug: string): T => {
    const item = map.get(slug);
    if (!item) throw new Error(`Unknown ${what}: ${slug}`);
    return item;
  };
}

export const getPlace = bySlug<Place>(places, "place");
export const getBusiness = bySlug<Business>(businesses, "business");
export const getRoute = bySlug<Route>(routes, "route");
export const getGuide = bySlug<Guide>(guides, "guide");
export const getTour = bySlug<VirtualTour>(tours, "tour");
export const getItinerary = bySlug<Itinerary>(itineraries, "itinerary");

export function getRecord(kind: RecordKind, slug: string): AnyRecord {
  switch (kind) {
    case "place":
      return getPlace(slug);
    case "business":
      return getBusiness(slug);
    case "route":
      return getRoute(slug);
    case "guide":
      return getGuide(slug);
    case "tour":
      return getTour(slug);
    case "itinerary":
      return getItinerary(slug);
  }
}

/** The page of a record, without the language prefix. */
export function recordPath(kind: RecordKind, slug: string): string {
  switch (kind) {
    case "place":
      return `/places/${slug}`;
    case "business":
      return `/directory/${slug}`;
    case "route":
      return `/hikes/${slug}`;
    case "guide":
      return `/travel-tips/${slug}`;
    case "tour":
      return `/tours/${slug}`;
    case "itinerary":
      return `/plan/itineraries/${slug}`;
  }
}

/* ------------------------------------------------------------ categories */

export const placeGroup: Record<PlaceCategory, LegendGroup> = {
  town: "villages",
  village: "villages",
  waterfall: "water",
  spring: "water",
  lake: "water",
  valley: "nature",
  viewpoint: "nature",
  mountain: "nature",
  culture: "culture",
};

export const businessGroup: Record<BusinessCategory, LegendGroup> = {
  hotel: "stay",
  guesthouse: "stay",
  cabin: "stay",
  campsite: "stay",
  restaurant: "food",
  cafe: "food",
  shop: "services",
  guide: "services",
  activity: "services",
  transport: "services",
  rental: "services",
  "visitor-info": "services",
  pharmacy: "services",
  atm: "services",
  fuel: "services",
};

/** Directory sections in the main navigation. */
export const directorySections = {
  stay: ["hotel", "guesthouse", "cabin", "campsite"],
  "eat-drink": ["restaurant", "cafe"],
  "guides-experiences": ["guide", "activity"],
  services: ["shop", "transport", "rental", "visitor-info", "pharmacy", "atm", "fuel"],
} as const satisfies Record<string, readonly BusinessCategory[]>;

export type DirectorySection = keyof typeof directorySections;

export function inSection(business: Business, section: DirectorySection): boolean {
  return business.categories.some((c) => (directorySections[section] as readonly BusinessCategory[]).includes(c));
}

/** The legend group a listing is drawn in (its first category). */
export function businessLegendGroup(business: Business): LegendGroup {
  return businessGroup[business.categories[0]];
}

/* -------------------------------------------------------------- relations */

/** Listings that say they are near a place (and the listing that hosts them, if any). */
export function businessesNear(placeSlug: string): Business[] {
  return businesses.filter((b) => b.nearby.includes(placeSlug));
}

/** Routes that start at or pass a place. */
export function routesForPlace(placeSlug: string): Route[] {
  return routes.filter((r) => r.start?.place === placeSlug || r.places.includes(placeSlug));
}

/** Tours with a stop about a place. */
export function toursForPlace(placeSlug: string): VirtualTour[] {
  return tours.filter((t) => t.stops.some((s) => s.ref?.kind === "place" && s.ref.slug === placeSlug));
}

/** Listings hosted inside another listing (a hotel's restaurant). */
export function hostedBy(slug: string): Business[] {
  return businesses.filter((b) => b.partOf === slug);
}

/** A listing's own location, or that of the listing it is part of. */
export function businessLocation(business: Business) {
  if (business.location) return business.location;
  if (business.partOf) return getBusiness(business.partOf).location;
  return null;
}

/** Records for "A–Z" order: punctuation and case ignored, so no name sorts first by a quirk of spelling. */
export function sortByName<T>(items: readonly T[], name: (item: T) => string, lang: string): T[] {
  const collator = new Intl.Collator(lang === "cnr" ? "sr-Latn" : lang, { sensitivity: "base", ignorePunctuation: true });
  return [...items].sort((a, b) => collator.compare(name(a), name(b)));
}
