/**
 * Regional branding — kept in one place so it can change for a future
 * collaboration (name, wordmark, colours in globals.css) without touching
 * pages. Nothing here may imply an official status or endorsement.
 */

import type { Localized } from "@/content/types";

export const brand = {
  /** Full name, used in titles and structured data. */
  name: {
    en: "Gusinje & Vusanje Valley Guide",
    sq: "Udhëzuesi i Luginës së Gucisë dhe Vuthajve",
    cnr: "Vodič kroz dolinu Gusinja i Vusanja",
  } satisfies Localized,
  /** Wordmark in the nav. */
  wordmark: { en: "Valley Guide", sq: "Udhëzuesi i Luginës", cnr: "Vodič kroz dolinu" } satisfies Localized,
  /** Small line under the wordmark. */
  region: "Gusinje · Vusanje · Prokletije",
  /** Who creates and hosts the site — always disclosed. */
  creator: {
    name: "ROSI",
    /** ROSI's own accommodation website (unchanged by this platform). */
    website: "https://ariongj.github.io/hotelplav/",
  },
  /** Public origin, no trailing slash: canonical URLs, sitemap, share links and QR codes. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ariongj.github.io/Gusinje").replace(/\/+$/, ""),
  /** Base path the static export is served under (GitHub Pages: /<repo>). */
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  /**
   * Where editorial submissions would go once approved. null = submissions
   * are closed and forms run in preview mode (nothing is sent or stored).
   */
  submissionsEndpoint: null as string | null,
  /** Theme colour for browsers. */
  themeColor: "#0f3b3f",
  copyrightYear: 2026,
} as const;

/** Absolute URL of a path on this site (for sharing, QR codes, structured data). */
export function absoluteUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const withSlash = clean.endsWith("/") || clean.includes("#") || clean.includes("?") ? clean : `${clean}/`;
  return `${brand.url}${withSlash}`;
}
