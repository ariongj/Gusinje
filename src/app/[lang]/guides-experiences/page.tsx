import type { Metadata } from "next";
import Link from "next/link";

import { RouteCard, TourCard } from "@/components/content/cards";
import { DirectorySection } from "@/components/content/DirectorySection";
import { PageIntro } from "@/components/content/PageIntro";
import { SourceList } from "@/components/content/SourceList";
import { commonsPhotos } from "@/content/photos";
import { routes, tours } from "@/content";
import { getMessages, resolveLocale } from "@/i18n";
import { href } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import ui from "@/styles/ui.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/guides-experiences">): Promise<Metadata> {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return pageMetadata({ lang, path: "/guides-experiences", title: t.directory.guidesTitle, description: t.directory.guidesIntro, image: commonsPhotos.ropojanaHiker });
}

export default async function GuidesPage({ params }: PageProps<"/[lang]/guides-experiences">) {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return (
    <>
      <PageIntro lang={lang} t={t} title={t.directory.guidesTitle} lead={t.directory.guidesIntro} crumbs={[[t.nav.home, href(lang)]]} photo={commonsPhotos.ropojanaHiker} />
      <div className={ui.wrap}>
        <section className={ui.section} aria-labelledby="providers">
          <h2 id="providers" className={ui.h2}>
            {t.businessCategory.guide} · {t.businessCategory.activity}
          </h2>
          <DirectorySection
            lang={lang}
            t={t}
            sections={["guides-experiences"]}
            empty={
              <div className={ui.stack}>
                <p>{t.directory.guidesEmpty}</p>
                <SourceList ids={["np-guided-routes"]} lang={lang} t={t} />
              </div>
            }
          />
        </section>

        <section className={ui.sectionTight} aria-labelledby="hikes">
          <div className={ui.sectionHead}>
            <h2 id="hikes" className={ui.h2}>
              {t.hikes.title}
            </h2>
            <Link href={href(lang, "/hikes")} className={ui.textLink}>
              {t.common.seeAll}
            </Link>
          </div>
          <p className={ui.muted}>{t.hikes.intro}</p>
          <div className={ui.cards}>
            {routes.map((r) => (
              <RouteCard key={r.slug} route={r} lang={lang} t={t} />
            ))}
          </div>
        </section>

        <section className={ui.section} aria-labelledby="virtual-tours">
          <div className={ui.sectionHead}>
            <h2 id="virtual-tours" className={ui.h2}>
              {t.explore.toursTitle}
            </h2>
            <Link href={href(lang, "/tours")} className={ui.textLink}>
              {t.common.seeAll}
            </Link>
          </div>
          <div className={ui.cards}>
            {tours.map((tour) => (
              <TourCard key={tour.slug} tour={tour} lang={lang} t={t} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
