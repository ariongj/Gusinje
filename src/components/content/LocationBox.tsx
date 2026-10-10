import Link from "next/link";

import type { Coordinates } from "@/content/types";
import { href, type Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/en";
import ui from "@/styles/ui.module.css";

import styles from "./LocationBox.module.css";

type Props = {
  lang: Locale;
  t: Messages;
  location: Coordinates | null;
  /** Explorer query for this record, e.g. "place=grlja". */
  exploreQuery: string;
  /** Shown instead of coordinates, e.g. "At Hotel ROSI". */
  hostNote?: string;
};

/** Where it is: coordinates with their status and precision, or a clear "not yet verified". */
export function LocationBox({ lang, t, location, exploreQuery, hostNote }: Props) {
  return (
    <section className={styles.box} aria-labelledby="location-title">
      <h2 id="location-title" className={styles.title}>
        {t.place.location}
      </h2>
      {hostNote && <p className={styles.text}>{hostNote}</p>}
      {location ? (
        <>
          <p className={styles.coords}>
            <span className="visually-hidden">{t.place.coordinates}: </span>
            {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
          </p>
          <p className={styles.text}>
            {location.status === "self-reported"
              ? t.explore.selfReportedLocation
              : location.precision === "area"
                ? t.explore.locationArea
                : t.explore.locationPoint}
            {" · "}
            {t.verification.status[location.status]}
          </p>
          <div className={ui.actions}>
            <Link href={`${href(lang, "/explore")}?view=map&${exploreQuery}`} className={ui.buttonSmall}>
              {t.common.showOnMap}
            </Link>
            <Link href={`${href(lang, "/explore")}?${exploreQuery}`} className={ui.buttonSmall}>
              {t.common.showIn3D}
            </Link>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className={ui.buttonSmall}
            >
              {t.common.directions}
            </a>
            <a
              href={`https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}#map=${location.precision === "area" ? 14 : 16}/${location.lat}/${location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className={ui.buttonSmall}
            >
              {t.place.openStreetMap}
            </a>
          </div>
        </>
      ) : (
        <p className={styles.text}>{t.place.noLocation}</p>
      )}
    </section>
  );
}
