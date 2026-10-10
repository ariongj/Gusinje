"use client";

import { useState } from "react";

import { useI18n } from "@/i18n/client";

import styles from "./ShareBox.module.css";

/** Native share sheet where available, otherwise copy to the clipboard. */
export function CopyLinkButton({ url, title }: { url: string; title: string }) {
  const { t } = useI18n();
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function onClick() {
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setState("copied");
    } catch (error) {
      if ((error as DOMException)?.name === "AbortError") return;
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 3000);
  }

  return (
    <>
      <button type="button" className={styles.copy} onClick={onClick}>
        {t.common.copyLink}
      </button>
      <span className={styles.status} role="status" aria-live="polite">
        {state === "copied" ? t.common.copied : state === "failed" ? t.common.copyFailed : ""}
      </span>
    </>
  );
}
