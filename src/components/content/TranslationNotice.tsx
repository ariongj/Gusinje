import type { TranslationStatus } from "@/content/types";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/en";

import styles from "./TranslationNotice.module.css";

/** Tells readers when the text they're reading is an unreviewed translation (or English fallback). */
export function TranslationNotice({ status, lang, t, fallback = false }: { status: TranslationStatus; lang: Locale; t: Messages; fallback?: boolean }) {
  if (lang === "en") return null;
  if (fallback) return <p className={styles.notice}>{t.common.notTranslated}</p>;
  if (status[lang] === "reviewed") return null;
  return (
    <p className={styles.notice} lang={lang}>
      {t.common.translationUnreviewed}
    </p>
  );
}
