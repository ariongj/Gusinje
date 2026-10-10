import Link from "next/link";
import type { ReactNode } from "react";

import { UnitCard } from "@/components/stay/UnitCard";
import { Photo } from "@/components/ui/Photo";
import { PhotoCredit } from "@/components/ui/PhotoCredit";
import { site } from "@/config/site";
import { cx } from "@/lib/cx";
import { bookingUrl, directionsUrl, mapsUrl, requestHref } from "@/lib/stay/links";
import type { SitePhoto } from "@/lib/stay/photos";
import type { Property } from "@/lib/stay/properties";
import { unitsFor } from "@/lib/stay/units";
import ui from "@/styles/ui.module.css";

import styles from "./PropertySections.module.css";

/** Summary + the key facts in a small bento. */
export function PropertyIntro({ property, children }: { property: Property; children?: ReactNode }) {
  const booking = property.scores[0];
  return (
    <section className={cx(ui.section, styles.intro)}>
      <div className={cx(ui.container, styles.introGrid)}>
        <div>
          <h2 className={cx(ui.eyebrow, styles.m0)} data-reveal="up">
            {property.name} · {property.place}
          </h2>
          <p className={styles.statement} data-reveal="up" data-delay="80">
            {property.summary}
          </p>
          {children}
        </div>
        <ul className={styles.bento} data-reveal="up" data-delay="120">
          <li className={styles.bentoDark}>
            <span className={styles.bentoValue}>
              {booking.score}
              <small>{booking.scale}</small>
            </span>
            <span className={styles.bentoLabel}>
              {booking.source} · {booking.reviews} reviews
            </span>
          </li>
          <li>
            <span className={styles.bentoValue}>{property.checkIn.split("–")[0]}</span>
            <span className={styles.bentoLabel}>Check-in from</span>
          </li>
          <li>
            <span className={styles.bentoValue}>24 h</span>
            <span className={styles.bentoLabel}>Open day and night</span>
          </li>
          <li>
            <span className={styles.bentoValue}>Cash</span>
            <span className={styles.bentoLabel}>Payment on arrival</span>
          </li>
        </ul>
      </div>
    </section>
  );
}

