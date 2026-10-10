import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import styles from "./LakeIntro.module.css";
import { lakeStats } from "./content";

const nearby = ["Prokletije National Park", "Ali Pasha's Springs", "Grlja", "Ropojana", "Grbaja", "Lake Plav"] as const;

/** Why Gusinje and Vusanje: the valley in a few words and four big numbers. */
export function LakeIntro() {
  return (
    <section className={styles.section} aria-labelledby="lake-intro-title">
      <div className={styles.grid}>
        <div className={styles.copy} data-reveal="left">
          <p className={ui.eyebrow}>Gusinje & Vusanje</p>
          <h2 id="lake-intro-title" className={cx(ui.h2, styles.title)}>
            Where the Prokletije <em>begin</em>
          </h2>
          <p className={cx(ui.lead, styles.lead)}>
            Gusinje grew up as a caravan stop between the Adriatic and Peć, where the Vruja and the Grnčar meet to
            form the Ljuča. South of town the valley climbs past Ali Pasha&rsquo;s Springs to Vusanje, at the foot of
            the Prokletije &mdash; the &ldquo;Accursed Mountains&rdquo;.
          </p>
          <p className={cx(ui.lead, styles.lead)}>
            Beyond the village lie the Grlja waterfall, the Ropojana and Grbaja valleys and the highest peaks in
            Montenegro, inside Prokletije National Park.
          </p>
          <div className={styles.nearby}>
            <span className={styles.nearbyLabel}>On the doorstep</span>
            <ul className={styles.chips}>
              {nearby.map((place) => (
                <li key={place} className={styles.chip}>
                  {place}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <dl className={styles.stats} data-reveal="right" data-delay="120">
          {lakeStats.map((stat, i) => (
            <div
              key={stat.label}
              className={cx(styles.stat, "accent" in stat && stat.accent && styles.accent, i === 3 && styles.wide)}
            >
              <dt className={styles.statLabel}>{stat.label}</dt>
              <dd className={styles.statValue}>{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
