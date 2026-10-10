/**
 * The stay request as text: chips above the form, the confirmation, and the
 * email the visitor can send themselves when the form has nowhere to go
 * (the static preview).
 */

import { site } from "@/config/site";
import { CONTACT_TOPICS, type ContactTopic } from "@/lib/contact-link";
import { plural, shortDate } from "@/lib/format";
import { guestsLabel, isIsoDate, nightsBetween } from "@/lib/stay/dates";

export type StayRequest = {
  topic: ContactTopic;
  unit?: string;
  checkin?: string;
  checkout?: string;
  guests?: string;
  name?: string;
  contact?: string;
  message?: string;
};

/** Topics that are a request to stay — they show the dates and guests fields. */
export const STAY_TOPICS: readonly ContactTopic[] = ["katun", "hotel", "camping"];

export function isStayTopic(topic: ContactTopic): boolean {
  return STAY_TOPICS.includes(topic);
}

const year = (iso: string) => iso.slice(0, 4);

/** "12 Jun – 14 Jun 2027 · 2 nights", "From 12 Jun 2027", or "" without usable dates. */
export function datesLabel(checkin = "", checkout = ""): string {
  if (!isIsoDate(checkin)) return "";
  const nights = isIsoDate(checkout) ? nightsBetween(checkin, checkout) : 0;
  if (nights > 0) {
    const from = year(checkin) === year(checkout) ? shortDate(checkin) : `${shortDate(checkin)} ${year(checkin)}`;
    return `${from} – ${shortDate(checkout)} ${year(checkout)} · ${plural(nights, "night")}`;
  }
  return `From ${shortDate(checkin)} ${year(checkin)}`;
}

/** The stay as short parts, e.g. ["Family bungalow", "12 Jun – 14 Jun 2027 · 2 nights", "4 guests"]. */
export function staySummary({ topic, unit, checkin, checkout, guests }: StayRequest): string[] {
  if (!isStayTopic(topic)) return [];
  const parts: string[] = [];
  if (unit) parts.push(unit);
  const dates = datesLabel(checkin, checkout);
  if (dates) parts.push(dates);
  const count = Number(guests);
  if (count > 0) parts.push(guestsLabel(count));
  return parts;
}

/** Long emails get cut by some mail apps; the message is trimmed to keep the link safe. */
const MAX_MESSAGE = 1200;

/** A mailto: link with the whole request written out, ready to send. */
export function requestEmailHref(request: StayRequest): string {
  const topic = CONTACT_TOPICS[request.topic];
  const stay = staySummary(request);
  const dates = isStayTopic(request.topic) ? datesLabel(request.checkin, request.checkout) : "";
  const subject = dates ? `${topic}, ${dates}` : topic;

  const lines = [`Hello,`, ``];
  lines.push(request.message?.trim().slice(0, MAX_MESSAGE) || `I'd like to ask about: ${topic}.`);
  lines.push(``);
  if (stay.length > 0) {
    lines.push(`— ${topic}`);
    for (const part of stay) lines.push(`— ${part}`);
    lines.push(``);
  }
  if (request.name?.trim()) lines.push(request.name.trim());
  if (request.contact?.trim() && !request.contact.includes("@")) lines.push(`Phone: ${request.contact.trim()}`);

  const query = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  return `${site.email.href}?${query}`;
}
