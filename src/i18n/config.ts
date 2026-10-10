/**
 * Languages of the site. Every page lives under /{lang}/…; the content model
 * stores text per language (see Localized in src/content/types.ts) and UI
 * strings live in ./messages.
 *
 * Montenegrin uses the ISO 639-3 / BCP 47 code "cnr" (Latin script).
 */
export const locales = ["en", "sq", "cnr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Each language in its own name, for the switcher. */
export const localeNames: Record<Locale, string> = {
  en: "English",
  sq: "Shqip",
  cnr: "Crnogorski",
};

/** Short label for the compact switcher. */
export const localeShort: Record<Locale, string> = { en: "EN", sq: "SQ", cnr: "CNR" };

/** Open Graph locale tags. */
export const ogLocale: Record<Locale, string> = { en: "en_GB", sq: "sq_AL", cnr: "cnr_ME" };

/** BCP 47 tags used for Intl formatting (dates). Montenegrin falls back to Serbian Latin rules. */
export const intlLocale: Record<Locale, string[]> = {
  en: ["en-GB"],
  sq: ["sq-AL", "sq"],
  cnr: ["cnr-ME", "sr-Latn-ME", "sr-Latn"],
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** A path inside a language: href("sq", "/places/grlja") → "/sq/places/grlja". */
export function href(lang: Locale, path = "/"): string {
  const clean = path === "/" || path === "" ? "/" : path.startsWith("/") ? path : `/${path}`;
  return clean === "/" ? `/${lang}` : `/${lang}${clean}`;
}

/** The same page in another language: swaps the first path segment. */
export function switchLocalePath(pathname: string, target: Locale, basePath = ""): string {
  let path = pathname;
  if (basePath && path.startsWith(basePath)) path = path.slice(basePath.length) || "/";
  const parts = path.split("/");
  if (isLocale(parts[1])) parts[1] = target;
  else parts.splice(1, 0, target);
  return parts.join("/") || `/${target}`;
}

/** Format an ISO date (YYYY-MM-DD or YYYY-MM) for display, independent of time zone. */
export function formatDate(iso: string | null | undefined, lang: Locale, style: "day" | "month" = "day"): string {
  if (!iso) return "";
  const full = iso.length === 7 ? `${iso}-01` : iso;
  const date = new Date(`${full}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  const options: Intl.DateTimeFormatOptions =
    style === "month" || iso.length === 7
      ? { month: "long", year: "numeric", timeZone: "UTC" }
      : { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" };
  for (const tag of intlLocale[lang]) {
    try {
      return date.toLocaleDateString(tag, options);
    } catch {
      // try the next tag
    }
  }
  return date.toLocaleDateString("en-GB", options);
}
