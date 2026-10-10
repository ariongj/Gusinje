import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { TourCta } from "@/components/tour/TourCta";
import { TourExplorer } from "@/components/tour/TourExplorer";
import { TourIntro } from "@/components/tour/TourIntro";

export const metadata: Metadata = {
  title: "3D valley & guided tour",
  description:
    "Fly over the valley of Gusinje and Vusanje in 3D: Hotel ROSI in town, Ali Pasha's Springs, Eko Katun ROSI and its stone tower, the Grlja waterfall, Oko Skakavice, the Ropojana valley, Karanfili and Zla Kolata — explore freely or take the guided tour.",
  alternates: { canonical: "/tour" },
};

export default function TourPage() {
  return (
    <>
      <SiteNav cta={{ label: "Book", href: "/#book" }} menuCta={{ label: "Check dates", href: "/#book" }} />
      <main>
        <TourIntro />
        <TourExplorer />
        <TourCta />
      </main>
      <SiteFooter />
    </>
  );
}
