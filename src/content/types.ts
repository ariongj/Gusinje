/**
 * The content model. Every place, listing, tour, route and guide on the site
 * is a typed record here, read by the 3D view, the map, the lists, the detail
 * pages, search and the sitemap alike — one record, many views.
 *
 * Rules the types encode:
 * - Practical facts (fees, hours, durations, distances, prices) are optional.
 *   When a fact is not verified it is left out and the page says so; it is
 *   never filled with a plausible guess.
 * - Every record carries a Verification: how it was checked, when, and the
 *   sources it rests on.
 * - Text is stored per language. English is the source; Albanian and
 *   Montenegrin carry a review status until an editor has checked them.
 */

import type { Locale } from "@/i18n/config";

/* ------------------------------------------------------------- languages */

/** Text in each language. English is required; others fall back to it. */
export type Localized<T = string> = { en: T } & Partial<Record<Exclude<Locale, "en">, T>>;

/** Review state of a record's translations ("unreviewed" = drafted, not yet checked by a fluent editor). */
export type TranslationStatus = Partial<Record<Exclude<Locale, "en">, "reviewed" | "unreviewed">>;

/* --------------------------------------------------------------- sources */

export type SourceKind =
  /** Government, national park, municipality, tourism organisation. */
  | "official"
  /** Encyclopaedias, gazetteers, mapping databases, guidebooks. */
  | "reference"
  /** The business's own website, listing or social profile. */
  | "business"
  /** Checked on the ground by a named editor or partner. */
  | "field";

export type Source = {
  id: string;
  title: string;
  publisher: string;
  url?: string;
  kind: SourceKind;
  /** When the source was consulted (YYYY-MM-DD). */
  accessed: string;
  note?: string;
};

export type VerificationStatus =
  /** Checked on the ground (or confirmed in writing by the responsible body). */
  | "field-verified"
  /** Checked against at least one reliable published source. */
  | "desk-verified"
  /** Supplied by the business or person concerned and not independently checked. */
  | "self-reported"
  /** Not yet checked — shown only with a clear notice, or not shown. */
  | "unverified";

export type Verification = {
  status: VerificationStatus;
  /** Last time an editor checked the record (YYYY-MM-DD), or null if never. */
  lastChecked: string | null;
  /** Who is responsible for keeping it current (a role, not a private person). */
  owner: string;
  sources: string[];
  notes?: string;
};

/* ------------------------------------------------------------- locations */

export type Coordinates = {
  lat: number;
  lng: number;
  /** "point": a specific spot; "area": the centre of a village, valley or massif. */
  precision: "point" | "area";
  status: VerificationStatus;
  sources: string[];
};

/** Named parts of the region, used for filters and "nearby". */
export type AreaId = "gusinje" | "vusanje" | "grbaja" | "ropojana" | "plav" | "high-mountains";

/**
 * Where the camera looks on the 3D map. "overview": the whole valley;
 * "valley": a low flight over Gusinje towards the peaks; or a place (by slug)
 * with a mapped location — optionally with the direction the camera faces
 * (degrees, 0 = north). Places without verified coordinates are framed through
 * a mapped neighbour; the camera never points at an invented position.
 */
export type MapCamera = "overview" | "valley" | { place: string; bearing?: number; zoom?: number };

/* ----------------------------------------------------------------- media */

export type MediaRights =
  /** Free licence (CC BY, CC BY-SA, CC0, public domain) — credit required. */
  | "free-licence"
  /** The owner has given written permission. */
  | "owner-permission"
  /** Supplied by the owner; written permission and originals still to be collected. */
  | "owner-pending";

export type Credit = {
  author: string;
  license: string;
  /** The licence deed, e.g. https://creativecommons.org/licenses/by-sa/4.0/ */
  licenseUrl?: string;
  /** The file's page (Wikimedia Commons) or the owner's page. */
  href: string;
  /** "Wikimedia Commons", or the owner's name. */
  via: string;
};

