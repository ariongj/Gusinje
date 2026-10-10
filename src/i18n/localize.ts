import type { Localized } from "@/content/types";

import type { Locale } from "./config";

/** Text in the requested language, falling back to English. */
export function loc<T>(value: Localized<T>, lang: Locale): T;
export function loc<T>(value: Localized<T> | undefined, lang: Locale): T | undefined;
export function loc<T>(value: Localized<T> | undefined, lang: Locale): T | undefined {
  if (!value) return undefined;
  return (lang === "en" ? value.en : (value[lang] ?? value.en)) as T;
}

/** True when the value has no text of its own in this language (English is shown instead). */
export function isFallback(value: Localized<unknown> | undefined, lang: Locale): boolean {
  return !!value && lang !== "en" && value[lang] === undefined;
}

/** Fill {name} placeholders. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/** Pick a plural form: forms = [one, other] (English/Albanian) or [one, few, other] (Montenegrin). */
export function plural(lang: Locale, count: number, forms: readonly string[]): string {
  const rules = new Intl.PluralRules(lang === "cnr" ? "sr" : lang);
  const category = rules.select(count);
  let form: string;
  if (forms.length === 3) form = category === "one" ? forms[0] : category === "few" ? forms[1] : forms[2];
  else form = category === "one" ? forms[0] : forms[forms.length - 1];
  return fill(form, { n: count });
}

/**
 * Numbers written in English format ("1,450", "3.4") in the reader's format:
 * Albanian and Montenegrin use "1.450" and "3,4".
 */
export function localizeNumbers(text: string, lang: Locale): string {
  if (lang === "en") return text;
  return text
    .replace(/(\d),(\d{3})/g, "$1\u0000$2")
    .replace(/(\d)\.(\d)/g, "$1,$2")
    .replace(/\u0000/g, ".");
}

/** Lower-case, accent-free text for matching ("Alipašini" → "alipasini"). */
export function fold(text: string): string {
  return text
    .toLowerCase()
    .replace(/đ/g, "dj")
    .replace(/ë/g, "e")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’'`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
