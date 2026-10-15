"use client";

import { useI18n } from "@/i18n/client";
import { fill } from "@/i18n/localize";
import { cx } from "@/lib/cx";
import { bearing, km } from "@/lib/geo";
import { ON_SITE_METRES } from "@/lib/passport";

import styles from "./Hunt.module.css";

type Props = {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  heading: number | null;
};

export type Warmth = "here" | "hot" | "warm" | "cold";

export function warmth(distanceKm: number): Warmth {
  if (distanceKm * 1000 <= ON_SITE_METRES) return "here";
  if (distanceKm <= 1) return "hot";
  if (distanceKm <= 5) return "warm";
  return "cold";
}

/** How far and which way to a sealed clue's place: a compass arrow and a hot/warm/cold reading. */
export function HotCold({ from, to, heading }: Props) {
  const { t, lang } = useI18n();
  const distance = km(from, to);
  const level = warmth(distance);
  const turn = bearing(from, to) - (heading ?? 0);
  const label =
    level === "here"
      ? t.hunt.hereNow
      : distance < 1
        ? fill(t.hunt.awayM, { m: Math.round(distance * 100) * 10 })
        : fill(t.hunt.away, { km: distance.toLocaleString(lang === "cnr" ? "sr-Latn" : lang, { maximumFractionDigits: distance < 10 ? 1 : 0 }) });
  return (
    <div className={cx(styles.hotCold, styles[`level-${level}`])} data-testid="hot-cold" data-level={level}>
      <svg className={styles.compass} width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
        <circle cx="28" cy="28" r="26" fill="var(--light)" stroke="currentColor" strokeWidth="1.5" opacity="0.9" />
        <g style={{ transform: `rotate(${-(heading ?? 0)}deg)`, transformOrigin: "28px 28px" }}>
          <text x="28" y="11" textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor" opacity="0.7">
            N
          </text>
        </g>
        <g className={styles.needle} style={{ transform: `rotate(${turn}deg)`, transformOrigin: "28px 28px" }}>
          <path d="M28 9l7 20-7-4-7 4z" fill="currentColor" />
          <circle cx="28" cy="28" r="3" fill="var(--light)" stroke="currentColor" strokeWidth="1.5" />
        </g>
      </svg>
      <div className={styles.hotColdText}>
        <strong>{level === "here" ? t.hunt.hot : t.hunt[level]}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}
