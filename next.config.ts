import type { NextConfig } from "next";

/**
 * The site is a static export (no server): it can be hosted on GitHub Pages
 * or any static host. NEXT_PUBLIC_BASE_PATH serves it under a sub-path
 * (GitHub Pages: /<repo>). Accounts, reviews and submissions need an approved
 * backend — see docs/PLAN.md — and are not part of this build.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // Pages export as places/index.html — static hosts resolve /places/ to that folder.
  trailingSlash: true,
  images: {
    // No image server on static hosting: src/lib/image-loader.ts picks the
    // right Wikimedia Commons thumbnail width for each screen instead.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    // Widths that match Commons' standard thumbnail sizes.
    deviceSizes: [500, 960, 1280, 1920, 3840],
    imageSizes: [250, 330],
  },
  experimental: {
    // One 404 page for the whole site: the root layout sits under [lang].
    globalNotFound: true,
  },
};

export default nextConfig;
