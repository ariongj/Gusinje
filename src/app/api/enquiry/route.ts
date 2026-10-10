import { NextResponse } from "next/server";

import { deliverEnquiry, parseEnquiry } from "@/lib/enquiry";

/** POST /api/enquiry — { type, fields, page } from any form on the site. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill the hidden "company" field; pretend success.
  const fields = (body as { fields?: Record<string, unknown> } | null)?.fields;
  if (fields && typeof fields.company === "string" && fields.company.trim()) {
    return NextResponse.json({ ok: true });
  }

  const parsed = parseEnquiry(body);
  if (!parsed.ok) return NextResponse.json(parsed, { status: 422 });

  try {
    const { delivered } = await deliverEnquiry(parsed.enquiry);
    // Nowhere to deliver yet (no webhook): the form offers to send it by email instead.
    return NextResponse.json(delivered ? { ok: true } : { ok: true, preview: true });
  } catch (error) {
    console.error("[enquiry] delivery failed", error);
    return NextResponse.json(
      { ok: false, error: "We couldn't send that just now — please call or email us directly." },
      { status: 502 },
    );
  }
}
