"use client";

import { useEffect, useState } from "react";

import type { MapIcon } from "@/components/map/icons";
import { useI18n } from "@/i18n/client";
import { formatDate, intlLocale } from "@/i18n/config";
import { fill } from "@/i18n/localize";
import { cx } from "@/lib/cx";
import { km } from "@/lib/geo";
import { ON_SITE_METRES, passportActions, usePassport } from "@/lib/passport";

import styles from "./Hunt.module.css";
import { Stamp } from "./Stamp";

/** A short date that fits inside the stamp ("15 Oct 2026"). */
function stampLabel(iso: string, lang: Parameters<typeof formatDate>[1]): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(intlLocale[lang], { day: "numeric", month: "short", year: "numeric" }).replace(/\.$/, "");
}


type Props = {
  slug: string;
  name: string;
  icon?: MapIcon;
  /** The place's verified position; null when it has none yet. */
  location: { lat: number; lng: number } | null;
  compact?: boolean;
};

type Note = { kind: "ok" | "far" | "denied" | "unavailable" | "checking"; km?: number } | null;

/**
 * Stamp a place in the explorer's passport: on site ("I'm here", the
 * browser's position compared with the place on this device only) or by
 * hand. Shows the stamp once it's there.
 */
export function StampButton({ slug, name, icon = "info", location, compact = false }: Props) {
  const { t, lang } = useI18n();
  const passport = usePassport();
  const stamp = passport.stamps[slug];
  const [note, setNote] = useState<Note>(null);

  useEffect(() => {
    if (!note || note.kind === "checking") return;
    const timer = window.setTimeout(() => setNote(null), note.kind === "ok" ? 5000 : 9000);
    return () => window.clearTimeout(timer);
  }, [note]);

  const here = () => {
    if (!location) return;
    if (!("geolocation" in navigator)) {
      setNote({ kind: "unavailable" });
      return;
    }
    setNote({ kind: "checking" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const distance = km({ lat: pos.coords.latitude, lng: pos.coords.longitude }, location);
        if (distance * 1000 <= ON_SITE_METRES + Math.min(pos.coords.accuracy || 0, 100)) {
          passportActions.stamp(slug, "here");
          setNote({ kind: "ok" });
        } else {
          setNote({ kind: "far", km: distance });
        }
      },
      (error) => setNote({ kind: error.code === error.PERMISSION_DENIED ? "denied" : "unavailable" }),
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 30_000 },
    );
  };

  const message =
    note?.kind === "ok"
      ? t.hunt.stamped
      : note?.kind === "far"
        ? fill(t.hunt.tooFar, { km: (note.km ?? 0).toLocaleString(lang === "cnr" ? "sr-Latn" : lang, { maximumFractionDigits: 1 }) })
        : note?.kind === "denied"
          ? t.explore.locationDenied
          : note?.kind === "unavailable"
            ? t.explore.locationUnavailable
            : note?.kind === "checking"
              ? t.hunt.checking
              : null;

  if (stamp) {
    return (
      <div className={cx(styles.stampBox, compact && styles.stampBoxCompact)} data-testid="stamp" data-how={stamp.how}>
        <Stamp icon={icon} how={stamp.how} label={stampLabel(stamp.at, lang)} size={compact ? 72 : 96} />
        <div className={styles.stampText}>
          <strong>{t.hunt.foundBadge}</strong>
          <span>
            {fill(t.hunt.foundOn, { date: formatDate(stamp.at.slice(0, 10), lang) })} · {stamp.how === "here" ? t.hunt.onSite : t.hunt.byHand}
          </span>
          <button type="button" className={styles.textButton} onClick={() => passportActions.unstamp(slug)}>
            {t.hunt.unstamp}
          </button>
        </div>
        {message && (
          <p className={styles.note} role="status">
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cx(styles.stampBox, compact && styles.stampBoxCompact)} data-testid="stamp" data-how="none">
      <div className={styles.stampActions}>
        {location ? (
          <button type="button" className={styles.stampHere} onClick={here} disabled={note?.kind === "checking"} aria-label={`${t.hunt.stampHere}: ${name}`}>
            <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="10" cy="10" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="10" cy="10" r="2" fill="currentColor" />
              <path d="M10 1.5v3M10 15.5v3M1.5 10h3M15.5 10h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            {t.hunt.stampHere}
          </button>
        ) : (
          <p className={styles.muted}>{t.hunt.noLocation}</p>
        )}
        <button type="button" className={styles.markHand} onClick={() => passportActions.stamp(slug, "hand")} aria-label={`${t.hunt.markHand}: ${name}`}>
          {t.hunt.markHand}
        </button>
      </div>
      {message ? (
        <p className={styles.note} role="status">
          {message}
        </p>
      ) : (
        location && <p className={styles.privacy}>{t.hunt.privacy}</p>
      )}
    </div>
  );
}
