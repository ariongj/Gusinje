"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { useI18n } from "@/i18n/client";
import { fill, fold, plural } from "@/i18n/localize";
import type { SearchDoc } from "@/lib/search-index";
import ui from "@/styles/ui.module.css";

import styles from "./SearchPage.module.css";

/** Score a document: every word must match; names count more than body text. */
function score(doc: SearchDoc, words: string[]): number {
  let total = 0;
  for (const w of words) {
    if (doc.names.startsWith(w) || doc.names.includes(` ${w}`)) total += 6;
    else if (doc.names.includes(w)) total += 4;
    else if (doc.text.includes(w)) total += 1;
    else return 0;
  }
  return total;
}

export function SearchPage({ docs }: { docs: SearchDoc[] }) {
  const { lang, t } = useI18n();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    // A static export can't read the query string while rendering: apply it after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (q) setQuery(q.slice(0, 80));
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const url = query ? `${window.location.pathname}?q=${encodeURIComponent(query)}` : window.location.pathname;
    window.history.replaceState(window.history.state, "", url);
  }, [query]);

  const results = useMemo(() => {
    const words = fold(query).split(" ").filter((w) => w.length > 1);
    if (!words.length) return [];
    return docs
      .map((d) => ({ d, s: score(d, words) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.d);
  }, [docs, query]);

  return (
    <div className={styles.wrap}>
      <form role="search" className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="site-search" className={ui.label}>
          {t.search.label}
        </label>
        <input
          ref={inputRef}
          id="site-search"
          type="search"
          className={`${ui.input} ${styles.input}`}
          placeholder={t.search.placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          aria-describedby="search-hint"
        />
        <p id="search-hint" className={ui.hint}>
          {t.search.hint}
        </p>
      </form>
      <p className={styles.count} role="status" aria-live="polite">
        {query.trim().length > 1 ? (results.length ? plural(lang, results.length, t.common.results) : fill(t.search.none, { q: query })) : ""}
      </p>
      <ul className={styles.results}>
        {results.map((d) => (
          <li key={d.key} className={styles.result}>
            <p className={styles.kind}>{d.kindLabel}</p>
            <Link href={d.href} className={styles.title}>
              {d.title}
            </Link>
            <p className={styles.summary}>{d.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
