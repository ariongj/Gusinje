"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { exploreNav, mainNav, site, type Cta } from "@/config/site";
import { cx } from "@/lib/cx";

import styles from "./SiteNav.module.css";
import { useNavSolid } from "./useNavSolid";

type SiteNavProps = {
  /** Gold button in the bar, e.g. { label: "Book", href: "#book" }. */
  cta: Cta;
  /** Full-width button at the bottom of the mobile menu. */
  menuCta: Cta;
};

export function SiteNav({ cta, menuCta }: SiteNavProps) {
  const pathname = usePathname();
  const solid = useNavSolid();
  const [menuOpen, setMenuOpen] = useState(false);
  // Stable, so re-renders while the menu is open don't re-run its focus effect.
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const isHome = pathname === "/";

  return (
    <>
      <header className={cx(styles.nav, solid && styles.solid)}>
        {isHome ? (
          <a href="#top" className={styles.logo} aria-label={`${site.name} — top of the page`}>
            <span className={styles.logoText}>
              <span>{site.wordmark}</span>
              <span className={styles.logoSub}>{site.subtitle}</span>
            </span>
          </a>
        ) : (
          <Link href="/" className={styles.logo} aria-label={`${site.name} — home`}>
            <span className={styles.logoText}>
              <span>{site.wordmark}</span>
              <span className={styles.logoSub}>{site.subtitle}</span>
            </span>
          </Link>
        )}

        <nav className={styles.links} aria-label="Main">
          <div className={styles.desktop}>
            {mainNav.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cx(styles.link, pathname.startsWith(item.href) && styles.active)}
                aria-current={pathname.startsWith(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
            <Link href={cta.href} className={styles.cta}>
              {cta.label}
            </Link>
          </div>

          <div className={styles.mobile}>
            <Link href={cta.href} className={styles.ctaMobile}>
              {cta.label}
            </Link>
            <button
              type="button"
              className={styles.burger}
              aria-label="Menu"
              aria-expanded={menuOpen}
              aria-controls={menuOpen ? "site-menu" : undefined}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>
      </header>

      {menuOpen && <MobileMenu cta={menuCta} onClose={closeMenu} />}
    </>
  );
}

function MobileMenu({ cta, onClose }: { cta: Cta; onClose: () => void }) {
  const menuRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // A modal dialog: Tab cycles through the menu instead of the page behind it.
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
    <div ref={menuRef} id="site-menu" className={styles.menu} role="dialog" aria-modal="true" aria-label="Site menu">
      <div className={styles.menuHead}>
        <Link href="/" className={styles.menuLogo} onClick={onClose}>
          {site.wordmark}
        </Link>
        <button ref={closeRef} type="button" className={styles.close} aria-label="Close" onClick={onClose}>
          &times;
        </button>
      </div>
      <div className={styles.menuLinks}>
        {exploreNav.map((item) => (
          <Link key={item.href} href={item.href} className={styles.menuLink} onClick={onClose}>
            {item.label}
          </Link>
        ))}
      </div>
      <Link href={cta.href} className={styles.menuCta} onClick={onClose}>
        {cta.label}
      </Link>
      <a href={site.phone.href} className={styles.menuPhone}>
        Call {site.phone.display}
      </a>
    </div>
  );
}
