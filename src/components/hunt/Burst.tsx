import type { CSSProperties } from "react";

import styles from "./Hunt.module.css";

/** A burst of gold sparks (decorative, once, on a stamp or a finished hunt). */
export function Burst({ n = 10 }: { n?: number }) {
  return (
    <span className={styles.burst} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <i key={i} style={{ "--a": `${Math.round((360 / n) * i)}deg` } as CSSProperties} />
      ))}
    </span>
  );
}
