import type { MapIcon } from "@/components/map/icons";
import type { ArtTone } from "@/components/ui/ArtTile";
import { places } from "@/content";
import { placeholderPicture } from "@/content/demo";
import { href, type Locale } from "@/i18n/config";
import { loc } from "@/i18n/localize";
import type { Messages } from "@/i18n/messages/en";

import { placeIcon } from "./explore-data";
import { bearing, km } from "./geo";

const GUSINJE = { lat: 42.5619, lng: 19.8339 };

export type PickPlace = {
  slug: string;
  name: string;
  kicker: string;
  summary: string;
  href: string;
  mapHref: string;
  /** Direction from Gusinje in degrees (0 = north), or null for the town itself. */
  bearing: number | null;
  /** Straight-line distance from Gusinje in km. */
  km: number;
  photo: { src: string; alt: string } | null;
  icon: MapIcon;
  tone: ArtTone;
};

const tone: Record<string, ArtTone> = { town: "stone", village: "stone", waterfall: "water", spring: "water", lake: "water", valley: "forest", viewpoint: "forest", mountain: "dusk", culture: "clay" };

/** The places the compass can point to: those with a verified position, with their real direction from Gusinje. */
export function pickPlaces(lang: Locale, t: Messages): PickPlace[] {
  return places
    .filter((p) => p.location)
    .map((p) => {
      const distance = km(GUSINJE, p.location!);
      const photo = p.photos[0] ?? placeholderPicture(p.category);
      return {
        slug: p.slug,
        name: loc(p.name, lang),
        kicker: `${t.placeCategory[p.category]} · ${t.area[p.area]}`,
        summary: loc(p.summary, lang),
        href: href(lang, `/places/${p.slug}`),
        mapHref: `${href(lang, "/explore")}/?place=${p.slug}`,
        bearing: distance < 0.5 ? null : bearing(GUSINJE, p.location!),
        km: distance,
        photo: photo ? { src: photo.srcSmall ?? photo.src, alt: (lang !== "en" && photo.altLocalized?.[lang]) || photo.alt } : null,
        icon: placeIcon[p.category],
        tone: tone[p.category] ?? "stone",
      };
    });
}
