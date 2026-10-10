"use client";

import { useMemo, useState } from "react";

import { UnitCard } from "@/components/stay/UnitCard";
import { cx } from "@/lib/cx";
import { addDays, GUEST_COUNTS, guestsLabel, isIsoDate, nightsBetween } from "@/lib/stay/dates";
import { properties, type PropertyId } from "@/lib/stay/properties";
import { units } from "@/lib/stay/units";
import { useStayDates } from "@/lib/stay/useStayDates";

import styles from "./RoomsBrowser.module.css";

type Place = PropertyId | "all";

/**
 * Every room and bungalow type of both properties, filtered by place and
 * group size. Dates are optional: when set, they ride along into the request
 * form and the Booking.com links.
 */
export function RoomsBrowser() {
  const { checkin, checkout, setCheckin, setCheckout, today } = useStayDates();
  const [place, setPlace] = useState<Place>("all");
  const [guests, setGuests] = useState(0);

  const shown = useMemo(
    () =>
      units.filter(
        (unit) =>
          (place === "all" || unit.property === place) && (!guests || unit.sleeps === null || unit.sleeps >= guests),
      ),
    [place, guests],
  );

  const datesOk = isIsoDate(checkin) && isIsoDate(checkout) && nightsBetween(checkin, checkout) > 0;
  const stay = { checkin: datesOk ? checkin : undefined, checkout: datesOk ? checkout : undefined, guests: guests || undefined };

  return (
    <section id="browse" className={styles.browse} aria-label="Rooms and bungalows">
      <div className={styles.inner}>
        <div className={styles.bar} role="group" aria-label="Filter rooms and bungalows">
          <div className={styles.seg} role="radiogroup" aria-label="Where">
            {(["all", ...properties.map((p) => p.id)] as Place[]).map((value) => (
              <label key={value} className={cx(styles.segOption, place === value && styles.segOn)}>
                <input
                  type="radio"
                  name="place"
                  value={value}
                  checked={place === value}
                  onChange={() => setPlace(value)}
                />
                {value === "all" ? "Both places" : properties.find((p) => p.id === value)?.name}
              </label>
            ))}
          </div>
          <label className={styles.field}>
            <span className={styles.label}>Guests</span>
            <select className={styles.input} value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
              <option value={0}>Any</option>
              {GUEST_COUNTS.map((count) => (
                <option key={count} value={count}>
                  {guestsLabel(count)}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Check in</span>
            <input
              className={styles.input}
              type="date"
              value={checkin}
              min={today || undefined}
              onChange={(e) => setCheckin(e.target.value)}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Check out</span>
            <input
              className={styles.input}
              type="date"
              value={checkout}
              min={checkin ? addDays(checkin, 1) : today || undefined}
              onChange={(e) => setCheckout(e.target.value)}
            />
          </label>
        </div>

        <p className={styles.count} aria-live="polite">
          {shown.length} {shown.length === 1 ? "option" : "options"}
          {guests ? ` for ${guestsLabel(guests)}` : ""}
          {datesOk ? " · your dates go into the request" : ""}
        </p>

        <div className={styles.grid}>
          {shown.map((unit) => (
            <UnitCard key={unit.id} unit={unit} stay={stay} showProperty={place === "all"} />
          ))}
        </div>
      </div>
    </section>
  );
}
