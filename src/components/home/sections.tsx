import Link from "next/link";

import { Photo } from "@/components/ui/Photo";
import { PhotoCredit } from "@/components/ui/PhotoCredit";
import { ValleyMap } from "@/components/ui/ValleyMap";
import { site } from "@/config/site";
import { contactHref } from "@/lib/contact-link";
import { cx } from "@/lib/cx";
import { directionsUrl } from "@/lib/stay/links";
import { ownerPhotos as P } from "@/lib/stay/photos";
import { hotel, katun, properties } from "@/lib/stay/properties";
import { gettingHere } from "@/lib/stay/travel";
import ui from "@/styles/ui.module.css";

import { katunLife, nearby } from "./content";
import { Gallery } from "./Gallery";
import { RoomsRail } from "./RoomsRail";
import styles from "./sections.module.css";

/** The two properties side by side. */
export function Places() {
  return (
    <section id="places" className={cx(ui.section, styles.places)}>
      <div className={cx(ui.container, styles.rowHead)}>
        <div>
          <h2 className={cx(ui.eyebrow, styles.m0)} data-reveal="up">
            Two places, one family
          </h2>
          <p className={cx(ui.h2, styles.mt18)} data-reveal="up" data-delay="80">
            Where would you like <em className={styles.accent}>to wake up?</em>
          </p>
        </div>
      </div>
      <div className={cx(ui.container, styles.duo)}>
        {properties.map((property, i) => {
          const booking = property.scores[0];
          return (
            <Link
              key={property.id}
              href={property.href}
              className={cx(styles.duoCard, i === 1 && styles.duoCardOffset)}
              data-reveal="up"
              data-delay={String(i * 100)}
            >
              <Photo
                src={property.photos.card.src}
                alt={property.photos.card.alt}
                sizes="(max-width: 900px) 100vw, 50vw"
              />
              <div className={styles.duoShade} aria-hidden="true" />
              <div className={styles.duoBody}>
                <span className={styles.duoKicker}>
                  {property.place} · {booking.score} on {booking.source}
                </span>
                <h3 className={styles.duoTitle}>{property.name}</h3>
                <p className={styles.duoText}>{property.kind}</p>
                <span className={styles.duoCta}>
                  {property.id === "katun" ? "Visit the katun" : "See the hotel"} <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/** What makes the katun special: the tower, the animals, the food. */
export function KatunLife() {
  return (
    <section id="katun-life" className={cx(ui.section, styles.seasons)}>
      <div className={ui.container}>
        <div className={styles.seasonsHead}>
          <div>
            <h2 className={cx(ui.eyebrow, styles.m0)} data-reveal="up">
              Eko Katun ROSI · Vusanje
            </h2>
            <p className={cx(ui.h2, styles.mt18)} data-reveal="up" data-delay="80">
              Life on <em className={styles.accent}>the katun</em>
            </p>
          </div>
          <div className={styles.seasonsSide} data-reveal="up" data-delay="120">
            <p className={cx(ui.lead, styles.seasonsLead)}>
              A katun is a summer settlement in the high pastures. Ours sits at the head of the Vusanje valley, where the
              family has welcomed guests since 2008 — “you become part of our family” is how many of them put it.
            </p>
            <Link href="/katun" className={ui.linkUnderline}>
              More about the katun <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className={cx(styles.seasonGrid, styles.threeUp)}>
          {katunLife.map((item, i) => (
            <article key={item.title} className={styles.seasonCard} data-reveal="up" data-delay={String(i * 80)}>
              <div className={styles.seasonPhoto}>
                <Photo
                  src={item.image.srcSmall ?? item.image.src}
                  alt={item.image.alt}
                  sizes="(max-width: 700px) 100vw, 33vw"
                />
              </div>
              <div className={styles.seasonBody}>
                <h3 className={styles.seasonTitle}>{item.title}</h3>
                <p className={styles.seasonText}>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Stay() {
  return (
    <section id="stay" className={cx(ui.section, styles.stay)}>
      <div className={cx(ui.container, styles.rowHead)}>
        <div>
          <h2 className={cx(ui.eyebrow, styles.m0)} data-reveal="up">
            Stay
          </h2>
          <p className={cx(ui.h2, styles.mt18)} data-reveal="up" data-delay="80">
            Bungalows, family rooms <em className={styles.accent}>& a town hotel</em>
          </p>
        </div>
        <Link href="/rooms" className={ui.btnOutline} data-reveal="up" data-delay="140">
          All rooms & bungalows
        </Link>
      </div>
      <div className={ui.container} data-reveal="up" data-delay="120">
        <RoomsRail />
      </div>
    </section>
  );
}

/** Walks from the katun's door. */
export function Nearby() {
  return (
    <section id="nearby" className={cx(ui.section, styles.nearby)}>
      <div className={cx(ui.container, styles.rowHead)}>
        <div>
          <h2 className={cx(ui.eyebrow, styles.m0)} data-reveal="up">
            Explore
          </h2>
          <p className={cx(ui.h2, styles.mt18)} data-reveal="up" data-delay="80">
            Step out <em className={styles.accent}>of the door</em>
          </p>
        </div>
        <Link href="/experiences" className={ui.btnOutline} data-reveal="up" data-delay="140">
          Explore the Prokletije
        </Link>
      </div>
      <div className={cx(ui.container, styles.seasonGrid)}>
        {nearby.map((place, i) => (
          <article key={place.name} className={styles.seasonCard} data-reveal="up" data-delay={String(i * 70)}>
            <div className={styles.seasonPhoto}>
              <Photo src={place.image.src} alt={place.image.alt} sizes="(max-width: 700px) 50vw, 300px" />
            </div>
            <div className={styles.seasonBody}>
              <h3 className={styles.seasonTitle}>{place.name}</h3>
              <p className={styles.placeDistance}>{place.distance}</p>
              <p className={styles.seasonText}>{place.text}</p>
              <PhotoCredit credit={place.image.credit} tone="dark" className={styles.seasonCredit} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/** The two restaurants. */
export function Food() {
  return (
    <section id="food" className={cx(ui.section, styles.intro)}>
      <div className={cx(ui.container, styles.introGrid)}>
        <div className={styles.introCopy}>
          <h2 className={cx(ui.eyebrow, styles.m0)} data-reveal="up">
            Food
          </h2>
          <p className={cx(ui.h2, styles.mt18)} data-reveal="up" data-delay="80">
            Cooked <em className={styles.accent}>the mountain way</em>
          </p>
          <div className={styles.restaurants}>
            {[katun, hotel].map((property, i) => (
              <div key={property.id} className={styles.restaurant} data-reveal="up" data-delay={String(100 + i * 80)}>
                <span className={styles.restaurantPlace}>
                  {property.restaurant.cuisine} · {property.place}
                </span>
                <h3 className={styles.restaurantName}>{property.restaurant.name}</h3>
                <p className={styles.restaurantText}>{property.restaurant.text}</p>
              </div>
            ))}
          </div>
          <Link href="/dining" className={cx(ui.linkUnderline, styles.mt24)} data-reveal="up" data-delay="260">
            Food & restaurants <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div data-reveal="scale">
          <div className={styles.introPhoto}>
            <Photo src={P.katunFeast.src} alt={P.katunFeast.alt} sizes="(max-width: 900px) 100vw, 45vw" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** The 3D valley and guided tour. */
export function TourBand() {
  return (
    <section id="tour" className={cx(ui.section, styles.tour)}>
      <div className={styles.tourGlow} aria-hidden="true" />
      <div className={cx(ui.container, styles.tourGrid)}>
        <div>
          <h2 className={cx(ui.eyebrowLight, styles.m0)} data-reveal="up">
            3D valley
          </h2>
          <p className={cx(ui.h2Light, styles.mt18)} data-reveal="up" data-delay="80">
            Look around <em className={styles.accentLight}>before you arrive</em>
          </p>
          <p className={cx(ui.leadLight, styles.mt24)} data-reveal="up" data-delay="140">
            Fly up the valley from Gusinje to Vusanje in 3D — the hotel, the springs, the katun, the waterfall and the
            peaks around them. Prefer to sit back? The guided tour shows you around in a couple of minutes.
          </p>
          <div className={styles.tourActions} data-reveal="up" data-delay="200">
            <Link href="/tour#guided-tour" className={ui.btnGold}>
              <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M3.5 1.8v10.4L12 7z" fill="currentColor" />
              </svg>
              Start the guided tour
            </Link>
            <Link href="/tour" className={ui.btnOutlineLight}>
              Explore on my own
            </Link>
          </div>
        </div>
        <Link href="/tour" className={styles.tourFrame} data-reveal="scale" aria-label="Open the 3D valley">
          <Photo src={P.katunNight.src} alt={P.katunNight.alt} sizes="(max-width: 900px) 100vw, 55vw" />
          <span className={styles.tourPlay} aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 14 14">
              <path d="M3.5 1.8v10.4L12 7z" fill="currentColor" />
            </svg>
          </span>
        </Link>
      </div>
    </section>
  );
}

export function GallerySection() {
  return (
    <section id="gallery" className={cx(ui.section, styles.gallery)}>
      <div className={ui.container}>
        <div className={styles.rowHead}>
          <div>
            <h2 className={cx(ui.eyebrow, styles.m0)} data-reveal="up">
              Gallery
            </h2>
            <p className={cx(ui.h2, styles.mt18)} data-reveal="up" data-delay="80">
              A look around
            </p>
          </div>
        </div>
        <Gallery />
      </div>
    </section>
  );
}

/** Real scores, dated and linked — no invented testimonials. */
export function Reviews() {
  return (
    <section id="reviews" className={cx(ui.section, styles.reviews)}>
      <div className={ui.container}>
        <div className={styles.rowHead}>
          <div>
            <h2 className={cx(ui.eyebrow, styles.m0)} data-reveal="up">
              What guests say
            </h2>
            <p className={cx(ui.h2, styles.mt18)} data-reveal="up" data-delay="80">
              Treated <em className={styles.accent}>like family</em>
            </p>
          </div>
        </div>
        <div className={styles.scoreGrid}>
          {properties.map((property, i) => (
            <article key={property.id} className={styles.scoreCard} data-reveal="up" data-delay={String(i * 90)}>
              <h3 className={styles.scoreName}>{property.name}</h3>
              <div className={styles.scoreRow}>
                {property.scores.map((score) => (
                  <a key={score.source} href={score.href} className={styles.score} target="_blank" rel="noopener noreferrer">
                    <span className={styles.ratingValue}>{score.score}</span>
                    <span className={styles.ratingCount}>
                      {score.scale} on {score.source}
                      <br />
                      {score.reviews} reviews
                    </span>
                  </a>
                ))}
              </div>
              <p className={styles.scoreHighlights}>
                {property.highlights.map((h) => `${h.label} ${h.score}`).join(" · ")} on Booking.com
              </p>
            </article>
          ))}
        </div>
        <p className={styles.scoreNote} data-reveal="up">
          Scores as shown in {katun.scoresDate}. Guests most often mention the warm family welcome, the home cooking and
          breakfast, the animals at the katun and how close the springs and trails are.
        </p>
      </div>
    </section>
  );
}

export function Location() {
  return (
    <section id="location" className={cx(ui.section, styles.location)}>
      <div className={cx(ui.container, styles.locationGrid)}>
        <div>
          <h2 className={cx(ui.eyebrow, styles.m0)} data-reveal="up">
            Getting here
          </h2>
          <p className={cx(ui.h2, styles.mt18)} data-reveal="up" data-delay="80">
            At the foot of <em className={styles.accent}>the Prokletije</em>
          </p>
          <p className={cx(ui.lead, styles.mt24)} data-reveal="up" data-delay="120">
            Gusinje lies in the far east of Montenegro, close to the Albanian border. The hotel is on the road into town;
            the katun is about 4 km further up the valley, below the village of Vusanje.
          </p>
          <dl className={styles.facts} data-reveal="up" data-delay="160">
            {gettingHere.map((fact) => (
              <div key={fact.label} className={styles.fact}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div className={styles.locationActions} data-reveal="up" data-delay="200">
            {properties.map((property) => (
              <a
                key={property.id}
                href={directionsUrl(property)}
                target="_blank"
                rel="noopener noreferrer"
                className={property.id === "katun" ? ui.btnGold : ui.btnOutline}
              >
                Directions to the {property.id === "katun" ? "katun" : "hotel"}
              </a>
            ))}
            <Link href={contactHref({ topic: "transfer" })} className={ui.btnOutline}>
              Ask about a transfer
            </Link>
          </div>
        </div>
        <div className={styles.mapCard} data-reveal="scale">
          <ValleyMap titleId="home-valley-map" />
          <span className={styles.mapNote}>Illustrative · not to scale</span>
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className={styles.final}>
      <svg className={styles.finalRidge} viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 150 L120 110 L210 128 L320 70 L420 112 L520 84 L640 40 L760 96 L880 62 L1000 104 L1120 56 L1240 98 L1340 76 L1440 104 V220 H0 Z" />
        <path d="M0 184 L140 160 L280 176 L420 148 L560 170 L700 150 L840 174 L980 152 L1120 172 L1260 156 L1440 170 V220 H0 Z" />
      </svg>
      <div className={styles.finalInner}>
        <h2 className={cx(ui.eyebrowLight, styles.m0)} data-reveal="up">
          Come and stay
        </h2>
        <p className={styles.finalTitle} data-reveal="up" data-delay="80">
          The mountains <em>are waiting.</em>
        </p>
        <p className={styles.finalLead} data-reveal="up" data-delay="140">
          Send us your dates and the family will answer with availability and the price — or simply call, day or night.
        </p>
        <div className={styles.finalActions} data-reveal="up" data-delay="200">
          <a href="#book" className={ui.btnGold}>
            Check dates
          </a>
          <a href={site.phone.href} className={ui.btnOutlineLight}>
            Call {site.phone.display}
          </a>
        </div>
      </div>
    </section>
  );
}
