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
import { katun } from "@/lib/stay/properties";
import ui from "@/styles/ui.module.css";

export const metadata: Metadata = {
  title: "Eko Katun ROSI · Vusanje",
  description:
    "Wooden bungalows, family rooms and camping at Eko Katun ROSI in Vusanje, Montenegro — home cooking, farm animals and an old stone tower, a short walk from the Grlja waterfall and Ali Pasha's Springs.",
  alternates: { canonical: "/katun" },
};

export default function KatunPage() {
  return (
    <>
      <SiteNav cta={{ label: "Book", href: "/#book" }} menuCta={{ label: "Request dates", href: requestHref({ property: "katun" }) }} />
      <main>
        <PageHero
          kicker="Eko Katun ROSI · Vusanje"
          title={
            <>
              Sleep under <em>the Accursed Mountains</em>
            </>
          }
          intro="Wooden bungalows on a meadow at the head of the Vusanje valley — sheep and ponies outside, home cooking inside, and the trails to Grlja, the springs and the Ropojana starting at the gate."
          image={katun.photos.hero}
          actions={
            <>
              <Link href="#rooms" className={ui.btnGold}>
                See the bungalows
              </Link>
              <a
                href={bookingUrl("katun")}
                className={ui.btnOutlineLight}
                target="_blank"
                rel="noopener noreferrer"
              >
                Booking.com · 9.0
              </a>
            </>
          }
        />
        <PropertyIntro property={katun} />
        <PropertyUnits
          property={katun}
          title={
            <>
              Bungalows, family rooms <em>& the meadow</em>
            </>
          }
          lead="Pine-panelled bungalows for three to five, family rooms in the old stone house, and pitches for tents and camper vans on the meadow."
        />
        <Feature
          id="tower"
          eyebrow="The old stone tower"
          title={
            <>
              Three hundred years <em>of mountain life</em>
            </>
          }
          image={P.katunStoneHouse}
          dark
        >
          <p>
            The family&apos;s stone tower — a kula — has stood in Vuthaj for around three centuries; it was last restored
            in 1981. Today it is kept as a small living museum of mountain life, with handmade objects, woven rugs and
            the very first telephone and radio ever to reach the village.
          </p>
          <p>Ask at the restaurant and someone will gladly show you around.</p>
        </Feature>
        <Feature
          eyebrow="On the meadow"
          title={
            <>
              Sheep, horses <em>& ponies</em>
            </>
          }
          image={P.katunPony}
          flip
        >
          <p>
            The katun is a working mountain farm. Sheep cross the courtyard, horses and ponies graze in front of the
            bungalows, and children have a play area, open meadow and plenty of space to run.
          </p>
          <p>In the evenings there are lanterns along the path, movie nights and a fire for cold nights.</p>
        </Feature>
        <PropertyFacilities property={katun} />
        <Feature
          eyebrow="Camping"
          title={
            <>
              Pitch your tent <em>by the bungalows</em>
            </>
          }
          image={P.katunTents}
        >
          <p>
            Hikers on the Peaks of the Balkans and camper-van travellers can stay on the meadow beside the bungalows,
            with the restaurant and bar a few steps away.
          </p>
          <p>
            <Link href={requestHref({ property: "katun", unit: { id: "camping", name: "Camping on the meadow" } })}>
              Ask us about a pitch
            </Link>
          </p>
        </Feature>
        <PropertyDistances
          property={katun}
          title={
            <>
              The trails start <em>at the gate</em>
            </>
          }
        />
        <PropertyPractical property={katun} />
        <PropertyGallery property={katun} title="Eko Katun ROSI in pictures" />
        <PropertyCta
          property={katun}
          title={
            <>
              Come and stay <em>on the katun.</em>
            </>
          }
        />
      </main>
      <SiteFooter divider />
    </>
  );
}
