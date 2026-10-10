import type { Metadata } from "next";
import Link from "next/link";

import { AskFamilyCta } from "@/components/experiences/AskFamilyCta";
import { LakeIntro } from "@/components/experiences/LakeIntro";
import { PhotoCredit } from "@/components/ui/PhotoCredit";
import { SeasonsSection } from "@/components/experiences/SeasonsSection";
import { askFamilyHref, heroImage } from "@/components/experiences/content";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { PageHero } from "@/components/ui/PageHero";
import ui from "@/styles/ui.module.css";

export const metadata: Metadata = {
  title: "Explore the valley",
  description:
    "Walk to the Grlja waterfall and the Blue Eye, hike the Ropojana and Grbaja valleys, climb Zla Kolata or cross to Theth on the Peaks of the Balkans — summer and winter around Gusinje and Vusanje, in Prokletije National Park, Montenegro.",
  alternates: { canonical: "/experiences" },
};

export default function ExperiencesPage() {
  return (
    <>
      <SiteNav cta={{ label: "Book", href: "/#book" }} menuCta={{ label: "Check dates", href: "/#book" }} />
      <main>
        <PageHero
          kicker="Explore the Prokletije"
          title={
            <>
              From the doorstep <em>to the peaks</em>
            </>
          }
          intro="The katun is in Vusanje, a short walk from the Grlja waterfall and the start of the Ropojana valley; the hotel is in Gusinje, half an hour on foot from Ali Pasha's Springs. Here is what's around — the family will help with the rest."
          image={heroImage}
          actions={
            <>
              <Link href={askFamilyHref} className={ui.btnGold}>
                Ask the family
              </Link>
              <a href="#seasons" className={ui.btnOutlineLight}>
                Summer &amp; winter ideas
              </a>
            </>
          }
        >
          <PhotoCredit credit={heroImage.credit} spaced />
        </PageHero>
        <LakeIntro />
        <SeasonsSection />
        <AskFamilyCta />
      </main>
      <SiteFooter />
    </>
  );
}
