"use client";

import { useId, useState } from "react";

import { Notice } from "@/components/ui/Notice";
import type { RecordKind } from "@/content/types";
import { useI18n } from "@/i18n/client";
import { fill, plural } from "@/i18n/localize";
import ui from "@/styles/ui.module.css";

import styles from "./ReviewFormPreview.module.css";

const MIN_LENGTH = 30;

/**
 * The review form as it will look — in preview mode. It validates what you
 * type so the flow can be tried, but it has no submit endpoint: nothing is
 * sent, stored, or published.
 */
export function ReviewFormPreview({ kind, slug }: { kind: RecordKind; slug: string }) {
  const { lang, t } = useI18n();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [visit, setVisit] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const thisMonth = new Date().toISOString().slice(0, 7);

  function check(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!rating) next.rating = t.contribute.required;
    if (comment.trim().length < MIN_LENGTH) next.comment = fill(t.contribute.tooShort, { n: MIN_LENGTH });
    if (!visit) next.visit = t.contribute.required;
    setErrors(next);
    setChecked(Object.keys(next).length === 0);
  }

  if (!open) {
    return (
      <button type="button" className={ui.buttonGhost} onClick={() => setOpen(true)} aria-expanded={false} data-review-target={`${kind}:${slug}`}>
        {t.reviews.write}
        <span className={ui.badgeGold}>{t.common.previewBadge}</span>
      </button>
    );
  }

  return (
    <form className={styles.form} onSubmit={check} noValidate aria-describedby={`${id}-preview`}>
      <div id={`${id}-preview`}>
        <Notice tone="preview" title={t.contribute.preview}>
          {t.reviews.closed}
        </Notice>
      </div>

      <fieldset className={styles.stars}>
        <legend className={ui.label}>{t.reviews.rating}</legend>
        <div className={styles.starRow}>
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className={styles.star}>
              <input
                type="radio"
                name={`${id}-rating`}
                value={n}
                checked={rating === n}
                onChange={() => setRating(n)}
                aria-describedby={errors.rating ? `${id}-rating-error` : undefined}
              />
              <span aria-hidden="true">{n <= rating ? "★" : "☆"}</span>
              <span className="visually-hidden">{plural(lang, n, t.reviews.stars)}</span>
            </label>
          ))}
        </div>
        {errors.rating && (
          <p id={`${id}-rating-error`} className={ui.error}>
            {errors.rating}
          </p>
        )}
      </fieldset>

      <div className={ui.field}>
        <label htmlFor={`${id}-comment`} className={ui.label}>
          {t.reviews.comment}
        </label>
        <p id={`${id}-comment-hint`} className={ui.hint}>
          {t.reviews.commentHint}
        </p>
        <textarea
          id={`${id}-comment`}
          className={ui.input}
          value={comment}
          maxLength={2000}
          onChange={(e) => setComment(e.target.value)}
          aria-invalid={!!errors.comment}
          aria-describedby={`${id}-comment-hint${errors.comment ? ` ${id}-comment-error` : ""}`}
        />
        {errors.comment && (
          <p id={`${id}-comment-error`} className={ui.error}>
            {errors.comment}
          </p>
        )}
      </div>

      <div className={ui.field}>
        <label htmlFor={`${id}-visit`} className={ui.label}>
          {t.reviews.visitDate}
        </label>
        <input
          id={`${id}-visit`}
          type="month"
          className={ui.input}
          max={thisMonth}
          value={visit}
          onChange={(e) => setVisit(e.target.value)}
          aria-invalid={!!errors.visit}
          aria-describedby={errors.visit ? `${id}-visit-error` : undefined}
        />
        {errors.visit && (
          <p id={`${id}-visit-error`} className={ui.error}>
            {errors.visit}
          </p>
        )}
      </div>

      <div className={ui.field}>
        <label htmlFor={`${id}-photos`} className={ui.label}>
          {t.reviews.photos}
        </label>
        <p className={ui.hint}>{t.reviews.photosHint}</p>
        {/* Disabled in preview: no photo is read or uploaded. */}
        <input id={`${id}-photos`} type="file" accept="image/*" multiple disabled className={styles.file} />
      </div>

      <div className={ui.actions}>
        <button type="submit" className={ui.button}>
          {t.reviews.check}
        </button>
        <button type="button" className={ui.buttonGhost} onClick={() => setOpen(false)}>
          {t.common.close}
        </button>
      </div>
      <p role="status" className={styles.status}>
        {checked ? t.reviews.checkedOk : ""}
      </p>
    </form>
  );
}
