import type { Metadata } from "next";

import { PageIntro } from "@/components/content/PageIntro";
import { TranslationNotice } from "@/components/content/TranslationNotice";
import { Notice } from "@/components/ui/Notice";
import { culture, historyLead, timeline } from "@/content/history";
import { commonsPhotos } from "@/content/photos";
import { getSource } from "@/content/sources";
import { getMessages, resolveLocale } from "@/i18n";
import { href, type Locale } from "@/i18n/config";
import { loc } from "@/i18n/localize";
import type { Messages } from "@/i18n/messages/en";
import { pageMetadata } from "@/lib/seo";
import ui from "@/styles/ui.module.css";

import styles from "./history.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/about/history">): Promise<Metadata> {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return pageMetadata({ lang, path: "/about/history", title: t.history.title, description: loc(historyLead, lang), image: commonsPhotos.gusinjeHouses });
}

function Sources({ ids, t }: { ids: string[]; t: Messages }) {
  return (
    <p className={styles.sources}>
      {t.history.sources}:{" "}
      {ids.map((id, i) => {
        const source = getSource(id);
        return (
          <span key={id}>
            {i > 0 && " · "}
            {source.url ? (
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                {source.title} ({source.publisher})
              </a>
            ) : (
              `${source.title} (${source.publisher})`
            )}
          </span>
        );
      })}
    </p>
  );
}

export default async function HistoryPage({ params }: PageProps<"/[lang]/about/history">) {
  const lang: Locale = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return (
    <>
      <PageIntro
        lang={lang}
        t={t}
        title={t.history.title}
        lead={loc(historyLead, lang)}
        photo={commonsPhotos.gusinjeHouses}
        crumbs={[
          [t.nav.home, href(lang)],
          [t.nav.about, href(lang, "/about")],
        ]}
      >
        <TranslationNotice status={{ sq: "unreviewed", cnr: "unreviewed" }} lang={lang} t={t} />
      </PageIntro>
      <div className={ui.wrap}>
        <Notice tone="info">{t.history.review}</Notice>

        <section className={styles.section} aria-labelledby="timeline">
          <h2 id="timeline" className={styles.title}>
            {t.history.timeline}
          </h2>
          <ol className={styles.timeline}>
            {timeline.map((entry) => (
              <li key={entry.period.en} className={styles.entry}>
                <p className={styles.period}>{loc(entry.period, lang)}</p>
                <div className={styles.entryBody}>
                  <h3 className={styles.entryTitle}>{loc(entry.title, lang)}</h3>
                  {entry.contested && <p className={styles.contested}>{t.history.contested}</p>}
                  {loc(entry.body, lang).map((paragraph) => (
                    <p key={paragraph} className={styles.text}>
                      {paragraph}
                    </p>
                  ))}
                  <Sources ids={entry.sources} t={t} />
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.section} aria-labelledby="culture">
          <h2 id="culture" className={styles.title}>
            {t.history.culture}
          </h2>
          <div className={styles.culture}>
            {culture.map((entry) => (
              <article key={entry.title.en} className={styles.card}>
                <h3 className={styles.entryTitle}>{loc(entry.title, lang)}</h3>
                {loc(entry.body, lang).map((paragraph) => (
                  <p key={paragraph} className={styles.text}>
                    {paragraph}
                  </p>
                ))}
                <Sources ids={entry.sources} t={t} />
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
