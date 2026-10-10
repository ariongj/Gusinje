import type { VerificationStatus } from "@/content/types";

/** Legend groups: every item on the 3D view, map and list belongs to one. */
export const legendGroups = ["villages", "water", "nature", "culture", "stay", "food", "services"] as const;

export type LegendGroup = (typeof legendGroups)[number];

/**
 * One place or listing as the explorer sees it — built on the server from the
 * content records (src/content) in the page's language, so the 3D view, the
 * map and the list always show the same thing.
 */
export type ExploreItem = {
  /** "place:grlja" / "business:hotel-rosi" — stable across views and in URLs. */
  key: string;
  kind: "place" | "business";
  slug: string;
  name: string;
  /** Category label in the page's language, e.g. "Waterfall". */
  categoryLabel: string;
  group: LegendGroup;
  area: string;
  summary: string;
  /** Folded (lower-case, accent-free) names and alternate names, for filtering. */
  search: string;
  /** Detail page, already prefixed with the language. */
  href: string;
  photo?: { src: string; alt: string; credit: string; creditHref: string };
  location?: { lat: number; lng: number; precision: "point" | "area"; status: VerificationStatus };
  /** Inside another listing (a hotel's restaurant): drawn as that listing's marker. */
  hostKey?: string;
  hostName?: string;
  /** Listing created by the site's host — disclosed wherever it appears. */
  disclosure?: string;
};

/** Colours per legend group (kept in sync with Legend.module.css). */
export const groupColor: Record<LegendGroup, string> = {
  villages: "#0f3b3f",
  water: "#1f7a9a",
  nature: "#4f7a3a",
  culture: "#8a3b4a",
  stay: "#b8894a",
  food: "#c0612b",
  services: "#5b5a8f",
};

/**
 * Where the camera goes: the whole valley, a low flight towards the peaks, or
 * a mapped point (with the direction to face and zoom, when a tour sets them).
 */
export type CameraTarget =
  | { kind: "overview" }
  | { kind: "valley" }
  | { kind: "point"; lng: number; lat: number; area: boolean; bearing?: number; zoom?: number };
