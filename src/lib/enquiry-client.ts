"use client";

export type EnquiryType = "contact";

/** `preview`: the static preview has nowhere to send the form, so nothing went out. */
export type EnquiryResponse = { ok: true; preview?: boolean } | { ok: false; error: string };

/** True for the static export (GitHub Pages preview), which has no /api/enquiry. */
const STATIC_EXPORT = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
/** Optional form service for static hosting (e.g. a Formspree endpoint accepting JSON). */
const FORM_ENDPOINT = process.env.NEXT_PUBLIC_ENQUIRY_ENDPOINT;

const SEND_FAILED = "We couldn't send that just now — please call or email us directly.";

/** Accepts an email address or a phone number (6+ digits). */
export function isEmailOrPhone(value: string): boolean {
  const v = value.trim();
  if (v.includes("@")) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  return /^[+\d\s().-]+$/.test(v) && v.replace(/\D/g, "").length >= 6;
}

/** Send a form to /api/enquiry. Never throws — failures come back as { ok: false }. */
export async function submitEnquiry(
  type: EnquiryType,
  fields: Record<string, string | number | boolean | null | undefined>,
): Promise<EnquiryResponse> {
  const payload = { type, fields, page: window.location.pathname };

  if (STATIC_EXPORT) {
    // Bots fill the hidden honeypot; drop those quietly.
    if (typeof fields.company === "string" && fields.company.trim()) return { ok: true };
    // No form service yet: the caller offers to send the request by email instead.
    if (!FORM_ENDPOINT) return { ok: true, preview: true };
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...payload, ...fields }),
      });
      return res.ok ? { ok: true } : { ok: false, error: SEND_FAILED };
    } catch {
      return { ok: false, error: SEND_FAILED };
    }
  }

  try {
    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as EnquiryResponse;
    return data;
  } catch {
    return { ok: false, error: SEND_FAILED };
  }
}
