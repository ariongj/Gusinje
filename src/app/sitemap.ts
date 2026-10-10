import type { MetadataRoute } from "next";

import { brand } from "@/config/brand";
import { locales } from "@/i18n/config";
import { allPaths } from "@/lib/paths";

export const dynamic = "force-static";

/** Every page in every language, each listing its translations. */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (lang: string, path: string) => `${brand.url}/${lang}${path === "/" ? "" : path}/`;
  return allPaths().flatMap((path) =>
    locales.map((lang) => ({
      url: url(lang, path),
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : path.split("/").length > 2 ? 0.6 : 0.8,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, url(l, path)])) },
    })),
  );
}
