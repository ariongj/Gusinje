/**
 * Deep links into the contact form, pre-filled with a request — e.g. "Request
 * these dates" on a bungalow. The family answers every request personally
 * (by email or phone) with availability and the price.
 */

export type ContactTopic = "katun" | "hotel" | "camping" | "restaurant" | "transfer" | "other";

/** Options of the contact form's topic choice, keyed by URL value. */
export const CONTACT_TOPICS: Record<ContactTopic, string> = {
  katun: "Stay at Eko Katun ROSI",
  hotel: "Stay at Hotel ROSI",
  camping: "Camping at the katun",
  restaurant: "Restaurant or group meal",
  transfer: "Transfer, shuttle or guide",
  other: "Something else",
};

export type ContactPrefill = {
  topic?: ContactTopic;
  /** Room or bungalow name, e.g. "Family bungalow". */
  unit?: string;
  /** ISO dates. */
  checkin?: string;
  checkout?: string;
  /** Number of guests, e.g. "4". */
  guests?: string;
};

const KEYS = ["topic", "unit", "checkin", "checkout", "guests"] as const;

export function contactHref(prefill: ContactPrefill = {}): string {
  const params = new URLSearchParams();
  for (const key of KEYS) {
    const value = prefill[key];
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `/contact?${query}` : "/contact";
}

export function parseContactPrefill(params: URLSearchParams): ContactPrefill {
  const topic = params.get("topic");
  const text = (key: string) => params.get(key)?.slice(0, 120) || undefined;
  const guests = text("guests");
  return {
    topic: topic && topic in CONTACT_TOPICS ? (topic as ContactTopic) : undefined,
    unit: text("unit"),
    checkin: text("checkin"),
    checkout: text("checkout"),
    guests: guests && /^\d{1,2}$/.test(guests) ? guests : undefined,
  };
}
