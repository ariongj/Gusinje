import type { ReactNode } from "react";

import { site } from "@/config/site";
import { cx } from "@/lib/cx";
import { gettingHere } from "@/lib/stay/travel";

import styles from "./ContactEnquiry.module.css";

/**
 * The request form card beside the other ways to reach the family (phone,
 * email, social, getting here). The page passes the form in as children.
 * Pulled up over the bottom of the hero.
 */
export function ContactEnquiry({ children }: { children: ReactNode }) {
  return (
    <section id="write" className={styles.section} aria-label="Get in touch">
      <div className={styles.grid}>
        <div className={styles.formCard} data-reveal="up">
          <h2 className={styles.title}>Send a request</h2>
          <p className={styles.subtitle}>
            Tell the family when you&rsquo;d like to come and how many you are &mdash; they&rsquo;ll reply with
            availability and the price. Both places take payment in cash only.
          </p>
          {children}
        </div>

        {/* One reveal for the stack: the cards own their hover transition. */}
        <div className={styles.cards} data-reveal="up" data-delay="120">
          <div className={cx(styles.card, styles.phoneCard)}>
            <h3 className={styles.cardLabel}>Call the family</h3>
            <a href={site.phone.href} className={styles.big}>
              {site.phone.display}
            </a>
            <p className={styles.cardNote}>The main number for both places. Also:</p>
            <ul className={styles.phones}>
              {site.otherPhones.map((phone) => (
                <li key={phone.href}>
                  <a href={phone.href} className={styles.emailLink}>
                    {phone.display}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardLabel}>Email</h3>
            <a href={site.email.href} className={styles.emailLink}>
              {site.email.display}
            </a>
            <h3 className={cx(styles.cardLabel, styles.followLabel)}>Follow along</h3>
            <ul className={styles.social}>
              {site.social.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                    <span className={styles.socialName}>{item.label}</span>
                    <span className={styles.socialHandle}>{item.handle}</span>
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={cx(styles.card, styles.travelCard)}>
            <h3 className={styles.cardLabel}>Getting here</h3>
            <dl className={styles.travel}>
              {gettingHere.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
            <a href="#where" className={styles.directions}>
              Find both places on the map
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
