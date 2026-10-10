"use client";

import { useCallback, useState, useSyncExternalStore } from "react";

import { addDays, isIsoDate, localTodayIso, nightsBetween } from "./dates";

const subscribeNoop = () => () => {};

/** False during SSR and hydration, true afterwards. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

/**
 * Check-in / check-out state for the request widgets. Defaults (today + 14,
 * two nights) are computed in the browser after hydration, so a statically
 * built page never shows stale dates. Moving check-in onto or past check-out
 * carries check-out along, keeping the stay's length.
 */
export function useStayDates(leadDays = 14, defaultNights = 2) {
  const hydrated = useHydrated();
  const [checkinInput, setCheckinInput] = useState<string | null>(null);
  const [checkoutInput, setCheckout] = useState<string | null>(null);

  const today = hydrated ? localTodayIso() : "";
  const defaultCheckin = hydrated ? addDays(today, leadDays) : "";
  const checkin = checkinInput ?? defaultCheckin;
  const checkout = checkoutInput ?? (isIsoDate(checkin) ? addDays(checkin, defaultNights) : "");

  const setCheckin = useCallback(
    (next: string) => {
      setCheckinInput(next);
      if (isIsoDate(next) && checkout && checkout <= next) {
        const nights = isIsoDate(checkin) ? Math.max(1, nightsBetween(checkin, checkout)) : defaultNights;
        setCheckout(addDays(next, nights));
      }
    },
    [checkin, checkout, defaultNights],
  );

  return { checkin, checkout, setCheckin, setCheckout, today };
}
