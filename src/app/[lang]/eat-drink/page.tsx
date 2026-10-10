import type { Metadata } from "next";

import { DirectorySection } from "@/components/content/DirectorySection";
import { PageIntro } from "@/components/content/PageIntro";
import { getSource } from "@/content/sources";
import { getMessages, resolveLocale } from "@/i18n";
import { href } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import ui from "@/styles/ui.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/eat-drink">): Promise<Metadata> {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return pageMetadata({ lang, path: "/eat-drink", title: t.directory.eatTitle, description: t.directory.eatIntro });
}

export default async function EatDrinkPage({ params }: PageProps<"/[lang]/eat-drink">) {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  const official = getSource("gusinje-to-restaurants");
  return (
    <>
      <PageIntro lang={lang} t={t} title={t.directory.eatTitle} lead={t.directory.eatIntro} crumbs={[[t.nav.home, href(lang)]]} />
      <div className={ui.wrap}>
        <div className={ui.section}>
          <DirectorySection
            lang={lang}
            t={t}
            sections={["eat-drink"]}
            empty={<p>{t.directory.empty}</p>}
            notes={
              <p>
                <a href={official.url} target="_blank" rel="noopener noreferrer" className={ui.textLink}>
                  {t.directory.officialRestaurants}
                </a>
                .
              </p>
            }
          />
        </div>
      </div>
    </>
  );
}
