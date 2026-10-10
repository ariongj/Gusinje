import type { ReactNode } from "react";

import styles from "./StickyBar.module.css";

/*
 * Content pieces for <StickyBar>. Kept out of the "use client" module so
 * Server Components can use them too.
 */

/** Text in the bar; wrap the price part in <em>. */
export function StickyLabel({ children }: { children: ReactNode }) {
  return <div className={styles.label}>{children}</div>;
}

/** Gold call to action, e.g. <StickyAction href="#book">Check availability</StickyAction>. */
export function StickyAction({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className={styles.action}>
      {children}
    </a>
  );
}
