import { MAP_ICONS, type MapIcon } from "@/components/map/icons";
import { cx } from "@/lib/cx";
import type { StampHow } from "@/lib/passport";

import styles from "./Hunt.module.css";

type Props = {
  icon: MapIcon;
  /** On site: gold. By hand: slate. */
  how: StampHow;
  /** A short line inside the stamp (a date, a name). */
  label?: string;
  size?: number;
  className?: string;
};

/** A round rubber stamp with the place's icon: the mark of a treasure found. */
export function Stamp({ icon, how, label, size = 96, className }: Props) {
  const color = how === "here" ? "#a8773a" : "#56696a";
  return (
    <svg className={cx(styles.stamp, className)} width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{ color }}>
      <g transform="rotate(-9 50 50)">
        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2.6" strokeDasharray="4 2.6" />
        <circle cx="50" cy="50" r="38" fill="currentColor" opacity="0.08" />
        <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <g transform={`translate(${50 - 13} ${label ? 24 : 37}) scale(${26 / 24})`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d={MAP_ICONS[icon] ?? MAP_ICONS.info} />
        </g>
        {label && (
          <text x="50" y="66" textAnchor="middle" fontSize="8.5" fontWeight="700" fontFamily="var(--font-text), system-ui, sans-serif" letterSpacing="0.6" fill="currentColor">
            {label.toUpperCase()}
          </text>
        )}
      </g>
    </svg>
  );
}

/** An empty slot in the passport: a treasure still to find. */
export function StampSlot({ size = 96, className }: { size?: number; className?: string }) {
  return (
    <svg className={cx(styles.slot, className)} width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1.8" strokeDasharray="3 4" />
      <text x="50" y="60" textAnchor="middle" fontSize="30" fontWeight="700" fontFamily="var(--font-display), serif" fill="currentColor" opacity="0.6">
        ?
      </text>
    </svg>
  );
}
