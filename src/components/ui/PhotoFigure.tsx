import type { Photo as PhotoType } from "@/content/types";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/en";
import { cx } from "@/lib/cx";

import { Photo } from "./Photo";
import { PhotoCredit } from "./PhotoCredit";
import styles from "./PhotoFigure.module.css";

export function photoAlt(photo: PhotoType, lang: Locale): string {
  return lang === "en" ? photo.alt : (photo.altLocalized?.[lang] ?? photo.alt);
}

type Props = {
  photo: PhotoType;
  lang: Locale;
  t: Messages;
  sizes?: string;
  eager?: boolean;
  /** CSS aspect ratio of the frame, e.g. "4 / 3". */
  ratio?: string;
  className?: string;
  small?: boolean;
};

/** A photo with its credit underneath — never text laid over the image. */
export function PhotoFigure({ photo, lang, t, sizes = "100vw", eager = false, ratio = "3 / 2", className, small = false }: Props) {
  return (
    <figure className={cx(styles.figure, className)}>
      <div className={styles.frame} style={{ aspectRatio: ratio }}>
        <Photo src={small && photo.srcSmall ? photo.srcSmall : photo.src} alt={photoAlt(photo, lang)} sizes={sizes} eager={eager} position={photo.position} />
      </div>
      <figcaption>
        <PhotoCredit credit={photo.credit} pending={photo.rights === "owner-pending"} t={t} />
      </figcaption>
    </figure>
  );
}
