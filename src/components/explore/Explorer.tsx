"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import { TripButton } from "@/components/content/TripButton";
import { TerrainMap, type MapFocus, type MapMode } from "@/components/map/TerrainMap";
import { GuideCard, type GuideCardStop } from "@/components/tour/GuideCard";
import { useGuidedTour } from "@/components/tour/useGuidedTour";
import { useI18n } from "@/i18n/client";
import { fill, fold, plural } from "@/i18n/localize";
import { cx } from "@/lib/cx";
import { usePassport } from "@/lib/passport";
import ui from "@/styles/ui.module.css";

import styles from "./Explorer.module.css";
import { InfoPanel, km } from "./InfoPanel";
import { LeafletMap } from "./LeafletMap";
import { groupColor, legendGroups, type CameraTarget, type ExploreItem, type LegendGroup } from "./types";

export type ExploreView = "3d" | "map" | "list";

export type ExploreTourStop = GuideCardStop & { camera: CameraTarget; key?: string };

export type ExploreTour = {
  slug: string;
  title: string;
  intro: string;
  textHref: string;
  stops: ExploreTourStop[];
};

type Props = {
  /** Page title (the page's h1) and one-line introduction. */
  title: string;
  lead: string;
  items: ExploreItem[];
  tours: ExploreTour[];
  /** Trip plans flown day by day — played like the tours. */
  journeys?: ExploreTour[];
};

type Insets = { left: number; right: number; bottom: number };

/** Cheap WebGL probe, without loading the map engine. */
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
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData) return true;
  if (nav.connection?.effectiveType?.endsWith("2g")) return true;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 1) return true;
  return window.matchMedia?.("(prefers-reduced-data: reduce)").matches ?? false;
}

const VIEWS: ExploreView[] = ["3d", "map", "list"];

