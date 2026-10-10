"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import type { LegendGroup } from "@/components/explore/types";
import type { SceneAnchor } from "@/content/types";
import { useI18n } from "@/i18n/client";
import { cx } from "@/lib/cx";

import type { PinPosition, ResortEngine, ViewId } from "./resortEngine";
import styles from "./ResortMap.module.css";

export type SceneFocus = { id: ViewId; nonce: number };

export type ScenePin = { key: string; anchor: SceneAnchor; name: string; group: LegendGroup };

type ResortMapProps = {
  /**
   * "explore": drag, zoom, place markers (Explore page).
   * "hero": a living backdrop — the camera drifts on its own, nothing to
   * operate, and the page scrolls straight past it (home page).
   */
  variant?: "explore" | "hero";
  /** Where the camera should be; a new object (nonce) flies there again. */
  focus?: SceneFocus;
  /** A guided tour is running: gentle orbit, explore controls hidden. */
  touring?: boolean;
  /** Markers to draw (already filtered). */
  pins?: ScenePin[];
  selectedKey?: string | null;
  onSelect?: (key: string) => void;
  /** The visitor pressed "show everything". */
  onReset?: () => void;
  /** WebGL could not start: the parent switches to the map. */
  onFailed?: () => void;
  /** Overlays drawn above the map (e.g. the guide card). */
  children?: ReactNode;
  className?: string;
};

const HERO_FOCUS: SceneFocus = { id: "hero", nonce: 0 };

/**
 * Illustrative 3D model of the Gusinje–Vusanje valley — not to scale. three.js
 * and the scene are loaded on mount (code-split), so pages without the model
 * never download them.
 */
