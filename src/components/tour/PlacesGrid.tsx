import Link from "next/link";

import { pois, type PoiId } from "@/components/resort3d/pois";
import { Photo } from "@/components/ui/Photo";
import { PhotoCredit } from "@/components/ui/PhotoCredit";
import ui from "@/styles/ui.module.css";

import styles from "./PlacesGrid.module.css";

type PlacesGridProps = {
  /** Flies the map to the place and scrolls back up to it. */
  onShow: (id: PoiId) => void;
};

/** Every place on the map as a card — and the way in without WebGL. */
export function PlacesGrid({ onShow }: PlacesGridProps) {
  return (
    <section id="places" className={styles.section}>
      <div className={ui.container}>
        <div className={styles.head} data-reveal="up">
          <div>
            <div className={ui.eyebrow}>On the map</div>
            <h2 className={styles.title}>
              Ten places, <em>one valley</em>
            </h2>
          </div>
          <p className={styles.hint}>Choose a place to fly to it on the map above.</p>
        </div>
        <ul className={styles.grid}>
          {pois.map((poi, i) => (
            <li key={poi.id} data-reveal="up" data-delay={i % 4 > 0 ? String((i % 4) * 70) : undefined}>
              <div className={styles.card}>
                <div className={styles.thumb}>
                  <Photo
                    src={poi.photo.srcSmall ?? poi.photo.src}
                    alt={poi.photo.alt}
                    position={poi.photo.position}
                    sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 340px"
                  />
                </div>
                <div className={styles.body}>
                  <div className={styles.num}>{poi.kind}</div>
                  <h3 className={styles.name}>{poi.name}</h3>
                  <p className={styles.text}>{poi.blurb}</p>
                  <button
                    type="button"
                    className={styles.enter}
                    aria-label={`Show ${poi.name} on the map`}
                    onClick={() => onShow(poi.id)}
                  >
                    Show on the map
                    <span className={styles.enterArrow} aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 14 14">
                        <path
                          d="M7 12V2M3 6l4-4 4 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </svg>
                    </span>
                  </button>
                  {/* Above the button's card-wide hit area, so the links stay clickable. */}
                  <div className={styles.extra}>
                    <Link href={poi.link.href} className={styles.more}>
                      {poi.link.label}
                    </Link>
                    {poi.photo.credit && <PhotoCredit credit={poi.photo.credit} tone="dark" />}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
