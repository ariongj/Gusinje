"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import { Notice } from "@/components/ui/Notice";
import { brand } from "@/config/brand";
import { useI18n } from "@/i18n/client";
import { href } from "@/i18n/config";
import { fill } from "@/i18n/localize";
import type { CatalogueEntry } from "@/lib/catalogue";
import { cx } from "@/lib/cx";
import { encodeTrip, itemKey, storageAvailable, tripActions, useTrip, type TripItem } from "@/lib/trip";
import ui from "@/styles/ui.module.css";

import styles from "./TripPlanner.module.css";

const subscribeNever = () => () => {};

/** My Trip: saved items grouped by day, with reordering, notes, a read-only share link and print. */
export function TripPlanner({ catalogue }: { catalogue: Record<string, CatalogueEntry> }) {
  const { lang, t } = useI18n();
  const trip = useTrip();
  const storageOk = useSyncExternalStore(subscribeNever, storageAvailable, () => true);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const groups = useMemo(() => {
    const days = Array.from({ length: trip.days }, (_, i) => ({ day: (i + 1) as number | null, items: trip.items.filter((x) => x.day === i + 1) }));
    return [...days, { day: null as number | null, items: trip.items.filter((x) => x.day === null) }];
  }, [trip]);

  function share() {
    // The trip travels in the #fragment, which browsers never send to a server.
    const link = `${window.location.origin}${brand.basePath}${href(lang, "/plan/shared")}/#${encodeTrip(trip)}`;
    setShareUrl(link);
    setCopied(false);
  }

  async function copy() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className={styles.planner}>
      {!storageOk && (
        <Notice tone="warning" role="status">
          {t.plan.storageUnavailable}
        </Notice>
      )}
      <p className={cx(ui.small, ui.muted, ui.noPrint)}>{t.plan.storage}</p>
      <div className={ui.noPrint}>
        <Notice tone="info">{t.plan.noRouting}</Notice>
      </div>

      {trip.items.length === 0 ? (
        <div className={styles.empty} data-testid="trip-empty">
          <p>{t.plan.empty}</p>
          <div className={ui.actions}>
            <Link href={href(lang, "/explore")} className={ui.button}>
              {t.nav.explore}
            </Link>
            <Link href={href(lang, "/places")} className={ui.buttonGhost}>
              {t.nav.places}
            </Link>
          </div>
        </div>
      ) : (
        <>
          <h2 className={styles.printTitle}>{t.plan.printTitle}</h2>
          {groups.map((group) => (
            <section key={group.day ?? "unscheduled"} className={styles.day} aria-labelledby={`day-${group.day ?? "u"}`}>
              <div className={styles.dayHead}>
                <h2 id={`day-${group.day ?? "u"}`} className={styles.dayTitle}>
                  {group.day ? fill(t.plan.day, { n: group.day }) : t.plan.unscheduled}
                </h2>
                {group.day !== null && (
                  <button type="button" className={cx(ui.buttonSmall, ui.noPrint)} onClick={() => tripActions.removeDay(group.day!)}>
                    {t.plan.removeDay}
                  </button>
                )}
              </div>
              {group.items.length === 0 ? (
                <p className={styles.none}>—</p>
              ) : (
                <ol className={styles.items}>
                  {group.items.map((item, index) => (
                    <TripRow
                      key={itemKey(item)}
                      item={item}
                      entry={catalogue[itemKey(item)]}
                      first={index === 0}
                      last={index === group.items.length - 1}
                      days={trip.days}
                    />
                  ))}
                </ol>
              )}
            </section>
          ))}
          <div className={cx(ui.actions, ui.noPrint)}>
            <button type="button" className={ui.buttonGhost} onClick={() => tripActions.addDay()}>
              {t.plan.addDay}
            </button>
            <button type="button" className={ui.button} onClick={share}>
              {t.plan.share}
            </button>
            <button type="button" className={ui.buttonGhost} onClick={() => window.print()}>
              {t.plan.print}
            </button>
            <button
              type="button"
              className={ui.buttonGhost}
              onClick={() => {
                if (window.confirm(t.plan.clearConfirm)) tripActions.clear();
              }}
            >
              {t.plan.clear}
            </button>
          </div>
          {shareUrl && (
            <div className={cx(styles.share, ui.noPrint)}>
              <p className={ui.small}>{t.plan.shareExplain}</p>
              <label className={ui.field}>
                <span className="visually-hidden">{t.plan.share}</span>
                <input className={ui.input} readOnly value={shareUrl} onFocus={(e) => e.currentTarget.select()} data-testid="share-url" />
              </label>
              <div className={ui.actions}>
                <button type="button" className={ui.buttonSmall} onClick={copy}>
                  {t.common.copyLink}
                </button>
                <span role="status" className={ui.small}>
                  {copied ? t.common.copied : ""}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TripRow({ item, entry, first, last, days }: { item: TripItem; entry?: CatalogueEntry; first: boolean; last: boolean; days: number }) {
  const { t } = useI18n();
  const key = itemKey(item);
  const [note, setNote] = useState(item.note);
  // The saved note can change from another tab: follow it.
  const [savedNote, setSavedNote] = useState(item.note);
  if (item.note !== savedNote) {
    setSavedNote(item.note);
    setNote(item.note);
  }
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const title = entry?.title ?? t.plan.unknownItem;

  useEffect(() => () => clearTimeout(timer.current), []);

  function onNote(value: string) {
    setNote(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => tripActions.setNote(key, value), 400);
  }

  return (
    <li className={styles.item} data-key={key}>
      <div className={styles.itemHead}>
        <div>
          <p className={styles.kind}>
            {entry?.kindLabel} {entry?.detail && <>· {entry.detail}</>}
          </p>
          {entry ? (
            <Link href={entry.href} className={styles.itemTitle}>
              {title}
            </Link>
          ) : (
            <span className={styles.itemTitle}>{title}</span>
          )}
        </div>
        <div className={cx(styles.controls, ui.noPrint)}>
          <button type="button" className={styles.icon} aria-label={`${t.plan.moveUp}: ${title}`} title={t.plan.moveUp} disabled={first} onClick={() => tripActions.move(key, -1)}>
            ↑
          </button>
          <button type="button" className={styles.icon} aria-label={`${t.plan.moveDown}: ${title}`} title={t.plan.moveDown} disabled={last} onClick={() => tripActions.move(key, 1)}>
            ↓
          </button>
          <label className={styles.moveTo}>
            <span className="visually-hidden">
              {t.plan.moveTo}: {title}
            </span>
            <select className={ui.input} value={item.day ?? ""} onChange={(e) => tripActions.setDay(key, e.target.value ? Number(e.target.value) : null)}>
              <option value="">{t.plan.unscheduled}</option>
              {Array.from({ length: days }, (_, i) => (
                <option key={i} value={i + 1}>
                  {fill(t.plan.day, { n: i + 1 })}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className={ui.buttonSmall} onClick={() => tripActions.remove(key)} aria-label={`${t.plan.remove}: ${title}`}>
            {t.plan.remove}
          </button>
        </div>
      </div>
      <label className={cx(styles.note, ui.noPrint)}>
        <span className={ui.label}>{t.plan.notes}</span>
        <textarea
          className={cx(ui.input, styles.noteInput)}
          value={note}
          maxLength={2000}
          placeholder={t.plan.notesPlaceholder}
          aria-label={fill(t.plan.notesFor, { name: title })}
          onChange={(e) => onNote(e.target.value)}
        />
      </label>
      {note && <p className={styles.printNote}>{note}</p>}
    </li>
  );
}
