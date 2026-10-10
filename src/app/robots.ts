import type { MetadataRoute } from "next";

import { brand } from "@/config/brand";
import { locales } from "@/i18n/config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // A preview build (NEXT_PUBLIC_NOINDEX) asks crawlers to stay away entirely.
  if (process.env.NEXT_PUBLIC_NOINDEX === "true") return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Editorial dashboard and shared trips are not for search results.
      disallow: locales.flatMap((l) => [`/${l}/admin/`, `/${l}/plan/shared/`]),
    },
    sitemap: `${brand.url}/sitemap.xml`,
  };
}
