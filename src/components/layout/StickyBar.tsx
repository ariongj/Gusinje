"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cx } from "@/lib/cx";

import styles from "./StickyBar.module.css";
import { useNavSolid } from "./useNavSolid";

type StickyBarProps = {
  children: ReactNode;
  /** "center": label and button side by side, centred. "split": label left, button right. */
  layout?: "center" | "split";
};

/**
 * Bottom "reserve" bar — slides in once the visitor has scrolled past the
 * hero (same trigger as the solid nav). Renders a spacer so the bar never
 * covers the end of the footer.
 */
export function StickyBar({ children, layout = "center" }: StickyBarProps) {
  const show = useNavSolid();
  const barRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar || typeof ResizeObserver === "undefined") return;
    // The bar floats 12px above the edge; leave room for that too.
    const ro = new ResizeObserver(() => setHeight(bar.offsetHeight + 24));
    ro.observe(bar);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      <div className={styles.spacer} style={{ height }} aria-hidden="true" />
      <div
        ref={barRef}
        className={cx(styles.bar, layout === "split" && styles.split, show && styles.show)}
        aria-hidden={!show}
        inert={!show}
      >
        {children}
      </div>
    </>
  );
}
