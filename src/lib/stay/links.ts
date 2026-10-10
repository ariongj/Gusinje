/**
 * Links out of the request flow: Booking.com with the dates filled in, the
 * contact form pre-filled with a stay, and Google Maps.
 */

import { contactHref, type ContactTopic } from "@/lib/contact-link";

import { isIsoDate } from "./dates";
import { getProperty, type Property, type PropertyId } from "./properties";

export type StayPrefill = {
  property: PropertyId;
  unit?: { id: string; name: string };
  checkin?: string;
  checkout?: string;
  guests?: number;
};

/** The property's Booking.com listing, with dates and guests when known (prices shown there are live). */
export function bookingUrl(property: PropertyId, stay: Omit<StayPrefill, "property" | "unit"> = {}): string {
  const url = new URL(getProperty(property).booking.url);
  if (stay.checkin && stay.checkout && isIsoDate(stay.checkin) && isIsoDate(stay.checkout)) {
    url.searchParams.set("checkin", stay.checkin);
    url.searchParams.set("checkout", stay.checkout);
  }
  if (stay.guests) {
    url.searchParams.set("group_adults", String(stay.guests));
    url.searchParams.set("group_children", "0");
    url.searchParams.set("no_rooms", "1");
  }
  url.searchParams.set("selected_currency", "EUR");
  return url.toString();
}

/** The contact form, pre-filled with a stay request (lands on the form). */
export function requestHref(stay: StayPrefill): string {
  const topic: ContactTopic = stay.unit?.id === "camping" ? "camping" : stay.property;
  const href = contactHref({
    topic,
    unit: stay.unit?.name,
    checkin: stay.checkin,
    checkout: stay.checkout,
    guests: stay.guests ? String(stay.guests) : undefined,
  });
  return `${href}#write`;
}

export function mapsUrl(property: Property): string {
  return `https://www.google.com/maps/search/?api=1&query=${property.coords.lat},${property.coords.lng}`;
}

export function directionsUrl(property: Property): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${property.coords.lat},${property.coords.lng}`;
}
