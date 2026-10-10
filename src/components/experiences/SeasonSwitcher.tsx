"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";

import { cx } from "@/lib/cx";

import type { SeasonKey } from "./content";
import styles from "./SeasonSwitcher.module.css";

type SeasonOption = { key: SeasonKey; label: string; intro: string };

type SeasonSwitcherProps = {
  options: readonly SeasonOption[];
  /** One server-rendered grid per season; the inactive one stays in the page, hidden. */
  panels: Record<SeasonKey, ReactNode>;
};

/**
 * "Summer / Winter" pill switch above the experience grids — built as tabs:
 * one season is always selected, and the arrow keys move between them.
 */
export function SeasonSwitcher({ options, panels }: SeasonSwitcherProps) {
  const [active, setActive] = useState<SeasonKey>(options[0]?.key ?? "summer");
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.key === active),
  );
  const current = options[activeIndex];

  /** Arrow keys (and Home / End) select the next season and move focus to it. */
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = options.length - 1;
    let next: number;
    switch (event.key) {
      case "ArrowRight":
        next = activeIndex === last ? 0 : activeIndex + 1;
        break;
      case "ArrowLeft":
        next = activeIndex === 0 ? last : activeIndex - 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        return;
    }
    const option = options[next];
    if (!option) return;
    event.preventDefault();
    setActive(option.key);
    event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  }

  return (
    <div className={styles.root} data-reveal="up" data-delay="80">
      <div className={styles.bar}>
        <div className={styles.switch} role="tablist" aria-label="Choose a season" onKeyDown={onKeyDown}>
          <span
            className={styles.thumb}
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
            aria-hidden="true"
          />
          {options.map((option) => (
            <button
              key={option.key}
              type="button"
              role="tab"
              id={`season-tab-${option.key}`}
              className={cx(styles.option, option.key === active && styles.optionActive)}
              aria-selected={option.key === active}
              aria-controls={`season-${option.key}`}
              tabIndex={option.key === active ? 0 : -1}
              onClick={() => setActive(option.key)}
            >
              <SeasonIcon season={option.key} />
              {option.label}
            </button>
          ))}
        </div>
        <p className={styles.intro} aria-live="polite">
          {current?.intro}
        </p>
      </div>

      {options.map((option) => (
        <div
          key={option.key}
          id={`season-${option.key}`}
          role="tabpanel"
          aria-labelledby={`season-tab-${option.key}`}
          tabIndex={0}
          className={styles.panel}
          hidden={option.key !== active}
        >
          {panels[option.key]}
        </div>
      ))}
    </div>
  );
}

function SeasonIcon({ season }: { season: SeasonKey }) {
  if (season === "summer") {
    return (
      <svg className={styles.icon} viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="10" cy="10" r="3.6" />
        <path d="M10 1.8v2.4M10 15.8v2.4M1.8 10h2.4M15.8 10h2.4M4.2 4.2l1.7 1.7M14.1 14.1l1.7 1.7M4.2 15.8l1.7-1.7M14.1 5.9l1.7-1.7" />
      </svg>
    );
  }
  return (
    <svg className={styles.icon} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 1.8v16.4M2.9 5.9l14.2 8.2M2.9 14.1l14.2-8.2M7.6 2.9 10 5.2l2.4-2.3M7.6 17.1 10 14.8l2.4 2.3" />
    </svg>
  );
}
