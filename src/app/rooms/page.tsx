import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { PropertyCta } from "@/components/property/PropertySections";
import { RoomsBrowser } from "@/components/rooms/RoomsBrowser";
import { PageHero } from "@/components/ui/PageHero";
import { site } from "@/config/site";
import { ownerPhotos as P } from "@/lib/stay/photos";
import { katun } from "@/lib/stay/properties";
import ui from "@/styles/ui.module.css";

export const metadata: Metadata = {
  title: "Rooms & bungalows",
  description:
    "Wooden bungalows, family rooms and camping at Eko Katun ROSI in Vusanje, and rooms with mountain views at Hotel ROSI in Gusinje, Montenegro. Send your dates — the family confirms availability and the price.",
  alternates: { canonical: "/rooms" },
};

export default function RoomsPage() {
  return (
    <>
      <SiteNav cta={{ label: "Book", href: "/#book" }} menuCta={{ label: "Check dates", href: "/#book" }} />
      <main>
        <PageHero
          kicker="Rooms & bungalows"
          title={
            <>
              Choose <em>your corner of the valley</em>
            </>
          }
          intro="Pine-panelled bungalows and family rooms at the katun in Vusanje, or a room with a mountain view at the hotel in Gusinje. Pick what suits your group, send your dates, and the family will reply with availability and the price."
          image={P.katunBungalowRow}
          actions={
            <>
              <Link href="#browse" className={ui.btnGold}>
                See every option
              </Link>
              <a href={site.phone.href} className={ui.btnOutlineLight}>
                Call {site.phone.display}
              </a>
            </>
          }
        />
        <RoomsBrowser />
        <PropertyCta
          property={katun}
          title={
            <>
              Not sure which? <em>Ask the family.</em>
            </>
          }
        />
      </main>
      <SiteFooter divider />
    </>
  );
}
