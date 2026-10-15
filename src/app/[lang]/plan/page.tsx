import type { Metadata } from "next";
import Link from "next/link";

import { ItineraryCard } from "@/components/content/cards";
import { PageIntro } from "@/components/content/PageIntro";
import { HuntProgress } from "@/components/hunt/HuntProgress";
import { TripPlanner } from "@/components/plan/TripPlanner";
import { itineraries, places } from "@/content";
import { getMessages, resolveLocale } from "@/i18n";
import { href } from "@/i18n/config";
import { catalogue } from "@/lib/catalogue";
import { pageMetadata } from "@/lib/seo";
import ui from "@/styles/ui.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/plan">): Promise<Metadata> {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return pageMetadata({ lang, path: "/plan", title: t.plan.title, description: t.plan.intro });
}

export default async function PlanPage({ params }: PageProps<"/[lang]/plan">) {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return (
    <>
      <div className={ui.noPrint}>
        <PageIntro lang={lang} t={t} title={t.plan.title} lead={t.plan.intro} crumbs={[[t.nav.home, href(lang)]]} />
      </div>
      <div className={ui.wrap}>
        <section className={ui.section} aria-labelledby="my-trip">
          <h2 id="my-trip" className={`${ui.h2} ${ui.noPrint}`}>
            {t.plan.myTrip}
          </h2>
          <TripPlanner catalogue={catalogue(lang)} />
        </section>
        <section className={`${ui.section} ${ui.noPrint}`} aria-labelledby="passport">
          <h2 id="passport" className={ui.h2}>
            {t.hunt.passport}
          </h2>
          <p className={ui.muted}>{t.hunt.passportIntro}</p>
          <HuntProgress places={places.map((p) => p.slug)} large />
          <div className={ui.actions}>
            <Link href={href(lang, "/hunt/passport")} className={ui.button}>
              {t.hunt.myPassport}
            </Link>
            <Link href={href(lang, "/hunt")} className={ui.textLink}>
              {t.hunt.hunts}
            </Link>
          </div>
        </section>
        <section className={`${ui.section} ${ui.noPrint}`} aria-labelledby="templates">
          <h2 id="templates" className={ui.h2}>
            {t.plan.templates}
          </h2>
          <p className={ui.muted}>{t.plan.templatesIntro}</p>
          <div className={ui.cards}>
            {itineraries.map((i) => (
              <ItineraryCard key={i.slug} itinerary={i} lang={lang} t={t} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
