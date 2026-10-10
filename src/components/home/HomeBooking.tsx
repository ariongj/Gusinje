"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

import { checkStay, DEFAULT_GUESTS } from "@/lib/stay/dates";
import type { PropertyId } from "@/lib/stay/properties";
import { useStayDates } from "@/lib/stay/useStayDates";

/** A submitted request: what the results section shows. */
export type StaySearch = {
  property: PropertyId;
  checkin: string;
  checkout: string;
  nights: number;
  guests: number;
};

type HomeBookingState = ReturnType<typeof useStayDates> & {
  property: PropertyId;
  setProperty: (property: PropertyId) => void;
  guests: number;
  setGuests: (guests: number) => void;
  search: StaySearch | null;
  error: string;
  /** Validates the form; resolves true when there are results to show. */
  submit: () => boolean;
};

const HomeBookingContext = createContext<HomeBookingState | null>(null);

/**
 * State shared by the hero's request bar, the results and the sticky bar.
 * There is no live inventory: results list the room types that fit, and the
 * family confirms availability and the price for each request.
 */
export function HomeBookingProvider({ children }: { children: ReactNode }) {
  const dates = useStayDates();
  const [property, setProperty] = useState<PropertyId>("katun");
  const [guests, setGuests] = useState(DEFAULT_GUESTS);
  const [search, setSearch] = useState<StaySearch | null>(null);
  const [error, setError] = useState("");

  const { checkin, checkout, today } = dates;

  const submit = useCallback(() => {
    const stay = checkStay(checkin, checkout, today);
    if (!stay.ok) {
      setError(stay.error);
      return false;
    }
    setError("");
    setSearch({ property, checkin, checkout, nights: stay.nights, guests });
    return true;
  }, [checkin, checkout, today, property, guests]);

  const value: HomeBookingState = { ...dates, property, setProperty, guests, setGuests, search, error, submit };

  return <HomeBookingContext.Provider value={value}>{children}</HomeBookingContext.Provider>;
}

export function useHomeBooking(): HomeBookingState {
  const context = useContext(HomeBookingContext);
  if (!context) throw new Error("useHomeBooking must be used inside <HomeBookingProvider>");
  return context;
}
