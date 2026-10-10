import Link from "next/link";

import { recordPath } from "@/content";
import type { Place } from "@/content/types";
import { skyline } from "@/content/skyline";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/config";
import { loc } from "@/i18n/localize";
import type { Messages } from "@/i18n/messages/en";

import styles from "./Ridgeline.module.css";

const W = 1000;
const H = 100;

function bearing(from: { lat: number; lng: number }, to: { lat: number; lng: number }): number {
  const r = Math.PI / 180;
  const dl = (to.lng - from.lng) * r;
  const y = Math.sin(dl) * Math.cos(to.lat * r);
  const x = Math.cos(from.lat * r) * Math.sin(to.lat * r) - Math.sin(from.lat * r) * Math.cos(to.lat * r) * Math.cos(dl);
  return ((Math.atan2(y, x) / r) + 360) % 360;
}

type Props = {
  centre: Place;
  /** Places to name on the drawing: peaks sit on the crest, valleys in their gap. */
  labels: Place[];
  lang: Locale;
  t: Messages;
};

/**
 * The real ring of peaks around Vusanje (scripts/skyline.mjs): the crest
 * behind, nearer ridges in front, the nearest filled with the page colour so
 * the hero photo ends in the mountains' own outline. Named places link to
 * their pages.
 */
export function Ridgeline({ centre, labels, lang, t }: Props) {
  const [az0, az1] = skyline.azimuth;
  const crest = skyline.layers[0];
  const near = skyline.layers[skyline.layers.length - 1];
  const low = Math.min(...near) - 60;
  const high = Math.max(...crest) + 30;
  const y = (h: number) => H - ((h - low) / (high - low)) * H;
  const x = (i: number, n: number) => (i / (n - 1)) * W;
  const at = (layer: readonly number[], az: number) => layer[Math.round(((az - az0) / (az1 - az0)) * (layer.length - 1))];
  const path = (layer: readonly number[]) =>
    `M0,${H} ` + layer.map((h, i) => `L${x(i, layer.length).toFixed(1)},${y(h).toFixed(2)}`).join(" ") + ` L${W},${H} Z`;
  const line = (layer: readonly number[]) => "M" + layer.map((h, i) => `${x(i, layer.length).toFixed(1)},${y(h).toFixed(2)}`).join(" L");

  const named = labels.flatMap((place) => {
    if (!place.location || !centre.location) return [];
    const az = bearing(centre.location, place.location);
    if (az < az0 || az > az1) return [];
    const valley = place.location.precision === "area";
    const h = valley ? at(near, az) + 40 : at(crest, az);
    return [{ place, left: ((az - az0) / (az1 - az0)) * 100, bottom: ((h - low) / (high - low)) * 100, valley }];
  });

  const ticks = [135, 180, 225].map((az, i) => ({ az, label: t.home.compass[i] }));

  return (
    <figure className={styles.ridge}>
      <div className={styles.art}>
        <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
          {skyline.layers.map((layer, i) => (
            <path key={i} d={path(layer)} className={styles[`layer${i}`]} />
          ))}
          <path d={line(crest)} className={styles.crest} vectorEffect="non-scaling-stroke" />
        </svg>
        <ul className={styles.labels}>
          {named.map(({ place, left, bottom, valley }) => (
            <li key={place.slug} className={valley ? styles.valley : styles.peak} style={{ left: `${left}%`, bottom: `${bottom}%` }}>
              <Link href={href(lang, recordPath("place", place.slug))} className={styles.label} prefetch={false}>
                {loc(place.name, lang)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.compass} aria-hidden="true">
        {ticks.map(({ az, label }) => (
          <span key={az} style={{ left: `${((az - az0) / (az1 - az0)) * 100}%` }}>
            {label}
          </span>
        ))}
      </div>
      <figcaption className={styles.caption}>{t.home.ridgeCaption}</figcaption>
    </figure>
  );
}
