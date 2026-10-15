"use client";

import { cx } from "@/lib/cx";
import { usePassport } from "@/lib/passport";

import styles from "./Hunt.module.css";

/** A point on a cubic Bézier curve. */
function bez(t: number, p: [number, number][]) {
  const u = 1 - t;
  const x = u ** 3 * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t ** 3 * p[3][0];
  const y = u ** 3 * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t ** 3 * p[3][1];
  return [x, y] as const;
}

const CURVE: [number, number][] = [
  [22, 104],
  [110, 10],
  [180, 150],
  [292, 44],
];

/** A treasure-map sketch of a hunt: a dotted route with an X for each clue, gold once found. */
export function HuntSketch({ places, className }: { places: readonly string[]; className?: string }) {
  const passport = usePassport();
  const n = places.length;
  const marks = places.map((slug, i) => ({ slug, found: !!passport.stamps[slug], at: bez(n === 1 ? 0.5 : i / (n - 1), CURVE) }));
  const path = `M${CURVE[0][0]} ${CURVE[0][1]} C${CURVE[1][0]} ${CURVE[1][1]}, ${CURVE[2][0]} ${CURVE[2][1]}, ${CURVE[3][0]} ${CURVE[3][1]}`;
  return (
    <svg className={cx(styles.sketch, className)} viewBox="0 0 320 150" aria-hidden="true">
      <defs>
        <pattern id="sketch-contours" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M0 30c15-12 30-12 45 0s30 12 45 0M0 52c15-12 30-12 45 0s30 12 45 0M0 8c15-12 30-12 45 0s30 12 45 0" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.18" />
        </pattern>
      </defs>
      <rect width="320" height="150" rx="14" fill="url(#sketch-contours)" />
      <path d={path} fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 5" strokeLinecap="round" opacity="0.7" />
      {marks.map((m, i) => (
        <g key={m.slug} className={cx(styles.mark, m.found && styles.markFound)} style={{ transformOrigin: `${m.at[0]}px ${m.at[1]}px`, animationDelay: `${i * 90}ms` }}>
          {m.found && <circle cx={m.at[0]} cy={m.at[1]} r="11" fill="var(--gold)" opacity="0.25" />}
          <path d={`M${m.at[0] - 6} ${m.at[1] - 6}l12 12M${m.at[0] + 6} ${m.at[1] - 6}l-12 12`} stroke={m.found ? "var(--gold-hover)" : "currentColor"} strokeWidth={m.found ? 3.2 : 2.4} strokeLinecap="round" />
        </g>
      ))}
      {/* A compass rose in the corner. */}
      <g transform="translate(292 118)" opacity="0.7">
        <circle r="13" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M0-11l3 8-3-2-3 2z" fill="var(--kilim, #b03a2e)" />
        <path d="M0 11l-3-8 3 2 3-2z" fill="currentColor" opacity="0.5" />
        <text y="-16" textAnchor="middle" fontSize="7" fontWeight="700" fill="currentColor">
          N
        </text>
      </g>
    </svg>
  );
}
