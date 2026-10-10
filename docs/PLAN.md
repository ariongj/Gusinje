# Destination platform — audit and implementation plan

Status: working plan, October 2026. Owner: ROSI (creator and host). Nothing in this
document is approved by, endorsed by or agreed with any tourism organisation.

## 1. Audit of the existing project

**Where it lives.** The existing experience is the `ariongj/hotelplav` repository, published
as a GitHub Pages preview at `ariongj.github.io/hotelplav/` (the 3D valley is `/tour/`). The
`ariongj/Gusinje` repository was empty. The platform is built here, starting from an
unmodified copy of hotelplav (first commit), so the hotel website stays exactly where it is.

**Stack.** Next.js 16 (App Router, Turbopack), React 19, TypeScript, CSS Modules,
three.js 0.186. Static export to GitHub Pages under a base path; an `/api/enquiry` route
exists for server hosting only. No database, no accounts, no CMS: content is typed
TypeScript modules.

| Area | Finding | Decision |
| --- | --- | --- |
| 3D engine (`resort3d/resortEngine.ts`, `terrain.ts`) | Procedural, deterministic, *illustrative, not to scale* valley in world units (+x west, +z north). Good camera flights, overlap-aware pin labels, keyboard-reachable pins, zoom/reset, damping, reduced motion, lighter scene on phones, pauses off-screen. | **Reuse.** Decouple anchors/views from the hotel's place list so any record can point at a scene anchor. Keep the "illustrative" label prominent; real locations come from the map. |
| Terrain data | No DEM or survey data; positions are hand-placed. No terrain imagery is used, so there is no imagery licence to comply with. | Keep illustrative 3D. Real coordinates live on records with sources; the 2D map uses them. |
| Guided tour (`useGuidedTour`, `GuideCard`) | Back/next, play/pause, optional voice (Web Speech), ←/→/Esc, progress bar, exit. One tour; it promotes the hotel and ends with a booking prompt. | **Reuse** the hook and card. Add intro, restart, progress text, multiple themed tours, storytelling disclaimer; drop booking prompts. |
| Place data | Split over `pois.ts`, `guide.ts`, `experiences/content.ts`, the SVG `ValleyMap` — four copies of the same facts, no real coordinates, no per-fact sources, no verification dates. | Replace with one content model (below) that every view reads. |
| WebGL failure | Shows a sentence and a link to the cards. | Replace with the map + list (same records) and a photo-led tour. |
| "Hikes & routes" links | All point to `/experiences#seasons`. | Dedicated route pages. |
| Photography | 23 Wikimedia Commons photos with author, licence and file page; `/credits` page. Owner photos hot-linked from Booking.com pending rights. | **Reuse** Commons photos with credits (add licence links). Use owner photos only on ROSI's own listings, marked "rights pending". |
| Third-party scores | The hotel site shows Booking.com/Google scores with source and date. | Not copied into the platform: no authorised integration. |
| Design | Teal/brass tokens, Fraunces + Manrope, glass surfaces, restrained motion. | **Reuse** tokens; region-first art direction. |
| Hotel pages (`/katun`, `/hotel`, `/rooms`, `/dining`, `/contact`) | Working, with Booking.com links. | Left untouched in hotelplav (still live). ROSI appears here as two clearly disclosed listings linking to that site and to Booking.com. |
| Hosting | Pages workflow deploys on every push to `main`. | Workflow changed to **manual dispatch only** so nothing is published without approval. |

## 2. Implementation plan

1. Restructure into a locale-prefixed, statically exported site (`/en`, `/sq`, `/cnr`).
2. One typed content model in `src/content/` with sources, verification status and dates on every record.
3. Explorer: 3D, map and list views of the same records; filters, legend, selection panel, deep links, themed tours, WebGL fallback.
4. Detail pages for places, businesses, routes, guides, tours — with share link, QR code, sources and last-checked date.
5. Directory (stay, eat & drink, guides & experiences, services) with verified/self-reported labels and Submit / Claim / Correct flows.
6. Travel Tips, itinerary templates, search, translations (marked unreviewed), My Trip planner.
7. Reviews and contributions: real data model, permissions and moderation design; front end in clearly labelled preview mode; backend schema ready for an approved service.
8. Partner pilot proposal page, launch-readiness checklist, tests.

## 3. Sitemap

