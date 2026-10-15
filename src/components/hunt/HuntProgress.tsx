"use client";

import { useI18n } from "@/i18n/client";
import { fill } from "@/i18n/localize";
import { cx } from "@/lib/cx";
import { usePassport } from "@/lib/passport";

import styles from "./Hunt.module.css";

/** "3 of 5 found" with a bar, for a set of places (a hunt, or the whole valley). */
export function HuntProgress({ places, large = false, className }: { places: readonly string[]; large?: boolean; className?: string }) {
  const { t } = useI18n();
  const passport = usePassport();
  const found = places.filter((p) => passport.stamps[p]).length;
  const total = places.length;
  const done = total > 0 && found === total;
  return (
    <div className={cx(styles.progress, large && styles.progressLarge, done && styles.progressDone, className)} data-found={found}>
      <span className={styles.progressText}>{done ? t.hunt.complete : fill(large ? t.hunt.passportProgress : t.hunt.progress, { found, total })}</span>
      <span className={styles.bar} role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={found} aria-label={t.hunt.treasures}>
        <span className={styles.barFill} style={{ width: `${total ? (found / total) * 100 : 0}%` }} />
      </span>
    </div>
  );
}
