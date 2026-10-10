import "server-only";

/**
 * The contact form (stay requests for the katun and the hotel, restaurant,
 * transfers, anything else) posts to /api/enquiry, which validates the
 * payload and hands it to deliverEnquiry().
 *
 * Delivery: set ENQUIRY_WEBHOOK_URL to forward each enquiry as JSON to any
 * webhook (Zapier/Make → email, Slack, CRM, a PMS or booking tool). Without
 * it, enquiries are only written to the server log — configure it before
 * going live.
 */

export const ENQUIRY_TYPES = ["contact"] as const;

export type EnquiryType = (typeof ENQUIRY_TYPES)[number];

export type Enquiry = {
  type: EnquiryType;
  fields: Record<string, string>;
  /** Page the form was sent from. */
  page?: string;
  receivedAt: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELDS = 30;
const MAX_LENGTH = 4000;

export type ParseResult = { ok: true; enquiry: Enquiry } | { ok: false; error: string };

export function parseEnquiry(body: unknown): ParseResult {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid request." };
  const { type, fields, page } = body as { type?: unknown; fields?: unknown; page?: unknown };

  if (typeof type !== "string" || !ENQUIRY_TYPES.includes(type as EnquiryType)) {
    return { ok: false, error: "Unknown form." };
  }
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
    return { ok: false, error: "Invalid request." };
  }

  const clean: Record<string, string> = {};
  for (const [key, value] of Object.entries(fields as Record<string, unknown>).slice(0, MAX_FIELDS)) {
    if (value == null) continue;
    clean[key.slice(0, 60)] = String(value).trim().slice(0, MAX_LENGTH);
  }

  if (clean.email && !EMAIL.test(clean.email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (!clean.contact && !clean.email) {
    return { ok: false, error: "Please give us an email address or a phone number." };
  }

  return {
    ok: true,
    enquiry: {
      type: type as EnquiryType,
      fields: clean,
      page: typeof page === "string" ? page.slice(0, 200) : undefined,
      receivedAt: new Date().toISOString(),
    },
  };
}

export async function deliverEnquiry(enquiry: Enquiry): Promise<{ delivered: boolean }> {
  const url = process.env.ENQUIRY_WEBHOOK_URL;
  if (!url) {
    console.info("[enquiry] ENQUIRY_WEBHOOK_URL is not set — logging only:", JSON.stringify(enquiry));
    return { delivered: false };
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(enquiry),
  });
  if (!res.ok) throw new Error(`Enquiry webhook responded ${res.status}`);
  return { delivered: true };
}
