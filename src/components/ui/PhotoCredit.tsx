import type { Credit } from "@/content/types";
import { fill } from "@/i18n/localize";
import type { Messages } from "@/i18n/messages/en";
import { cx } from "@/lib/cx";

import styles from "./PhotoCredit.module.css";

type PhotoCreditProps = {
  credit: Credit;
  /** Photo rights still being collected (owner photos). */
  pending?: boolean;
  t: Messages;
  /** "light" over dark backgrounds, "dark" on paper. */
  tone?: "light" | "dark";
  className?: string;
};

/** Attribution line: author (linked to the file page), licence (linked to its deed) and where it is from. */
export function PhotoCredit({ credit, pending = false, t, tone = "dark", className }: PhotoCreditProps) {
  if (credit.kind === "illustration") return <p className={cx(styles.credit, tone === "dark" && styles.dark, className)}>{t.common.illustration}</p>;
  const parts = t.common.photoBy.split(/(\{author\}|\{license\}|\{via\})/);
  return (
    <p className={cx(styles.credit, tone === "dark" && styles.dark, className)}>
      {parts.map((part, i) => {
        if (part === "{author}")
          return (
            <a key={i} href={credit.href} target="_blank" rel="noopener noreferrer" className={styles.link}>
              {credit.author}
            </a>
          );
        if (part === "{license}")
          return credit.licenseUrl ? (
            <a key={i} href={credit.licenseUrl} target="_blank" rel="noopener noreferrer license" className={styles.link}>
              {credit.license}
            </a>
          ) : (
            credit.license
          );
        if (part === "{via}") return credit.via;
        return part;
      })}
      {pending && <> · {t.common.rightsPending}</>}
    </p>
  );
}

/** The same credit as plain text (for alt-adjacent contexts and the map panel). */
export function creditText(credit: Credit, t: Messages): string {
  if (credit.kind === "illustration") return t.common.illustration;
  return fill(t.common.photoBy, { author: credit.author, license: credit.license, via: credit.via });
}