export function Explorer({ title, lead, items, tours, journeys = [] }: Props) {
  const { lang, t } = useI18n();
  const [view, setView] = useState<ExploreView>("3d");
  const [webgl, setWebgl] = useState<"unknown" | "ok" | "no">("unknown");
  /** The map engine is created the first time the 3D view or the map is shown, then kept. */
  const [mounted, setMounted] = useState(false);
  /** 3D or flat — kept while the list is showing, so going back returns to the same map. */
  const [mapMode, setMapMode] = useState<MapMode>("3d");
  const [groups, setGroups] = useState<Set<LegendGroup>>(() => new Set(legendGroups));
  const [query, setQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [mapFocus, setMapFocus] = useState<MapFocus>({ key: null, nonce: 0 });
  /** The visitor moved the 3D map themselves (the reset button only shows once there is something to reset). */
  const [moved, setMoved] = useState(false);
  /** Places stamped in the explorer's passport: a tick on their pins. */
  const passport = usePassport();
  const found = useMemo(() => new Set(Object.keys(passport.stamps).map((slug) => `place:${slug}`)), [passport]);
  const [notice, setNotice] = useState<string | null>(null);
  const [tour, setTour] = useState<{
    data: ExploreTour;
    phase: "intro" | "running";
  } | null>(null);
  const [ready, setReady] = useState(false);
  const [announce, setAnnounce] = useState("");
  /** The visitor has picked something (as opposed to a deep link on load). */
  const [picked, setPicked] = useState(false);
  /** The floating legend: open by default on wide screens (set after mount). */
  const [legendOpen, setLegendOpen] = useState(false);
  /** Screen space the panels cover, so the 3D view and the map centre the focus in what's left. */
  const [insets, setInsets] = useState<Insets>({
    left: 0,
    right: 0,
    bottom: 0,
  });

  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const railListRef = useRef<HTMLOListElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const sheetDrag = useRef<{ y: number; dy: number } | null>(null);
  const [sheetTall, setSheetTall] = useState(false);
  const legendRef = useRef<HTMLDivElement>(null);
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

  const notOnMap = filtered.filter((i) => !i.location).length;

  /** The places along the bottom of the stage: everything mapped, from Gusinje south into the mountains. */
  // The strip walks up the valley through the guide's own places and listings; businesses from
  // open map data join it only when the visitor searches by name (they're always on the map).
  const rail = useMemo(
    () =>
      view === "list"
        ? []
        : filtered.filter((i) => i.location && (!i.openData || query.trim() !== "")).sort((a, b) => b.location!.lat - a.location!.lat),
    [filtered, view, query],
  );

  /* ------------------------------------------------------------ selection */

  /** Fly to an item on the map. Items without a verified location stay where the camera is. */
  const focusItem = useCallback((item: ExploreItem | undefined) => {
    if (!item?.location) return;
    setMapFocus((f) => ({ key: item.hostKey ?? item.key, nonce: f.nonce + 1 }));
  }, []);

  const select = useCallback(
    (key: string | null) => {
      setSelectedKey(key);
      setPicked(true);
      const item = key ? byKey.get(key) : undefined;
      if (item) {
        focusItem(item);
        setAnnounce(fill(t.explore.panelLabel, { name: item.name }));
      }
    },
    [byKey, focusItem, t],
  );

  /** Previous / next place along the rail — each gets its own camera view. */
  const step = useCallback(
    (direction: 1 | -1) => {
      if (!rail.length) return;
      const index = rail.findIndex((i) => i.key === selectedKey);
      const next = index < 0 ? (direction === 1 ? 0 : rail.length - 1) : (index + direction + rail.length) % rail.length;
      setPicked(true);
      select(rail[next].key);
    },
    [rail, selectedKey, select],
  );

  const switchView = useCallback(
    (next: ExploreView) => {
      if (next === "3d" && webgl === "no") return;
      setView(next);
      setNotice(null);
      if (next !== "list") {
        setMounted(true);
        setMapMode(next === "map" ? "2d" : "3d");
        const item = selectedKey ? byKey.get(selectedKey) : undefined;
        // Frame the selection again once the map has tilted (or flattened).
        if (item) window.setTimeout(() => focusItem(item), 950);
      }
      setAnnounce(`${t.explore.viewsLabel}: ${t.explore.views[next]}`);
    },
    [webgl, selectedKey, byKey, focusItem, t],
  );

  /* ---------------------------------------------------------------- tours */

  const onGuideStop = useCallback((stop: ExploreTourStop) => {
    setSelectedKey(stop.key ?? null);
    setMapFocus((f) => ({ key: stop.key ?? null, camera: stop.camera, nonce: f.nonce + 1 }));
  }, []);

  const tourStops = useMemo(() => tour?.data.stops ?? [], [tour]);
  const guide = useGuidedTour(tourStops, onGuideStop, lang);
  const touring = guide.active;

  const chooseTour = useCallback(
    (slug: string) => {
      const data = [...tours, ...journeys].find((x) => x.slug === slug);
      if (!data) return;
      guide.exit();
      setGroups(new Set(legendGroups));
      setQuery("");
      setSelectedKey(null);
      if (viewRef.current === "list") switchView(webgl === "no" ? "map" : "3d");
      setTour({ data, phase: "intro" });
      // The explorer right under the header: it fills the screen, and on the tour
      // the model takes it all. (scrollIntoView would add the page's anchor padding.)
      const stage = stageRef.current;
      if (stage) {
        const target = stage.parentElement ?? stage;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(stage).scrollMarginTop) || 0),
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        });
      }
    },
    [tours, journeys, guide, switchView, webgl],
  );

  // The intro takes focus without cutting short the scroll up to the map.
  const beginRef = useRef<HTMLButtonElement>(null);
  const introOpen = tour?.phase === "intro" && view !== "list";
  useEffect(() => {
    if (introOpen) beginRef.current?.focus({ preventScroll: true });
  }, [introOpen, tour?.data.slug]);

  const beginTour = useCallback(() => {
    setTour((x) => (x ? { ...x, phase: "running" } : x));
    guide.start();
  }, [guide]);

  const endTour = useCallback(() => {
    guide.exit();
    setTour(null);
    setSelectedKey(null);
    setMapFocus((f) => ({ key: null, nonce: f.nonce + 1 }));
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
    if (initialView !== "list") setMounted(true);
    setMapMode(initialView === "map" ? "2d" : "3d");

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
      window.setTimeout(() => focusItem(byKey.get(key)), 60);
    }
    const tourSlug = params.get("tour");
    if (tourSlug) {
      const data = [...tours, ...journeys].find((x) => x.slug === tourSlug);
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
  const showPanel = !!selected && !touring && view !== "list";

  // Measure what the panels cover. Wide screens: legend left, card right, rail
  // along the bottom. Phones: the card is a sheet over the bottom of the view.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage || view === "list" || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      const wide = stage.clientWidth >= 900;
      const rail = railRef.current?.offsetHeight ?? 0;
      const panel = panelRef.current;
      const legend = legendRef.current;
      const next: Insets = wide
        ? {
            left: legend && legendOpen ? legend.offsetWidth + 16 : 0,
            right: panel ? panel.offsetWidth + 16 : 0,
            bottom: rail ? rail + 8 : 0,
          }
        : {
            left: 0,
            right: 0,
            bottom: panel ? panel.offsetHeight + 8 : rail ? rail + 8 : 0,
          };
      setInsets((prev) => (prev.left === next.left && prev.right === next.right && prev.bottom === next.bottom ? prev : next));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    for (const el of [railRef.current, panelRef.current, legendRef.current]) if (el) ro.observe(el);
    return () => ro.disconnect();
  }, [view, showPanel, legendOpen, touring, selectedKey, tour?.phase]);

  // Keep the selected place visible in the rail (scrolling only the rail, never the page).
  useEffect(() => {
    const list = railListRef.current;
    const button = selectedKey ? list?.querySelector<HTMLElement>(`[data-rail="${CSS.escape(selectedKey)}"]`) : null;
    if (!list || !button) return;
    const left = button.offsetLeft - (list.clientWidth - button.offsetWidth) / 2;
    list.scrollTo({
      left,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, [selectedKey, view]);

  const toggleGroup = (g: LegendGroup) =>
    setGroups((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });
  const allOn = groups.size === legendGroups.length;
  const filtersActive = !allOn || !!query;

  const railIndex = rail.findIndex((i) => i.key === selectedKey);
  const stageVars = {
    "--inset-left": `${insets.left}px`,
    "--inset-right": `${insets.right}px`,
    "--inset-bottom": `${insets.bottom}px`,
  } as CSSProperties;

  const legend = (
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
      {view !== "list" && (
        <p className={styles.shapes}>
          <span className={styles.shapeArea} aria-hidden="true" /> {t.explore.legendArea}
          <span className={styles.shapePoint} aria-hidden="true" /> {t.explore.legendPoint}
        </p>
      )}
      {view !== "list" && webgl === "ok" && (
        <ul className={styles.mapKey}>
          <li>
            <span className={styles.keyTrail} aria-hidden="true" />
            {t.explore.legendTrails}
          </li>
          <li>
            <span className={styles.keyContour} aria-hidden="true" />
            {t.explore.legendContours}
          </li>
        </ul>
      )}
      <p className={styles.counts} aria-live="polite">
        {plural(lang, filtered.length, t.common.results)}
        {view !== "list" && notOnMap > 0 && <> · {plural(lang, notOnMap, t.explore.notOnMap)}</>}
      </p>
      {view !== "list" && <p className={styles.mapNote}>{t.explore.mapNote}</p>}
      {view !== "list" && items.some((i) => i.openData) && <p className={styles.mapNote}>{t.explore.openDataNote}</p>}
    </section>
  );

  // What's around the selected place: mapped places and listings within 2 km, nearest first.
  const nearby = useMemo(() => {
    const here = selected?.location;
    if (!here) return [];
    return filtered
      .filter((i) => i.key !== selected.key && i.location && !i.hostKey)
      .map((i) => ({ i, d: km(here, i.location!) }))
      .filter(({ d }) => d <= 2)
      .sort((a, b) => a.d - b.d)
      .slice(0, 6)
      .map(({ i }) => i);
  }, [selected, filtered]);

  const infoPanel = selected && (
    <InfoPanel
      item={selected}
      nearby={nearby}
      onPick={(key) => select(key)}
      autoFocus={picked}
      view={view}
      webgl={webgl === "ok"}
      onClose={() => setSelectedKey(null)}
      onShowIn={(v) => switchView(v)}
      step={
        view !== "list" && railIndex >= 0 && rail.length > 1
          ? {
              index: railIndex,
              total: rail.length,
              onPrevious: () => step(-1),
              onNext: () => step(1),
            }
          : undefined
      }
    />
  );

  const tourList = (list: ExploreTour[], action: string) => (
    <ul className={styles.tourList}>
      {list.map((x, i) => (
        <li key={x.slug} className={styles.tourCard}>
          <span className={styles.tourNumber} aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className={styles.tourTitle}>{x.title}</h3>
          <p className={styles.tourText}>{x.intro}</p>
          <p className={styles.tourMeta}>{plural(lang, x.stops.length, t.explore.stops)}</p>
          <div className={styles.tourActions}>
            <button
              ref={tour?.data.slug === x.slug ? tourButtonRef : undefined}
              type="button"
              className={ui.button}
              onClick={() => chooseTour(x.slug)}
              data-tour={x.slug}
            >
              {action}
            </button>
            <Link href={x.textHref} className={ui.textLink}>
              {t.explore.textVersion}
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={cx(styles.explorer, view !== "list" && styles.immersive, touring && styles.isTouring)}>
      {/* The bar and the stage fill the screen below the site header. */}
      <div className={styles.screen}>
        {/* ------------------------------------------------------------- bar */}
        <div className={styles.bar}>
          <div className={styles.heading}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.lead}>{lead}</p>
          </div>
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
            <a href="#tours" className={styles.toursLink}>
              {t.explore.toursTitle}
            </a>
          </div>
          {/* One tap to show one kind of place (the legend still mixes them). */}
          {view !== "list" && (
            <div className={styles.chips} role="group" aria-label={t.explore.quickFilters}>
              <button type="button" className={styles.chip} aria-pressed={allOn} onClick={() => setGroups(new Set(legendGroups))}>
                {t.explore.allGroups}
              </button>
              {legendGroups
                .filter((g) => counts[g] > 0)
                .map((g) => {
                  const only = groups.size === 1 && groups.has(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      className={styles.chip}
                      aria-pressed={only}
                      data-group={g}
                      onClick={() => setGroups(only ? new Set(legendGroups) : new Set([g]))}
                    >
                      <span className={styles.chipDot} style={{ background: groupColor[g] }} aria-hidden="true" />
                      {t.legend[g]}
                      <span className={styles.chipCount}>{counts[g]}</span>
                    </button>
                  );
                })}
            </div>
          )}
        </div>

        {(notice || (webgl === "no" && !notice)) && (
          <p className={styles.notice} role={notice ? "status" : undefined}>
            {notice ?? t.explore.webglFailed}
          </p>
        )}

        {/* ----------------------------------------------------------- stage */}
        <div ref={stageRef} data-testid="explore-stage" data-map-stage="" className={cx(styles.stage, view === "list" && styles.stageList, touring && styles.touring, showPanel && styles.panelOpen)} style={stageVars}>
          {/* The real valley: 3D terrain, or the same map laid flat. Without WebGL, a simple tiled map. */}
          {mounted && webgl !== "unknown" && (
            <div className={styles.layer} hidden={view === "list"}>
              {webgl === "ok" ? (
                <TerrainMap
                  mode={mapMode}
                  items={filtered}
                  selectedKey={selectedKey}
                  focus={mapFocus}
                  touring={touring}
                  insets={view !== "list" ? insets : undefined}
                  found={found}
                  onSelect={(key) => {
                    if (touring) guide.pause();
                    select(key);
                  }}
                  onInteract={() => setMoved(true)}
                  onFailed={() => {
                    setWebgl("no");
                    setView("map");
                    setMapMode("2d");
                    setNotice(t.explore.switchedToMap);
                  }}
                />
              ) : (
                <LeafletMap
                  items={filtered}
                  selectedKey={selectedKey}
                  touring={touring}
                  insets={view !== "list" ? insets : undefined}
                  onSelect={(key) => {
                    if (touring) guide.pause();
                    select(key);
                  }}
                  focus={mapFocus}
                />
              )}
              {!touring && (selectedKey || moved || mapFocus.key || mapFocus.camera) && (
                <button
                  type="button"
                  className={styles.mapReset}
                  onClick={() => {
                    setSelectedKey(null);
                    setMoved(false);
                    setMapFocus((f) => ({ key: null, nonce: f.nonce + 1 }));
                  }}
                >
                  {t.explore.resetView}
                </button>
              )}
            </div>
          )}

          {/* Floating legend and filters (3D and map); out of the way of a tour. */}
          {view !== "list" && !touring && tour?.phase !== "intro" && (
            <div ref={legendRef} className={cx(styles.floatingLegend, legendOpen && styles.floatingLegendOpen)}>
              <button
                type="button"
                className={styles.legendToggle}
                aria-expanded={legendOpen}
                aria-controls="explore-legend"
                onClick={() => setLegendOpen((open) => !open)}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M2 4h12M4.5 8h7M7 12h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                {t.explore.legendTitle}
                {!allOn && <span className={styles.legendBadge}>{groups.size}</span>}
              </button>
              <div id="explore-legend" hidden={!legendOpen}>
                {legend}
              </div>
            </div>
          )}

          {/* The selected place, with previous / next. On phones a sheet: swipe it down to close, up to see more. */}
          {showPanel && (
            <div
              ref={panelRef}
              className={cx(styles.panelSlot, sheetTall && styles.sheetTall)}
              onTouchStart={(e) => {
                const el = panelRef.current;
                if (!el || !window.matchMedia("(max-width: 899.98px)").matches) return;
                sheetDrag.current = el.scrollTop <= 0 ? { y: e.touches[0].clientY, dy: 0 } : null;
              }}
              onTouchMove={(e) => {
                const drag = sheetDrag.current;
                const el = panelRef.current;
                if (!drag || !el) return;
                drag.dy = e.touches[0].clientY - drag.y;
                if (drag.dy > 0) el.style.transform = `translateY(${drag.dy}px)`;
              }}
              onTouchEnd={() => {
                const drag = sheetDrag.current;
                const el = panelRef.current;
                sheetDrag.current = null;
                if (!drag || !el) return;
                el.style.transform = "";
                if (drag.dy > 90) {
                  setSheetTall(false);
                  setSelectedKey(null);
                } else if (drag.dy < -50) setSheetTall(true);
              }}
            >
              <span className={styles.sheetHandle} aria-hidden="true" />
              {infoPanel}
            </div>
          )}

          {/* Every place this view can show — one tap flies to it. */}
          {view !== "list" && !touring && rail.length > 0 && (
            <nav ref={railRef} className={cx(styles.rail, showPanel && styles.railUnderPanel)} aria-label={t.explore.railLabel}>
              <button type="button" className={styles.railStep} aria-label={t.explore.previousPlace} onClick={() => step(-1)}>
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path d="M11 3.5 5.5 9l5.5 5.5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <ol ref={railListRef} className={styles.railList}>
                {rail.map((item) => (
                  <li key={item.key}>
                    <button
                      type="button"
                      className={styles.railItem}
                      aria-current={item.key === selectedKey ? "true" : undefined}
                      data-rail={item.key}
                      onClick={() => {
                        setPicked(true);
                        select(item.key);
                      }}
                    >
                      <span className={styles.swatch} style={{ background: groupColor[item.group] }} aria-hidden="true" />
                      <span className={styles.railText}>
                        <span className={styles.railName}>{item.name}</span>
                        <span className={styles.railMeta}>{item.categoryLabel}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
              <button type="button" className={styles.railStep} aria-label={t.explore.nextPlace} onClick={() => step(1)}>
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path d="m7 3.5 5.5 5.5L7 14.5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </nav>
          )}

          {view === "list" && (
            <div className={styles.listLayout}>
              <aside className={styles.side}>
                {selected && !touring && infoPanel}
                {legend}
              </aside>
              <ExploreList
                items={filtered}
                selectedKey={selectedKey}
                onSelect={select}
                onShow={(key, v) => {
                  select(key);
                  switchView(v);
                }}
                webgl={webgl}
              />
            </div>
          )}

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
                <button ref={beginRef} type="button" className={ui.button} onClick={beginTour}>
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
              nextTitle={tourStops[guide.index + 1]?.title}
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
      </div>

      <p className="visually-hidden" aria-live="polite">
        {announce}
      </p>

      {/* ------------------------------------------------------------ tours */}
      <section id="tours" className={styles.tours} aria-labelledby="tours-title">
        <div className={ui.wrap}>
          <p className={ui.kicker}>{t.explore.guidedTour}</p>
          <h2 id="tours-title" className={styles.toursTitle}>
            {t.explore.toursTitle}
          </h2>
          <p className={styles.toursIntro}>{t.explore.toursIntro}</p>
          {tourList(tours, t.explore.startTour)}
          {journeys.length > 0 && (
            <>
              <h2 id="journeys" className={styles.toursTitle}>
                {t.explore.journeysTitle}
              </h2>
              <p className={styles.toursIntro}>{t.explore.journeysIntro}</p>
              {tourList(journeys, t.explore.startJourney)}
            </>
          )}
          <p className={styles.disclaimerBelow}>{t.explore.tourDisclaimer}</p>
        </div>
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
                    {item.location && webgl !== "no" && (
                      <button type="button" className={ui.buttonSmall} onClick={() => onShow(item.key, "3d")}>
                        {t.common.showIn3D}
                      </button>
                    )}
                    {!item.location && (
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
