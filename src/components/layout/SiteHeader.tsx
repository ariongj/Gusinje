"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { brand } from "@/config/brand";
import { mainNav } from "@/config/nav";
import { useI18n } from "@/i18n/client";
import { href, locales, localeNames, localeShort, switchLocalePath, type Locale } from "@/i18n/config";
import { cx } from "@/lib/cx";
import { useTrip } from "@/lib/trip";

import styles from "./SiteHeader.module.css";

/** Is `path` (no language prefix) the current section? */
function useSection() {
  const pathname = usePathname() ?? "/";
  const rest = "/" + pathname.split("/").slice(2).join("/");
  return (path: string) => rest === path || rest.startsWith(`${path}/`);
}

export function SiteHeader() {
  const { lang, t } = useI18n();
  const isActive = useSection();
  const trip = useTrip();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const count = trip.items.length;

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link href={href(lang)} className={styles.logo}>
          <span className={styles.mark} aria-hidden="true" />
          <span className={styles.logoText}>
            <span className={styles.wordmark}>{brand.wordmark[lang]}</span>
            <span className={styles.region}>{brand.region}</span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label={t.nav.main}>
          {mainNav.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.key}
                href={href(lang, item.path)}
                className={cx(styles.link, active && styles.active)}
                aria-current={active ? "page" : undefined}
              >
                {t.nav[item.key]}
              </Link>
            );
          })}
        </nav>

        <div className={styles.tools}>
          <Link href={href(lang, "/search")} className={styles.tool} aria-label={t.nav.search} title={t.nav.search}>
            <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
              <path d="M13 13l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </Link>
          <Link
            href={href(lang, "/plan")}
            className={cx(styles.tool, styles.trip)}
            aria-label={count ? `${t.nav.myTrip} (${count})` : t.nav.myTrip}
            title={t.nav.myTrip}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 2.5h10v15l-5-3.6-5 3.6z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" fill={count ? "currentColor" : "none"} />
            </svg>
            {count > 0 && (
              <span className={styles.badge} aria-hidden="true">
                {count}
              </span>
            )}
          </Link>
          <LanguageSwitcher />
          <button
            type="button"
            className={styles.burger}
            aria-label={t.nav.menu}
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? "site-menu" : undefined}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {menuOpen && <MobileMenu onClose={closeMenu} />}
    </header>
  );
}

function LanguageSwitcher({ inMenu = false }: { inMenu?: boolean }) {
  const { lang, t } = useI18n();
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const [hash, setHash] = useState("");

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        rootRef.current?.querySelector("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // usePathname() has no base path; next/link adds it back.
  const target = (l: Locale) => switchLocalePath(pathname, l) + hash;

  if (inMenu) {
    return (
      <div className={styles.menuLangs} role="group" aria-label={t.nav.language}>
        {locales.map((l) => (
          <Link key={l} href={target(l)} lang={l} hrefLang={l} className={cx(styles.menuLang, l === lang && styles.menuLangActive)} aria-current={l === lang ? "true" : undefined}>
            {localeNames[l]}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div ref={rootRef} className={styles.lang}>
      <button
        type="button"
        className={styles.langButton}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`${t.nav.language}: ${localeNames[lang]}`}
        onClick={() => {
          // Keep the query and #fragment (e.g. a shared trip) when switching language.
          setHash(window.location.search + window.location.hash);
          setOpen((o) => !o);
        }}
      >
        <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M2.5 10h15M10 2.5c2.2 2.3 3.2 4.8 3.2 7.5s-1 5.2-3.2 7.5c-2.2-2.3-3.2-4.8-3.2-7.5s1-5.2 3.2-7.5z" stroke="currentColor" strokeWidth="1.3" fill="none" />
        </svg>
        <span>{localeShort[lang]}</span>
      </button>
      {open && (
        <ul className={styles.langMenu}>
          {locales.map((l) => (
            <li key={l}>
              <Link
                href={target(l)}
                lang={l}
                hrefLang={l}
                className={cx(styles.langItem, l === lang && styles.langItemActive)}
                aria-current={l === lang ? "true" : undefined}
                onClick={() => setOpen(false)}
              >
                {localeNames[l]}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const { lang, t } = useI18n();
  const isActive = useSection();
  const menuRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // A modal dialog: Tab cycles inside the menu.
      if (e.key === "Tab") {
        const items = menuRef.current?.querySelectorAll<HTMLElement>("a[href], button");
        if (!items?.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        const inside = menuRef.current?.contains(document.activeElement);
        if (e.shiftKey && (document.activeElement === first || !inside)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (document.activeElement === last || !inside)) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [onClose]);

  return (
    <div ref={menuRef} id="site-menu" className={styles.menu} role="dialog" aria-modal="true" aria-label={t.nav.menu}>
      <div className={styles.menuHead}>
        <span className={styles.menuTitle}>{brand.wordmark[lang]}</span>
        <button ref={closeRef} type="button" className={styles.close} aria-label={t.nav.close} onClick={onClose}>
          &times;
        </button>
      </div>
      <nav aria-label={t.nav.main}>
        <ul className={styles.menuLinks}>
          <li>
            <Link href={href(lang)} className={styles.menuLink} onClick={onClose}>
              {t.nav.home}
            </Link>
          </li>
          {mainNav.map((item) => (
            <li key={item.key}>
              <Link
                href={href(lang, item.path)}
                className={cx(styles.menuLink, isActive(item.path) && styles.menuLinkActive)}
                aria-current={isActive(item.path) ? "page" : undefined}
                onClick={onClose}
              >
                {t.nav[item.key]}
              </Link>
            </li>
          ))}
          <li>
            <Link href={href(lang, "/search")} className={styles.menuLink} onClick={onClose}>
              {t.nav.search}
            </Link>
          </li>
        </ul>
      </nav>
      <p className={styles.menuLabel}>{t.nav.language}</p>
      <LanguageSwitcher inMenu />
    </div>
  );
}
