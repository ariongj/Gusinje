import type { Metadata } from "next";
import Link from "next/link";

import { PlaceCard } from "@/components/content/cards";
import { PageIntro } from "@/components/content/PageIntro";
import { Prose } from "@/components/content/Prose";
import { TranslationNotice } from "@/components/content/TranslationNotice";
import { places } from "@/content";
import { aboutRegion } from "@/content/pages";
import { commonsPhotos } from "@/content/photos";
import { getMessages, resolveLocale } from "@/i18n";
import { href } from "@/i18n/config";
import { loc } from "@/i18n/localize";
import { pageMetadata } from "@/lib/seo";
import detail from "@/styles/detail.module.css";
import ui from "@/styles/ui.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return pageMetadata({ lang, path: "/about", title: t.about.title, description: loc(aboutRegion.lead, lang), image: commonsPhotos.gusinjeAerial });
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return (
    <>
      <PageIntro lang={lang} t={t} title={t.about.title} lead={loc(aboutRegion.lead, lang)} crumbs={[[t.nav.home, href(lang)]]} photo={commonsPhotos.gusinjeAerial}>
        <TranslationNotice status={{ sq: "unreviewed", cnr: "unreviewed" }} lang={lang} t={t} />
      </PageIntro>
      <div className={ui.wrap}>
        <div className={detail.layout}>
          <div className={detail.main}>
            <Prose sections={aboutRegion.sections} lang={lang} t={t} />
          </div>
          <aside className={detail.side}>
            <div className={ui.stack}>
              <Link href={href(lang, "/about/history")} className={ui.button}>
                {t.footer.history}
              </Link>
              <Link href={href(lang, "/explore")} className={ui.buttonGhost}>
                {t.nav.explore}
              </Link>
              <Link href={href(lang, "/about/platform")} className={ui.buttonGhost}>
                {t.about.platformTitle}
              </Link>
            </div>
          </aside>
        </div>
        <section className={ui.section} aria-labelledby="places">
          <h2 id="places" className={ui.h2}>
            {t.home.placesTitle}
          </h2>
          <div className={ui.cards}>
            {places.slice(0, 6).map((p) => (
              <PlaceCard key={p.slug} place={p} lang={lang} t={t} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
