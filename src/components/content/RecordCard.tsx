import Link from "next/link";
import type { ReactNode } from "react";

import { Photo } from "@/components/ui/Photo";
import { photoAlt } from "@/components/ui/PhotoFigure";
import type { Photo as PhotoType } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { cx } from "@/lib/cx";

import styles from "./RecordCard.module.css";

type Props = {
  href: string;
  title: string;
  kicker?: string;
  text?: string;
  photo?: PhotoType;
  lang: Locale;
  /** Badges under the title. */
  badges?: ReactNode;
  /** Actions below the card body (outside the main link). */
  footer?: ReactNode;
  /** Shown instead of a photo. */
  placeholder?: string;
  headingLevel?: 2 | 3;
  className?: string;
};

/**
 * A card linking to a record. The whole card is clickable through its title
 * link (stretched); footer actions stay separate buttons.
 */
export function RecordCard({ href, title, kicker, text, photo, lang, badges, footer, placeholder, headingLevel = 3, className }: Props) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className={cx(styles.card, className)}>
      <div className={styles.media}>
        {photo ? (
          <Photo src={photo.srcSmall ?? photo.src} alt={photoAlt(photo, lang)} sizes="(max-width: 700px) 100vw, 380px" position={photo.position} />
        ) : (
          <div className={styles.placeholder} aria-hidden={!placeholder}>
            {placeholder && <span>{placeholder}</span>}
          </div>
        )}
      </div>
      <div className={styles.body}>
        {kicker && <p className={styles.kicker}>{kicker}</p>}
        <Heading className={styles.title}>
          <Link href={href} className={styles.link}>
            {title}
          </Link>
        </Heading>
        {badges && <div className={styles.badges}>{badges}</div>}
        {text && <p className={styles.text}>{text}</p>}
      </div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </article>
  );
}
