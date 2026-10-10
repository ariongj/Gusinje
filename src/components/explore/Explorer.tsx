"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { TripButton } from "@/components/content/TripButton";
import type { ViewId } from "@/components/resort3d/resortEngine";
import { ResortMap, type SceneFocus } from "@/components/resort3d/ResortMap";
import { GuideCard, type GuideCardStop } from "@/components/tour/GuideCard";
import { useGuidedTour } from "@/components/tour/useGuidedTour";
import { useI18n } from "@/i18n/client";
import { fill, fold, plural } from "@/i18n/localize";
import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import styles from "./Explorer.module.css";
import { InfoPanel } from "./InfoPanel";
import { LeafletMap, type MapFocus } from "./LeafletMap";
import { groupColor, legendGroups, type ExploreItem, type LegendGroup } from "./types";

export type ExploreView = "3d" | "map" | "list";

export type ExploreTourStop = GuideCardStop & { view: ViewId; key?: string };

export type ExploreTour = { slug: string; title: string; intro: string; textHref: string; stops: ExploreTourStop[] };

type Props = {
  items: ExploreItem[];
  tours: ExploreTour[];
};

/** Cheap WebGL probe, without loading three.js. */
function webglSupported(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Data saver on, a very slow connection or a low-memory phone: start with the
 * map rather than downloading the 3D engine. Visitors can still switch.
 */
function preferLightweight(): boolean {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string }; deviceMemory?: number };
  if (nav.connection?.saveData) return true;
  if (nav.connection?.effectiveType?.endsWith("2g")) return true;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 1) return true;
  return window.matchMedia?.("(prefers-reduced-data: reduce)").matches ?? false;
}

const VIEWS: ExploreView[] = ["3d", "map", "list"];

