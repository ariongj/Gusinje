"use client";

/**
 * "My Trip": the visitor's saved places, listings, walks and guides, kept in
 * this browser's localStorage only — no account and nothing sent anywhere.
 * A shared link carries a copy of the trip in the URL fragment (#…), which
 * browsers don't send to servers.
 */

import { useSyncExternalStore } from "react";

import type { RecordKind } from "@/content/types";

export type TripItem = {
  kind: RecordKind;
  slug: string;
  /** 1-based day, or null while unscheduled. */
  day: number | null;
  note: string;
};

export type Trip = { version: 1; days: number; items: TripItem[] };

const KEY = "valley-guide:trip";
const EVENT = "valley-guide:trip-change";
const EMPTY: Trip = { version: 1, days: 1, items: [] };
const KINDS: readonly RecordKind[] = ["place", "business", "route", "guide", "tour", "itinerary"];

export const itemKey = (item: { kind: RecordKind; slug: string }) => `${item.kind}:${item.slug}`;

function isTrip(value: unknown): value is Trip {
  if (!value || typeof value !== "object") return false;
  const trip = value as Trip;
  return (
    trip.version === 1 &&
    Number.isInteger(trip.days) &&
    trip.days >= 1 &&
    trip.days <= 30 &&
    Array.isArray(trip.items) &&
    trip.items.every(
      (i) =>
        i &&
        KINDS.includes(i.kind) &&
        typeof i.slug === "string" &&
        /^[a-z0-9-]{1,80}$/.test(i.slug) &&
        (i.day === null || (Number.isInteger(i.day) && i.day >= 1 && i.day <= trip.days)) &&
        typeof i.note === "string" &&
        i.note.length <= 2000,
    )
  );
}

/* ------------------------------------------------------------- storage */

let cachedRaw: string | null | undefined;
let cachedTrip: Trip = EMPTY;

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function read(): Trip {
  const raw = readRaw();
  if (raw === cachedRaw) return cachedTrip;
  cachedRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : null;
    cachedTrip = isTrip(parsed) ? parsed : EMPTY;
  } catch {
    cachedTrip = EMPTY;
  }
  return cachedTrip;
}

function write(trip: Trip): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(trip));
  } catch {
    return false;
  }
  window.dispatchEvent(new Event(EVENT));
  return true;
}

/** True when this browser lets the page store data. */
export function storageAvailable(): boolean {
  try {
    const probe = `${KEY}:probe`;
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
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

export function useTrip(): Trip {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

/* ------------------------------------------------------------- actions */

function update(change: (trip: Trip) => Trip): boolean {
  return write(change(read()));
}

export const tripActions = {
  add(kind: RecordKind, slug: string) {
    return update((trip) =>
      trip.items.some((i) => i.kind === kind && i.slug === slug) ? trip : { ...trip, items: [...trip.items, { kind, slug, day: null, note: "" }] },
    );
  },
  remove(key: string) {
    return update((trip) => ({ ...trip, items: trip.items.filter((i) => itemKey(i) !== key) }));
  },
  setDay(key: string, day: number | null) {
    return update((trip) => {
      const items = trip.items.filter((i) => itemKey(i) !== key);
      const moved = trip.items.find((i) => itemKey(i) === key);
      if (!moved) return trip;
      // Joins the end of its new day.
      return { ...trip, items: [...items, { ...moved, day }] };
    });
  },
  /** Swap with the previous (-1) or next (+1) item on the same day. */
  move(key: string, direction: -1 | 1) {
    return update((trip) => {
      const items = [...trip.items];
      const index = items.findIndex((i) => itemKey(i) === key);
      if (index < 0) return trip;
      const day = items[index].day;
      let j = index + direction;
      while (j >= 0 && j < items.length && items[j].day !== day) j += direction;
      if (j < 0 || j >= items.length) return trip;
      [items[index], items[j]] = [items[j], items[index]];
      return { ...trip, items };
    });
  },
  setNote(key: string, note: string) {
    return update((trip) => ({ ...trip, items: trip.items.map((i) => (itemKey(i) === key ? { ...i, note: note.slice(0, 2000) } : i)) }));
  },
  addDay() {
    return update((trip) => ({ ...trip, days: Math.min(30, trip.days + 1) }));
  },
  /** Remove a day: its items become unscheduled and later days move up. */
  removeDay(day: number) {
    return update((trip) => {
      if (trip.days <= 1) return { ...trip, items: trip.items.map((i) => ({ ...i, day: null })) };
      return {
        ...trip,
        days: trip.days - 1,
        items: trip.items.map((i) => (i.day === day ? { ...i, day: null } : i.day !== null && i.day > day ? { ...i, day: i.day - 1 } : i)),
      };
    });
  },
  clear() {
    return write(EMPTY);
  },
  /** Add items (e.g. from a template or a shared link), keeping days; skips ones already saved. */
  merge(incoming: Trip) {
    return update((trip) => {
      const have = new Set(trip.items.map(itemKey));
      const offset = trip.items.length ? trip.days : 0;
      const added = incoming.items
        .filter((i) => !have.has(itemKey(i)))
        .map((i) => ({ ...i, day: i.day === null ? null : i.day + offset }));
      const days = Math.min(30, Math.max(trip.days, offset + incoming.days));
      return { ...trip, days, items: [...trip.items, ...added.map((i) => (i.day !== null && i.day > days ? { ...i, day: null } : i))] };
    });
  },
};

/* --------------------------------------------------------------- sharing */

const KIND_CODE: Record<RecordKind, string> = { place: "p", business: "b", route: "r", guide: "g", tour: "t", itinerary: "i" };
const CODE_KIND = Object.fromEntries(Object.entries(KIND_CODE).map(([k, v]) => [v, k])) as Record<string, RecordKind>;

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(text: string): string {
  const base64 = text.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64 + "===".slice((base64.length + 3) % 4));
  return new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
}

/** The trip as a compact string for a share link's #fragment. */
export function encodeTrip(trip: Trip): string {
  const compact = { d: trip.days, i: trip.items.map((i) => [KIND_CODE[i.kind], i.slug, i.day ?? 0, i.note]) };
  return toBase64Url(JSON.stringify(compact));
}

export function decodeTrip(text: string): Trip | null {
  try {
    const compact = JSON.parse(fromBase64Url(text)) as { d: number; i: [string, string, number, string][] };
    const trip: Trip = {
      version: 1,
      days: compact.d,
      items: compact.i.map(([k, slug, day, note]) => ({ kind: CODE_KIND[k], slug, day: day > 0 ? day : null, note: note ?? "" })),
    };
    return isTrip(trip) ? trip : null;
  } catch {
    return null;
  }
}
