import { MAP_ICONS, type MapIcon } from "@/components/map/icons";
import { ridgePath, seed } from "@/lib/ridge";

import styles from "./ArtTile.module.css";

export type ArtTone = "water" | "forest" | "stone" | "gold" | "dusk" | "clay";

const TONES: Record<ArtTone, { sky: [string, string]; far: string; near: string; ink: string }> = {
  water: { sky: ["#dcebef", "#a9cbd6"], far: "#7fa7b6", near: "#4f7f90", ink: "#1f5566" },
  forest: { sky: ["#e3ecd9", "#b9cfa9"], far: "#8aa77f", near: "#5c7f5a", ink: "#2f5631" },
  stone: { sky: ["#ece7dd", "#cfc6b6"], far: "#a99f8e", near: "#7d7566", ink: "#4c463a" },
  gold: { sky: ["#f6ecd6", "#e4c995"], far: "#c9a268", near: "#a27a40", ink: "#6d4d1f" },
  dusk: { sky: ["#e6e1ee", "#bdb4d2"], far: "#928ab0", near: "#655e86", ink: "#3d375c" },
  clay: { sky: ["#f5e3d8", "#e0b7a0"], far: "#c48f74", near: "#9a6248", ink: "#5f3423" },
};

type Props = {
  icon: MapIcon;
  tone: ArtTone;
  /** A short line under the icon (a type or a length — never the card's own title). */
  label?: string;
  /** Picks this tile's slice of the skyline, so tiles differ. */
  id: string;
};

/**
 * The picture for a record that has no photo: its icon in a medallion over a
 * slice of the real skyline around Vusanje, in the colour of its kind.
 */
export function ArtTile({ icon, tone, label, id }: Props) {
  const c = TONES[tone];
  const s = seed(id);
  const gid = `art-${id.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <div className={styles.tile} aria-hidden="true">
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className={styles.scene}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c.sky[0]} />
            <stop offset="1" stopColor={c.sky[1]} />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill={`url(#${gid})`} />
        {/* Contour lines in the sky. */}
        <g fill="none" stroke={c.ink} strokeOpacity="0.1" strokeWidth="1">
          <path d="M-20 60c60-30 100-30 160 0s100 30 160 0 100-30 160 0" />
          <path d="M-20 100c60-22 100-22 160 0s100 22 160 0 100-22 160 0" />
          <path d="M-20 140c60-26 100-26 160 0s100 26 160 0 100-26 160 0" />
        </g>
        <g transform="translate(0 150)">
          <path d={ridgePath(0, s * 0.6, 0.38, 400, 150, 30)} fill={c.far} opacity="0.75" />
          <path d={ridgePath(2, s * 0.55, 0.42, 400, 150, 78)} fill={c.near} />
        </g>
      </svg>
      <div className={styles.badge} style={{ color: c.ink }}>
        <span className={styles.medallion}>
          <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d={MAP_ICONS[icon]} />
          </svg>
        </span>
        {label && <span className={styles.label}>{label}</span>}
      </div>
    </div>
  );
}
