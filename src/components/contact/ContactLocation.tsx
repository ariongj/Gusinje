import Link from "next/link";

import { ValleyMap } from "@/components/ui/ValleyMap";
import { cx } from "@/lib/cx";
import { directionsUrl, mapsUrl } from "@/lib/stay/links";
import { properties } from "@/lib/stay/properties";
import ui from "@/styles/ui.module.css";

import styles from "./ContactLocation.module.css";

/** Both places on the valley map, each with its address, times and directions. */
export function ContactLocation() {
  return (
    <section id="where" className={styles.section} aria-labelledby="location-title">
      <div className={styles.inner}>
        <div className={styles.head} data-reveal="up">
          <div>
            <p className={ui.eyebrow}>Where we are</p>
            <h2 id="location-title" className={cx(ui.h2, styles.title)}>
              Two places, <em>one valley</em>
            </h2>
          </div>
          <p className={cx(ui.lead, styles.lead)}>
            Hotel ROSI stands on the road into Gusinje. Eko Katun ROSI is a few kilometres further up the valley, by
            the bridge on the road to Vusanje &mdash; a short walk from the Grlja waterfall and the Ropojana valley.
          </p>
        </div>

        <div className={styles.bento}>
          <figure className={styles.mapCard} data-reveal="up">
            <ValleyMap titleId="contact-valley-map" />
            <figcaption className={styles.mapNote}>Illustrative map, not to scale.</figcaption>
          </figure>

          <ul className={styles.places} data-reveal="up" data-delay="120">
            {properties.map((property) => (
              <li key={property.id} className={styles.place}>
                <p className={styles.placeKind}>{property.place}</p>
                <h3 className={styles.placeName}>
                  <Link href={property.href}>{property.name}</Link>
                </h3>
                <address className={styles.address}>
                  {property.address.line1}, {property.address.postcode} {property.address.locality},{" "}
                  {property.address.country}
                </address>
                <p className={styles.findUs}>{property.findUs}</p>
                <dl className={styles.times}>
                  <div>
                    <dt>Check-in</dt>
                    <dd>{property.checkIn}</dd>
                  </div>
                  <div>
                    <dt>Check-out</dt>
                    <dd>{property.checkOut}</dd>
                  </div>
                </dl>
                <div className={styles.placeActions}>
                  <a
                    href={directionsUrl(property)}
                    className={styles.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Directions
                    <span className="visually-hidden"> to {property.name} (opens Google Maps in a new tab)</span>
                    <span aria-hidden="true">&nbsp;&#8599;</span>
                  </a>
                  <a href={mapsUrl(property)} className={styles.textLink} target="_blank" rel="noopener noreferrer">
                    Open in Maps
                    <span className="visually-hidden"> (new tab)</span>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
