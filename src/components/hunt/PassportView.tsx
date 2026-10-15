"use client";

import Link from "next/link";

import type { MapIcon } from "@/components/map/icons";
import { useI18n } from "@/i18n/client";
import { formatDate, intlLocale } from "@/i18n/config";
import { fill } from "@/i18n/localize";
import { cx } from "@/lib/cx";
import { passportActions, usePassport } from "@/lib/passport";

import styles from "./Hunt.module.css";
import { Stamp, StampSlot } from "./Stamp";

/** A short date that fits inside the stamp ("15 Oct 2026"). */
function stampLabel(iso: string, lang: Parameters<typeof formatDate>[1]): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(intlLocale[lang], { day: "numeric", month: "short", year: "numeric" }).replace(/\.$/, "");
}


export type PassportPlace = { slug: string; name: string; categoryLabel: string; icon: MapIcon; href: string; mapHref: string | null; gem: boolean };
export type PassportHunt = { slug: string; title: string; icon: MapIcon; places: string[]; href: string };

/** The explorer's passport: progress, badges and a stamp for every place found. */
export function PassportView({ places, hunts, huntsHref }: { places: PassportPlace[]; hunts: PassportHunt[]; huntsHref: string }) {
  const { t, lang } = useI18n();
  const passport = usePassport();
  const found = places.filter((p) => passport.stamps[p.slug]).length;
  const total = places.length;
  const ratio = total ? found / total : 0;
  const r = 52;
  const circumference = 2 * Math.PI * r;

  const badges = [
    { key: "first", title: t.hunt.badgeFirst, text: t.hunt.badgeFirstText, icon: "compass" as MapIcon, earned: found >= 1 },
    ...hunts.map((h) => ({ key: h.slug, title: h.title, text: fill(t.hunt.progress, { found: h.places.filter((p) => passport.stamps[p]).length, total: h.places.length }), icon: h.icon, earned: h.places.every((p) => passport.stamps[p]) })),
    { key: "all", title: t.hunt.badgeAll, text: t.hunt.badgeAllText, icon: "mountain" as MapIcon, earned: total > 0 && found === total },
  ];

  return (
    <div className={styles.passport}>
      <div className={styles.passportHead}>
        <svg className={styles.ring} width="140" height="140" viewBox="0 0 140 140" role="img" aria-label={fill(t.hunt.passportProgress, { found, total })}>
          <circle cx="70" cy="70" r={r} fill="none" stroke="currentColor" strokeWidth="9" opacity="0.14" />
          <circle
            cx="70"
            cy="70"
            r={r}
            fill="none"
            stroke="var(--gold)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={`${circumference * ratio} ${circumference}`}
            transform="rotate(-90 70 70)"
          />
          <text x="70" y="66" textAnchor="middle" fontSize="30" fontWeight="500" fontFamily="var(--font-display), serif" fill="currentColor">
            {found}
          </text>
          <text x="70" y="88" textAnchor="middle" fontSize="12" fontWeight="600" fontFamily="var(--font-text), system-ui" fill="currentColor" opacity="0.7">
            / {total}
          </text>
        </svg>
        <div>
          <p className={styles.passportProgress} data-testid="passport-progress">
            {fill(t.hunt.passportProgress, { found, total })}
          </p>
          <p className={styles.muted}>{found === 0 ? t.hunt.firstStamp : t.hunt.passportIntro}</p>
          <div className={styles.answerLinks}>
            <Link href={huntsHref} className={styles.linkPrimary}>
              {t.hunt.hunts}
            </Link>
            {found > 0 && (
              <button
                type="button"
                className={styles.textButton}
                onClick={() => {
                  if (window.confirm(t.hunt.resetConfirm)) passportActions.clear();
                }}
              >
                {t.hunt.reset}
              </button>
            )}
          </div>
        </div>
      </div>

      <h2 className={styles.h2}>{t.hunt.badges}</h2>
      <ul className={styles.badges}>
        {badges.map((b) => (
          <li key={b.key} className={cx(styles.badge, b.earned && styles.badgeEarned)} data-testid="badge" data-earned={b.earned}>
            {b.earned ? <Stamp icon={b.icon} how="here" size={64} /> : <StampSlot size={64} />}
            <span className={styles.badgeTitle}>{b.title}</span>
            <span className={styles.badgeText}>{b.earned ? t.hunt.earned : b.text}</span>
          </li>
        ))}
      </ul>

      <h2 className={styles.h2}>{t.hunt.treasures}</h2>
      <ul className={styles.stampGrid}>
        {places.map((p) => {
          const stamp = passport.stamps[p.slug];
          return (
            <li key={p.slug} className={cx(styles.stampCell, stamp && styles.stampCellFound)}>
              {stamp ? <Stamp icon={p.icon} how={stamp.how} label={stampLabel(stamp.at, lang)} size={84} /> : <StampSlot size={84} />}
              <span className={styles.stampName}>{p.name}</span>
              <span className={styles.stampMeta}>{p.categoryLabel}</span>
              <span className={styles.stampLinks}>
                <Link href={p.href}>{t.common.openPage}</Link>
                {p.mapHref && <Link href={p.mapHref}>{t.common.showOnMap}</Link>}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
