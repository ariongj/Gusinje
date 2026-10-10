"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { Locale } from "./config";
import type { Messages } from "./messages/en";

type I18n = { lang: Locale; t: Messages };

const I18nContext = createContext<I18n | null>(null);

/** Makes the page's language and UI strings available to client components. */
export function I18nProvider({ lang, messages, children }: { lang: Locale; messages: Messages; children: ReactNode }) {
  return <I18nContext.Provider value={{ lang, t: messages }}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside <I18nProvider>");
  return value;
}
