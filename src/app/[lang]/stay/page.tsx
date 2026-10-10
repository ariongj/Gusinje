import type { Metadata } from "next";

import { DirectorySection } from "@/components/content/DirectorySection";
import { PageIntro } from "@/components/content/PageIntro";
import { getSource } from "@/content/sources";
import { commonsPhotos } from "@/content/photos";
import { getMessages, resolveLocale } from "@/i18n";
import { href } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import ui from "@/styles/ui.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/stay">): Promise<Metadata> {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return pageMetadata({ lang, path: "/stay", title: t.directory.stayTitle, description: t.directory.stayIntro, image: commonsPhotos.vusanjeGuesthouses });
}

export default async function StayPage({ params }: PageProps<"/[lang]/stay">) {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  const official = getSource("togusinje-hotels");
  return (
    <>
      <PageIntro lang={lang} t={t} title={t.directory.stayTitle} lead={t.directory.stayIntro} crumbs={[[t.nav.home, href(lang)]]} photo={commonsPhotos.vusanjeGuesthouses} />
      <div className={ui.wrap}>
        <div className={ui.section}>
          <DirectorySection
            lang={lang}
            t={t}
            sections={["stay"]}
            empty={<p>{t.directory.empty}</p>}
            notes={
              <p>
                <a href={official.url} target="_blank" rel="noopener noreferrer" className={ui.textLink}>
                  {t.directory.officialAccommodation}
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
