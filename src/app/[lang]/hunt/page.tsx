import type { Metadata } from "next";
import Link from "next/link";

import { PageIntro } from "@/components/content/PageIntro";
import styles from "@/components/hunt/Hunt.module.css";
import { HuntCard } from "@/components/hunt/HuntCard";
import { HuntProgress } from "@/components/hunt/HuntProgress";
import { HuntSketch } from "@/components/hunt/HuntSketch";
import { MAP_ICONS } from "@/components/map/icons";
import { hunts, places } from "@/content";
import { getMessages, resolveLocale } from "@/i18n";
import { href } from "@/i18n/config";
import { fill, loc } from "@/i18n/localize";
import { pageMetadata } from "@/lib/seo";
import ui from "@/styles/ui.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/hunt">): Promise<Metadata> {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return pageMetadata({ lang, path: "/hunt", title: t.hunt.title, description: t.hunt.intro });
}

/** The treasure hunt: how it works, the hunts, and the explorer's passport. */
export default async function HuntPage({ params }: PageProps<"/[lang]/hunt">) {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  const all = places.map((p) => p.slug);
  return (
    <>
      <PageIntro lang={lang} t={t} kicker={t.hunt.kicker} title={t.hunt.title} lead={t.hunt.intro} crumbs={[[t.nav.home, href(lang)]]} />
      <div className={styles.expedition}>
        <div className={ui.wrap}>
        <section className={ui.section} aria-labelledby="how">
          <h2 id="how" className={ui.h2}>
            {t.hunt.howTitle}
          </h2>
          <ol className={styles.steps}>
            {t.hunt.how.map((step) => (
              <li key={step} className={styles.step}>
                {step}
              </li>
            ))}
          </ol>
        </section>

        <section className={ui.section} aria-labelledby="hunts">
          <h2 id="hunts" className={ui.h2}>
            {t.hunt.hunts}
          </h2>
          <div className={styles.huntCards}>
            {hunts.map((hunt) => (
              <HuntCard key={hunt.slug} href={href(lang, `/hunt/${hunt.slug}`)} slug={hunt.slug}>
                <HuntSketch places={hunt.clues.map((c) => c.place)} />
                <div className={styles.huntCardHead}>
                  <span className={styles.huntIcon} aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={MAP_ICONS[hunt.icon]} />
                    </svg>
                  </span>
                  <div>
                    <h3 className={styles.huntTitle}>{loc(hunt.title, lang)}</h3>
                    <p className={styles.huntTagline}>{loc(hunt.tagline, lang)}</p>
                  </div>
                </div>
                <span className={styles.huntMeta}>{fill(t.hunt.clues, { n: hunt.clues.length })}</span>
                <HuntProgress places={hunt.clues.map((c) => c.place)} />
                <span className={styles.huntCta}>{t.hunt.openHunt} →</span>
              </HuntCard>
            ))}
          </div>
        </section>

        <section className={ui.section} aria-labelledby="passport">
          <h2 id="passport" className={ui.h2}>
            {t.hunt.passport}
          </h2>
          <p className={ui.muted}>{t.hunt.passportIntro}</p>
          <HuntProgress places={all} large />
          <div className={ui.actions}>
            <Link href={href(lang, "/hunt/passport")} className={ui.button}>
              {t.hunt.myPassport}
            </Link>
          </div>
        </section>
        </div>
      </div>
    </>
  );
}
