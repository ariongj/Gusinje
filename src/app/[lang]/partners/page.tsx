import type { Metadata } from "next";
import Link from "next/link";

import { PageIntro } from "@/components/content/PageIntro";
import { Prose } from "@/components/content/Prose";
import { TranslationNotice } from "@/components/content/TranslationNotice";
import { Notice } from "@/components/ui/Notice";
import { absoluteUrl } from "@/config/brand";
import { partners } from "@/content/pages";
import { getMessages, resolveLocale } from "@/i18n";
import { href } from "@/i18n/config";
import { loc } from "@/i18n/localize";
import { pageMetadata } from "@/lib/seo";
import detail from "@/styles/detail.module.css";
import ui from "@/styles/ui.module.css";

import styles from "./partners.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/partners">): Promise<Metadata> {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return pageMetadata({ lang, path: "/partners", title: t.partners.title, description: loc(partners.lead, lang) });
}

export default async function PartnersPage({ params }: PageProps<"/[lang]/partners">) {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  const embedUrl = absoluteUrl(`${href(lang, "/explore")}/?view=map`);
  const [before, after] = [partners.sections.slice(0, 4), partners.sections.slice(4)];
  return (
    <>
      <PageIntro lang={lang} t={t} title={t.partners.title} lead={loc(partners.lead, lang)} crumbs={[[t.nav.home, href(lang)]]}>
        <TranslationNotice status={{ sq: "unreviewed", cnr: "unreviewed" }} lang={lang} t={t} />
      </PageIntro>
      <div className={ui.wrap}>
        <div className={detail.layout}>
          <div className={detail.main}>
            <Notice tone="preview" title={t.common.previewBadge}>
              {loc(partners.status, lang)}
            </Notice>
            <Prose sections={before} lang={lang} t={t} />
            <ol className={styles.pilot}>
              {loc(partners.pilotPlaces, lang).map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ol>
            <Prose sections={after} lang={lang} t={t} />
            <pre className={styles.code} aria-label="Embed">
              {`<iframe src="${embedUrl}" title="Gusinje · Vusanje · Prokletije" width="100%" height="560" loading="lazy" style="border:0"></iframe>`}
            </pre>
          </div>
          <aside className={detail.side}>
            <div className={ui.stack}>
              <Link href={href(lang, "/explore")} className={ui.button}>
                {t.nav.explore}
              </Link>
              <Link href={href(lang, "/about/platform")} className={ui.buttonGhost}>
                {t.about.platformTitle}
              </Link>
              <Link href={href(lang, "/admin")} className={ui.buttonGhost}>
                {t.footer.admin}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
