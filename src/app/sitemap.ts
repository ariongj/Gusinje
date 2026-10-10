import type { MetadataRoute } from "next";

import { mainNav, site } from "@/config/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", ...mainNav.map((item) => item.href), "/credits"];
  // The static export (GitHub Pages) serves every page as a folder: rooms/.
  const staticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
  // Concatenate rather than new URL(path, base): the site may live under a sub-path.
  return pages.map((path) => ({
    url: `${site.url}${path}${staticExport && path !== "/" ? "/" : ""}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : path === "/credits" ? 0.3 : 0.8,
  }));
}