```
/                                  language chooser (redirects to the browser's language)
/{lang}/                           Home
/{lang}/explore/                   Explore in 3D — 3D | Map | List   (?view= ?place= ?cat= ?tour=)
/{lang}/tours/  /{lang}/tours/{slug}/            Virtual tours (text version of every stop)
/{lang}/places/ /{lang}/places/{slug}/           Places: villages, waterfalls, springs, valleys, peaks, culture
/{lang}/stay/                      Directory — accommodation
/{lang}/eat-drink/                 Directory — restaurants & cafés
/{lang}/guides-experiences/        Guides, activity providers, hikes, virtual tours
/{lang}/hikes/{slug}/              Route pages
/{lang}/directory/ /{lang}/directory/{slug}/     All listings incl. shops, transport, rental, visitor services
/{lang}/travel-tips/ /{lang}/travel-tips/{slug}/ Travel Tips
/{lang}/plan/                      Plan Your Trip — My Trip + itinerary templates
/{lang}/plan/itineraries/{slug}/   Itinerary templates
/{lang}/plan/shared/               Read-only shared trip (data travels in the link)
/{lang}/about/                     About the Region
/{lang}/about/platform/            About this guide: who runs it, listings, ratings, moderation
/{lang}/search/                    Search
/{lang}/contribute/                Submit a business · Claim a listing · Suggest a correction · Share a tip
/{lang}/partners/                  Pilot proposal (proposal only)
/{lang}/credits/                   Photo credits, map data, sources
/{lang}/admin/                     Editorial dashboard (noindex): verification + translation status, moderation preview
```

## 4. Data model (summary — full types in `src/content/types.ts`)

- **Localized&lt;T&gt;** `{ en, sq?, cnr? }` + per-record `translations: { sq: "unreviewed" | "reviewed", … }`. Missing → English with a notice.
- **Source** registry: id, title, publisher, URL, kind (`official` | `reference` | `business` | `field`), accessed date.
- **Verification** on every record and on coordinates: `field-verified` | `desk-verified` | `self-reported` | `unverified`, `lastChecked`, `sources[]`, notes.
- **Media**: src, size, alt (localized), credit (author, licence, licence URL, file page), rights (`free-licence` | `owner-permission` | `owner-pending`).
- **Place**: slug, names + alternate names (with language), category, area, summary/description/highlights, coordinates (+ precision, sources), 3D scene anchor (illustrative), media, access, accessibility limits, seasonality, duration, fees, hours (each optional — omitted, never guessed), warnings, official links, related routes/tours, verification.
- **Business**: slug, name, categories, area, description, coordinates, address, public contact (phone, WhatsApp only if approved, email, website), booking links, services, attributes each with `basis: self-reported | verified`, hours/prices only when supplied and dated, media, disclosure (e.g. platform creator), `sponsored` (separate from ratings), ownership claim status, verification.
- **VirtualTour**: theme, intro, storytelling disclaimer, ordered stops (scene view + place + narration).
- **Route**: type (walk | hike | summit | canyon | cross-border), start, distance/ascent/duration/difficulty each with a source or absent, season, equipment, guide recommendation, access, permits, `track: null` (no generated GPX), `status: published | awaiting-verification`.
- **Guide** (Travel Tips): topic, sections each with sources and `editorial-verified | community | needs-verification`, owner role, updated date.
- **Itinerary** template: length, level, interests, days → stops, disclaimer.
- **Review / Tip / Report / BusinessResponse / Submission / Claim / Correction** (Phase 3): see `backend/schema.sql` — statuses, moderation actions, priorities (safety first), authorship, edit/delete by author.
- **Roles**: admin, editor, moderator, business owner (scoped to listings), visitor.

## 5. Phases

| Phase | Scope | State after this delivery |
| --- | --- | --- |
| 1 | Destination structure, 3D improvements, fallback, place pages, initial directory | Built |
| 2 | Travel Tips, search, translations, local trip planner | Built (translations machine-drafted, marked unreviewed) |
| 3 | Approved backend, reviews, submissions, enquiries, moderation | Data model, permissions, schema and preview-mode UI built; **no backend connected** — needs approval |
| 4 | Partner presentation, optimisation, launch review | Proposal page + checklist built; launch needs content verification and approvals |

## 6. Backend options for Phase 3 (not purchased, not created)

| Option | What it gives | Cost (indicative, check before buying) | Access needed |
| --- | --- | --- | --- |
| Supabase (Postgres + Auth + Storage) | Email-verified accounts, row-level security, photo storage | Free tier for a pilot; paid plan when traffic grows | A Supabase project owned by you; anon key in the front end, service key only in a server/edge function |
| Cloudflare Workers + D1 + Turnstile | Serverless API, SQLite, bot protection | Free tier generous; paid plan for scale | Cloudflare account; API token kept in CI secrets |
| Form service only (e.g. Formspree) | Business submissions and corrections by email, no reviews | Free/low tier | Endpoint URL as a repository variable |

Recommendation: Supabase for the pilot (auth, RLS and storage in one place). The schema in
`backend/schema.sql` targets it. Nothing is created until you approve it.
