"use client";

import type { FormEvent } from "react";

import { cx } from "@/lib/cx";
import { addDays, GUEST_COUNTS, guestsLabel } from "@/lib/stay/dates";
import { properties } from "@/lib/stay/properties";

import styles from "./HeroBooking.module.css";
import { useHomeBooking } from "./HomeBooking";

/** The frosted request bar at the foot of the hero (the page's #book target). */
export function HeroBooking() {
  const b = useHomeBooking();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!b.submit()) return;
    // Wait a frame for the results to render, then bring them into view and move focus there.
    window.setTimeout(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById("results")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      document.getElementById("results-title")?.focus({ preventScroll: true });
    }, 80);
  }

  return (
    <div className={styles.wrap}>
      <form id="book" className={styles.bar} onSubmit={onSubmit} aria-label="Plan your stay" noValidate>
        <div className={cx(styles.field, styles.where)}>
          <span id="book-where" className={styles.label}>
            Where
          </span>
          <div className={styles.seg} role="radiogroup" aria-labelledby="book-where">
            {properties.map((property) => (
              <label key={property.id} className={cx(styles.segOption, b.property === property.id && styles.segOn)}>
                <input
                  type="radio"
                  name="property"
                  value={property.id}
                  checked={b.property === property.id}
                  onChange={() => b.setProperty(property.id)}
                />
                {property.shortName}
              </label>
            ))}
          </div>
        </div>
        <label className={styles.field}>
          <span className={styles.label}>Check in</span>
          <input
            className={styles.input}
            type="date"
            value={b.checkin}
            min={b.today || undefined}
            onChange={(e) => b.setCheckin(e.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Check out</span>
          <input
            className={styles.input}
            type="date"
            value={b.checkout}
            min={b.checkin ? addDays(b.checkin, 1) : b.today || undefined}
            onChange={(e) => b.setCheckout(e.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Guests</span>
          <select className={styles.input} value={b.guests} onChange={(e) => b.setGuests(Number(e.target.value))}>
            {GUEST_COUNTS.map((count) => (
              <option key={count} value={count}>
                {guestsLabel(count)}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className={styles.submit}>
          See rooms
        </button>
      </form>
      {b.error ? (
        <p className={styles.error} role="alert">
          {b.error}
        </p>
      ) : (
        <p className={styles.perks}>
          <span>Booked with the family</span>
          <span>No booking fees</span>
          <span>Cash on arrival</span>
        </p>
      )}
    </div>
  );
}
