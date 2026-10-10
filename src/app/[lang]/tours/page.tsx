import type { Metadata } from "next";
import Link from "next/link";

import { TourCard } from "@/components/content/cards";
import { PageIntro } from "@/components/content/PageIntro";
import { Notice } from "@/components/ui/Notice";
import { tours } from "@/content";
import { getMessages, resolveLocale } from "@/i18n";
import { href } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import ui from "@/styles/ui.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/tours">): Promise<Metadata> {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return pageMetadata({ lang, path: "/tours", title: t.explore.toursTitle, description: t.explore.toursIntro });
}

export default async function ToursPage({ params }: PageProps<"/[lang]/tours">) {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return (
    <>
      <PageIntro lang={lang} t={t} title={t.explore.toursTitle} lead={t.explore.toursIntro} crumbs={[[t.nav.home, href(lang)]]}>
        <div className={ui.actions}>
          <Link href={href(lang, "/explore")} className={ui.button}>
            {t.nav.explore}
          </Link>
        </div>
      </PageIntro>
      <div className={ui.wrap}>
        <div className={ui.section}>
          <div className={ui.stack}>
            <Notice tone="info">{t.explore.tourDisclaimer}</Notice>
            <div className={ui.cards}>
              {tours.map((tour) => (
                <TourCard key={tour.slug} tour={tour} lang={lang} t={t} headingLevel={2} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
