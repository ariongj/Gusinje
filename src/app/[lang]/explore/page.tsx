import type { Metadata } from "next";

import { PageIntro } from "@/components/content/PageIntro";
import { Explorer } from "@/components/explore/Explorer";
import { getMessages, resolveLocale } from "@/i18n";
import { href } from "@/i18n/config";
import { exploreItems, exploreTours } from "@/lib/explore-data";
import { pageMetadata } from "@/lib/seo";
import ui from "@/styles/ui.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/explore">): Promise<Metadata> {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return pageMetadata({ lang, path: "/explore", title: t.explore.title, description: t.explore.intro });
}

export default async function ExplorePage({ params }: PageProps<"/[lang]/explore">) {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return (
    <>
      <PageIntro lang={lang} t={t} title={t.explore.title} lead={t.explore.intro} crumbs={[[t.nav.home, href(lang)]]} />
      <div className={ui.wrap}>
        <div className={ui.sectionTight}>
          <Explorer items={exploreItems(lang)} tours={exploreTours(lang)} />
        </div>
      </div>
    </>
  );
}
