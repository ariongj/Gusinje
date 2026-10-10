"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

import { cx } from "@/lib/cx";

import { getPoi, pois, type PoiId } from "./pois";
import type { PinPosition, ResortEngine, ViewId } from "./resortEngine";
import styles from "./ResortMap.module.css";

export type MapFocus = { id: ViewId; nonce: number };

type ResortMapProps = {
  /**
   * "explore": drag, zoom, place markers and cards (tour page).
   * "hero": a living backdrop — the camera drifts on its own, nothing to
   * operate, and the page scrolls straight past it (home page).
   */
  variant?: "explore" | "hero";
  /** Where the camera should be; a new object (nonce) flies there again. */
  focus?: MapFocus;
  /** A guided tour is running: gentle orbit, explore controls hidden. */
  touring?: boolean;
  /** Falling snow, where the season has it (see ResortEngine.setSnow). */
  snow?: boolean;
  /** Highlighted place; in explore mode its card is shown. */
  selected?: PoiId | null;
  onSelect?: (id: PoiId) => void;
  onCloseSelected?: () => void;
  /** Overlays drawn above the map (e.g. the guide card). */
  children?: ReactNode;
  className?: string;
};

/**
 * Illustrative 3D map of the Gusinje–Vusanje valley. three.js and the scene
 * are loaded on mount (code-split), so pages without the map never download
 * them.
 */
const HERO_FOCUS: MapFocus = { id: "hero", nonce: 0 };