export type Photo = {
  src: string;
  /** Smaller variant for cards, when the host offers one. */
  srcSmall?: string;
  /** English alt text; translations in altLocalized. */
  alt: string;
  altLocalized?: Partial<Record<Exclude<Locale, "en">, string>>;
  width?: number;
  height?: number;
  /** CSS object-position for the crop. */
  position?: string;
  credit: Credit;
  rights: MediaRights;
};

/* ---------------------------------------------------------------- places */

export type PlaceCategory = "town" | "village" | "waterfall" | "spring" | "valley" | "viewpoint" | "culture" | "mountain" | "lake";

export type AltName = { name: string; lang: "sq" | "cnr" | "en" | "other"; note?: Localized };

export type Place = {
  slug: string;
  kind: "place";
  /** Name as used on this site, per language. */
  name: Localized;
  /** Names used locally and on maps — with correct diacritics. */
  altNames: AltName[];
  category: PlaceCategory;
  area: AreaId;
  summary: Localized;
  description: Localized<string[]>;
  highlights?: Localized<string[]>;
  location: Coordinates | null;
  photos: Photo[];
  /** How to get there — only verified information. */
  access?: Localized;
  /** Known accessibility limitations. */
  accessibility?: Localized;
  seasonality?: Localized;
  duration?: Localized;
  /** Only when confirmed by the responsible body, with the date in the text. */
  fees?: Localized;
  hours?: Localized;
  warnings?: Localized[];
  /** Official information pages (source ids). */
  officialLinks?: string[];
  routes?: string[];
  verification: Verification;
  translations: TranslationStatus;
};

/* -------------------------------------------------------------- business */

export type BusinessCategory =
  | "hotel"
  | "guesthouse"
  | "cabin"
  | "campsite"
  | "restaurant"
  | "cafe"
  | "shop"
  | "guide"
  | "activity"
  | "transport"
  | "rental"
  | "visitor-info";

/** How a feature or fact is known. */
export type Basis = "self-reported" | "verified";

export type Feature = { label: Localized; basis: Basis };

export type Contact = {
  /** Public numbers the business has published. */
  phones?: { display: string; tel: string; note?: Localized; whatsapp?: { approved: true; source: string } }[];
  email?: string;
  website?: { url: string; label?: string };
  social?: { label: string; url: string }[];
  /** Listings on booking platforms the business itself uses. */
  booking?: { label: string; url: string }[];
};

export type Business = {
  slug: string;
  kind: "business";
  name: string;
  /** Other names the business is listed under. */
  altNames?: string[];
  categories: BusinessCategory[];
  /** null when the listing doesn't say where it is. */
  area: AreaId | null;
  summary: Localized;
  description?: Localized<string[]>;
  location: Coordinates | null;
  /** Inside another listing (e.g. a hotel's restaurant): shares its marker and directions. */
  partOf?: string;
  address?: Localized;
  /** Public listings of this business on official sites (source ids). */
  listings?: string[];
  contact: Contact;
  services?: Feature[];
  /** Useful attributes; each says whether it is self-reported or independently checked. */
  attributes?: {
    parking?: Feature;
    family?: Feature;
    accessibility?: Feature;
    payment?: Feature;
    /** ISO 639 codes, shown in the reader's language (e.g. "sq" → "Albanian"). */
    languages?: { value: string[]; basis: Basis };
  };
  /** Opening hours / seasons — only as supplied, with the date supplied. */
  hours?: { text: Localized; basis: Basis; asOf: string };
  /** Price information — only as supplied and current. Never estimated. */
  prices?: { text: Localized; basis: Basis; asOf: string };
  photos: Photo[];
  /** Places this business is near or serves. */
  nearby: string[];
  /**
   * Disclosures shown on the listing, e.g. that the business created this site.
   * A disclosure never changes the listing's order.
   */
  disclosure?: "platform-creator";
  /** Paid placement — none exist; if ever added it is labelled and kept apart from reviews. */
  sponsored: false;
  /** Whether the owner has claimed the listing through a verified claim. */
  claimed: boolean;
  verification: Verification;
  translations: TranslationStatus;
};

/* ------------------------------------------------------------------ tours */

export type TourTheme = "highlights" | "villages-culture" | "water" | "mountains";

