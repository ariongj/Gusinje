import type { Metadata } from "next";
import Link from "next/link";

import { PageIntro } from "@/components/content/PageIntro";
import { Prose } from "@/components/content/Prose";
import { TranslationNotice } from "@/components/content/TranslationNotice";
import { brand } from "@/config/brand";
import { aboutPlatform } from "@/content/pages";
import { getMessages, resolveLocale } from "@/i18n";
import { href } from "@/i18n/config";
import { loc } from "@/i18n/localize";
import { pageMetadata } from "@/lib/seo";
import detail from "@/styles/detail.module.css";
import ui from "@/styles/ui.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/about/platform">): Promise<Metadata> {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return pageMetadata({ lang, path: "/about/platform", title: t.about.platformTitle, description: loc(aboutPlatform.lead, lang) });
}

export default async function PlatformPage({ params }: PageProps<"/[lang]/about/platform">) {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return (
    <>
      <PageIntro
        lang={lang}
        t={t}
        title={t.about.platformTitle}
        lead={loc(aboutPlatform.lead, lang)}
        crumbs={[
          [t.nav.home, href(lang)],
          [t.nav.about, href(lang, "/about")],
        ]}
      >
        <TranslationNotice status={{ sq: "unreviewed", cnr: "unreviewed" }} lang={lang} t={t} />
      </PageIntro>
      <div className={ui.wrap}>
        <div className={detail.layout}>
          <div className={detail.main}>
            <Prose sections={aboutPlatform.sections} lang={lang} t={t} />
          </div>
          <aside className={detail.side}>
            <div className={ui.stack}>
              <Link href={href(lang, "/contribute")} className={ui.button}>
                {t.footer.contribute}
              </Link>
              <Link href={href(lang, "/partners")} className={ui.buttonGhost}>
                {t.footer.partners}
              </Link>
              <a href={brand.creator.website} className={ui.buttonGhost}>
                {t.footer.rosiSite}
              </a>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
