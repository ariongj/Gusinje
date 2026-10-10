import type { Metadata } from "next";

import { DirectorySection } from "@/components/content/DirectorySection";
import { PageIntro } from "@/components/content/PageIntro";
import { getMessages, resolveLocale } from "@/i18n";
import { href } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import ui from "@/styles/ui.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/directory">): Promise<Metadata> {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return pageMetadata({ lang, path: "/directory", title: t.directory.title, description: t.directory.intro });
}

export default async function DirectoryPage({ params }: PageProps<"/[lang]/directory">) {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return (
    <>
      <PageIntro lang={lang} t={t} title={t.directory.title} lead={t.directory.intro} crumbs={[[t.nav.home, href(lang)]]} />
      <div className={ui.wrap}>
        <div className={ui.section}>
          <DirectorySection lang={lang} t={t} empty={<p>{t.directory.empty}</p>} />
        </div>
      </div>
    </>
  );
}
