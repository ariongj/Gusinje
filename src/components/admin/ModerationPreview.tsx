"use client";

import { useState } from "react";

import { useI18n } from "@/i18n/client";
import ui from "@/styles/ui.module.css";

import styles from "./ModerationPreview.module.css";

type Kind = "review" | "tip" | "correction" | "claim" | "report";
type Status = "pending" | "published" | "rejected" | "escalated";
type Item = { id: number; kind: Kind; text: string; safety: boolean; status: Status; log: string[] };

const KINDS: Kind[] = ["review", "tip", "correction", "claim", "report"];

/**
 * The moderation workflow, previewed with items the viewer types in — kept
 * in memory only (gone on reload), so no example reviews are invented and
 * nothing is stored. Safety-related items sort first.
 */
export function ModerationPreview() {
  const { t } = useI18n();
  const [items, setItems] = useState<Item[]>([]);
  const [kind, setKind] = useState<Kind>("correction");
  const [text, setText] = useState("");
  const [safety, setSafety] = useState(false);

  const queue = [...items].sort((a, b) => Number(b.safety) - Number(a.safety) || a.id - b.id);
  const act = (id: number, status: Status) =>
    setItems((list) => list.map((i) => (i.id === id ? { ...i, status, log: [...i.log, `${new Date().toLocaleTimeString()} → ${t.admin.mod.statuses[status]}`] } : i)));

  return (
    <div className={styles.wrap}>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          setItems((list) => [...list, { id: list.length + 1, kind, text: text.trim().slice(0, 300), safety, status: "pending", log: [t.admin.mod.statuses.pending] }]);
          setText("");
          setSafety(false);
        }}
      >
        <span className={ui.badgeGold}>{t.common.previewBadge}</span>
        <label className={ui.field}>
          <span className={ui.label}>{t.admin.mod.type}</span>
          <select className={ui.input} value={kind} onChange={(e) => setKind(e.target.value as Kind)}>
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {t.admin.mod.kinds[k]}
              </option>
            ))}
          </select>
        </label>
        <label className={ui.field}>
          <span className={ui.label}>{t.admin.mod.testText}</span>
          <input className={ui.input} value={text} maxLength={300} onChange={(e) => setText(e.target.value)} />
        </label>
        <label className={styles.check}>
          <input type="checkbox" checked={safety} onChange={(e) => setSafety(e.target.checked)} /> {t.contribute.fields.safety}
        </label>
        <button type="submit" className={ui.buttonSmall}>
          {t.admin.mod.add}
        </button>
      </form>

      {queue.length === 0 ? (
        <p className={ui.muted}>{t.admin.mod.empty}</p>
      ) : (
        <ol className={styles.queue}>
          {queue.map((i) => (
            <li key={i.id} className={styles.item} data-status={i.status}>
              <p className={styles.meta}>
                #{i.id} · {t.admin.mod.kinds[i.kind]} · <strong>{t.admin.mod.statuses[i.status]}</strong>{" "}
                {i.safety && <span className={ui.badgeWarn}>{t.admin.mod.priority}</span>}
              </p>
              <p className={styles.text}>{i.text}</p>
              <div className={ui.actions}>
                <button type="button" className={ui.buttonSmall} onClick={() => act(i.id, "published")}>
                  {t.admin.mod.approve}
                </button>
                <button type="button" className={ui.buttonSmall} onClick={() => act(i.id, "rejected")}>
                  {t.admin.mod.reject}
                </button>
                <button type="button" className={ui.buttonSmall} onClick={() => act(i.id, "escalated")}>
                  {t.admin.mod.escalate}
                </button>
              </div>
              <p className={styles.log}>{i.log.join(" · ")}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
