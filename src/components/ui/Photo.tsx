import Image from "next/image";

import { cx } from "@/lib/cx";

import styles from "./Photo.module.css";

type PhotoProps = {
  src: string;
  alt: string;
  /** Responsive sizes hint for next/image — defaults to full viewport width. */
  sizes?: string;
  /** Load immediately with high priority (above-the-fold / LCP images). */
  eager?: boolean;
  /** CSS object-position, e.g. "50% 30%". */
  position?: string;
  className?: string;
};

/**
 * Cover-cropped photo that fills its container (the production replacement
 * for the prototypes' <image-slot>). Give the parent a size — an aspect
 * ratio, a height, or an absolutely positioned box.
 */
export function Photo({ src, alt, sizes = "100vw", eager = false, position, className }: PhotoProps) {
  return (
    <div className={cx(styles.frame, className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={styles.img}
        style={position ? { objectPosition: position } : undefined}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
      />
    </div>
  );
}