export type TourStop = {
  /** What the camera shows on the 3D map. */
  view: MapCamera;
  /** The place (or listing) this stop is about, for the info panel and photo fallback. */
  ref?: { kind: "place" | "business"; slug: string };
  kicker: Localized;
  title: Localized;
  text: Localized;
};

export type VirtualTour = {
  slug: string;
  kind: "tour";
  theme: TourTheme;
  title: Localized;
  intro: Localized;
  stops: TourStop[];
  verification: Verification;
  translations: TranslationStatus;
};

/* ----------------------------------------------------------------- routes */

export type RouteType = "walk" | "hike" | "summit" | "canyon" | "cross-border";

/** A number as reported by a named source — shown with that source, never rounded into certainty. */
export type Reported<T> = {
  /** English number format ("1,450", "3.4"); pages localise it. */
  value: T;
  /** What the figure covers, when the source says. */
  qualifier?: "loop" | "one-way";
  source: string;
  note?: Localized;
};

export type Route = {
  slug: string;
  kind: "route";
  name: Localized;
  type: RouteType;
  area: AreaId;
  summary: Localized;
  description?: Localized<string[]>;
  /** Where it starts — a place on this site and/or a description. */
  start?: { place?: string; text?: Localized };
  /** Places along the way or at the end. */
  places: string[];
  distanceKm?: Reported<string>;
  ascentM?: Reported<string>;
  duration?: Reported<Localized>;
  difficulty?: Reported<Localized>;
  seasonality?: Reported<Localized>;
  equipment?: Localized<string[]>;
  guide: "required" | "strongly-recommended" | "recommended" | "not-required" | "unknown";
  access?: Localized;
  /** Cross-border routes: permit guidance, each statement sourced. */
  permits?: { text: Localized; sources: string[] };
  warnings: Localized[];
  officialLinks: string[];
  /**
   * There is no navigable track on this site. Routes are never drawn from
   * guesswork; "none" until a trusted GPX with a licence is supplied.
   */
  track: "none";
  /**
   * "published": the key facts (start, distance, ascent, difficulty, duration,
   * season) are verified. "awaiting-verification": the page shows what is
   * known and what is missing, and must not be used to navigate.
   */
  status: "published" | "awaiting-verification";
  verification: Verification;
  translations: TranslationStatus;
};

/* ----------------------------------------------------------------- guides */

export type GuideTopic =
  | "getting-here"
  | "where-to-stay"
  | "seasons"
  | "food-culture"
  | "families-access"
  | "outdoors"
  | "practical"
  | "responsible";

export type GuideSection = {
  heading: Localized;
  body: Localized<string[]>;
  sources: string[];
  /**
   * "local-verified": reviewed by a local editor or partner.
   * "source-checked": the facts match the cited published sources.
   * "needs-local-review": general advice, shown with a notice until a local
   * editor confirms it applies here.
   */
  status: "local-verified" | "source-checked" | "needs-local-review";
};

export type Guide = {
  slug: string;
  kind: "guide";
  topic: GuideTopic;
  title: Localized;
  summary: Localized;
  sections: GuideSection[];
  /** Role responsible for keeping it up to date. */
  owner: string;
  updated: string;
  verification: Verification;
  translations: TranslationStatus;
};

/* ------------------------------------------------------------- itineraries */

export type ItineraryLength = "short" | "one-day" | "weekend" | "long";

export type ItineraryStop = { ref: { kind: "place" | "business" | "route" | "guide"; slug: string }; note?: Localized };

export type Itinerary = {
  slug: string;
  kind: "itinerary";
  length: ItineraryLength;
  level: "easy" | "moderate" | "active";
  interests: Localized;
  title: Localized;
  summary: Localized;
  days: { title: Localized; stops: ItineraryStop[] }[];
  verification: Verification;
  translations: TranslationStatus;
};

/* ------------------------------------------------------------- references */

export type RecordKind = "place" | "business" | "route" | "guide" | "tour" | "itinerary";

export type AnyRecord = Place | Business | Route | Guide | VirtualTour | Itinerary;
