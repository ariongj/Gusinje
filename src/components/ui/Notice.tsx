import type { ReactNode } from "react";

import { cx } from "@/lib/cx";

import styles from "./Notice.module.css";

type Props = {
  tone?: "info" | "warning" | "preview" | "safety";
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** role="note" by default; "status" for messages that appear after an action. */
  role?: "note" | "status" | "alert";
};

/** A boxed note: information, a warning, a safety message or a preview/demo label. */
export function Notice({ tone = "info", title, children, className, role = "note" }: Props) {
  return (
    <div className={cx(styles.notice, styles[tone], className)} role={role}>
      <span className={styles.icon} aria-hidden="true">
        {tone === "warning" || tone === "safety" ? "!" : tone === "preview" ? "◐" : "i"}
      </span>
      <div className={styles.body}>
        {title && <p className={styles.title}>{title}</p>}
        {children && <div className={styles.text}>{children}</div>}
      </div>
    </div>
  );
}
