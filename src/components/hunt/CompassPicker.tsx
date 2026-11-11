"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ArtTile } from "@/components/ui/ArtTile";
import { Photo } from "@/components/ui/Photo";
import { useI18n } from "@/i18n/client";
import { fill } from "@/i18n/localize";
import { cx } from "@/lib/cx";
import { usePassport } from "@/lib/passport";
import type { PickPlace } from "@/lib/picks";

import styles from "./CompassPicker.module.css";

const SPIN_MS = 2600;

/**
 * "Spin the compass": picks a place for the visitor — one they haven't found
 * yet, while there are any — and stops the needle in its real direction from
 * Gusinje. A game of chance over real places; nothing is invented.
 */
export function CompassPicker({ places, className }: { places: PickPlace[]; className?: string }) {
  const { t, lang } = useI18n();
  const passport = usePassport();
  const [angle, setAngle] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [started, setStarted] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const spin = () => {
    if (spinning || places.length === 0) return;
    const others = places.map((_, i) => i).filter((i) => i !== pick);
    const fresh = others.filter((i) => !passport.stamps[places[i].slug]);
    const pool = fresh.length ? fresh : others.length ? others : [0];
    const next = pool[Math.floor(Math.random() * pool.length)];
    const target = places[next].bearing ?? Math.random() * 360;
    const current = ((angle % 360) + 360) % 360;
    const delta = (target - current + 360) % 360;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setStarted(true);
    setAngle(angle + delta + (still ? 0 : 1080));
    if (still) {
      setPick(next);
      return;
    }
    setSpinning(true);
    timer.current = window.setTimeout(() => {
      setPick(next);
      setSpinning(false);
    }, SPIN_MS);
  };

  const place = pick === null ? null : places[pick];
  const distance = place ? place.km.toLocaleString(lang === "cnr" ? "sr-Latn" : lang, { maximumFractionDigits: 1 }) : "";

  return (
    <div className={cx(styles.picker, className)} data-testid="compass-picker">
      <div className={styles.dial}>
        <svg className={styles.rose} viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r="96" className={styles.rim} />
          <circle cx="100" cy="100" r="82" className={styles.ring} />
          {Array.from({ length: 24 }, (_, i) => (
            <path key={i} d={i % 6 === 0 ? "M100 8v14" : i % 2 === 0 ? "M100 8v9" : "M100 8v5"} transform={`rotate(${i * 15} 100 100)`} className={styles.tick} />
          ))}
          {(["N", "E", "S", "W"] as const).map((letter, i) => (
            <text key={letter} x="100" y="42" textAnchor="middle" transform={`rotate(${i * 90} 100 100)`} className={styles.letter}>
              {letter}
            </text>
          ))}
          <g className={cx(styles.needle, !started && styles.idle)} style={{ transform: `rotate(${angle}deg)`, transitionDuration: spinning ? `${SPIN_MS}ms` : "0ms" }}>
            <path d="M100 30l11 70H89z" className={styles.north} />
            <path d="M100 170l-11-70h22z" className={styles.south} />
          </g>
          <circle cx="100" cy="100" r="7" className={styles.hub} />
        </svg>
        <button type="button" className={styles.spin} onClick={spin} disabled={spinning}>
          {spinning ? t.hunt.spinning : place ? t.hunt.spinAgain : t.hunt.spin}
        </button>
      </div>

      <div className={styles.result} role="status">
        {place && !spinning ? (
          <article key={place.slug} className={styles.card}>
            <div className={styles.media}>{place.photo ? <Photo src={place.photo.src} alt={place.photo.alt} sizes="(max-width: 700px) 100vw, 320px" /> : <ArtTile icon={place.icon} tone={place.tone} id={place.slug} />}</div>
            <div className={styles.body}>
              <p className={styles.eyebrow}>{t.hunt.pointsTo}</p>
              <h3 className={styles.name}>{place.name}</h3>
              <p className={styles.kicker}>{place.kicker}</p>
              <p className={styles.text}>{place.summary}</p>
              {place.bearing !== null && <p className={styles.distance}>{fill(t.explore.fromGusinje, { km: distance })}</p>}
              <div className={styles.links}>
                <Link href={place.href} className={styles.primary}>
                  {t.common.openPage}
                </Link>
                <Link href={place.mapHref} className={styles.secondary}>
                  {t.common.showOnMap}
                </Link>
              </div>
            </div>
          </article>
        ) : (
          <div className={styles.invite}>
            <h3 className={styles.inviteTitle}>{t.hunt.pickTitle}</h3>
            <p className={styles.text}>{t.hunt.pickText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
