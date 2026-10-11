"use client";

import { useId, useState } from "react";

import { useI18n } from "@/i18n/client";

import styles from "./DemoBooking.module.css";

/**
 * A booking box for demo listings: dates and party size only (no names, no
 * contact details), and it sends nothing — it says so when used.
 */
export function DemoBooking({ kind }: { kind: "stay" | "table" | "tour" }) {
  const { t } = useI18n();
  const id = useId();
  const [done, setDone] = useState(false);
  const title = kind === "stay" ? t.business.bookTitle : kind === "table" ? t.business.tableTitle : t.business.tourTitle;
  return (
    <form
      className={styles.box}
      aria-labelledby={`${id}-title`}
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      <p id={`${id}-title`} className={styles.title}>
        {title} <span className={styles.tag}>{t.common.demo}</span>
      </p>
      <div className={styles.fields}>
        <label className={styles.field}>
          <span>{t.business.bookDate}</span>
          <input type="date" required onChange={() => setDone(false)} />
        </label>
        {kind === "stay" && (
          <label className={styles.field}>
            <span>{t.business.bookNights}</span>
            <input type="number" min={1} max={30} defaultValue={2} onChange={() => setDone(false)} />
          </label>
        )}
        <label className={styles.field}>
          <span>{kind === "stay" ? t.business.bookGuests : t.business.bookPeople}</span>
          <input type="number" min={1} max={20} defaultValue={2} onChange={() => setDone(false)} />
        </label>
        <button type="submit" className={styles.button}>
          {t.business.bookButton}
        </button>
      </div>
      {done && (
        <p className={styles.result} role="status">
          {t.business.bookResult}
        </p>
      )}
    </form>
  );
}
