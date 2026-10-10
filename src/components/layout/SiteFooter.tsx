import Link from "next/link";

import { exploreNav, site } from "@/config/site";
import { cx } from "@/lib/cx";
import { directionsUrl } from "@/lib/stay/links";
import { properties } from "@/lib/stay/properties";

import styles from "./SiteFooter.module.css";

type SiteFooterProps = {
  /** Hairline + tighter top padding, for pages whose last section is dark. */
  divider?: boolean;
  /** Home renders the wordmark as text (it is already the home page). */
  isHome?: boolean;
};

export function SiteFooter({ divider = false, isHome = false }: SiteFooterProps) {
  return (
    <footer className={cx(styles.footer, divider && styles.divider)}>
      <div className={styles.grid}>
        <div className={styles.brand}>
          {isHome ? (
            <div className={styles.wordmark}>{site.wordmark}</div>
          ) : (
            <Link href="/" className={styles.wordmark}>
              {site.wordmark}
            </Link>
          )}
          <p className={cx(styles.tagline, styles.taglineSpaced)}>{site.tagline}</p>
          <div className={styles.social}>
            {site.social.map((item) => (
              <a
                key={item.short}
                href={item.href}
                className={styles.socialLink}
                aria-label={`${item.label} (${item.handle})`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.short}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className={styles.heading}>Explore</h2>
          <div className={styles.list}>
            {exploreNav.map((item) => (
              <Link key={item.href} href={item.href} className={styles.listLink}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className={styles.heading}>Find us</h2>
          <div className={styles.contact}>
            {properties.map((property) => (
              <address key={property.id} className={styles.place}>
                <Link href={property.href} className={styles.placeName}>
                  {property.name}
                </Link>
                <span>
                  {property.address.line1}, {property.address.postcode} {property.address.locality}
                  <br />
                  {property.address.country}
                </span>
                <a href={directionsUrl(property)} className={styles.listLink} target="_blank" rel="noopener noreferrer">
                  Directions
                </a>
              </address>
            ))}
          </div>
        </div>

        <div>
          <h2 className={styles.heading}>Contact</h2>
          <address className={styles.contact}>
            <a href={site.phone.href} className={styles.listLink}>
              {site.phone.display}
            </a>
            <a href={site.email.href} className={styles.listLink}>
              {site.email.display}
            </a>
            <span className={styles.note}>Both places are open 24 hours. Cash payments only.</span>
            <Link href="/contact" className={styles.asideLink}>
              Send us a request
            </Link>
          </address>
        </div>
      </div>

      <div className={styles.mega} aria-hidden="true">
        {site.wordmark}
      </div>

      <div className={styles.bottom}>
        <span>
          &copy; {site.copyrightYear} {site.name} · Gusinje, Montenegro
        </span>
        <div className={styles.legal}>
          {site.legal.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
