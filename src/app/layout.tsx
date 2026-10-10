import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import type { ReactNode } from "react";

import { RevealObserver } from "@/components/ui/RevealObserver";
import { site } from "@/config/site";
import { ownerPhotos } from "@/lib/stay/photos";

import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Gusinje & Vusanje, Montenegro`,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  applicationName: site.name,
  // No og:title / og:description here: Next fills them from each page's own
  // title and description (a value set here would override every page's).
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_GB",
    // The katun from above (the property's own photo).
    images: [
      {
        url: ownerPhotos.katunAerial.src,
        width: ownerPhotos.katunAerial.width,
        height: ownerPhotos.katunAerial.height,
        alt: ownerPhotos.katunAerial.alt,
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
  // Preview deployments (e.g. GitHub Pages) stay out of search results.
  robots: process.env.NEXT_PUBLIC_NOINDEX === "true" ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#0f3b3f",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    // data-scroll-behavior: page-to-page navigation jumps to the top instead of
    // smooth-scrolling there (globals.css keeps smooth in-page anchors).
    <html lang="en" data-scroll-behavior="smooth" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
