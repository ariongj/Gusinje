"use client";

import type { RecordKind } from "@/content/types";
import { useI18n } from "@/i18n/client";
import { cx } from "@/lib/cx";
import { itemKey, tripActions, useTrip } from "@/lib/trip";

import styles from "./TripButton.module.css";

/** Save a record to My Trip (or take it out again). */
export function TripButton({ kind, slug, compact = false, className }: { kind: RecordKind; slug: string; compact?: boolean; className?: string }) {
  const { t } = useI18n();
  const trip = useTrip();
  const key = itemKey({ kind, slug });
  const saved = trip.items.some((i) => itemKey(i) === key);
  return (
    <button
      type="button"
      className={cx(styles.button, saved && styles.saved, compact && styles.compact, className)}
      aria-pressed={saved}
      onClick={() => (saved ? tripActions.remove(key) : tripActions.add(kind, slug))}
    >
      <svg width="15" height="15" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M5 2.5h10v15l-5-3.6-5 3.6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill={saved ? "currentColor" : "none"} />
      </svg>
      {saved ? t.common.inTrip : t.common.addToTrip}
    </button>
  );
}
