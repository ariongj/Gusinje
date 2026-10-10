import type { ReactNode } from "react";

import { cx } from "@/lib/cx";

import styles from "./PageHero.module.css";
import { Photo } from "./Photo";

type PageHeroProps = {
  /** Small frosted label above the title, e.g. "Rooms & suites". */
  kicker: string;
  /** The page's h1. Wrap a phrase in <em> for the italic accent. */
  title: ReactNode;
  intro?: ReactNode;
  /** Full-bleed photo; without one the hero is a lake-teal gradient. */
  image?: { src: string; alt: string; position?: string };
  /** Buttons or links under the intro. */
  actions?: ReactNode;
  /** Keep space at the bottom for a booking bar pulled up over the hero. */
  overlap?: boolean;
  /** "tall" for photo pages, "compact" for pages that get straight to business. */
  size?: "tall" | "compact";
  /** Extra content under the actions (facts, chips …). */
  children?: ReactNode;
};

/**
 * Page header used across the inner pages. It is the nav's scroll anchor:
 * the nav turns solid once it has scrolled past.
 */
export function PageHero({
  kicker,
  title,
  intro,
  image,
  actions,
  overlap = false,
  size = "tall",
  children,
}: PageHeroProps) {
  return (
    <section
      className={cx(styles.hero, size === "compact" && styles.compact, overlap && styles.overlap, !image && styles.plain)}
      data-nav-anchor
    >
      {image && (
        <div className={styles.media}>
          <Photo src={image.src} alt={image.alt} position={image.position} eager />
        </div>
      )}
      <div className={styles.shade} aria-hidden="true" />
      {/* No data-reveal here: the heading and buttons are above the fold and
          must show before hydration. The entrance is a CSS animation instead. */}
      <div className={styles.inner}>
        <div className={styles.kicker}>{kicker}</div>
        <h1 className={styles.title}>{title}</h1>
        {intro && <p className={styles.intro}>{intro}</p>}
        {actions && <div className={styles.actions}>{actions}</div>}
        {children}
      </div>
    </section>
  );
}
