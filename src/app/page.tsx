import type { Metadata } from "next";

import { BookingResults } from "@/components/home/BookingResults";
import { HomeBookingProvider } from "@/components/home/HomeBooking";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeStickyBar } from "@/components/home/HomeStickyBar";
import {
  FinalCta,
  Food,
  GallerySection,
  KatunLife,
  Location,
  Nearby,
  Places,
  Reviews,
  Stay,
  TourBand,
} from "@/components/home/sections";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { site } from "@/config/site";
import { properties } from "@/lib/stay/properties";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/** One LodgingBusiness per property, with the real contacts (no prices). */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": properties.map((property) => ({
    "@type": property.id === "hotel" ? "Hotel" : "LodgingBusiness",
    name: property.name,
    description: property.summary,
    url: `${site.url}${property.href}/`,
    image: property.photos.card.src,
    telephone: site.phone.display,
    email: site.email.display,
    ...(property.id === "hotel" ? { starRating: { "@type": "Rating", ratingValue: "3" } } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address.line1,
      addressLocality: property.address.locality,
      postalCode: property.address.postcode,
      addressCountry: property.address.countryCode,
    },
    geo: { "@type": "GeoCoordinates", latitude: property.coords.lat, longitude: property.coords.lng },
    checkinTime: property.checkIn.split("–")[0],
    checkoutTime: property.checkOut.split("–")[1],
    paymentAccepted: "Cash",
    sameAs: site.social.map((item) => item.href),
  })),
};

export default function HomePage() {
  return (
    <HomeBookingProvider>
      <SiteNav cta={{ label: "Book", href: "#book" }} menuCta={{ label: "Check dates", href: "#book" }} />
      <main id="top">
        <HomeHero />
        <BookingResults />
        <Places />
        <KatunLife />
        <Stay />
        <Nearby />
        <Food />
        <TourBand />
        <GallerySection />
        <Reviews />
        <Location />
        <FinalCta />
      </main>
      <SiteFooter isHome />
      <HomeStickyBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </HomeBookingProvider>
  );
}
