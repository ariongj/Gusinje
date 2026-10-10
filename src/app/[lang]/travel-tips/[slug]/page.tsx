import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TipCard } from "@/components/content/cards";
import { PageIntro } from "@/components/content/PageIntro";
import { ShareBox } from "@/components/content/ShareBox";
import { SourceList } from "@/components/content/SourceList";
import { TranslationNotice } from "@/components/content/TranslationNotice";
import { TripButton } from "@/components/content/TripButton";
import { VerificationPanel } from "@/components/content/VerificationPanel";
import { Notice } from "@/components/ui/Notice";
import { guides } from "@/content";
import { getMessages, resolveLocale } from "@/i18n";
import { formatDate, href, locales } from "@/i18n/config";
import { fill, loc } from "@/i18n/localize";
import { pageMetadata } from "@/lib/seo";
import detail from "@/styles/detail.module.css";
import ui from "@/styles/ui.module.css";

import styles from "./guide.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => guides.map((g) => ({ lang, slug: g.slug })));
}

function findGuide(slug: string) {
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) notFound();
  return guide;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/travel-tips/[slug]">): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  const lang = resolveLocale(raw);
  const guide = findGuide(slug);
  return pageMetadata({ lang, path: `/travel-tips/${slug}`, title: loc(guide.title, lang), description: loc(guide.summary, lang) });
}

export default async function GuidePage({ params }: PageProps<"/[lang]/travel-tips/[slug]">) {
  const { lang: raw, slug } = await params;
  const lang = resolveLocale(raw);
  const t = getMessages(lang);
  const guide = findGuide(slug);
  const path = `/travel-tips/${slug}`;
  const title = loc(guide.title, lang);
  const others = guides.filter((g) => g.slug !== slug).slice(0, 3);
  return (
    <>
      <PageIntro
        lang={lang}
        t={t}
        crumbs={[
          [t.nav.home, href(lang)],
          [t.nav.tips, href(lang, "/travel-tips")],
        ]}
        kicker={t.nav.tips}
        title={title}
        lead={loc(guide.summary, lang)}
      >
        <p className={detail.alt}>
          {fill(t.tips.updated, { date: formatDate(guide.updated, lang) })} ·{" "}
          {fill(t.tips.owner, { owner: t.verification.owners[guide.owner as keyof typeof t.verification.owners] ?? guide.owner })}
        </p>
        <TranslationNotice status={guide.translations} lang={lang} t={t} />
        <div className={ui.actions}>
          <TripButton kind="guide" slug={guide.slug} />
        </div>
      </PageIntro>
      <div className={ui.wrap}>
        <div className={detail.layout}>
          <div className={detail.main}>
            {guide.sections.map((section, i) => (
              <section key={i} className={styles.section} aria-labelledby={`s${i}`} data-status={section.status}>
                <div className={styles.head}>
                  <h2 id={`s${i}`} className={ui.h2}>
                    {loc(section.heading, lang)}
                  </h2>
                  <span className={section.status === "needs-local-review" ? ui.badgeWarn : ui.badge}>{t.verification.guideStatus[section.status]}</span>
                </div>
                <div className={ui.prose}>
                  {loc(section.body, lang).map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                {section.sources.length > 0 && (
                  <details className={styles.sources}>
                    <summary>{t.tips.sectionSources}</summary>
                    <SourceList ids={section.sources} lang={lang} t={t} />
                  </details>
                )}
              </section>
            ))}
            <Notice tone="info">{t.tips.community}</Notice>
            <section aria-labelledby="more-tips" className={detail.block}>
              <h2 id="more-tips" className={ui.h2}>
                {t.tips.title}
              </h2>
              <div className={ui.cards}>
                {others.map((g) => (
                  <TipCard key={g.slug} guide={g} lang={lang} t={t} />
                ))}
              </div>
            </section>
          </div>
          <aside className={detail.side}>
            <ShareBox lang={lang} t={t} path={path} title={title} />
            <VerificationPanel verification={guide.verification} lang={lang} t={t} path={path} />
          </aside>
        </div>
      </div>
    </>
  );
}
