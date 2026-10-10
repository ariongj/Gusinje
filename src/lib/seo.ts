import type { Metadata } from "next";

import { brand } from "@/config/brand";
import type { Photo } from "@/content/types";
import { href, locales, ogLocale, type Locale } from "@/i18n/config";

type PageMeta = {
  lang: Locale;
  /** Path without the language prefix, e.g. "/places/grlja". */
  path: string;
  title: string;
  description: string;
  image?: Photo;
  /** Keep out of search results (editorial pages, shared trips). */
  noindex?: boolean;
};

/**
 * Title, description, canonical URL, the same page in each language
 * (hreflang), and social previews — from real page content only.
 */
export function pageMetadata({ lang, path, title, description, image, noindex }: PageMeta): Metadata {
  const languages: Record<string, string> = Object.fromEntries(locales.map((l) => [l, href(l, path)]));
  languages["x-default"] = href("en", path);
  return {
    title,
    description,
    alternates: { canonical: href(lang, path), languages },
    openGraph: {
      type: "website",
      siteName: brand.name[lang],
      title,
      description,
      url: href(lang, path),
      locale: ogLocale[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocale[l]),
      images: image ? [{ url: image.src, width: image.width, height: image.height, alt: image.alt }] : undefined,
    },
    twitter: { card: image ? "summary_large_image" : "summary", title, description },
    // Set only when needed: an explicit `undefined` would replace the
    // layout's preview-wide noindex. Previews (NEXT_PUBLIC_NOINDEX) hide every page.
    ...(noindex || process.env.NEXT_PUBLIC_NOINDEX === "true" ? { robots: { index: false, follow: false } } : {}),
  };
}

/** Serialise JSON-LD safely for a <script> tag. */
export function jsonLd(data: unknown): { __html: string } {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
