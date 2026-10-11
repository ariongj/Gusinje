import Link from "next/link";

import { DEMO } from "@/content/demo";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/en";

import styles from "./DemoBanner.module.css";

/** Demo builds only: one line on every page saying what is invented. */
export function DemoBanner({ lang, t }: { lang: Locale; t: Messages }) {
  if (!DEMO) return null;
  return (
    <div className={styles.banner} role="note">
      <span className={styles.tag}>{t.common.demo}</span>
      <span className={styles.text}>{t.home.demoBanner}</span>
      <span className={styles.short}>{t.home.demoBannerShort}</span>
      <Link href={href(lang, "/about/platform")} className={styles.link} prefetch={false}>
        {t.home.demoMore}
      </Link>
    </div>
  );
}
