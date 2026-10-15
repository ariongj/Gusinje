"use client";

/**
 * The explorer's passport: which places the visitor has found (a stamp each,
 * with the date and whether it was stamped on site or marked by hand) and
 * which hunt clues they chose to reveal. Kept in this browser's localStorage
 * only — no account, nothing sent anywhere.
 */

import { useSyncExternalStore } from "react";

export type StampHow = "here" | "hand";
export type Stamp = { at: string; how: StampHow };
export type Passport = { version: 1; stamps: Record<string, Stamp>; revealed: string[] };

const KEY = "valley-guide:passport";
const EVENT = "valley-guide:passport-change";
const EMPTY: Passport = { version: 1, stamps: {}, revealed: [] };
const SLUG = /^[a-z0-9-]{1,80}$/;

/** Within this distance of a place, "I'm here" stamps it on site. */
export const ON_SITE_METRES = 300;

function isPassport(value: unknown): value is Passport {
  if (!value || typeof value !== "object") return false;
  const p = value as Passport;
  return (
    p.version === 1 &&
    !!p.stamps &&
    typeof p.stamps === "object" &&
    Object.entries(p.stamps).every(([slug, s]) => SLUG.test(slug) && s && typeof s.at === "string" && (s.how === "here" || s.how === "hand")) &&
    Array.isArray(p.revealed) &&
    p.revealed.every((id) => typeof id === "string" && /^[a-z0-9-]{1,80}:[a-z0-9-]{1,80}$/.test(id))
  );
}

/* ------------------------------------------------------------- storage */

let cachedRaw: string | null | undefined;
let cached: Passport = EMPTY;

function read(): Passport {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    raw = null;
  }
  if (raw === cachedRaw) return cached;
  cachedRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : null;
    cached = isPassport(parsed) ? parsed : EMPTY;
  } catch {
    cached = EMPTY;
  }
  return cached;
}

function write(passport: Passport): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(passport));
  } catch {
    return false;
  }
  window.dispatchEvent(new Event(EVENT));
  return true;
}

function subscribe(onChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) onChange();
  };
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function usePassport(): Passport {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

/* ------------------------------------------------------------- actions */

const update = (change: (p: Passport) => Passport) => write(change(read()));

export const clueId = (hunt: string, place: string) => `${hunt}:${place}`;

export const passportActions = {
  stamp(slug: string, how: StampHow) {
    return update((p) => ({ ...p, stamps: { ...p.stamps, [slug]: { at: new Date().toISOString(), how } } }));
  },
  unstamp(slug: string) {
    return update((p) => {
      const stamps = { ...p.stamps };
      delete stamps[slug];
      return { ...p, stamps };
    });
  },
  reveal(id: string) {
    return update((p) => (p.revealed.includes(id) ? p : { ...p, revealed: [...p.revealed, id] }));
  },
  unreveal(id: string) {
    return update((p) => ({ ...p, revealed: p.revealed.filter((x) => x !== id) }));
  },
  clear() {
    return write(EMPTY);
  },
};
