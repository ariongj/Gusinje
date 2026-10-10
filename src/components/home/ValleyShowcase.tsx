"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { TerrainMap } from "@/components/map/TerrainMap";
import { useI18n } from "@/i18n/client";
import { href } from "@/i18n/config";

import styles from "./ValleyShowcase.module.css";

/** Data saver, a 2G connection or very little memory: keep the still backdrop. */
function lightweight(): boolean {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string }; deviceMemory?: number };
  if (nav.connection?.saveData || nav.connection?.effectiveType?.endsWith("2g")) return true;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 1) return true;
  return window.matchMedia?.("(prefers-reduced-data: reduce)").matches ?? false;
}

/**
 * Full-width band on the home page: the real valley in 3D, turning slowly
 * behind a short invitation. The map only loads when the band comes near the
 * screen, and never on data saver; until then a painted sky-to-valley backdrop
 * stands in.
 */
export function ValleyShowcase() {
  const { lang, t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || lightweight() || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLive(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className={styles.band} aria-labelledby="showcase-title">
      <div className={styles.backdrop} aria-hidden="true">
        {live && <TerrainMap variant="showcase" onFailed={() => setLive(false)} />}
      </div>
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.inner}>
        <p className={styles.kicker}>{t.home.showcaseKicker}</p>
        <h2 id="showcase-title" className={styles.title}>
          {t.home.showcaseTitle}
        </h2>
        <p className={styles.text}>{t.home.showcaseText}</p>
        <div className={styles.actions}>
          <Link href={href(lang, "/explore")} className={styles.primary}>
            {t.home.showcaseCta}
          </Link>
          <Link href={`${href(lang, "/explore")}/#tours`} className={styles.secondary} prefetch={false}>
            {t.home.showcaseTours}
          </Link>
        </div>
      </div>
    </section>
  );
}
