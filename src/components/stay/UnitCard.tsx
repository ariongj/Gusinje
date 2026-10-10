import Link from "next/link";

import { Photo } from "@/components/ui/Photo";
import { cx } from "@/lib/cx";
import { bookingUrl, requestHref } from "@/lib/stay/links";
import { getProperty } from "@/lib/stay/properties";
import type { Unit } from "@/lib/stay/units";
import ui from "@/styles/ui.module.css";

import styles from "./UnitCard.module.css";

type UnitCardProps = {
  unit: Unit;
  /** Dates and guests to carry into the request and the Booking.com link. */
  stay?: { checkin?: string; checkout?: string; guests?: number };
  /** Show which property the unit belongs to (on pages listing both). */
  showProperty?: boolean;
};

const KIND: Record<Unit["kind"], string> = { bungalow: "Bungalow", room: "Room", camping: "Camping" };

/** One room or bungalow type: photo, facts, and the two ways to book it. */
export function UnitCard({ unit, stay = {}, showProperty = false }: UnitCardProps) {
  const property = getProperty(unit.property);
  const facts = [unit.size ? `${unit.size} m²` : null, unit.beds, unit.sleeps ? `Sleeps ${unit.sleeps}` : null].filter(
    Boolean,
  );

  return (
    <article id={unit.id} className={styles.card}>
      <div className={styles.media}>
        {unit.photo ? (
          <Photo
            src={unit.photo.srcSmall ?? unit.photo.src}
            alt={unit.photo.alt}
            position={unit.photo.position}
            sizes="(max-width: 790px) 100vw, (max-width: 1190px) 50vw, 420px"
          />
        ) : (
          <span className={styles.noPhoto}>Photos coming soon</span>
        )}
        <span className={styles.badge}>{showProperty ? property.name : KIND[unit.kind]}</span>
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{unit.name}</h3>
        <ul className={styles.facts} aria-label="Key facts">
          {facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
        <ul className={styles.features}>
          {unit.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        {unit.note && <p className={styles.note}>{unit.note}</p>}

        <div className={styles.actions}>
          <Link href={requestHref({ property: unit.property, unit, ...stay })} className={ui.btnGold}>
            Request dates<span className="visually-hidden"> for the {unit.name}</span>
          </Link>
          {unit.kind !== "camping" && (
            <a
              href={bookingUrl(unit.property, stay)}
              className={cx(ui.btnOutline, styles.booking)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Booking.com<span className="visually-hidden"> — {property.name}, opens in a new tab</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
