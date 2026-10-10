import type { MetadataRoute } from "next";

import { brand } from "@/config/brand";

export const dynamic = "force-static";

/** Lets phones add the guide to the home screen and open it like an app. */
export default function manifest(): MetadataRoute.Manifest {
  const base = brand.basePath;
  return {
    id: `${base}/`,
    name: brand.name.en,
    short_name: brand.wordmark.en,
    description: "An independent visitor guide to Gusinje, Vusanje and the Prokletije, created by ROSI.",
    start_url: `${base}/`,
    scope: `${base}/`,
    display: "standalone",
    background_color: "#f2efe9",
    theme_color: brand.themeColor,
    icons: [
      { src: `${base}/icons/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${base}/icons/icon-512.png`, sizes: "512x512", type: "image/png" },
      { src: `${base}/icons/icon-maskable-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
