"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useI18n } from "@/i18n/client";
import { href } from "@/i18n/config";
import { cx } from "@/lib/cx";
import { useTrip } from "@/lib/trip";

import styles from "./TabBar.module.css";

const ICONS = {
  home: "M4 11l8-6 8 6v9h-5v-5H9v5H4z",
  map: "M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14",
  stay: "M3 18V8M3 14h18v4M21 14v-1.5A2.5 2.5 0 0 0 18.5 10H11v4M7 12.5a1.5 1.5 0 1 1 0-.01",
  hunt: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 1.5V4M12 20v2.5M1.5 12H4M20 12h2.5M15 9l-1.8 4.2L9 15l1.8-4.2z",
  trip: "M6 3h12v18l-6-4-6 4z",
};

/** Phones: the five things visitors reach for most, always at the thumb. */
export function TabBar() {
  const { lang, t } = useI18n();
  const pathname = usePathname() ?? "/";
  const rest = "/" + pathname.split("/").slice(2).join("/").replace(/\/$/, "");
  const count = useTrip().items.length;
  const tabs = [
    { key: "home", path: "", label: t.nav.home, icon: ICONS.home },
    { key: "map", path: "/explore", label: t.nav.tabMap, icon: ICONS.map },
    { key: "hunt", path: "/hunt", label: t.nav.tabHunt, icon: ICONS.hunt },
    { key: "stay", path: "/stay", label: t.nav.tabStay, icon: ICONS.stay },
    { key: "trip", path: "/plan", label: t.nav.tabTrip, icon: ICONS.trip },
  ];
  return (
    <nav className={styles.bar} aria-label={t.nav.tabs}>
      {tabs.map((tab) => {
        const active = tab.path === "" ? rest === "/" || rest === "" : rest === tab.path || rest.startsWith(`${tab.path}/`);
        return (
          <Link key={tab.key} href={href(lang, tab.path || undefined)} className={cx(styles.tab, active && styles.active)} aria-current={active ? "page" : undefined} prefetch={false}>
            <span className={styles.icon} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d={tab.icon} />
              </svg>
              {tab.key === "trip" && count > 0 && <span className={styles.count}>{count}</span>}
            </span>
            <span className={styles.label}>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
