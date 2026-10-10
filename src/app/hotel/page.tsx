import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import {
  Feature,
  PropertyCta,
  PropertyDistances,
  PropertyFacilities,
  PropertyGallery,
  PropertyIntro,
  PropertyPractical,
  PropertyUnits,
} from "@/components/property/PropertySections";
import { PageHero } from "@/components/ui/PageHero";
import { bookingUrl, requestHref } from "@/lib/stay/links";
import { ownerPhotos as P } from "@/lib/stay/photos";
import { hotel } from "@/lib/stay/properties";
import ui from "@/styles/ui.module.css";

export const metadata: Metadata = {
  title: "Hotel ROSI · Gusinje",
  description:
    "Hotel ROSI is a family-run 3-star hotel in Gusinje, Montenegro: rooms with mountain views, Restaurant Rosi (Italian, pizza and local food), a minimarket downstairs and the Prokletije on the doorstep.",
  alternates: { canonical: "/hotel" },
};

export default function HotelPage() {
  return (
    <>
      <SiteNav cta={{ label: "Book", href: "/#book" }} menuCta={{ label: "Request dates", href: requestHref({ property: "hotel" }) }} />
      <main>
        <PageHero
          kicker="Hotel ROSI · Gusinje"
          title={
            <>
              A family hotel <em>in the heart of the valley</em>
            </>
          }
          intro="On the road into Gusinje, a minute from the bus station: rooms with mountain views, breakfast on the terrace and a family who know every trail around."
          image={hotel.photos.hero}
          actions={
            <>
              <Link href="#rooms" className={ui.btnGold}>
                See the rooms
              </Link>
              <a
                href={bookingUrl("hotel")}
                className={ui.btnOutlineLight}
                target="_blank"
                rel="noopener noreferrer"
              >
                Booking.com · 8.2
              </a>
            </>
          }
        />
        <PropertyIntro property={hotel} />
        <PropertyUnits
          property={hotel}
          title={
            <>
              Rooms for two <em>to four</em>
            </>
          }
          lead="Doubles, twins, triples and family rooms — most with a balcony or terrace and a view of the mountains. All have air conditioning, heating and a private bathroom."
        />
        <Feature
          eyebrow="Restaurant Rosi"
          title={
            <>
              Breakfast <em>with a view</em>
            </>
          }
          image={P.hotelDusk}
          dark
        >
          <p>
            Restaurant Rosi sits one floor below the rooms, behind a wall of glass looking out at the mountains. Breakfast
            is generous and often eaten out on the terrace; lunch and dinner bring pizza, Italian classics and local
            dishes, with a bar and coffee house alongside.
          </p>
          <p>Heading into the hills? Ask for a packed lunch the evening before.</p>
        </Feature>
        <Feature
          eyebrow="The view"
          title={
            <>
              Gusinje <em>at your window</em>
            </>
          }
          image={P.hotelMoonView}
          flip
        >
          <p>
            From the upper floors you look over the rooftops of Gusinje to the mountains — moonlit on clear nights, and
            once in a while under a double rainbow.
          </p>
          <p>
            Downstairs, the minimarket is open late for snacks and supplies, and the bus station is a minute&apos;s walk
            away. The family can arrange a shuttle to the trailheads or the airport (extra charge).
          </p>
        </Feature>
        <PropertyFacilities property={hotel} />
        <PropertyDistances
          property={hotel}
          title={
            <>
              A base for <em>two valleys</em>
            </>
          }
        />
        <PropertyPractical property={hotel} />
        <PropertyGallery property={hotel} title="Hotel ROSI in pictures" />
        <PropertyCta
          property={hotel}
          title={
            <>
              Stay with us <em>in Gusinje.</em>
            </>
          }
        />
      </main>
      <SiteFooter divider />
    </>
  );
}
