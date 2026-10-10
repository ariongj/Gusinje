"use client";

import Link from "next/link";

import { Photo } from "@/components/ui/Photo";
import { site } from "@/config/site";
import { cx } from "@/lib/cx";
import { plural, shortDate } from "@/lib/format";
import { guestsLabel } from "@/lib/stay/dates";
import { bookingUrl, requestHref } from "@/lib/stay/links";
import { getProperty } from "@/lib/stay/properties";
import { unitsThatFit } from "@/lib/stay/units";
import ui from "@/styles/ui.module.css";

import styles from "./BookingResults.module.css";
import { useHomeBooking } from "./HomeBooking";

/** Room types that fit the request, each with a pre-filled request and a Booking.com link. */
export function BookingResults() {
  const { search } = useHomeBooking();
  if (!search) return null;

  const property = getProperty(search.property);
  const fits = unitsThatFit(search.property, search.guests);
  const stay = { checkin: search.checkin, checkout: search.checkout, guests: search.guests };

  return (
    <section id="results" className={styles.results} aria-labelledby="results-title">
      <div className={styles.inner}>
        <header className={styles.head}>
          <div>
            <div className={ui.eyebrow}>{property.name}</div>
            {/* Focused after a search (tabIndex -1) so keyboard users continue from the results. */}
            <h2 id="results-title" className={styles.title} tabIndex={-1}>
              {shortDate(search.checkin)} <span aria-hidden="true">→</span>
              <span className="visually-hidden"> to </span> {shortDate(search.checkout)}
            </h2>
          </div>
          <p className={styles.meta}>
            {plural(search.nights, "night")} · {guestsLabel(search.guests)}
            <br />
            <strong>
              {fits.length} {fits.length === 1 ? "option fits" : "options fit"} your group
            </strong>
          </p>
          <a href="#book" className={styles.edit}>
            Change dates
          </a>
        </header>

        <div className={styles.layout}>
          <ul className={styles.list}>
            {fits.map((unit) => (
              <li key={unit.id} className={styles.room}>
                <div className={styles.photo}>
                  {unit.photo ? (
                    <Photo src={unit.photo.srcSmall ?? unit.photo.src} alt="" sizes="(max-width: 700px) 40vw, 220px" />
                  ) : (
                    <span className={styles.noPhoto}>Photos soon</span>
                  )}
                </div>
                <div>
                  <h3 className={styles.name}>{unit.name}</h3>
                  <p className={styles.roomSummary}>
                    {[unit.size ? `${unit.size} m²` : null, unit.beds, unit.sleeps ? `sleeps ${unit.sleeps}` : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <p className={styles.left}>{unit.features.slice(0, 2).join(" · ")}</p>
                </div>
                <div className={styles.actions}>
                  <Link
                    href={requestHref({ property: search.property, unit, ...stay })}
                    className={cx(styles.select, styles.selectOn)}
                  >
                    Request these dates<span className="visually-hidden"> — {unit.name}</span>
                  </Link>
                  {unit.kind !== "camping" && (
                    <a
                      href={bookingUrl(search.property, stay)}
                      className={styles.select}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Booking.com<span className="visually-hidden"> — {unit.name}, opens in a new tab</span>
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <aside className={styles.summary} aria-label="How booking works">
            <div className={styles.sumLabel}>How booking works</div>
            <div className={styles.sumName}>Ask the family</div>
            <p className={styles.sumMeta}>
              Send a request and the family confirms availability and the price by email or phone. For tonight, just
              call.
            </p>
            <div className={styles.figures}>
              <a href={site.phone.href} className={cx(ui.btnGold, styles.sumButton)}>
                Call {site.phone.display}
              </a>
              <a
                href={bookingUrl(search.property, stay)}
                className={cx(ui.btnOutlineLight, styles.sumButton)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Live prices on Booking.com
              </a>
            </div>
            <dl className={styles.rules}>
              <div>
                <dt>Check-in</dt>
                <dd>{property.checkIn}</dd>
              </div>
              <div>
                <dt>Check-out</dt>
                <dd>{property.checkOut}</dd>
              </div>
              <div>
                <dt>Payment</dt>
                <dd>Cash only</dd>
              </div>
            </dl>
            <p className={styles.terms}>
              On Booking.com the {property.id === "katun" ? "katun" : "hotel"} is listed as “{property.booking.listedAs}”.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