export function Explorer({ items, tours }: Props) {
  const { lang, t } = useI18n();
  const [view, setView] = useState<ExploreView>("3d");
  const [webgl, setWebgl] = useState<"unknown" | "ok" | "no">("unknown");
  const [mounted3d, setMounted3d] = useState(false);
  const [mountedMap, setMountedMap] = useState(false);
  const [groups, setGroups] = useState<Set<LegendGroup>>(() => new Set(legendGroups));
  const [query, setQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [sceneFocus, setSceneFocus] = useState<SceneFocus>({ id: "overview", nonce: 0 });
  const [mapFocus, setMapFocus] = useState<MapFocus>({ key: null, nonce: 0 });
  const [notice, setNotice] = useState<string | null>(null);
  const [tour, setTour] = useState<{ data: ExploreTour; phase: "intro" | "running" } | null>(null);
  const [ready, setReady] = useState(false);
  const [announce, setAnnounce] = useState("");
  /** The visitor has picked something (as opposed to a deep link on load). */
  const [picked, setPicked] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const tourButtonRef = useRef<HTMLButtonElement>(null);
  const viewRef = useRef(view);
  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  const byKey = useMemo(() => new Map(items.map((i) => [i.key, i])), [items]);

  const matchesQuery = useCallback(
    (item: ExploreItem) => {
      const q = fold(query);
      return !q || item.search.includes(q);
    },
    [query],
  );

  const filtered = useMemo(() => items.filter((i) => groups.has(i.group) && matchesQuery(i)), [items, groups, matchesQuery]);
  const counts = useMemo(() => {
    const c = Object.fromEntries(legendGroups.map((g) => [g, 0])) as Record<LegendGroup, number>;
    for (const i of items) if (matchesQuery(i)) c[i.group] += 1;
    return c;
  }, [items, matchesQuery]);

  const pins = useMemo(
    () => filtered.filter((i) => i.scene).map((i) => ({ key: i.key, anchor: i.scene!, name: i.name, group: i.group })),
    [filtered],
  );
  const notIn3d = filtered.filter((i) => !i.scene).length;
  const notOnMap = filtered.filter((i) => !i.location).length;

  /* ------------------------------------------------------------ selection */

  const focusItem = useCallback((item: ExploreItem | undefined, inView: ExploreView) => {
    if (inView === "3d") setSceneFocus((f) => ({ id: item?.scene ?? "overview", nonce: f.nonce + 1 }));
    if (inView === "map") setMapFocus((f) => ({ key: item?.location ? (item.hostKey ?? item.key) : null, nonce: f.nonce + 1 }));
  }, []);

  const select = useCallback(
    (key: string | null) => {
      setSelectedKey(key);
      setPicked(true);
      const item = key ? byKey.get(key) : undefined;
      if (item) {
        focusItem(item, viewRef.current);
        setAnnounce(fill(t.explore.panelLabel, { name: item.name }));
      }
    },
    [byKey, focusItem, t],
  );

  const switchView = useCallback(
    (next: ExploreView) => {
      if (next === "3d" && webgl === "no") return;
      setView(next);
      setNotice(null);
      if (next === "3d") setMounted3d(true);
      if (next === "map") setMountedMap(true);
      const item = selectedKey ? byKey.get(selectedKey) : undefined;
      // Fly to the selection in the new view once it is showing.
      window.setTimeout(() => focusItem(item, next), 30);
      setAnnounce(`${t.explore.viewsLabel}: ${t.explore.views[next]}`);
    },
    [webgl, selectedKey, byKey, focusItem, t],
  );

  /* ---------------------------------------------------------------- tours */

  const onGuideStop = useCallback(
    (stop: ExploreTourStop) => {
      setSelectedKey(stop.key ?? null);
      const item = stop.key ? byKey.get(stop.key) : undefined;
      if (viewRef.current === "3d") setSceneFocus((f) => ({ id: stop.view, nonce: f.nonce + 1 }));
      else setMapFocus((f) => ({ key: item?.location ? item.key : null, nonce: f.nonce + 1 }));
    },
    [byKey],
  );

  const tourStops = useMemo(() => tour?.data.stops ?? [], [tour]);
  const guide = useGuidedTour(tourStops, onGuideStop, lang);
  const touring = guide.active;

  const chooseTour = useCallback(
    (slug: string) => {
      const data = tours.find((x) => x.slug === slug);
      if (!data) return;
      guide.exit();
      setGroups(new Set(legendGroups));
      setQuery("");
      setSelectedKey(null);
      if (viewRef.current === "list") switchView(webgl === "no" ? "map" : "3d");
      setTour({ data, phase: "intro" });
      stageRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    },
    [tours, guide, switchView, webgl],
  );

  const beginTour = useCallback(() => {
    setTour((x) => (x ? { ...x, phase: "running" } : x));
    guide.start();
  }, [guide]);

  const endTour = useCallback(() => {
    guide.exit();
    setTour(null);
    setSelectedKey(null);
    if (viewRef.current === "3d") setSceneFocus((f) => ({ id: "overview", nonce: f.nonce + 1 }));
    else setMapFocus((f) => ({ key: null, nonce: f.nonce + 1 }));
  }, [guide]);

  // The hook ends itself on the last "Finish" or Escape: tidy up.
  const wasTouring = useRef(false);
  useEffect(() => {
    if (wasTouring.current && !touring && tour?.phase === "running") setTour(null);
    wasTouring.current = touring;
  }, [touring, tour]);

  /* ------------------------------------------------------- initial state */

  useEffect(() => {
    const supported = webglSupported();
    // WebGL support and the query string are only known in the browser, after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWebgl(supported ? "ok" : "no");
    const params = new URLSearchParams(window.location.search);
    let initialView = (params.get("view") as ExploreView) || "3d";
    if (!VIEWS.includes(initialView)) initialView = "3d";
    if (initialView === "3d" && !supported) {
      initialView = "map";
      setNotice(t.explore.switchedToMap);
    } else if (initialView === "3d" && !params.has("view") && preferLightweight()) {
      initialView = "map";
      setNotice(t.explore.savingData);
    }
    setView(initialView);
    if (initialView === "3d") setMounted3d(true);
    if (initialView === "map") setMountedMap(true);

    const g = params.get("groups");
    if (g) {
      const set = new Set(g.split(",").filter((x): x is LegendGroup => (legendGroups as readonly string[]).includes(x)));
      if (set.size) setGroups(set);
    }
    const q = params.get("q");
    if (q) setQuery(q.slice(0, 60));
    const place = params.get("place");
    const listing = params.get("listing");
    const key = place ? `place:${place}` : listing ? `business:${listing}` : null;
    if (key && byKey.has(key)) {
      setSelectedKey(key);
      window.setTimeout(() => focusItem(byKey.get(key), initialView), 60);
    }
    const tourSlug = params.get("tour");
    if (tourSlug) {
      const data = tours.find((x) => x.slug === tourSlug);
      if (data) setTour({ data, phase: "intro" });
    }
    setReady(true);
    // Run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the URL shareable: view, selection, filters, tour.
  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams();
    if (view !== "3d") params.set("view", view);
    if (selectedKey && !touring) {
      const [kind, slug] = selectedKey.split(":");
      params.set(kind === "place" ? "place" : "listing", slug);
    }
    if (groups.size !== legendGroups.length) params.set("groups", [...groups].join(","));
    if (query) params.set("q", query);
    if (tour) params.set("tour", tour.data.slug);
    const search = params.toString();
    const url = `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`;
    window.history.replaceState(window.history.state, "", url);
  }, [ready, view, selectedKey, groups, query, tour, touring]);

  // Escape closes the info panel.
  useEffect(() => {
    if (!selectedKey || touring) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !(e.target instanceof HTMLInputElement)) setSelectedKey(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedKey, touring]);

  const selected = selectedKey ? byKey.get(selectedKey) : undefined;
  const toggleGroup = (g: LegendGroup) =>
    setGroups((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });
  const allOn = groups.size === legendGroups.length;
  const filtersActive = !allOn || !!query;

  return (
    <div className={styles.explorer}>
      {/* --------------------------------------------------------- toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.views} role="group" aria-label={t.explore.viewsLabel}>
          {VIEWS.map((v) => (
            <button
              key={v}
              type="button"
              className={cx(styles.viewButton, view === v && styles.viewActive)}
              aria-pressed={view === v}
              disabled={v === "3d" && webgl === "no"}
              onClick={() => switchView(v)}
              data-view={v}
            >
              {t.explore.views[v]}
            </button>
          ))}
        </div>
        <label className={styles.filter}>
          <span className="visually-hidden">{t.explore.filterLabel}</span>
          <input
            type="search"
            className={styles.filterInput}
            placeholder={t.explore.filterPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </label>
      </div>

      {notice && (
        <p className={styles.notice} role="status">
          {notice}
        </p>
      )}
      {webgl === "no" && !notice && <p className={styles.notice}>{t.explore.webglFailed}</p>}

      <div className={styles.layout}>
        {/* ------------------------------------------------------- stage */}
        <div ref={stageRef} className={cx(styles.stage, view === "list" && styles.stageList, touring && styles.touring)}>
          {mounted3d && webgl === "ok" && (
            <div className={styles.layer} hidden={view !== "3d"}>
              <ResortMap
                focus={sceneFocus}
                touring={touring}
                pins={pins}
                selectedKey={selectedKey}
                onSelect={(key) => {
                  if (touring) guide.pause();
                  select(key);
                }}
                onReset={() => setSelectedKey(null)}
                onFailed={() => {
                  setWebgl("no");
                  setView("map");
                  setMountedMap(true);
                  setNotice(t.explore.switchedToMap);
                }}
              />
              <p className={styles.illustrative}>{t.explore.illustrative}</p>
            </div>
          )}
          {mountedMap && (
            <div className={styles.layer} hidden={view !== "map"}>
              <LeafletMap
                items={filtered}
                selectedKey={selectedKey}
                touring={touring}
                onSelect={(key) => {
                  if (touring) guide.pause();
                  select(key);
                }}
                focus={mapFocus}
              />
              <button
                type="button"
                className={styles.mapReset}
                onClick={() => {
                  setSelectedKey(null);
                  setMapFocus((f) => ({ key: null, nonce: f.nonce + 1 }));
                }}
              >
                {t.explore.resetView}
              </button>
            </div>
          )}

          {view === "list" && <ExploreList items={filtered} selectedKey={selectedKey} onSelect={select} onShow={(key, v) => { select(key); switchView(v); }} webgl={webgl} />}

          {/* Tour introduction: what it is, and that it's not a route. */}
          {tour?.phase === "intro" && view !== "list" && (
            <div className={styles.tourIntro} role="dialog" aria-modal="false" aria-labelledby="tour-intro-title">
              <p className={ui.kicker}>{t.explore.guidedTour}</p>
              <h2 id="tour-intro-title" className={styles.tourIntroTitle}>
                {tour.data.title}
              </h2>
              <p className={styles.tourIntroText}>{tour.data.intro}</p>
              <p className={styles.tourIntroMeta}>{plural(lang, tour.data.stops.length, t.explore.stops)}</p>
              <p className={styles.disclaimer}>{t.explore.tourDisclaimer}</p>
              <div className={ui.actions}>
                <button type="button" className={ui.button} onClick={beginTour} autoFocus>
                  {t.explore.begin}
                </button>
                <button type="button" className={ui.buttonGhost} onClick={() => setTour(null)}>
                  {t.explore.cancel}
                </button>
                <Link href={tour.data.textHref} className={ui.textLink}>
                  {t.explore.textVersion}
                </Link>
              </div>
            </div>
          )}

          {touring && guide.stop && (
            <GuideCard
              returnFocusRef={tourButtonRef}
              stop={guide.stop}
              index={guide.index}
              total={guide.total}
              isLast={guide.isLast}
              playing={guide.playing}
              voice={guide.voice}
              voiceAvailable={guide.voiceAvailable}
              runKey={guide.runKey}
              duration={guide.duration}
              showPhoto={view !== "3d"}
              onBack={guide.back}
              onNext={guide.next}
              onTogglePlay={guide.togglePlay}
              onToggleVoice={guide.toggleVoice}
              onRestart={guide.restart}
              onExit={endTour}
            />
          )}
        </div>

        {/* ------------------------------------------------------- sidebar */}
        <aside className={styles.side}>
          {selected && !touring && (
            <InfoPanel
              item={selected}
              autoFocus={picked}
              view={view}
              webgl={webgl === "ok"}
              onClose={() => setSelectedKey(null)}
              onShowIn={(v) => switchView(v)}
            />
          )}

          <section className={styles.legend} aria-labelledby="legend-title">
            <div className={styles.legendHead}>
              <h2 id="legend-title" className={styles.legendTitle}>
                {t.explore.legendTitle}
              </h2>
              {filtersActive && (
                <button
                  type="button"
                  className={styles.clear}
                  onClick={() => {
                    setGroups(new Set(legendGroups));
                    setQuery("");
                  }}
                >
                  {t.common.clearFilters}
                </button>
              )}
            </div>
            <p className={styles.legendHint}>{t.explore.legendHint}</p>
            <ul className={styles.legendList}>
              {legendGroups.map((g) => (
                <li key={g}>
                  <button type="button" className={styles.legendItem} aria-pressed={groups.has(g)} onClick={() => toggleGroup(g)} data-group={g}>
                    <span className={styles.swatch} style={{ background: groupColor[g] }} aria-hidden="true" />
                    <span className={styles.legendLabel}>{t.legend[g]}</span>
                    <span className={styles.legendCount}>{counts[g]}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className={styles.shapes}>
              <span className={styles.shapeArea} aria-hidden="true" /> {t.explore.legendArea}
              <span className={styles.shapePoint} aria-hidden="true" /> {t.explore.legendPoint}
            </p>
            <p className={styles.counts} aria-live="polite">
              {plural(lang, filtered.length, t.common.results)}
              {view === "3d" && notIn3d > 0 && <> · {plural(lang, notIn3d, t.explore.notIn3d)}</>}
              {view === "map" && notOnMap > 0 && <> · {plural(lang, notOnMap, t.explore.notOnMap)}</>}
            </p>
            {view === "map" && <p className={styles.mapNote}>{t.explore.mapNote}</p>}
          </section>
        </aside>
      </div>

      <p className="visually-hidden" aria-live="polite">
        {announce}
      </p>

      {/* ------------------------------------------------------------ tours */}
      <section className={styles.tours} aria-labelledby="tours-title">
        <h2 id="tours-title" className={ui.h2}>
          {t.explore.toursTitle}
        </h2>
        <p className={cx(ui.muted, styles.toursIntro)}>{t.explore.toursIntro}</p>
        <ul className={styles.tourList}>
          {tours.map((x) => (
            <li key={x.slug} className={styles.tourCard}>
              <h3 className={styles.tourTitle}>{x.title}</h3>
              <p className={styles.tourText}>{x.intro}</p>
              <p className={styles.tourMeta}>{plural(lang, x.stops.length, t.explore.stops)}</p>
              <div className={ui.actions}>
                <button
                  ref={tour?.data.slug === x.slug ? tourButtonRef : undefined}
                  type="button"
                  className={ui.button}
                  onClick={() => chooseTour(x.slug)}
                  data-tour={x.slug}
                >
                  {t.explore.startTour}
                </button>
                <Link href={x.textHref} className={ui.textLink}>
                  {t.explore.textVersion}
                </Link>
              </div>
            </li>
          ))}
        </ul>
        <p className={styles.disclaimerBelow}>{t.explore.tourDisclaimer}</p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ list */

function ExploreList({
  items,
  selectedKey,
  onSelect,
  onShow,
  webgl,
}: {
  items: ExploreItem[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
  onShow: (key: string, view: ExploreView) => void;
  webgl: "unknown" | "ok" | "no";
}) {
  const { t } = useI18n();
  if (!items.length) return <p className={styles.empty}>{t.explore.noMatches}</p>;
  return (
    <div className={styles.list}>
      {legendGroups.map((g) => {
        const group = items.filter((i) => i.group === g);
        if (!group.length) return null;
        return (
          <section key={g} aria-labelledby={`list-${g}`} className={styles.listGroup}>
            <h2 id={`list-${g}`} className={styles.listHeading}>
              <span className={styles.swatch} style={{ background: groupColor[g] }} aria-hidden="true" />
              {t.legend[g]}
            </h2>
            <ul className={styles.listItems}>
              {group.map((item) => (
                <li key={item.key} className={cx(styles.listItem, item.key === selectedKey && styles.listItemActive)} data-key={item.key}>
                  <div className={styles.listMain}>
                    <Link href={item.href} className={styles.listName}>
                      {item.name}
                    </Link>
                    <p className={styles.listMeta}>
                      {item.categoryLabel} · {item.area}
                      {item.disclosure && <> · {item.disclosure}</>}
                    </p>
                    <p className={styles.listSummary}>{item.summary}</p>
                    <p className={styles.listLocation}>
                      {item.location
                        ? item.location.status === "self-reported"
                          ? t.explore.selfReportedLocation
                          : item.location.precision === "area"
                            ? t.explore.locationArea
                            : t.explore.locationPoint
                        : t.explore.noLocation}
                    </p>
                  </div>
                  <div className={styles.listActions}>
                    {item.location && (
                      <button type="button" className={ui.buttonSmall} onClick={() => onShow(item.key, "map")}>
                        {t.common.showOnMap}
                      </button>
                    )}
                    {item.scene && webgl !== "no" && (
                      <button type="button" className={ui.buttonSmall} onClick={() => onShow(item.key, "3d")}>
                        {t.common.showIn3D}
                      </button>
                    )}
                    {!item.location && !item.scene && (
                      <button type="button" className={ui.buttonSmall} onClick={() => onSelect(item.key)}>
                        {t.common.open}
                      </button>
                    )}
                    <TripButton kind={item.kind} slug={item.slug} compact />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
