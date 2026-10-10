"use client";

import { useState } from "react";

import { Photo } from "@/components/ui/Photo";
import { PhotoCredit } from "@/components/ui/PhotoCredit";
import { cx } from "@/lib/cx";

import { gallery, galleryFilters, type GalleryKey } from "./content";
import styles from "./sections.module.css";

const LABELS: Record<GalleryKey, string> = { katun: "Eko Katun", hotel: "Hotel", valley: "The valley" };

export function Gallery() {
  const [filter, setFilter] = useState<GalleryKey | "all">("all");
  const shown = gallery.filter((item) => filter === "all" || item.category === filter);

  return (
    <>
      <div className={styles.galleryChips} role="group" aria-label="Filter the gallery">
        {galleryFilters.map((chip) => (
          <button
            key={chip.key}
            type="button"
            className={cx(styles.galleryChip, filter === chip.key && styles.galleryChipOn)}
            aria-pressed={filter === chip.key}
            onClick={() => setFilter(chip.key)}
          >
            {chip.label}
          </button>
        ))}
      </div>
      <div className={styles.galleryGrid}>
        {shown.map((item) => (
          <figure key={item.image.src} className={styles.galleryItem}>
            <div style={{ aspectRatio: item.ratio }}>
              <Photo
                src={item.image.srcSmall ?? item.image.src}
                alt={item.image.alt}
                position={item.image.position}
                sizes="(max-width: 600px) 50vw, (max-width: 1100px) 33vw, 300px"
              />
            </div>
            <figcaption className={styles.galleryCaption}>{LABELS[item.category]}</figcaption>
          </figure>
        ))}
      </div>
      <div className={styles.galleryCredits}>
        {shown
          .filter((item) => item.image.credit)
          .map((item) => (
            <PhotoCredit key={item.image.src} credit={item.image.credit} tone="dark" />
          ))}
      </div>
    </>
  );
}
