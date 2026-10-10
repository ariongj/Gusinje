import Link from "next/link";
import type { ReactNode } from "react";

import { PhotoFigure } from "@/components/ui/PhotoFigure";
import type { Photo } from "@/content/types";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/en";
import { cx } from "@/lib/cx";
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
  children?: ReactNode;
};

/** Page header: breadcrumbs, title and lead beside (not over) a credited photo. */
export function PageIntro({ lang, t, title, kicker, lead, photo, crumbs, children }: Props) {
  return (
    <header className={cx(styles.intro, photo && styles.withPhoto)}>
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
          {photo && <PhotoFigure photo={photo} lang={lang} t={t} eager sizes="(max-width: 900px) 100vw, 560px" ratio="4 / 3" className={styles.photo} />}
        </div>
      </div>
    </header>
  );
}