export function ResortMap({
  variant = "explore",
  focus = HERO_FOCUS,
  touring = false,
  snow = true,
  selected = null,
  onSelect,
  onCloseSelected,
  children,
  className,
}: ResortMapProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const pinRefs = useRef<Partial<Record<PoiId, HTMLButtonElement | null>>>({});
  const cardRef = useRef<HTMLDivElement>(null);
  /** The pin was pressed from the keyboard: move focus to the card it opens. */
  const focusCard = useRef(false);
  const engineRef = useRef<ResortEngine | null>(null);
  const focusRef = useRef(focus);
  const hero = variant === "hero";
  const heroRef = useRef(hero);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [interacted, setInteracted] = useState(false);
  /** The highlighted place keeps its label when labels would overlap. */
  const selectedRef = useRef(selected);
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  useEffect(() => {
    let cancelled = false;
    let engine: ResortEngine | null = null;

    /** Label widths, measured once: they never change. */
    const labelWidths = new Map<PoiId, number>();
    const rank = (id: PoiId) => (id === selectedRef.current ? -1 : pois.findIndex((p) => p.id === id));

    const placePins = (pins: PinPosition[]) => {
      const host = hostRef.current;
      const width = host?.clientWidth ?? 0;
      const height = host?.clientHeight ?? 0;
      /** Labels already shown this frame, as screen rectangles. */
      const shown: [number, number, number, number][] = [];
      // Most important first (the list order), the highlighted place before all.
      for (const pin of [...pins].sort((a, b) => rank(a.id) - rank(b.id))) {
        const el = pinRefs.current[pin.id];
        if (!el) continue;
        el.style.setProperty("--px", `${pin.x.toFixed(2)}%`);
        el.style.setProperty("--py", `${pin.y.toFixed(2)}%`);
        el.style.setProperty("--po", pin.visible ? "1" : "0");
        el.style.setProperty("--pe", pin.visible ? "auto" : "none");
        // Off-screen pins leave the tab order too, so focus never lands on one it can't show.
        el.inert = !pin.visible;
        if (!pin.visible) continue;

        // A label that would overlap one already shown hides; its dot stays (hover or focus shows it).
        let w = labelWidths.get(pin.id);
        if (w === undefined) {
          w = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? 120;
          labelWidths.set(pin.id, w);
        }
        const x = (pin.x / 100) * width;
        const y = (pin.y / 100) * height;
        const rect: [number, number, number, number] = [x - w / 2 - 4, y - 54, x + w / 2 + 4, y - 16];
        const clash = shown.some((r) => r[0] < rect[2] && rect[0] < r[2] && r[1] < rect[3] && rect[1] < r[3]);
        el.style.setProperty("--lo", clash ? "0" : "1");
        if (!clash) shown.push(rect);
      }
    };

    import("./resortEngine")
      .then(({ ResortEngine }) => {
        const host = hostRef.current;
        if (cancelled || !host) return;
        if (!ResortEngine.isSupported()) {
          setStatus("failed");
          return;
        }
        const isHero = heroRef.current;
        engine = new ResortEngine(host, {
          reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
          interactive: !isHero,
          initialView: isHero ? "hero" : "overview",
          onPins: isHero ? undefined : placePins,
          onInteract: () => setInteracted(true),
        });
        engineRef.current = engine;
        if (!isHero && focusRef.current.id !== "overview") engine.flyTo(focusRef.current.id);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("failed");
      });

    return () => {
      cancelled = true;
      engine?.dispose();
      engineRef.current = null;
    };
  }, []);

  // Fly whenever the requested focus changes.
  useEffect(() => {
    focusRef.current = focus;
    if (!heroRef.current) engineRef.current?.flyTo(focus.id);
  }, [focus]);

  useEffect(() => {
    engineRef.current?.setTourMode(touring);
  }, [touring, status]);

  useEffect(() => {
    engineRef.current?.setSnow(snow);
  }, [snow, status]);

  const card = !hero && !touring && selected ? getPoi(selected) : null;
  const controlsShown = status === "ready" && !touring && !hero;

  useEffect(() => {
    if (card && focusCard.current) cardRef.current?.focus({ preventScroll: true });
    focusCard.current = false;
  }, [card]);

  // Closing the card from inside it hands focus back to its pin.
  function closeCard() {
    const pin = selected ? pinRefs.current[selected] : null;
    const hadFocus = !!cardRef.current?.contains(document.activeElement);
    onCloseSelected?.();
    if (hadFocus) pin?.focus({ preventScroll: true });
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape" && card) closeCard();
  }

  return (
    <div
      className={cx(styles.map, hero && styles.hero, status === "ready" && styles.ready, className)}
      onKeyDown={hero ? undefined : onKeyDown}
    >
      {/* In the hero the map is a decorative backdrop: the headline carries the message. */}
      <div
        ref={hostRef}
        className={styles.canvas}
        role={hero ? undefined : "img"}
        aria-label={
          hero
            ? undefined
            : "Illustrated 3D map of the valley from Gusinje to Vusanje: Hotel ROSI in town, Ali Pasha's Springs, Eko Katun ROSI and its stone tower, the Grlja waterfall, Oko Skakavice and the Ropojana valley, under Karanfili and Zla Kolata"
        }
        aria-hidden={hero || undefined}
      />

      {/* Non-modal, and ahead of the pins in the tab order. A pin pressed from the
          keyboard moves focus here; Escape or Close hands it back to the pin. */}
      {card && (
        <div ref={cardRef} className={styles.card} role="region" aria-label={card.name} tabIndex={-1}>
          <button type="button" className={styles.cardClose} aria-label="Close" onClick={closeCard}>
            &times;
          </button>
          <div className={styles.cardKicker}>{card.kind}</div>
          <h2 className={styles.cardTitle}>{card.name}</h2>
          <p className={styles.cardText}>{card.blurb}</p>
          <div className={styles.cardActions}>
            <Link href={card.link.href} className={styles.cardLink}>
              {card.link.label} &rarr;
            </Link>
          </div>
        </div>
      )}

      {status === "ready" && !hero && (
        <div className={cx(styles.pins, touring && styles.pinsTouring)}>
          {pois.map((poi) => (
            <button
              key={poi.id}
              ref={(el) => {
                pinRefs.current[poi.id] = el;
              }}
              type="button"
              className={cx(styles.pin, selected === poi.id && styles.pinActive)}
              aria-label={`${poi.name}: show on the map`}
              aria-pressed={selected === poi.id}
              tabIndex={touring ? -1 : undefined}
              onClick={(e) => {
                focusCard.current = e.detail === 0;
                onSelect?.(poi.id);
              }}
            >
              <span className={styles.pinLabel}>{poi.name}</span>
              <span className={styles.pinDot} aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      {controlsShown && (
        <>
          <div className={cx(styles.hint, interacted && styles.hintHidden)} aria-hidden="true">
            Drag to explore &middot; pinch or ctrl + scroll to zoom
          </div>
          <div className={styles.controls}>
            <button type="button" className={styles.control} aria-label="Zoom out" onClick={() => engineRef.current?.zoomBy(1.25)}>
              &minus;
            </button>
            <button type="button" className={styles.control} aria-label="Zoom in" onClick={() => engineRef.current?.zoomBy(0.8)}>
              +
            </button>
            <button
              type="button"
              className={styles.control}
              aria-label="Show the whole valley"
              title="Show the whole valley"
              onClick={() => {
                onCloseSelected?.();
                engineRef.current?.flyTo("overview");
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M2.5 7a4.5 4.5 0 1 0 1.3-3.2M2.5 1.5v2.8h2.8" stroke="currentColor" fill="none" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        </>
      )}

      {status === "loading" && !hero && (
        <div className={styles.loader}>
          <div className={styles.spinner} />
          <div className={styles.loaderText}>Building the valley</div>
        </div>
      )}

      {/* The hero just keeps its sky-to-valley poster. */}
      {status === "failed" && !hero && (
        <div className={styles.failed} role="alert">
          <p>The 3D map needs WebGL, which is switched off in this browser.</p>
          <a href="#places" className={styles.cardPrimary}>
            See the places instead
          </a>
        </div>
      )}

      {children}
    </div>
  );
}