export function ResortMap({
  variant = "explore",
  focus = HERO_FOCUS,
  touring = false,
  pins = [],
  selectedKey = null,
  onSelect,
  onReset,
  onFailed,
  children,
  className,
}: ResortMapProps) {
  const { t } = useI18n();
  const hostRef = useRef<HTMLDivElement>(null);
  const pinRefs = useRef(new Map<SceneAnchor, HTMLButtonElement>());
  const engineRef = useRef<ResortEngine | null>(null);
  const focusRef = useRef(focus);
  const hero = variant === "hero";
  const heroRef = useRef(hero);
  const onFailedRef = useRef(onFailed);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [interacted, setInteracted] = useState(false);
  /** Pin order for label priority: the selection first, then the list order. */
  const orderRef = useRef<{ selected: SceneAnchor | null; order: SceneAnchor[] }>({ selected: null, order: [] });

  useEffect(() => {
    onFailedRef.current = onFailed;
  });

  useEffect(() => {
    orderRef.current = {
      selected: pins.find((p) => p.key === selectedKey)?.anchor ?? null,
      order: pins.map((p) => p.anchor),
    };
  }, [pins, selectedKey]);

  useEffect(() => {
    let cancelled = false;
    let engine: ResortEngine | null = null;

    /** Label widths, measured once per marker element. */
    const labelWidths = new WeakMap<HTMLElement, number>();
    const rank = (id: SceneAnchor) => {
      const { selected, order } = orderRef.current;
      return id === selected ? -1 : order.indexOf(id);
    };

    const placePins = (positions: PinPosition[]) => {
      const host = hostRef.current;
      const width = host?.clientWidth ?? 0;
      const height = host?.clientHeight ?? 0;
      /** Labels already shown this frame, as screen rectangles. */
      const shown: [number, number, number, number][] = [];
      for (const pin of [...positions].sort((a, b) => rank(a.id) - rank(b.id))) {
        const el = pinRefs.current.get(pin.id);
        if (!el) continue;
        el.style.setProperty("--px", `${pin.x.toFixed(2)}%`);
        el.style.setProperty("--py", `${pin.y.toFixed(2)}%`);
        el.style.setProperty("--po", pin.visible ? "1" : "0");
        el.style.setProperty("--pe", pin.visible ? "auto" : "none");
        // Off-screen pins leave the tab order too, so focus never lands on one it can't show.
        el.inert = !pin.visible;
        if (!pin.visible) {
          el.style.setProperty("--lpe", "none");
          continue;
        }

        // A label that would overlap one already shown hides; its dot stays (hover or focus shows it).
        let w = labelWidths.get(el);
        if (w === undefined) {
          w = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? 120;
          labelWidths.set(el, w);
        }
        const x = (pin.x / 100) * width;
        const y = (pin.y / 100) * height;
        const rect: [number, number, number, number] = [x - w / 2 - 4, y - 54, x + w / 2 + 4, y - 16];
        const clash = shown.some((r) => r[0] < rect[2] && rect[0] < r[2] && r[1] < rect[3] && rect[1] < r[3]);
        el.style.setProperty("--lo", clash ? "0" : "1");
        // A hidden label must not catch clicks meant for the pins around it.
        el.style.setProperty("--lpe", clash ? "none" : "auto");
        if (!clash) shown.push(rect);
      }
    };

    const fail = () => {
      if (cancelled) return;
      setStatus("failed");
      onFailedRef.current?.();
    };

    import("./resortEngine")
      .then(({ ResortEngine }) => {
        const host = hostRef.current;
        if (cancelled || !host) return;
        if (!ResortEngine.isSupported()) {
          fail();
          return;
        }
        const isHero = heroRef.current;
        try {
          engine = new ResortEngine(host, {
            reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
            interactive: !isHero,
            initialView: isHero ? "hero" : "overview",
            onPins: isHero ? undefined : placePins,
            onInteract: () => setInteracted(true),
          });
        } catch {
          fail();
          return;
        }
        engineRef.current = engine;
        if (!isHero && focusRef.current.id !== "overview") engine.flyTo(focusRef.current.id);
        setStatus("ready");
      })
      .catch(fail);

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

  const controlsShown = status === "ready" && !touring && !hero;
  const visibleAnchors = new Set(pins.map((p) => p.anchor));

  return (
    <div className={cx(styles.map, hero && styles.hero, status === "ready" && styles.ready, className)}>
      {/* In the hero the model is a decorative backdrop: the headline carries the message. */}
      <div
        ref={hostRef}
        className={styles.canvas}
        role={hero ? undefined : "img"}
        aria-label={hero ? undefined : t.explore.sceneLabel}
        aria-hidden={hero || undefined}
      />

      {status === "ready" && !hero && (
        <div className={cx(styles.pins, touring && styles.pinsTouring)}>
          {pins.map((pin) => (
            <button
              key={pin.key}
              ref={(el) => {
                if (el) pinRefs.current.set(pin.anchor, el);
                else if (!visibleAnchors.has(pin.anchor)) pinRefs.current.delete(pin.anchor);
              }}
              type="button"
              className={cx(styles.pin, selectedKey === pin.key && styles.pinActive)}
              data-group={pin.group}
              data-key={pin.key}
              aria-label={pin.name}
              aria-pressed={selectedKey === pin.key}
              tabIndex={touring ? -1 : undefined}
              onClick={() => onSelect?.(pin.key)}
            >
              <span className={styles.pinLabel}>{pin.name}</span>
              <span className={styles.pinDot} aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      {controlsShown && (
        <>
          <div className={cx(styles.hint, interacted && styles.hintHidden)} aria-hidden="true">
            {t.explore.dragHint}
          </div>
          <div className={styles.controls}>
            <button type="button" className={styles.control} aria-label={t.explore.zoomIn} onClick={() => engineRef.current?.zoomBy(0.8)}>
              +
            </button>
            <button type="button" className={styles.control} aria-label={t.explore.zoomOut} onClick={() => engineRef.current?.zoomBy(1.25)}>
              &minus;
            </button>
            <button
              type="button"
              className={styles.control}
              aria-label={t.explore.resetView}
              title={t.explore.resetView}
              onClick={() => {
                onReset?.();
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
          <div className={styles.loaderText}>{t.explore.loading3d}</div>
        </div>
      )}

      {/* The hero keeps its photo poster; the explorer switches to the map (see onFailed). */}
      {status === "failed" && !hero && (
        <div className={styles.failed} role="alert">
          <p>{t.explore.webglFailed}</p>
        </div>
      )}

      {children}
    </div>
  );
}
