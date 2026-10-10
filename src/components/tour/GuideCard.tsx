import Link from "next/link";
import { useLayoutEffect, useRef, type Ref, type RefObject } from "react";

import { cx } from "@/lib/cx";

import type { GuideStop } from "./guide";
import styles from "./GuideCard.module.css";

type GuideCardProps = {
  stop: GuideStop;
  index: number;
  total: number;
  isLast: boolean;
  playing: boolean;
  voice: boolean;
  voiceAvailable: boolean;
  /** Restarts the progress bar when it changes. */
  runKey: string;
  duration: number;
  onBack: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  onToggleVoice: () => void;
  onExit: () => void;
  /** Where focus goes when the card closes while it holds focus (the tour's start/end button). */
  returnFocusRef?: RefObject<HTMLElement | null>;
  ref?: Ref<HTMLDivElement>;
};

/** The narrator's card for the guided tour, docked over the stage. */
export function GuideCard({
  stop,
  index,
  total,
  isLast,
  playing,
  voice,
  voiceAvailable,
  runKey,
  duration,
  onBack,
  onNext,
  onTogglePlay,
  onToggleVoice,
  onExit,
  returnFocusRef,
  ref,
}: GuideCardProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Ending the tour from inside the card (×, Done, Escape) unmounts the
  // focused button: hand focus to the toolbar button instead of <body>.
  useLayoutEffect(() => {
    const root = rootRef.current;
    const returnTo = returnFocusRef?.current;
    return () => {
      if (root?.contains(document.activeElement)) returnTo?.focus({ preventScroll: true });
    };
  }, [returnFocusRef]);

  return (
    <div
      ref={(el) => {
        rootRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      }}
      className={styles.card}
      role="region"
      aria-label="Guided tour"
    >
      <div className={styles.head}>
        <span className={styles.badge}>
          <span className={styles.pulse} aria-hidden="true" />
          Guided tour
        </span>
        <span className={styles.count}>
          <span className="visually-hidden">Stop </span>
          {index + 1}
          <span aria-hidden="true"> / </span>
          <span className="visually-hidden"> of </span>
          {total}
        </span>
        <button type="button" className={styles.exit} aria-label="End the guided tour" onClick={onExit}>
          <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div aria-live="polite" aria-atomic="true">
        {/* Keyed so each stop eases in; the live region itself stays put. */}
        <div key={index} className={styles.swap}>
          <div className={styles.kicker}>{stop.kicker}</div>
          <h2 className={styles.title}>{stop.title}</h2>
          <p className={styles.text}>{stop.text}</p>
        </div>
      </div>

      {stop.link && (
        <Link href={stop.link.href} className={styles.link}>
          {stop.link.label}
          <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </Link>
      )}

      <div className={styles.controls}>
        <button type="button" className={styles.round} aria-label="Previous stop" disabled={index === 0} onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M8.5 2.5 4 7l4.5 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>
        <button
          type="button"
          className={cx(styles.round, styles.play)}
          aria-label={playing ? "Pause the tour" : "Play the tour"}
          onClick={onTogglePlay}
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M4.5 2.5v9M9.5 2.5v9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M4.5 2.3v9.4l7.2-4.7z" fill="currentColor" />
            </svg>
          )}
        </button>
        <button
          type="button"
          className={cx(styles.round, isLast && styles.finish)}
          aria-label={isLast ? undefined : "Next stop"}
          onClick={onNext}
        >
          {isLast ? (
            "Done"
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M5.5 2.5 10 7l-4.5 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          )}
        </button>
        {voiceAvailable && (
          <button
            type="button"
            className={cx(styles.voice, voice && styles.voiceOn)}
            aria-pressed={voice}
            onClick={onToggleVoice}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M2.5 6v4h2.8L9 13V3L5.3 6z" fill="currentColor" />
              {voice && (
                <path
                  d="M11 5.2a3.6 3.6 0 0 1 0 5.6M12.8 3.4a6.2 6.2 0 0 1 0 9.2"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  fill="none"
                />
              )}
            </svg>
            Voice
          </button>
        )}
      </div>

      {!voice && !isLast && (
        <div className={styles.progress} aria-hidden="true">
          <span
            key={runKey}
            className={styles.progressFill}
            style={{ animationDuration: `${duration}ms`, animationPlayState: playing ? "running" : "paused" }}
          />
        </div>
      )}
    </div>
  );
}
