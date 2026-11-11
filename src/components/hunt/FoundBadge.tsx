"use client";

import { useI18n } from "@/i18n/client";
import { usePassport } from "@/lib/passport";

import styles from "./Hunt.module.css";

/** A gold "found" mark on a place's card, once it is stamped in the explorer's passport. */
export function FoundBadge({ slug }: { slug: string }) {
  const { t } = useI18n();
  const stamp = usePassport().stamps[slug];
  if (!stamp) return null;
  return (
    <span className={styles.foundBadge} data-testid="found-badge">
      <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M3 8.5l3.2 3.2L13 4.8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {t.hunt.foundBadge}
    </span>
  );
}
