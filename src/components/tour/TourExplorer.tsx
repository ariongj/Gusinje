"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { isPoiId, type PoiId } from "@/components/resort3d/pois";
import { ResortMap, type MapFocus } from "@/components/resort3d/ResortMap";
import type { ViewId } from "@/components/resort3d/resortEngine";
import { cx } from "@/lib/cx";

import { GuideCard } from "./GuideCard";
import { guideMinutes, guideStops, type GuideStop } from "./guide";
import { PlacesGrid } from "./PlacesGrid";
import styles from "./TourExplorer.module.css";
import { useGuidedTour } from "./useGuidedTour";

/** Room left above the stage for the fixed nav when scrolling to it (matches html scroll-padding-top). */
const NAV_CLEARANCE = 84;

/** The map place a guide stop is about — none for the wide views. */
function stopPlace(stop: GuideStop): PoiId | null {
  return stop.view === "overview" || stop.view === "hero" ? null : stop.view;
}

/**
 * The interactive 3D valley: the map with its place markers, a guided tour
 * that flies between the places, and every place as a card underneath.
 */
export function TourExplorer() {
  const [mapFocus, setMapFocus] = useState<MapFocus>({ id: "overview", nonce: 0 });
  const [place, setPlace] = useState<PoiId | null>(null);

  const viewerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const guideCardRef = useRef<HTMLDivElement>(null);
  const guideButtonRef = useRef<HTMLButtonElement>(null);

  const scrollToViewer = useCallback(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const top = viewer.getBoundingClientRect().top + window.scrollY - NAV_CLEARANCE;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
  }, []);

  const flyMap = useCallback((id: ViewId) => {
    setMapFocus((focus) => ({ id, nonce: focus.nonce + 1 }));
  }, []);

  const onGuideStop = useCallback(
    (stop: GuideStop) => {
      setPlace(null);
      flyMap(stop.view);
    },
    [flyMap],
  );

  const guide = useGuidedTour(guideStops, onGuideStop);
  const { start: startGuide, pause: pauseGuide, active: touring } = guide;

  function startTour() {
    scrollToViewer();
    startGuide();
  }

  /** The visitor picks a place (a pin or a card): the guide stops moving the camera. */
  const showPlace = useCallback(
    (id: PoiId, scroll = false) => {
      if (touring) pauseGuide();
      setPlace(id);
      flyMap(id);
      if (scroll) scrollToViewer();
    },
    [touring, pauseGuide, flyMap, scrollToViewer],
  );

  // Deep links: /tour#guided-tour starts the guide; /tour#katun, #grlja … fly to that place.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (hash.toLowerCase() === "guided-tour") {
      timer = setTimeout(() => {
        scrollToViewer();
        startGuide();
      }, 60);
    } else if (isPoiId(hash)) {
      timer = setTimeout(() => {
        setPlace(hash);
        flyMap(hash);
        scrollToViewer();
      }, 60);
    }
    return () => clearTimeout(timer);
  }, [flyMap, scrollToViewer, startGuide]);

  // On phones the card docks under the stage, and the stage leaves room for it
  // (--guide-h). Keeps the tallest height seen at this width, so the stage
  // doesn't resize with every stop's text.
  useEffect(() => {
    const stage = stageRef.current;
    const card = guideCardRef.current;
    if (!touring || !stage || !card || typeof ResizeObserver === "undefined") return;
    let width = 0;
    let tallest = 0;
    const ro = new ResizeObserver(() => {
      if (card.offsetWidth !== width) {
        width = card.offsetWidth;
        tallest = 0;
      }
      if (card.offsetHeight > tallest) {
        tallest = card.offsetHeight;
        stage.style.setProperty("--guide-h", `${tallest}px`);
      }
    });
    ro.observe(card);
    return () => {
      ro.disconnect();
      stage.style.removeProperty("--guide-h");
    };
  }, [touring]);

  const guidePlace = touring ? stopPlace(guide.stop) : null;

  return (
    <>
      <div className={styles.band}>
        <div className={styles.toolbar}>
          <p className={styles.toolbarNote}>
            Explore freely &mdash; or take the {guideStops.length}-stop guided tour, about {guideMinutes} min.
          </p>
          <button
            ref={guideButtonRef}
            type="button"
            className={cx(styles.guideButton, touring && styles.guideButtonActive)}
            onClick={touring ? guide.exit : startTour}
          >
            {touring ? (
              <>
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                End guided tour
              </>
            ) : (
              <>
                <span className={styles.playDisc} aria-hidden="true">
                  <svg width="10" height="10" viewBox="0 0 14 14">
                    <path d="M3.5 1.8v10.4L12 7z" fill="currentColor" />
                  </svg>
                </span>
                Start guided tour
              </>
            )}
          </button>
        </div>

        {/* The guide card overlays the stage on larger screens and docks below it on phones. */}
        <div ref={stageRef} className={cx(styles.stage, touring && styles.touring)}>
          <section ref={viewerRef} className={styles.viewer} aria-label="3D map of the valley">
            <div className={styles.layer}>
              <ResortMap
                focus={mapFocus}
                touring={touring}
                selected={touring ? guidePlace : place}
                onSelect={(id) => showPlace(id)}
                onCloseSelected={() => setPlace(null)}
              />
            </div>
          </section>

          {touring && (
            <GuideCard
              ref={guideCardRef}
              returnFocusRef={guideButtonRef}
              stop={guide.stop}
              index={guide.index}
              total={guide.total}
              isLast={guide.isLast}
              playing={guide.playing}
              voice={guide.voice}
              voiceAvailable={guide.voiceAvailable}
              runKey={guide.runKey}
              duration={guide.duration}
              onBack={guide.back}
              onNext={guide.next}
              onTogglePlay={guide.togglePlay}
              onToggleVoice={guide.toggleVoice}
              onExit={guide.exit}
            />
          )}
        </div>
      </div>

      <PlacesGrid onShow={(id) => showPlace(id, true)} />
    </>
  );
}
