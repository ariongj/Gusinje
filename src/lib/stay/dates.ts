/**
 * Date helpers for the stay requests. ISO dates (YYYY-MM-DD) throughout;
 * pure functions, safe on the server and in the browser.
 */

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const date = new Date(value + "T00:00:00Z");
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** Whole nights between two ISO dates (negative if checkout is first). */
export function nightsBetween(checkin: string, checkout: string): number {
  const a = Date.parse(checkin + "T00:00:00Z");
  const b = Date.parse(checkout + "T00:00:00Z");
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.round((b - a) / 86_400_000);
}

/** ISO date `days` after `iso`. */
export function addDays(iso: string, days: number): string {
  const date = new Date(iso + "T00:00:00Z");
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Today's date in the visitor's time zone, as ISO. */
export function localTodayIso(now = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

export type StayCheck = { ok: true; nights: number } | { ok: false; error: string };

/** Checks the dates of a request (no prices involved — the family confirms those). */
export function checkStay(checkin: string, checkout: string, today = ""): StayCheck {
  if (!isIsoDate(checkin) || !isIsoDate(checkout)) {
    return { ok: false, error: "Choose your check-in and check-out dates." };
  }
  if (today && checkin < today) return { ok: false, error: "Choose a check-in date from today onwards." };
  const nights = nightsBetween(checkin, checkout);
  if (!(nights > 0)) return { ok: false, error: "Choose a check-out date after your check-in." };
  return { ok: true, nights };
}

/** Guest counts offered by the request widgets (the family bungalow and family rooms sleep 5). */
export const GUEST_COUNTS = [1, 2, 3, 4, 5, 6] as const;
export const DEFAULT_GUESTS = 2;

export function guestsLabel(count: number): string {
  return count === 1 ? "1 guest" : `${count} guests`;
}
