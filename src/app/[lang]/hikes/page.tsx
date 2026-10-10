import type { Metadata } from "next";

import { RouteCard } from "@/components/content/cards";
import { PageIntro } from "@/components/content/PageIntro";
import { SourceList } from "@/components/content/SourceList";
import { Notice } from "@/components/ui/Notice";
import { routes } from "@/content";
import { commonsPhotos } from "@/content/photos";
import { getMessages, resolveLocale } from "@/i18n";
import { href } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import ui from "@/styles/ui.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/hikes">): Promise<Metadata> {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return pageMetadata({ lang, path: "/hikes", title: t.hikes.title, description: t.hikes.intro, image: commonsPhotos.ropojanaUpper });
}

export default async function HikesPage({ params }: PageProps<"/[lang]/hikes">) {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return (
    <>
      <PageIntro
        lang={lang}
        t={t}
        title={t.hikes.title}
        lead={t.hikes.intro}
        crumbs={[
          [t.nav.home, href(lang)],
          [t.nav.guides, href(lang, "/guides-experiences")],
        ]}
        photo={commonsPhotos.ropojanaUpper}
      />
      <div className={ui.wrap}>
        <div className={ui.section}>
          <div className={ui.stack}>
            <Notice tone="warning" title={t.hikes.awaitingShort}>
              <p>{t.hikes.awaitingText}</p>
              <p>{t.hikes.noTrack}</p>
            </Notice>
            <div className={ui.cards}>
              {routes.map((r) => (
                <RouteCard key={r.slug} route={r} lang={lang} t={t} headingLevel={2} />
              ))}
            </div>
            <SourceList ids={["np-guided-routes", "np-prokletije-plan"]} lang={lang} t={t} />
          </div>
        </div>
      </div>
    </>
  );
}
