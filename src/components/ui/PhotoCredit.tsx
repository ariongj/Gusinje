import { cx } from "@/lib/cx";

import styles from "./PhotoCredit.module.css";

/** Attribution for a Wikimedia Commons photo (shown next to the image). */
export type Credit = {
  author: string;
  license: string;
  /** The file's Commons page. */
  href: string;
};

type PhotoCreditProps = {
  credit?: Credit;
  /** "light" over photos and dark sections, "dark" on paper. */
  tone?: "light" | "dark";
  /** Extra space above, e.g. under a hero's buttons. */
  spaced?: boolean;
  className?: string;
};

/** Attribution line for a Wikimedia Commons photo — required by its licence. */
export function PhotoCredit({ credit, tone = "light", spaced = false, className }: PhotoCreditProps) {
  if (!credit) return null;
  return (
    <p className={cx(styles.credit, tone === "dark" && styles.dark, spaced && styles.spaced, className)}>
      Photo:{" "}
      <a href={credit.href} target="_blank" rel="noopener noreferrer" className={styles.link}>
        {credit.author}
      </a>
      , {credit.license}, via Wikimedia Commons
    </p>
  );
}
