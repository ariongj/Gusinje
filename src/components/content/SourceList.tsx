import { getSource } from "@/content/sources";
import { formatDate, type Locale } from "@/i18n/config";
import { fill } from "@/i18n/localize";
import type { Messages } from "@/i18n/messages/en";

import styles from "./SourceList.module.css";

/** Sources with publisher, kind and the date consulted. */
export function SourceList({ ids, lang, t }: { ids: readonly string[]; lang: Locale; t: Messages }) {
  const unique = [...new Set(ids)];
  if (!unique.length) return null;
  return (
    <ul className={styles.list}>
      {unique.map((id) => {
        const s = getSource(id);
        return (
          <li key={id} className={styles.item}>
            <span className={styles.kind} data-kind={s.kind}>
              {t.verification.sourceKind[s.kind]}
            </span>{" "}
            {s.url ? (
              <a href={s.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                {s.title}
              </a>
            ) : (
              s.title
            )}{" "}
            <span className={styles.meta}>
              — {s.publisher}, {fill(t.verification.consulted, { date: formatDate(s.accessed, lang) })}
            </span>
            {s.note && <span className={styles.note}> {s.note}</span>}
          </li>
        );
      })}
    </ul>
  );
}
