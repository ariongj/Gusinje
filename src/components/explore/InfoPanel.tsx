"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { TripButton } from "@/components/content/TripButton";
import { StampButton } from "@/components/hunt/StampButton";
import { Photo } from "@/components/ui/Photo";
import { useI18n } from "@/i18n/client";
import { fill } from "@/i18n/localize";
import { km } from "@/lib/geo";

import type { ExploreView } from "./Explorer";
import styles from "./InfoPanel.module.css";
import { groupColor, type ExploreItem } from "./types";

type Props = {
  item: ExploreItem;
  /** Move focus to the panel (after the visitor picked something — not on page load). */
  autoFocus?: boolean;
  view: ExploreView;
  webgl: boolean;
  onClose: () => void;
  onShowIn: (view: ExploreView) => void;
  /** Step through the places in this view, one at a time. */
  step?: { index: number; total: number; onPrevious: () => void; onNext: () => void };
  /** Mapped places and listings close by, nearest first; picking one selects it. */
  nearby?: ExploreItem[];
  onPick?: (key: string) => void;
};

const GUSINJE = { lat: 42.56194, lng: 19.83389 };

export { km };

/** What the visitor picked — the same panel for the 3D view, the map and the list. */
export function InfoPanel({ item, view, webgl, onClose, onShowIn, step, nearby = [], onPick, autoFocus = true }: Props) {
  const { t, lang } = useI18n();
  const photos = item.photos && item.photos.length > 0 ? item.photos : item.photo ? [item.photo] : [];
  const [shown, setShown] = useState({ key: item.key, index: 0 });
  const photoIndex = shown.key === item.key ? Math.min(shown.index, photos.length - 1) : 0;
  const photo = photos[photoIndex];
  const headingRef = useRef<HTMLHeadingElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  // Keyboard and screen-reader users land on the panel when it opens or
  // changes; on phones (panel under the stage) it scrolls into view.
  useEffect(() => {
    const active = document.activeElement as HTMLElement | null;
    const fromPicker = !active || active === document.body || !!active.closest?.("[data-key]");
    if (!autoFocus) return;
    if (fromPicker) headingRef.current?.focus({ preventScroll: true });
    if (window.innerWidth < 900) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      panelRef.current?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
    }
    // Only when the selection changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.key]);

  const location = item.location;
  const directions = location ? `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}` : null;

  return (
    <section ref={panelRef} className={styles.panel} aria-labelledby="panel-title" data-testid="info-panel">
      <div className={styles.top}>
        {step && (
          <div className={styles.stepper}>
            <button type="button" className={styles.stepButton} aria-label={t.explore.previousPlace} onClick={step.onPrevious}>
              <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M11 3.5 5.5 9l5.5 5.5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className={styles.stepCount}>{fill(t.explore.placeOf, { i: step.index + 1, n: step.total })}</span>
            <button type="button" className={styles.stepButton} aria-label={t.explore.nextPlace} onClick={step.onNext}>
              <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
                <path d="m7 3.5 5.5 5.5L7 14.5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
        <button type="button" className={styles.close} aria-label={t.common.close} onClick={onClose}>
          &times;
        </button>
      </div>
      {photo && (
        <figure className={styles.figure}>
          <div className={styles.frame}>
            <Photo key={photo.src} src={photo.src} alt={photo.alt} sizes="(max-width: 899px) 100vw, 380px" className={styles.photo} />
            {photos.length > 1 && (
              <div className={styles.gallery}>
                {photos.map((p, i) => (
                  <button
                    key={p.src}
                    type="button"
                    className={styles.galleryDot}
                    aria-label={fill(t.explore.photoOf, { i: i + 1, n: photos.length })}
                    aria-current={i === photoIndex ? "true" : undefined}
                    onClick={() => setShown({ key: item.key, index: i })}
                  />
                ))}
              </div>
            )}
          </div>
          <figcaption className={styles.credit}>
            <a href={photo.creditHref} target="_blank" rel="noopener noreferrer">
              {photo.credit}
            </a>
          </figcaption>
        </figure>
      )}
      <p className={styles.kicker}>
        <span className={styles.swatch} style={{ background: groupColor[item.group] }} aria-hidden="true" />
        {item.categoryLabel} · {item.area}
      </p>
      <h2 id="panel-title" ref={headingRef} tabIndex={-1} className={styles.title}>
        {item.name}
      </h2>
      {item.disclosure && <p className={styles.disclosure}>{item.disclosure}</p>}
      {item.hostName && <p className={styles.location}>{fill(t.business.partOf, { name: item.hostName })}</p>}
      <p className={styles.summary}>{item.summary}</p>
      {location && km(GUSINJE, location) >= 0.5 && (
        <p className={styles.distance}>{fill(t.explore.fromGusinje, { km: km(GUSINJE, location).toLocaleString(lang === "cnr" ? "sr-Latn" : lang, { maximumFractionDigits: 1 }) })}</p>
      )}
      <p className={styles.location}>
        {location
          ? location.status === "self-reported"
            ? t.explore.selfReportedLocation
            : location.precision === "area"
              ? t.explore.locationArea
              : t.explore.locationPoint
          : t.explore.noLocation}
      </p>
      <div className={styles.actions}>
        <Link href={item.href} className={styles.primary}>
          {t.common.openPage}
        </Link>
        {view !== "map" && location && (
          <button type="button" className={styles.secondary} onClick={() => onShowIn("map")}>
            {t.common.showOnMap}
          </button>
        )}
        {view !== "3d" && location && webgl && (
          <button type="button" className={styles.secondary} onClick={() => onShowIn("3d")}>
            {t.common.showIn3D}
          </button>
        )}
        {directions && (
          <a href={directions} target="_blank" rel="noopener noreferrer" className={styles.secondary}>
            {t.common.directions}
          </a>
        )}
        <TripButton kind={item.kind} slug={item.slug} compact />
      </div>
      {item.kind === "place" && (
        <div className={styles.treasure}>
          <h3 className={styles.nearbyTitle}>{t.hunt.title}</h3>
          <StampButton slug={item.slug} name={item.name} location={location ? { lat: location.lat, lng: location.lng } : null} compact />
        </div>
      )}
      {nearby.length > 0 && onPick && (
        <div className={styles.nearby}>
          <h3 className={styles.nearbyTitle}>{t.explore.nearbyTitle}</h3>
          <ul className={styles.nearbyList}>
            {nearby.map((n) => (
              <li key={n.key}>
                <button type="button" className={styles.nearbyItem} onClick={() => onPick(n.key)}>
                  <span className={styles.swatch} style={{ background: groupColor[n.group] }} aria-hidden="true" />
                  <span className={styles.nearbyName}>{n.name}</span>
                  <span className={styles.nearbyMeta}>
                    {km(location!, n.location!).toLocaleString(lang === "cnr" ? "sr-Latn" : lang, { maximumFractionDigits: 1 })} km
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
