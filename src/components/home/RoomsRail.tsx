"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Photo } from "@/components/ui/Photo";
import { getProperty } from "@/lib/stay/properties";
import { units } from "@/lib/stay/units";

import styles from "./sections.module.css";

/** Swipeable row of every room and bungalow type, with arrow buttons for mouse users. */
export function RoomsRail() {
  const railRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const update = () =>
      setEdges({
        start: rail.scrollLeft < 8,
        end: rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 8,
      });
    update();
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      rail.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function step(direction: 1 | -1) {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector("li");
    const distance = card ? card.getBoundingClientRect().width + 20 : rail.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollBy({ left: direction * distance, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <div className={styles.rail}>
      <ul ref={railRef} className={styles.railTrack} aria-label="Rooms and bungalows">
        {units.map((room) => (
          <li key={room.id} className={styles.railItem}>
            {/* Named by its heading alone; the photo is decorative beside it. */}
            <Link href={`/rooms#${room.id}`} className={styles.roomCard} aria-labelledby={`rail-${room.id}`}>
              <div className={styles.roomPhoto}>
                {room.photo ? (
                  <Photo
                    src={room.photo.srcSmall ?? room.photo.src}
                    alt=""
                    position={room.photo.position}
                    sizes="(max-width: 700px) 80vw, 360px"
                  />
                ) : (
                  <span className={styles.roomNoPhoto}>Photos coming soon</span>
                )}
                <span className={styles.roomPrice}>
                  {room.sleeps ? <>Sleeps <strong>{room.sleeps}</strong></> : <strong>Bring your tent</strong>}
                </span>
                <span className={styles.roomBadge}>{getProperty(room.property).shortName}</span>
              </div>
              <div className={styles.roomBody}>
                <span className={styles.roomCategory}>{room.kind === "camping" ? "Camping" : room.kind === "bungalow" ? "Bungalow" : "Room"} · {getProperty(room.property).place}</span>
                <h3 id={`rail-${room.id}`} className={styles.roomName}>
                  {room.name}
                </h3>
                <p className={styles.roomSummary}>{[room.size ? `${room.size} m²` : null, room.beds].filter(Boolean).join(" · ")}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className={styles.railNav}>
        <button
          type="button"
          className={styles.railButton}
          onClick={() => step(-1)}
          disabled={edges.start}
          aria-label="Previous rooms"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M11 3.5 5.5 9l5.5 5.5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </svg>
        </button>
        <button
          type="button"
          className={styles.railButton}
          onClick={() => step(1)}
          disabled={edges.end}
          aria-label="More rooms"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M7 3.5 12.5 9 7 14.5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
