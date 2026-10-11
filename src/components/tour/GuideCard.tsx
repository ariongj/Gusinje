"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, type Ref, type RefObject, type TouchEvent } from "react";

import { Photo } from "@/components/ui/Photo";
import { useI18n } from "@/i18n/client";
import { fill } from "@/i18n/localize";
import { cx } from "@/lib/cx";

import styles from "./GuideCard.module.css";

export type GuideCardStop = {
  kicker: string;
  title: string;
  text: string;
  photo?: { src: string; alt: string; credit: string; creditHref: string };
  /** The stop's page. */
  href?: string;
};

type GuideCardProps = {
  stop: GuideCardStop;
  index: number;
  total: number;
  isLast: boolean;
  /** The next stop's title, shown on the Next button. */
  nextTitle?: string;
  playing: boolean;
  voice: boolean;
  voiceAvailable: boolean;
  /** Restarts the per-stop timer bar when it changes. */
  runKey: string;
  duration: number;
  onBack: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  onToggleVoice: () => void;
  onRestart: () => void;
  onExit: () => void;
  /** Show the stop's photo (when the stage can't show the place itself). */
  showPhoto?: boolean;
  /** Where focus goes when the card closes while it holds focus. */
  returnFocusRef?: RefObject<HTMLElement | null>;
  ref?: Ref<HTMLDivElement>;
};

/** The narrator's card for a virtual tour, docked over (or under) the stage. */
export function GuideCard({
  stop,
  index,
  total,
  isLast,
  nextTitle,
  playing,
  voice,
  voiceAvailable,
  runKey,
  duration,
  onBack,
  onNext,
  onTogglePlay,
  onToggleVoice,
  onRestart,
  onExit,
  showPhoto = false,
  returnFocusRef,
  ref,
}: GuideCardProps) {
  const { t } = useI18n();
  const rootRef = useRef<HTMLDivElement>(null);

  // Ending the tour from inside the card unmounts the focused button: hand
  // focus to the tour's start button instead of <body>.
  useLayoutEffect(() => {
    const root = rootRef.current;
    const returnTo = returnFocusRef?.current;
    return () => {
      if (root?.contains(document.activeElement)) returnTo?.focus({ preventScroll: true });
    };
  }, [returnFocusRef]);

  const position = fill(t.explore.stopOf, { i: index + 1, n: total });

  // Phones: swipe the card left for the next stop, right for the one before.
  const swipeRef = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    swipeRef.current = e.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null;
  };
  const onTouchEnd = (e: TouchEvent) => {
    const start = swipeRef.current;
    swipeRef.current = null;
    if (!start) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx < 0 && !isLast) onNext();
    else if (dx > 0 && index > 0) onBack();
  };

  return (
    <div
      ref={(el) => {
        rootRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      }}
      className={cx(styles.card, showPhoto && stop.photo && styles.withPhoto)}
      role="region"
      aria-label={t.explore.guidedTour}
      data-testid="guide-card"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className={styles.head}>
        <span className={styles.badge}>
          <span className={styles.pulse} aria-hidden="true" />
          {t.explore.guidedTour}
        </span>
        <span className={styles.count}>{position}</span>
        <button type="button" className={styles.exit} aria-label={t.explore.exit} title={t.explore.exit} onClick={onExit}>
          <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className={styles.overall} role="progressbar" aria-label={t.explore.progress} aria-valuemin={1} aria-valuemax={total} aria-valuenow={index + 1} aria-valuetext={position}>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={cx(styles.segment, i <= index && styles.segmentDone)} />
        ))}
      </div>

      {showPhoto && stop.photo && (
        <figure className={styles.photo}>
          <div className={styles.photoFrame}>
            <Photo src={stop.photo.src} alt={stop.photo.alt} sizes="400px" />
          </div>
          <figcaption className={styles.photoCredit}>
            <a href={stop.photo.creditHref} target="_blank" rel="noopener noreferrer">
              {stop.photo.credit}
            </a>
          </figcaption>
        </figure>
      )}

      <div aria-live="polite" aria-atomic="true">
        {/* Keyed so each stop eases in; the live region itself stays put. */}
        <div key={index} className={styles.swap}>
          <div className={styles.kicker}>{stop.kicker}</div>
          <h2 className={styles.title}>{stop.title}</h2>
          <p className={styles.text}>{stop.text}</p>
        </div>
      </div>

      {stop.href && (
        <Link href={stop.href} className={styles.link}>
          {t.common.openPage}
          <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </Link>
      )}

      {/* One big step forward; everything else stays small. */}
      <div className={styles.controls}>
        <button type="button" className={styles.round} aria-label={t.explore.previous} title={t.explore.previous} disabled={index === 0} onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M8.5 2.5 4 7l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>
        <button type="button" className={cx(styles.next, isLast && styles.finish)} onClick={onNext}>
          <span className={styles.nextText}>
            <span className={styles.nextLabel}>{isLast ? t.explore.finish : t.explore.next}</span>
            {!isLast && nextTitle && (
              <span className={styles.nextName}>
                {t.explore.nextUp} {nextTitle}
              </span>
            )}
          </span>
          {!isLast && (
            <svg width="18" height="18" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          )}
        </button>
      </div>
      <div className={styles.extras}>
        <button type="button" className={cx(styles.small, playing && styles.smallOn)} onClick={onTogglePlay}>
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M4.5 2.5v9M9.5 2.5v9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M4.5 2.3v9.4l7.2-4.7z" fill="currentColor" />
            </svg>
          )}
          {playing ? t.explore.autoplayOff : t.explore.autoplay}
        </button>
        <button type="button" className={styles.small} onClick={onRestart}>
          <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M2.5 7a4.5 4.5 0 1 0 1.3-3.2M2.5 1.5v2.8h2.8" stroke="currentColor" fill="none" strokeWidth="1.6" />
          </svg>
          {t.explore.restart}
        </button>
        {voiceAvailable && (
          <button type="button" className={cx(styles.small, voice && styles.smallOn)} aria-pressed={voice} onClick={onToggleVoice}>
            <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M2.5 6v4h2.8L9 13V3L5.3 6z" fill="currentColor" />
              {voice && <path d="M11 5.2a3.6 3.6 0 0 1 0 5.6M12.8 3.4a6.2 6.2 0 0 1 0 9.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />}
            </svg>
            {t.explore.voice}
          </button>
        )}
      </div>

      {playing && !voice && !isLast && (
        <div className={styles.progress} aria-hidden="true">
          <span key={runKey} className={styles.progressFill} style={{ animationDuration: `${duration}ms`, animationPlayState: playing ? "running" : "paused" }} />
        </div>
      )}
    </div>
  );
}
