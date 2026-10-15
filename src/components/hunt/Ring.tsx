import styles from "./Hunt.module.css";

/** A progress ring: found out of total, with the number in the middle. */
export function Ring({ found, total, size = 120, label }: { found: number; total: number; size?: number; label: string }) {
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const ratio = total ? found / total : 0;
  return (
    <svg className={styles.ring} width={size} height={size} viewBox="0 0 140 140" role="img" aria-label={label}>
      <circle cx="70" cy="70" r={r} fill="none" stroke="currentColor" strokeWidth="9" opacity="0.14" />
      <circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke="var(--gold)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={`${circumference * ratio} ${circumference}`}
        transform="rotate(-90 70 70)"
        className={styles.ringFill}
      />
      <text x="70" y="66" textAnchor="middle" fontSize="30" fontWeight="500" fontFamily="var(--font-display), serif" fill="currentColor">
        {found}
      </text>
      <text x="70" y="88" textAnchor="middle" fontSize="12" fontWeight="600" fontFamily="var(--font-text), system-ui" fill="currentColor" opacity="0.7">
        / {total}
      </text>
    </svg>
  );
}
