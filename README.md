# Gusinje & Vusanje Valley Guide

An independent, multilingual visitor guide to **Gusinje, Vusanje and the Prokletije** (Montenegro):
an interactive 3D valley with a map and list of the same places, place pages with sources,
a local directory, walks and hikes, travel tips, virtual tours and a personal trip planner.

Created and hosted by **ROSI**. It is not an official tourism website and is not endorsed by any
tourism organisation or public body. ROSI's own accommodation website (with its booking links) is
separate and unchanged: <https://ariongj.github.io/hotelplav/>.

> **Status:** preview. Content has been checked against published sources but not on the ground,
> Albanian and Montenegrin are unreviewed drafts, and reviews/submissions run in preview mode
> (nothing is sent or stored). See [docs/LAUNCH.md](docs/LAUNCH.md). Nothing has been deployed.

## Quick start

Requires Node.js 20.9+ (22 recommended).

```bash
npm install
npm run dev          # http://localhost:3000/en/
npm run build        # static export → out/
npm run serve        # serve out/ on http://localhost:4173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Static export to `out/` (type-checks too) |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm run check:content` | Content integrity: sources exist, references resolve, coordinates in the region, directory rules, translations complete |
| `npm run test:schema` | Backend schema permission checks in PGlite |
| `npm run test:e2e` | Playwright against the built site (desktop, phone, no-WebGL, axe) — run `npm run build` first |
| `npm test` | All of the above |

## How it is built

**Next.js 16** (App Router, static export), **React 19**, **TypeScript**, **CSS Modules**,
**three.js** (the 3D valley, reused from the ROSI site), **Leaflet** (the map), **qrcode**
(build-time QR codes). No server, no database, no cookies, no analytics.

```
src/
  app/[lang]/          every page, per language (en, sq, cnr); app/(root) picks a language
  content/             the content model — one record per place, listing, route, tour, guide,
                       itinerary; sources.ts; photos.ts (credits and rights); pages.ts (long text)
  i18n/                languages, UI strings (messages/en|sq|cnr.ts), helpers
  components/
    explore/           Explorer (3D + map + list), Leaflet map, legend, info panel
    resort3d/          the illustrative 3D valley engine (three.js) and its React wrapper
    tour/              guided-tour hook and narrator card
    content/           cards, verification panel, sources, share/QR, filters, reviews preview
    plan/              My Trip planner, shared trips
    contribute/ admin/ search/ layout/ ui/
  lib/                 trip store (localStorage), SEO/JSON-LD, search index, explorer data
backend/               Phase 3 schema (Supabase/Postgres + RLS) and its tests — not deployed
docs/PLAN.md           audit of the original project, plan, sitemap, data model, phases
docs/LAUNCH.md         what must happen before a public launch
tests/                 content integrity + end-to-end tests
```

### The content model

Everything the site shows is a typed record in `src/content/` (see `types.ts`). The 3D view, the
map, the lists, the detail pages, search, the sitemap and the planner all read the same records.

- Every record has a **verification** (`field-verified`, `desk-verified`, `self-reported`,
  `unverified`), a **last-checked date**, an **owner** (who keeps it current) and **sources**.
- **Coordinates** carry their own status, precision (point or area) and sources. Places without
  reliable published coordinates (Grlja, Karanfili, Volušnica) are not on the map.
- **Practical facts** (fees, hours, durations, distances, prices) are optional: when unknown,
  pages say "Not yet verified" — nothing is guessed.
- **Routes** show every figure with the source that reported it, have no GPS tracks, and stay
  "awaiting verification" until checked with a guide or the park.
- **Listings** label each feature self-reported or verified; ROSI's listings disclose that ROSI
  hosts the site; all listings are A–Z; `sponsored` is always `false`.
- **Text** is stored per language; Albanian and Montenegrin are marked unreviewed.

To edit content: change the record, run `npm run check:content`, open a pull request.

### Adding a place

1. Add a record to `src/content/places.ts` with sources from `sources.ts` (add new sources there).
2. Photos: only free-licence (Wikimedia Commons) or with written permission — add to `photos.ts`
   with author, licence, licence URL and file page.
3. For the 3D view, add a scene anchor in `src/components/resort3d/` (optional — the map and list
   work without it).
4. Write all three languages; mark translations `unreviewed`.

### Environment variables

See `.env.example`: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_BASE_PATH` (GitHub Pages: `/<repo>`),
`NEXT_PUBLIC_NOINDEX`, `NEXT_PUBLIC_MAP_TILES`, `NEXT_PUBLIC_MAP_ATTRIBUTION`.

## Deploying (only when approved)

`.github/workflows/pages.yml` builds and publishes to GitHub Pages **only when started by hand**
(Actions → "Deploy preview to GitHub Pages" → Run workflow), with `noindex`. `ci.yml` lints,
type-checks, builds and tests every push without publishing anything.

## Credits

Landscape photos: Wikimedia Commons contributors under CC licences (listed on `/credits`).
Map data: © OpenStreetMap contributors. 3D model: procedural illustration, not survey data.
