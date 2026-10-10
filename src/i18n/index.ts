import "server-only";

import { notFound } from "next/navigation";

import { isLocale, type Locale } from "./config";
import { cnr } from "./messages/cnr";
import { en, type Messages } from "./messages/en";
import { sq } from "./messages/sq";

const dictionaries: Record<Locale, Messages> = { en, sq, cnr };

/** UI strings for a language (server side). */
export function getMessages(lang: Locale): Messages {
  return dictionaries[lang];
}

/** Narrow a route parameter to a supported language, or 404. */
export function resolveLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  return value;
}
