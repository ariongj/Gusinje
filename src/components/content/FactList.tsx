import type { ReactNode } from "react";

import styles from "./FactList.module.css";

export type Fact = { label: string; value?: ReactNode; note?: ReactNode };

/** Label/value pairs. A missing value says "not yet verified" rather than leaving a gap or a guess. */
export function FactList({ facts, missing }: { facts: Fact[]; missing: string }) {
  return (
    <dl className={styles.list}>
      {facts.map((fact) => (
        <div key={fact.label} className={styles.row}>
          <dt className={styles.label}>{fact.label}</dt>
          <dd className={styles.value}>
            {fact.value ?? <span className={styles.missing}>{missing}</span>}
            {fact.note && <span className={styles.note}>{fact.note}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
