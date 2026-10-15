"use client";

import Link from "next/link";
import { useState } from "react";

import { Photo } from "@/components/ui/Photo";
import type { MapIcon } from "@/components/map/icons";
import { useI18n } from "@/i18n/client";
import { fill } from "@/i18n/localize";
import { cx } from "@/lib/cx";
import { clueId, passportActions, usePassport } from "@/lib/passport";
import { tripActions } from "@/lib/trip";

import styles from "./Hunt.module.css";
import { HuntProgress } from "./HuntProgress";
import { Stamp } from "./Stamp";
import { StampButton } from "./StampButton";

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

/** The clues of one hunt: hidden until solved or revealed, then the place with its stamp. */
export function HuntClues({ hunt, clues }: { hunt: string; clues: ClueCard[] }) {
  const { t } = useI18n();
  const passport = usePassport();
  const [added, setAdded] = useState(false);
  const places = clues.map((c) => c.place);
  const found = clues.filter((c) => passport.stamps[c.place]);

  const addFound = () => {
    for (const c of found) tripActions.add("place", c.place);
    setAdded(true);
  };

  return (
    <div className={styles.clues}>
      <HuntProgress places={places} />
      <ol className={styles.clueList}>
        {clues.map((c, i) => {
          const stamp = passport.stamps[c.place];
          const open = !!stamp || passport.revealed.includes(clueId(hunt, c.place));
          return (
            <li key={c.place} className={cx(styles.clue, open && styles.clueOpen, stamp && styles.clueFound)} data-testid="clue" data-state={stamp ? "found" : open ? "revealed" : "hidden"}>
              <div className={styles.clueHead}>
                <span className={styles.clueNumber}>{fill(t.hunt.clue, { n: i + 1 })}</span>
                {stamp && <Stamp icon={c.icon} how={stamp.how} size={44} className={styles.clueStamp} />}
              </div>
              <p className={styles.clueText}>{c.clue}</p>
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
                  <button type="button" className={styles.reveal} onClick={() => passportActions.reveal(clueId(hunt, c.place))}>
                    {t.hunt.reveal}
                  </button>
                  <span className={styles.muted}>{t.hunt.notFound}</span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {found.length > 0 && (
        <div className={styles.clueFooter}>
          <button type="button" className={styles.linkSecondary} onClick={addFound} disabled={added}>
            {added ? t.plan.added : t.hunt.addFound}
          </button>
          <Link href={`${clues[0]?.href.split("/places/")[0] ?? ""}/plan`} className={styles.textButton}>
            {t.nav.myTrip}
          </Link>
        </div>
      )}
    </div>
  );
}
