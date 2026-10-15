"use client";

import Link from "next/link";
import { useState } from "react";

import type { MapIcon } from "@/components/map/icons";
import { Photo } from "@/components/ui/Photo";
import { useI18n } from "@/i18n/client";
import { fill } from "@/i18n/localize";
import { cx } from "@/lib/cx";
import { km } from "@/lib/geo";
import { clueId, passportActions, usePassport } from "@/lib/passport";
import { tripActions } from "@/lib/trip";

import { Burst } from "./Burst";
import { HotCold, warmth } from "./HotCold";
import styles from "./Hunt.module.css";
import { HuntProgress } from "./HuntProgress";
import { Ring } from "./Ring";
import { Stamp } from "./Stamp";
import { StampButton } from "./StampButton";
import { useGuidance } from "./useGuidance";

export type ClueCard = {
  place: string;
  clue: string;
  name: string;
  categoryLabel: string;
  icon: MapIcon;
  href: string;
  mapHref: string;
  location: { lat: number; lng: number } | null;
  photo: { src: string; alt: string } | null;
};

/**
 * The clues of one hunt along a dotted trail: sealed until solved or revealed,
 * then the place with its stamp. "Guide me" turns on hot-or-cold guidance
 * towards every sealed clue (position and compass read on the device only).
 */
export function HuntClues({ hunt, clues, planHref }: { hunt: string; clues: ClueCard[]; planHref: string }) {
  const { t } = useI18n();
  const passport = usePassport();
  const guide = useGuidance();
  const [added, setAdded] = useState(false);
  const places = clues.map((c) => c.place);
  const found = clues.filter((c) => passport.stamps[c.place]);
  const done = clues.length > 0 && found.length === clues.length;

  const addFound = () => {
    for (const c of found) tripActions.add("place", c.place);
    setAdded(true);
  };

  const guideNote =
    guide.error === "denied"
      ? t.explore.locationDenied
      : guide.error === "unavailable"
        ? t.explore.locationUnavailable
        : guide.active
          ? guide.position
            ? t.hunt.guideOn
            : t.hunt.checking
          : t.hunt.guideIntro;

  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        {done && (
          <div className={styles.celebrate} role="status">
            <span className={styles.stampWrap}>
              <Burst n={12} />
              <Stamp icon="compass" how="here" label={t.hunt.foundBadge} size={88} className={styles.stampIn} />
            </span>
            <div>
              <strong className={styles.celebrateTitle}>{t.hunt.celebrateTitle}</strong>
              <span>{t.hunt.complete}</span>
            </div>
          </div>
        )}
        <ol className={styles.trail}>
          {clues.map((c, i) => {
            const stamp = passport.stamps[c.place];
            const open = !!stamp || passport.revealed.includes(clueId(hunt, c.place));
            const state = stamp ? "found" : open ? "revealed" : "hidden";
            const here = !open && guide.active && guide.position && c.location && warmth(km(guide.position, c.location)) === "here";
            return (
              <li key={c.place} className={cx(styles.clue, open && styles.clueOpen, stamp && styles.clueFound)} data-testid="clue" data-state={state}>
                <span className={styles.medallion} aria-hidden="true">
                  {stamp ? "✓" : i + 1}
                </span>
                <div className={styles.card}>
                  <div className={styles.clueHead}>
                    <span className={styles.clueNumber}>{fill(t.hunt.clue, { n: i + 1 })}</span>
                    <span className={cx(styles.tag, styles[`tag-${state}`])}>{stamp ? t.hunt.foundBadge : open ? t.hunt.revealedTag : t.hunt.sealed}</span>
                  </div>
                  <p className={styles.clueText}>{c.clue}</p>
                  {!open && guide.active && guide.position && c.location && <HotCold from={guide.position} to={c.location} heading={guide.heading} />}
                  {open ? (
                    <div className={styles.answer}>
                      {c.photo && (
                        <div className={styles.answerPhoto}>
                          <Photo src={c.photo.src} alt={c.photo.alt} sizes="(max-width: 600px) 100vw, 240px" />
                        </div>
                      )}
                      <div className={styles.answerBody}>
                        <p className={styles.answerKicker}>{c.categoryLabel}</p>
                        <h3 className={styles.answerTitle}>{c.name}</h3>
                        <div className={styles.answerLinks}>
                          {c.location && (
                            <Link href={c.mapHref} className={styles.linkPrimary}>
                              {t.common.showOnMap}
                            </Link>
                          )}
                          <Link href={c.href} className={styles.linkSecondary}>
                            {t.common.openPage}
                          </Link>
                          {!stamp && (
                            <button type="button" className={styles.textButton} onClick={() => passportActions.unreveal(clueId(hunt, c.place))}>
                              {t.hunt.hide}
                            </button>
                          )}
                        </div>
                        <StampButton slug={c.place} name={c.name} icon={c.icon} location={c.location} compact />
                      </div>
                    </div>
                  ) : (
                    <div className={styles.clueActions}>
                      {here ? (
                        <StampButton slug={c.place} name={fill(t.hunt.clue, { n: i + 1 })} icon={c.icon} location={c.location} compact />
                      ) : (
                        <>
                          <button type="button" className={styles.reveal} onClick={() => passportActions.reveal(clueId(hunt, c.place))}>
                            {t.hunt.reveal}
                          </button>
                          <span className={styles.muted}>{t.hunt.notFound}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <aside className={styles.side} aria-label={t.hunt.treasures}>
        <div className={styles.sideHead}>
          <Ring found={found.length} total={clues.length} size={104} label={fill(t.hunt.progress, { found: found.length, total: clues.length })} />
          <HuntProgress places={places} />
        </div>
        <div className={styles.guide}>
          <button type="button" className={cx(styles.guideButton, guide.active && styles.guideButtonOn)} aria-pressed={guide.active} onClick={guide.active ? guide.stop : guide.start}>
            <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.7" />
              <path d="M13.2 6.8l-2 5.2-4.4 1.2 2-5.2z" fill="currentColor" />
            </svg>
            {guide.active ? t.hunt.guideOff : t.hunt.guideMe}
          </button>
          <p className={styles.muted} role="status">
            {guideNote}
          </p>
          {guide.active && guide.position && (
            <p className={styles.privacy}>
              {t.hunt.northNote} {t.hunt.privacy}
            </p>
          )}
        </div>
        {found.length > 0 && (
          <div className={styles.sideActions}>
            <button type="button" className={styles.linkSecondary} onClick={addFound} disabled={added}>
              {added ? t.plan.added : t.hunt.addFound}
            </button>
            <Link href={planHref} className={styles.textButton}>
              {t.nav.myTrip}
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
