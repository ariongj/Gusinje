import type { Metadata } from "next";
import Link from "next/link";

import { PageIntro } from "@/components/content/PageIntro";
import { Notice } from "@/components/ui/Notice";
import { serviceGroups, services } from "@/content/services";
import { getSource } from "@/content/sources";
import { getMessages, resolveLocale } from "@/i18n";
import { formatDate, href } from "@/i18n/config";
import { fill, loc } from "@/i18n/localize";
import { pageMetadata } from "@/lib/seo";
import ui from "@/styles/ui.module.css";

import styles from "./services.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return pageMetadata({ lang, path: "/services", title: t.services.title, description: t.services.intro });
}

export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const lang = resolveLocale((await params).lang);
  const t = getMessages(lang);
  return (
    <>
      <PageIntro lang={lang} t={t} title={t.services.title} lead={t.services.intro} crumbs={[[t.nav.home, href(lang)]]} />
      <div className={ui.wrap}>
        <Notice tone="info">{t.services.note}</Notice>
        <nav className={styles.jump} aria-label={t.services.title}>
          {serviceGroups.map((group) => (
            <a key={group} href={`#${group}`} className={styles.jumpLink}>
              {t.services.groups[group]}
            </a>
          ))}
        </nav>
        {serviceGroups.map((group) => (
          <section key={group} id={group} className={styles.group} aria-labelledby={`${group}-title`}>
            <h2 id={`${group}-title`} className={styles.groupTitle}>
              {t.services.groups[group]}
            </h2>
            <div className={styles.grid}>
              {services
                .filter((s) => s.group === group)
                .map((s) => (
                  <article key={s.slug} id={s.slug} className={styles.card}>
                    <h3 className={styles.name}>{loc(s.name, lang)}</h3>
                    <p className={styles.summary}>{loc(s.summary, lang)}</p>
                    {s.phones && (
                      <ul className={styles.phones}>
                        {s.phones.map((phone) => (
                          <li key={phone.number}>
                            <a href={`tel:${phone.number}`} className={styles.phone} aria-label={`${fill(t.services.call, { number: phone.number })} — ${loc(phone.label, lang)}`}>
                              <span className={styles.number}>{phone.number}</span>
                              <span className={styles.phoneLabel}>{loc(phone.label, lang)}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                    {s.facts && (
                      <ul className={styles.facts}>
                        {loc(s.facts, lang).map((fact) => (
                          <li key={fact}>{fact}</li>
                        ))}
                      </ul>
                    )}
                    {(s.address || s.hours) && (
                      <dl className={styles.details}>
                        {s.address && (
                          <>
                            <dt>{t.services.address}</dt>
                            <dd>{s.address}</dd>
                          </>
                        )}
                        {s.hours && (
                          <>
                            <dt>{t.services.hours}</dt>
                            <dd>
                              {loc(s.hours, lang)}
                              <span className={styles.asPublished}>{t.services.asPublished}</span>
                            </dd>
                          </>
                        )}
                      </dl>
                    )}
                    {(s.email || s.website || s.more) && (
                      <div className={styles.actions}>
                        {s.email && (
                          <a href={`mailto:${s.email}`} className={ui.buttonSmall}>
                            {t.services.email}: {s.email}
                          </a>
                        )}
                        {s.website && (
                          <a href={s.website} target="_blank" rel="noopener noreferrer" className={ui.buttonSmall}>
                            {t.services.website}
                          </a>
                        )}
                        {s.more && (
                          <Link href={href(lang, s.more)} className={ui.buttonSmall} prefetch={false}>
                            {t.services.more}
                          </Link>
                        )}
                      </div>
                    )}
                    {s.verification.sources.length > 0 && (
                      <p className={styles.sources}>
                        {t.services.sources}:{" "}
                        {s.verification.sources.map((id, i) => {
                          const source = getSource(id);
                          return (
                            <span key={id}>
                              {i > 0 && " · "}
                              <a href={source.url} target="_blank" rel="noopener noreferrer">
                                {source.publisher}
                              </a>
                            </span>
                          );
                        })}
                        {s.verification.lastChecked && <> — {fill(t.services.checked, { date: formatDate(s.verification.lastChecked, lang) })}</>}
                      </p>
                    )}
                  </article>
                ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
