"use client";

import { useEffect, useId, useState } from "react";

import { Notice } from "@/components/ui/Notice";
import { useI18n } from "@/i18n/client";
import { fill } from "@/i18n/localize";
import type { Messages } from "@/i18n/messages/en";
import { cx } from "@/lib/cx";
import ui from "@/styles/ui.module.css";

import styles from "./ContributeForms.module.css";

export type Option = { value: string; label: string };

type Tab = "business" | "claim" | "correction" | "tip";
const TABS: Tab[] = ["business", "claim", "correction", "tip"];

type FieldKey = keyof Messages["contribute"]["fields"];

type Field = {
  key: FieldKey;
  type: "text" | "textarea" | "select" | "checkbox" | "url" | "email" | "tel";
  required?: boolean;
  min?: number;
  options?: Option[];
  /**
   * Personal or contact details: disabled while submissions are closed, so
   * no one types real personal data into a form that cannot be processed.
   */
  personal?: boolean;
};

type Props = {
  businessOptions: Option[];
  categoryOptions: Option[];
  areaOptions: Option[];
  placeOptions: Option[];
};

/**
 * Submit a business, claim a listing, suggest a correction, share a tip —
 * all in preview mode until an approved backend exists. The forms validate
 * so the flow can be reviewed, but have no endpoint: nothing is sent or stored.
 */
