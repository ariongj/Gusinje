import Link from "next/link";

import type { Verification } from "@/content/types";
import { formatDate, href, type Locale } from "@/i18n/config";
import { fill } from "@/i18n/localize";
import type { Messages } from "@/i18n/messages/en";

import { SourceList } from "./SourceList";
import styles from "./VerificationPanel.module.css";

type Props = {
  verification: Verification;
  lang: Locale;
  t: Messages;
  /** Path of the page (no language), for the correction link. */
  path: string;
  /** Extra source ids to list (e.g. from coordinates). */
  extraSources?: string[];
};

/** How the information on a page is known: status, date, who keeps it current, sources, and how to report a problem. */
export function VerificationPanel({ verification, lang, t, path, extraSources = [] }: Props) {
  const correction = `${href(lang, "/contribute")}?type=correction&page=${encodeURIComponent(path)}`;
  return (
    <section className={styles.panel} aria-labelledby="verification-title">
      <h2 id="verification-title" className={styles.title}>
        {t.verification.title}
      </h2>
      <p className={styles.status} data-status={verification.status}>
        <span className={styles.dot} aria-hidden="true" />
        {t.verification.status[verification.status]}
      </p>
      <p className={styles.meta}>
        {verification.lastChecked ? fill(t.verification.lastChecked, { date: formatDate(verification.lastChecked, lang) }) : t.verification.neverChecked}
        {" · "}
        {fill(t.verification.owner, { owner: t.verification.owners[verification.owner as keyof Messages["verification"]["owners"]] ?? verification.owner })}
      </p>
      {/* Editorial notes are kept in English for the editors. */}
      {verification.notes && (
        <p className={styles.notes} lang="en">
          {verification.notes}
        </p>
      )}
      <h3 className={styles.subtitle}>{t.common.sources}</h3>
      <SourceList ids={[...verification.sources, ...extraSources]} lang={lang} t={t} />
      <p className={styles.report}>
        {t.verification.report}{" "}
        <Link href={correction} className={styles.link}>
          {t.business.correct}
        </Link>
      </p>
    </section>
  );
}
