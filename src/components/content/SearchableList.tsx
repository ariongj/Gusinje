"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import { useI18n } from "@/i18n/client";
import { fill, fold, plural } from "@/i18n/localize";
import ui from "@/styles/ui.module.css";

import styles from "./SearchableList.module.css";

export type SearchEntry = { id: string; text: string; node: ReactNode };

/** A grid of server-rendered cards with an accent-insensitive text filter (kept in ?q=). */
export function SearchableList({ entries, label, placeholder, noResults }: { entries: SearchEntry[]; label: string; placeholder: string; noResults: string }) {
  const { lang, t } = useI18n();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    // A static export can't read the query string while rendering: apply it after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (q) setQuery(q.slice(0, 80));
  }, []);

  useEffect(() => {
    const url = query ? `${window.location.pathname}?q=${encodeURIComponent(query)}` : window.location.pathname;
    window.history.replaceState(window.history.state, "", url);
  }, [query]);

  const visible = useMemo(() => {
    const words = fold(query).split(" ").filter(Boolean);
    return words.length ? entries.filter((e) => words.every((w) => e.text.includes(w))) : entries;
  }, [entries, query]);

  return (
    <div className={styles.wrap}>
      <label className={styles.field}>
        <span className={ui.label}>{label}</span>
        <input type="search" className={ui.input} placeholder={placeholder} value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <p className={styles.count} role="status" aria-live="polite">
        {plural(lang, visible.length, t.common.results)}
      </p>
      {visible.length ? (
        <div className={ui.cards}>
          {visible.map((e) => (
            <div key={e.id} className={styles.cell}>
              {e.node}
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.empty}>{fill(noResults, { q: query })}</p>
      )}
    </div>
  );
}
