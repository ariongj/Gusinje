import type { RecordKind } from "@/content/types";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages/en";
import ui from "@/styles/ui.module.css";

import { ReviewFormPreview } from "./ReviewFormPreview";
import styles from "./ReviewsSection.module.css";

/**
 * Reviews for a place, listing or route. There is no review service yet, so
 * the count is zero and the page says "No reviews yet" — never a score.
 * The form is a clearly labelled preview that sends and stores nothing.
 */
export function ReviewsSection({ t, lang, kind, slug }: { t: Messages; lang: Locale; kind: RecordKind; slug: string }) {
  return (
    <section className={styles.section} aria-labelledby={`reviews-${slug}`} lang={lang}>
      <h2 id={`reviews-${slug}`} className={ui.h2}>
        {t.reviews.title}
      </h2>
      <p className={styles.none} data-testid="no-reviews">
        {t.reviews.none}
      </p>
      <details className={styles.how}>
        <summary>{t.reviews.howTitle}</summary>
        <p>{t.reviews.how}</p>
        <p className={styles.policyTitle}>{t.reviews.policyTitle}</p>
        <ul>
          {t.reviews.policy.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p>{t.reviews.policyFairness}</p>
      </details>
      <ReviewFormPreview kind={kind} slug={slug} />
    </section>
  );
}