export function ContributeForms({ businessOptions, categoryOptions, areaOptions, placeOptions }: Props) {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("business");
  const [prefill, setPrefill] = useState<Record<string, string>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type") as Tab | null;
    // A static export can't read the query string while rendering: apply it after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (type && TABS.includes(type)) setTab(type);
    const next: Record<string, string> = {};
    const listing = params.get("listing");
    if (listing && businessOptions.some((o) => o.value === listing)) next.listing = listing;
    const page = params.get("page");
    if (page && /^\/[a-z0-9/-]{0,120}$/.test(page)) next.page = page;
    setPrefill(next);
  }, [businessOptions]);

  const roles: Option[] = (["owner", "manager", "staff", "other"] as const).map((r) => ({ value: r, label: t.contribute.roles[r] }));

  const forms: Record<Tab, Field[]> = {
    business: [
      { key: "businessName", type: "text", required: true, min: 2 },
      { key: "category", type: "select", required: true, options: categoryOptions },
      { key: "area", type: "select", options: areaOptions },
      { key: "description", type: "textarea", required: true, min: 40 },
      { key: "website", type: "url" },
      { key: "publicPhone", type: "tel", personal: true },
      { key: "whatsappApproved", type: "checkbox", personal: true },
      { key: "publicEmail", type: "email", personal: true },
      { key: "role", type: "select", required: true, options: roles },
      { key: "yourName", type: "text", personal: true },
      { key: "yourEmail", type: "email", personal: true },
    ],
    claim: [
      { key: "listing", type: "select", required: true, options: businessOptions },
      { key: "role", type: "select", required: true, options: roles },
      { key: "evidence", type: "textarea", required: true, min: 30 },
      { key: "yourName", type: "text", personal: true },
      { key: "yourEmail", type: "email", personal: true },
    ],
    correction: [
      { key: "page", type: "text", required: true, min: 2 },
      { key: "correction", type: "textarea", required: true, min: 20 },
      { key: "sourceLink", type: "url" },
      { key: "safety", type: "checkbox" },
      { key: "yourEmail", type: "email", personal: true },
    ],
    tip: [
      { key: "tipPlace", type: "select", options: placeOptions },
      { key: "tip", type: "textarea", required: true, min: 30 },
      { key: "yourName", type: "text", personal: true },
      { key: "yourEmail", type: "email", personal: true },
    ],
  };

  return (
    <div className={styles.wrap}>
      <Notice tone="preview" title={t.contribute.preview}>
        {t.contribute.previewText}
      </Notice>

      <div className={styles.tabs} role="tablist" aria-label={t.contribute.title}>
        {TABS.map((x) => (
          <button
            key={x}
            id={`tab-${x}`}
            type="button"
            role="tab"
            aria-selected={tab === x}
            aria-controls={`panel-${x}`}
            tabIndex={tab === x ? 0 : -1}
            className={cx(styles.tab, tab === x && styles.tabActive)}
            onClick={() => setTab(x)}
            onKeyDown={(e) => {
              const i = TABS.indexOf(tab);
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                const next = TABS[(i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length];
                setTab(next);
                document.getElementById(`tab-${next}`)?.focus();
              }
            }}
          >
            {t.contribute.tabs[x]}
          </button>
        ))}
      </div>

      <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} className={styles.panel}>
        {tab === "correction" && <Notice tone="safety">{t.contribute.safetyFirst}</Notice>}
        {tab === "tip" && <p className={ui.small}>{t.contribute.communityNote}</p>}
        <PreviewForm key={`${tab}-${JSON.stringify(prefill)}`} fields={forms[tab]} prefill={prefill} />
      </div>

      <section className={styles.process} aria-labelledby="process">
        <h2 id="process" className={ui.h2}>
          {t.contribute.process}
        </h2>
        <ol>
          {t.contribute.processSteps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function PreviewForm({ fields, prefill }: { fields: Field[]; prefill: Record<string, string> }) {
  const { t } = useI18n();
  const id = useId();
  const [values, setValues] = useState<Record<string, string>>(() => ({ ...prefill }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ok, setOk] = useState(false);

  function validate(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    for (const f of fields) {
      if (f.personal) continue;
      const v = (values[f.key] ?? "").trim();
      if (f.required && !v) next[f.key] = t.contribute.required;
      else if (v && f.min && v.length < f.min) next[f.key] = fill(t.contribute.tooShort, { n: f.min });
      else if (v && f.type === "url" && !/^https:\/\/[^\s.]+\.[^\s]+$/.test(v)) next[f.key] = t.contribute.invalidUrl;
      else if (v && f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) next[f.key] = t.contribute.invalidEmail;
    }
    setErrors(next);
    setOk(Object.keys(next).length === 0);
    if (Object.keys(next).length) document.getElementById(`${id}-${Object.keys(next)[0]}`)?.focus();
  }

  return (
    <form className={styles.form} onSubmit={validate} noValidate>
      {fields.map((f) => {
        const fid = `${id}-${f.key}`;
        const label = t.contribute.fields[f.key];
        const err = errors[f.key];
        const describedBy = [f.personal ? `${fid}-closed` : "", err ? `${fid}-error` : ""].filter(Boolean).join(" ") || undefined;
        const common = {
          id: fid,
          disabled: f.personal,
          "aria-invalid": !!err,
          "aria-describedby": describedBy,
          "aria-required": f.required || undefined,
        };
        if (f.type === "checkbox") {
          return (
            <div key={f.key} className={styles.check}>
              <input type="checkbox" {...common} checked={values[f.key] === "yes"} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.checked ? "yes" : "" }))} />
              <label htmlFor={fid}>{label}</label>
              {f.personal && (
                <span id={`${fid}-closed`} className={ui.hint}>
                  {t.contribute.personalClosed}
                </span>
              )}
            </div>
          );
        }
        return (
          <div key={f.key} className={ui.field}>
            <label htmlFor={fid} className={ui.label}>
              {label}
              {f.required && <span aria-hidden="true"> *</span>}
            </label>
            {f.type === "textarea" ? (
              <textarea {...common} className={ui.input} maxLength={3000} value={values[f.key] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} />
            ) : f.type === "select" ? (
              <select {...common} className={ui.input} value={values[f.key] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}>
                <option value="">{t.contribute.choose}</option>
                {f.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                {...common}
                type={f.type}
                className={ui.input}
                value={f.personal ? "" : (values[f.key] ?? "")}
                placeholder={f.personal ? t.contribute.personalClosed : undefined}
                autoComplete="off"
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              />
            )}
            {f.personal && (
              <span id={`${fid}-closed`} className={ui.hint}>
                {t.contribute.personalClosed}
              </span>
            )}
            {err && (
              <p id={`${fid}-error`} className={ui.error}>
                {err}
              </p>
            )}
          </div>
        );
      })}
      <div className={ui.actions}>
        <button type="submit" className={ui.button}>
          {t.contribute.check}
        </button>
      </div>
      <p role="status" className={styles.ok}>
        {ok ? t.contribute.ok : ""}
      </p>
    </form>
  );
}
