import Link from "next/link";
import type { ReactNode } from "react";

import { PhotoFigure } from "@/components/ui/PhotoFigure";
import type { Photo } from "@/content/types";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/en";
import { cx } from "@/lib/cx";
import { ridgePath, seed } from "@/lib/ridge";
import ui from "@/styles/ui.module.css";

import styles from "./PageIntro.module.css";

type Props = {
  lang: Locale;
  t: Messages;
  title: ReactNode;
  kicker?: ReactNode;
  lead?: ReactNode;
  photo?: Photo;
  /** [label, href] pairs; the current page is added automatically. */
  crumbs?: [string, string][];
  /** The colour of what follows the header (the ridge at its foot is drawn in it). Defaults to the page colour. */
  ground?: string;
  children?: ReactNode;
};

/**
 * Page header: breadcrumbs, title and lead beside (not over) a credited photo,
 * under a pale sky with contour lines, ending in a slice of the real skyline
 * around Vusanje (each page its own slice).
 */
export function PageIntro({ lang, t, title, kicker, lead, photo, crumbs, ground, children }: Props) {
  const slice = seed(typeof title === "string" ? title : "valley") * 0.5;
  return (
    <header className={cx(styles.intro, photo && styles.withPhoto)}>
      <svg className={styles.ridge} viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true">
        {/* The far crests stay above the near ridge, which is drawn in the colour of what follows. */}
        <path d={ridgePath(0, slice, 0.5, 1440, 100, 6, 48)} fill="rgba(47, 113, 118, 0.09)" />
        <path d={ridgePath(1, slice, 0.5, 1440, 100, 30, 62)} fill="rgba(47, 113, 118, 0.09)" />
        <path d={ridgePath(2, slice, 0.5, 1440, 100, 60, 92)} fill={ground ?? "var(--paper)"} />
      </svg>
      <div className={ui.wrap}>
        {crumbs && crumbs.length > 0 && (
          <nav aria-label={t.common.breadcrumb} className={styles.crumbs}>
            <ol>
              {crumbs.map(([label, path]) => (
                <li key={path}>
                  <Link href={path} prefetch={false}>
                    {label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className={styles.grid}>
          <div className={styles.text}>
            {kicker && <p className={ui.kicker}>{kicker}</p>}
            <h1 className={ui.h1}>{title}</h1>
            {lead && <p className={ui.lead}>{lead}</p>}
            {children && <div className={styles.extra}>{children}</div>}
          </div>
          {photo && <PhotoFigure photo={photo} lang={lang} t={t} eager sizes="(max-width: 900px) 100vw, 680px" ratio="5 / 4" className={styles.photo} />}
        </div>
      </div>
    </header>
  );
}
