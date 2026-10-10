import Link from "next/link";

import { site } from "@/config/site";
import { contactHref } from "@/lib/contact-link";
import ui from "@/styles/ui.module.css";

import styles from "./TourCta.module.css";

/** Closing call to action under the tour: slow ripples on dark water. */
export function TourCta() {
  return (
    <section className={styles.cta}>
      <div className={styles.ripples} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className={styles.inner}>
        <div className={styles.kicker} data-reveal="up">
          Seen enough to fall for it?
        </div>
        <h2 className={styles.title} data-reveal="up" data-delay="80">
          The real valley is <em>even better.</em>
        </h2>
        <p className={styles.lead} data-reveal="up" data-delay="120">
          Send your dates to the family &mdash; no booking fees, and they&rsquo;ll reply with availability and the
          price. Or call {site.phone.display}.
        </p>
        <div className={styles.actions} data-reveal="up" data-delay="160">
          <Link href={`${contactHref()}#write`} className={ui.btnGold}>
            Send a request
          </Link>
          <Link href="/#book" className={ui.btnOutlineLight}>
            Check dates
          </Link>
        </div>
      </div>
    </section>
  );
}
