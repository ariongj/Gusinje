import type { Metadata } from "next";
import Link from "next/link";

import { Breakfast, Groups, RegionalFood } from "@/components/dining/FoodSections";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { Feature } from "@/components/property/PropertySections";
import { PageHero } from "@/components/ui/PageHero";
import { site } from "@/config/site";
import { ownerPhotos as P } from "@/lib/stay/photos";
import { hotel, katun, type Property } from "@/lib/stay/properties";
import ui from "@/styles/ui.module.css";

export const metadata: Metadata = {
  title: "Food & restaurants",
  description:
    "Traditional mountain cooking at Restaurant ROSI Tradicional in Vusanje and Italian, pizza and local dishes at Restaurant Rosi in Gusinje — breakfast on the terrace, picnic packs for hikers and the food of the Prokletije.",
  alternates: { canonical: "/dining" },
};

function Facts({ property }: { property: Property }) {
  return (
    <p>
      <strong>Serving:</strong> {property.restaurant.meals.join(" · ")}
      <br />
      <strong>Options:</strong> {property.restaurant.dietary.join(" · ")}
    </p>
  );
}

export default function DiningPage() {
  return (
    <>
      <SiteNav cta={{ label: "Book", href: "/#book" }} menuCta={{ label: "Check dates", href: "/#book" }} />
      <main>
        <PageHero
          kicker="Food at ROSI"
          title={
            <>
              Cooked <em>the mountain way</em>
            </>
          }
          intro="Two kitchens, one family: traditional cooking at the katun in Vusanje, and pizza, Italian and local dishes at the hotel in Gusinje — with a big breakfast at both."
          image={P.katunFeast}
          actions={
            <>
              <Link href="#katun-restaurant" className={ui.btnGold}>
                The restaurants
              </Link>
              <a href={site.phone.href} className={ui.btnOutlineLight}>
                Call to book a table
              </a>
            </>
          }
        />
        <Feature
          id="katun-restaurant"
          eyebrow={`${katun.restaurant.name} · Vusanje`}
          title={
            <>
              Traditional cooking <em>at the katun</em>
            </>
          }
          image={P.katunTerrace}
        >
          <p>{katun.restaurant.text}</p>
          <p>Tables stand out on the terrace under the peaks in summer; drinks are simple and fairly priced.</p>
          <Facts property={katun} />
        </Feature>
        <Feature
          id="hotel-restaurant"
          eyebrow={`${hotel.restaurant.name} · Gusinje`}
          title={
            <>
              Pizza, pasta <em>& local dishes</em>
            </>
          }
          image={P.hotelDusk}
          flip
          dark
        >
          <p>{hotel.restaurant.text}</p>
          <p>A bar and coffee house sit alongside, and the minimarket downstairs is handy for the trail.</p>
          <Facts property={hotel} />
        </Feature>
        <Breakfast />
        <RegionalFood />
        <Groups />
      </main>
      <SiteFooter />
    </>
  );
}