export function PropertyUnits({ property, title, lead }: { property: Property; title: ReactNode; lead: string }) {
  return (
    <section id="rooms" className={cx(ui.section, styles.units)}>
      <div className={ui.container}>
        <div className={styles.head}>
          <div>
            <h2 className={cx(ui.eyebrow, styles.m0)} data-reveal="up">
              Where you&apos;ll sleep
            </h2>
            <p className={cx(ui.h2, styles.mt18)} data-reveal="up" data-delay="80">
              {title}
            </p>
          </div>
          <p className={cx(ui.lead, styles.headLead)} data-reveal="up" data-delay="120">
            {lead}
          </p>
        </div>
        <div className={styles.unitGrid}>
          {unitsFor(property.id).map((unit) => (
            <UnitCard key={unit.id} unit={unit} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** A photo + text split, for each property's own stories. */
export function Feature({
  eyebrow,
  title,
  children,
  image,
  flip = false,
  dark = false,
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
  image: SitePhoto;
  flip?: boolean;
  dark?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className={cx(ui.section, dark ? styles.featureDark : styles.feature)}>
      <div className={cx(ui.container, styles.featureGrid, flip && styles.flip)}>
        <div className={styles.featurePhoto} data-reveal="scale">
          <Photo src={image.src} alt={image.alt} position={image.position} sizes="(max-width: 900px) 100vw, 50vw" />
        </div>
        <div className={styles.featureCopy}>
          <h2 className={cx(dark ? ui.eyebrowLight : ui.eyebrow, styles.m0)} data-reveal="up">
            {eyebrow}
          </h2>
          <p className={cx(dark ? ui.h2Light : ui.h2, styles.mt18)} data-reveal="up" data-delay="80">
            {title}
          </p>
          <div className={dark ? styles.featureTextLight : styles.featureText} data-reveal="up" data-delay="140">
            {children}
          </div>
          <PhotoCredit credit={image.credit} tone={dark ? "light" : "dark"} className={styles.credit} />
        </div>
      </div>
    </section>
  );
}

export function PropertyFacilities({ property }: { property: Property }) {
  return (
    <section className={cx(ui.section, styles.facilities)}>
      <div className={cx(ui.container, styles.facilitiesGrid)}>
        <div>
          <h2 className={cx(ui.eyebrow, styles.m0)} data-reveal="up">
            On site
          </h2>
          <p className={cx(ui.h2, styles.mt18)} data-reveal="up" data-delay="80">
            Everything <em className={styles.accent}>close at hand</em>
          </p>
          <ul className={styles.chips} data-reveal="up" data-delay="120">
            {property.facilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className={styles.small}>Languages spoken: {property.languages.join(", ")}.</p>
        </div>
        <div className={styles.restaurantCard} data-reveal="up" data-delay="160">
          <span className={styles.restaurantKicker}>{property.restaurant.cuisine}</span>
          <h3 className={styles.restaurantName}>{property.restaurant.name}</h3>
          <p className={styles.restaurantText}>{property.restaurant.text}</p>
          <dl className={styles.restaurantFacts}>
            <div>
              <dt>Serving</dt>
              <dd>{property.restaurant.meals.join(" · ")}</dd>
            </div>
            <div>
              <dt>Options</dt>
              <dd>{property.restaurant.dietary.join(" · ")}</dd>
            </div>
          </dl>
          <Link href="/dining" className={styles.restaurantLink}>
            Food at ROSI <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function PropertyDistances({ property, title }: { property: Property; title: ReactNode }) {
  return (
    <section className={cx(ui.section, styles.distances)}>
      <div className={cx(ui.container, styles.distancesGrid)}>
        <div>
          <h2 className={cx(ui.eyebrowLight, styles.m0)} data-reveal="up">
            Around you
          </h2>
          <p className={cx(ui.h2Light, styles.mt18)} data-reveal="up" data-delay="80">
            {title}
          </p>
          <Link href="/experiences" className={cx(ui.btnOutlineLight, styles.mt32)} data-reveal="up" data-delay="140">
            Explore the Prokletije
          </Link>
        </div>
        <ul className={styles.distanceList} data-reveal="up" data-delay="120">
          {property.distances.map((item) => (
            <li key={item.place}>
              <span className={styles.distancePlace}>{item.place}</span>
              <span className={styles.distanceValue}>
                {item.distance}
                {item.note && <small> · {item.note}</small>}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** House rules, scores and how to find the place — the practical bit. */
export function PropertyPractical({ property }: { property: Property }) {
  return (
    <section id="practical" className={cx(ui.section, styles.practical)}>
      <div className={cx(ui.container, styles.practicalGrid)}>
        <div className={styles.panel} data-reveal="up">
          <h2 className={styles.panelTitle}>House rules</h2>
          <dl className={styles.rules}>
            {property.policies.map((rule) => (
              <div key={rule.label}>
                <dt>{rule.label}</dt>
                <dd>{rule.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className={styles.panel} data-reveal="up" data-delay="80">
          <h2 className={styles.panelTitle}>What guests say</h2>
          <div className={styles.scores}>
            {property.scores.map((score) => (
              <a key={score.source} href={score.href} className={styles.score} target="_blank" rel="noopener noreferrer">
                <span className={styles.scoreValue}>
                  {score.score}
                  <small>{score.scale}</small>
                </span>
                <span className={styles.scoreLabel}>
                  {score.source}
                  <br />
                  {score.reviews} reviews
                </span>
              </a>
            ))}
          </div>
          <p className={styles.small}>
            {property.highlights.map((h) => `${h.label} ${h.score}`).join(" · ")} on Booking.com. Scores as shown in{" "}
            {property.scoresDate}.
          </p>
        </div>
        <div className={styles.panel} data-reveal="up" data-delay="160">
          <h2 className={styles.panelTitle}>Finding us</h2>
          <address className={styles.address}>
            {property.name}
            <br />
            {property.address.line1}, {property.address.postcode} {property.address.locality}
            <br />
            {property.address.country}
          </address>
          <p className={styles.small}>{property.findUs}</p>
          <div className={styles.panelLinks}>
            <a href={directionsUrl(property)} className={ui.btnGold} target="_blank" rel="noopener noreferrer">
              Directions
            </a>
            <a href={mapsUrl(property)} className={ui.btnOutline} target="_blank" rel="noopener noreferrer">
              Open the map
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PropertyGallery({ property, title }: { property: Property; title: string }) {
  return (
    <section className={cx(ui.section, styles.gallery)} aria-label={title}>
      <div className={ui.container}>
        <h2 className={cx(ui.eyebrow, styles.m0)} data-reveal="up">
          {title}
        </h2>
        <div className={styles.galleryGrid}>
          {property.photos.gallery.map((photo) => (
            <figure key={photo.src} className={styles.galleryItem}>
              <Photo src={photo.srcSmall ?? photo.src} alt={photo.alt} sizes="(max-width: 600px) 50vw, 300px" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PropertyCta({ property, title }: { property: Property; title: ReactNode }) {
  return (
    <section className={styles.cta}>
      <div className={styles.ctaInner}>
        <h2 className={cx(ui.eyebrowLight, styles.m0)} data-reveal="up">
          {property.name}
        </h2>
        <p className={styles.ctaTitle} data-reveal="up" data-delay="80">
          {title}
        </p>
        <p className={styles.ctaLead} data-reveal="up" data-delay="140">
          Send your dates and the family will reply with availability and the price. For tonight, just call.
        </p>
        <div className={styles.ctaActions} data-reveal="up" data-delay="200">
          <Link href={requestHref({ property: property.id })} className={ui.btnGold}>
            Request dates
          </Link>
          <a href={site.phone.href} className={ui.btnOutlineLight}>
            Call {site.phone.display}
          </a>
          <a href={bookingUrl(property.id)} className={ui.btnOutlineLight} target="_blank" rel="noopener noreferrer">
            Booking.com
          </a>
        </div>
        <p className={styles.ctaNote}>On Booking.com you&apos;ll find us as “{property.booking.listedAs}”.</p>
      </div>
    </section>
  );
}
