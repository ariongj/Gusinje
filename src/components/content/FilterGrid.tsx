"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import { InfoPanel } from "@/components/explore/InfoPanel";
import { LeafletMap, type MapFocus } from "@/components/explore/LeafletMap";
import type { ExploreItem } from "@/components/explore/types";
import { useI18n } from "@/i18n/client";
import { plural } from "@/i18n/localize";
import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import styles from "./FilterGrid.module.css";

export type Facet = { key: string; label: string; allLabel: string; options: { value: string; label: string }[] };

export type Entry = { id: string; facets: Record<string, string[]>; node: ReactNode; mapItem?: ExploreItem };

type Props = {
  facets: Facet[];
  entries: Entry[];
  empty: ReactNode;
  /** Offer a map of the filtered entries. */
  withMap?: boolean;
};

/** Cards with type/area filters (kept in the URL) and an optional map of the same results. */
export function FilterGrid({ facets, entries, empty, withMap = false }: Props) {
  const { lang, t } = useI18n();
  const [values, setValues] = useState<Record<string, string>>({});
  const [view, setView] = useState<"list" | "map">("list");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [focus, setFocus] = useState<MapFocus>({ key: null, nonce: 0 });

  // Filters come from and go back to the URL, so a filtered list can be shared.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initial: Record<string, string> = {};
    for (const f of facets) {
      const v = params.get(f.key);
      if (v && f.options.some((o) => o.value === v)) initial[f.key] = v;
    }
    // A static export can't read the query string while rendering: apply it after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValues(initial);
    if (withMap && params.get("view") === "map") setView("map");
    // Run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(values)) if (v) params.set(k, v);
    if (view === "map") params.set("view", "map");
    const search = params.toString();
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${search ? `?${search}` : ""}`);
  }, [values, view]);

  const visible = useMemo(
    () => entries.filter((e) => Object.entries(values).every(([k, v]) => !v || (e.facets[k] ?? []).includes(v))),
    [entries, values],
  );
  const mapItems = useMemo(() => visible.flatMap((e) => (e.mapItem ? [e.mapItem] : [])), [visible]);
  const unlocated = mapItems.filter((i) => !i.location).length;
  const active = Object.values(values).some(Boolean);
  const selected = selectedKey ? mapItems.find((i) => i.key === selectedKey) : undefined;

  return (
    <div className={styles.wrap}>
      <div className={styles.bar}>
        {facets.map((f) => (
          <label key={f.key} className={styles.select}>
            <span className={styles.selectLabel}>{f.label}</span>
            <select
              className={ui.input}
              value={values[f.key] ?? ""}
              onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
              data-facet={f.key}
            >
              <option value="">{f.allLabel}</option>
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        ))}
        {active && (
          <button type="button" className={ui.buttonSmall} onClick={() => setValues({})}>
            {t.common.clearFilters}
          </button>
        )}
        {withMap && (
          <div className={styles.views} role="group" aria-label={t.explore.viewsLabel}>
            {(["list", "map"] as const).map((v) => (
              <button key={v} type="button" className={cx(styles.viewButton, view === v && styles.viewActive)} aria-pressed={view === v} onClick={() => setView(v)}>
                {t.explore.views[v]}
              </button>
            ))}
          </div>
        )}
      </div>
      <p className={styles.count} role="status" aria-live="polite">
        {plural(lang, visible.length, t.common.results)}
        {view === "map" && unlocated > 0 && <> · {plural(lang, unlocated, t.explore.notOnMap)}</>}
      </p>

      {view === "map" ? (
        <div className={styles.mapLayout}>
          <div className={styles.map}>
            <LeafletMap
              items={mapItems}
              selectedKey={selectedKey}
              onSelect={(key) => {
                setSelectedKey(key);
                setFocus((f) => ({ key, nonce: f.nonce + 1 }));
              }}
              focus={focus}
            />
          </div>
          {selected && <InfoPanel item={selected} view="map" webgl={false} onClose={() => setSelectedKey(null)} onShowIn={() => undefined} />}
        </div>
      ) : visible.length ? (
        <div className={ui.cards}>
          {visible.map((e) => (
            <div key={e.id} className={styles.cell}>
              {e.node}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>{empty}</div>
      )}
    </div>
  );
}
