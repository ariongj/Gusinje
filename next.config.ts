import type { NextConfig } from "next";

/**
 * NEXT_PUBLIC_STATIC_EXPORT=true builds a static site (used for the GitHub
 * Pages preview, see .github/workflows/pages.yml): no server, so no API
 * routes or image optimiser, served under NEXT_PUBLIC_BASE_PATH (/<repo>).
 */
const staticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // trailingSlash: pages export as rooms/index.html — GitHub Pages resolves
  // /rooms to that folder (a rooms.html beside it would 404).
  ...(staticExport ? { output: "export" as const, basePath, trailingSlash: true } : {}),
  images: {
    // Static hosting can't optimise images on request; the photos are
    // already sized and compressed by their CDNs.
    unoptimized: staticExport,
    // The family's own photos are hot-linked from their Booking.com listings
    // (cf.bstatic.com) until the original files are in /public; landscape
    // photos are credited Wikimedia Commons images. Remove a host once
    // nothing loads from it.
    remotePatterns: [
      { protocol: "https", hostname: "cf.bstatic.com", pathname: "/xdata/images/hotel/**" },
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/wikipedia/commons/**" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
