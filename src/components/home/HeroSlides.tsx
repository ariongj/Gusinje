"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Credit } from "@/content/types";
import { PhotoCredit } from "@/components/ui/PhotoCredit";
import { Photo } from "@/components/ui/Photo";
import { useI18n } from "@/i18n/client";
import { fill } from "@/i18n/localize";
import { cx } from "@/lib/cx";

import styles from "./HeroSlides.module.css";

export type HeroSlide = {
  src: string;
  alt: string;
  position?: string;
  /** Place shown, e.g. "Grlja · Vusanje". */
  label: string;
  href: string;
  credit: Credit;
};

const INTERVAL = 7000;

/**
 * The hero's photos: one place at a time, cross-fading every few seconds.
 * Pauses on hover, on focus, when the tab is hidden and with reduced motion;
 * a button stops it for good. Swipe on touch screens. Each photo names its
 * place (a link) and its author.
 */
export function HeroSlides({ slides }: { slides: HeroSlide[] }) {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [held, setHeld] = useState(false);
  // Photos load one ahead of the one on screen, never all at once.
  const [loaded, setLoaded] = useState(1);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const total = slides.length;

  const go = useCallback(
    (next: number) => {
      const i = (next + total) % total;
      setIndex(i);
      setLoaded((n) => Math.max(n, Math.min(total, i + 2)));
    },
    [total],
  );

  // Reduced motion: still, until the visitor moves on.
  useEffect(() => {
    // Only known in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
    else setLoaded(2);
  }, []);

  useEffect(() => {
    if (!playing || held || total < 2) return;
    const timer = window.setTimeout(() => {
      if (document.visibilityState === "visible") go(index + 1);
    }, INTERVAL);
    return () => window.clearTimeout(timer);
  }, [playing, held, index, total, go]);

  const slide = slides[index];

  return (
    <div
      className={styles.slides}
      role="region"
      aria-roledescription="carousel"
      aria-label={t.home.heroPhotos}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
      }}
      onTouchStart={(e) => {
        const p = e.touches[0];
        touch.current = { x: p.clientX, y: p.clientY };
      }}
      onTouchEnd={(e) => {
        const start = touch.current;
        touch.current = null;
        if (!start) return;
        const p = e.changedTouches[0];
        const dx = p.clientX - start.x;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(p.clientY - start.y) * 1.5) {
          setPlaying(false);
          go(index + (dx < 0 ? 1 : -1));
        }
      }}
    >
      <div className={styles.stack}>
        {slides.map((s, i) => (
          <div
            key={s.src}
            className={cx(styles.slide, i === index && styles.current)}
            role="group"
            aria-roledescription="slide"
            aria-label={fill(t.home.slideOf, { n: i + 1, total })}
            aria-hidden={i !== index}
          >
            {i < loaded && <Photo src={s.src} alt={s.alt} eager={i === 0} sizes="100vw" position={s.position} className={styles.photo} />}
          </div>
        ))}
      </div>

      <div className={styles.bar}>
        <Link href={slide.href} className={styles.place} prefetch={false}>
          <span className={styles.placeName}>{slide.label}</span>
          <span aria-hidden="true">→</span>
        </Link>
        <div className={styles.controls}>
          <button type="button" className={cx(styles.round, styles.step)} aria-label={t.home.prevPhoto} onClick={() => (setPlaying(false), go(index - 1))}>
            <span aria-hidden="true">‹</span>
          </button>
          <div className={styles.dots}>
            {slides.map((s, i) => (
              <button
                key={s.src}
                type="button"
                className={cx(styles.dot, i === index && styles.dotOn)}
                aria-label={fill(t.home.showPhoto, { n: i + 1, name: s.label })}
                aria-current={i === index ? "true" : undefined}
                onClick={() => (setPlaying(false), go(i))}
              >
                {i === index && playing && !held && <span className={styles.timer} key={index} />}
              </button>
            ))}
          </div>
          <button type="button" className={cx(styles.round, styles.step)} aria-label={t.home.nextPhoto} onClick={() => (setPlaying(false), go(index + 1))}>
            <span aria-hidden="true">›</span>
          </button>
          <button type="button" className={styles.round} aria-label={playing ? t.home.pausePhotos : t.home.playPhotos} onClick={() => setPlaying((p) => !p)}>
            {playing ? (
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M3 2h2v8H3zM7 2h2v8H7z" fill="currentColor" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>
        <PhotoCredit credit={slide.credit} t={t} tone="light" className={styles.credit} />
      </div>
    </div>
  );
}
