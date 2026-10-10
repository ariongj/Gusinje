import type { Metadata } from "next";

import { PageIntro } from "@/components/content/PageIntro";
import { SearchPage } from "@/components/search/SearchPage";
import { getMessages, resolveLocale } from "@/i18n";
import { href } from "@/i18n/config";
import { searchIndex } from "@/lib/search-index";
import { pageMetadata } from "@/lib/seo";
import ui from "@/styles/ui.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/search">): Promise<Metadata> {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return pageMetadata({ lang, path: "/search", title: t.search.title, description: t.search.hint });
}

export default async function Search({ params }: PageProps<"/[lang]/search">) {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return (
    <>
      <PageIntro lang={lang} t={t} title={t.search.title} crumbs={[[t.nav.home, href(lang)]]} />
      <div className={ui.wrap}>
        <div className={ui.section}>
          <SearchPage docs={searchIndex(lang)} />
        </div>
      </div>
    </>
  );
}
