# Gusinje & Vusanje Valley Guide

An independent, multilingual visitor guide to **Gusinje, Vusanje and the Prokletije** (Montenegro):
a real-terrain 3D map of the valley with a flat map and a list of the same places, place pages with sources,
hidden gems further afield, a local directory, useful services (emergency, health, money, buses, guides),
history and culture, walks and hikes, travel tips, virtual tours, journeys flown on the map and a
personal trip planner.

Created and hosted by **ROSI**. It is not an official tourism website and is not endorsed by any
tourism organisation or public body. ROSI's own accommodation website (with its booking links) is
separate and unchanged: <https://ariongj.github.io/hotelplav/>.

> **Status:** preview. Content has been checked against published sources but not on the ground,
> Albanian and Montenegrin are unreviewed drafts, and reviews/submissions run in preview mode
> (nothing is sent or stored). See [docs/LAUNCH.md](docs/LAUNCH.md).
> A preview is published at <https://ariongj.github.io/Gusinje/> — hidden from search engines
> (`noindex`) and not announced.

## Quick start

Requires Node.js 20.9+ (22 recommended).

```bash
npm install
npm run dev          # http://localhost:3000/en/
npm run build        # static export → out/
npm run serve        # serve out/ on http://localhost:4173
```

To try the GitHub Pages layout locally: build with `NEXT_PUBLIC_BASE_PATH=/Gusinje`, then
`BASE_PATH=/Gusinje npm run serve` and open <http://localhost:4173/Gusinje/en/>.

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Static export to `out/` (type-checks too) |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm run check:content` | Content integrity: sources exist, references resolve, coordinates in the region, directory rules, translations complete |
| `npm run test:schema` | Backend schema permission checks in PGlite |
| `npm run test:e2e` | Playwright against the built site (desktop, phone, no-WebGL, offline, axe) — run `npm run build` first |
| `npm test` | All of the above |

## How it is built

**Next.js 16** (App Router, static export), **React 19**, **TypeScript**, **CSS Modules**,
**MapLibre GL** (the 3D and flat map), **Leaflet** (a simple map for browsers without WebGL),
**qrcode** (build-time QR codes). No server, no database, no cookies, no analytics.

```
src/
  app/[lang]/          every page, per language (en, sq, cnr); app/(root) picks a language
  content/             the content model — one record per place, listing, route, tour, guide,
                       itinerary, service; history.ts (timeline, culture); sources.ts;
                       photos.ts (credits and rights); pages.ts (long text)
  i18n/                languages, UI strings (messages/en|sq|cnr.ts), helpers
  components/
    explore/           Explorer (3D + map + list), legend, info panel, place strip; Leaflet fallback map
    map/               the real-terrain map (MapLibre): styles, terrain, markers, camera flights
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
  reliable published coordinates (today: Volušnica) are listed but never placed on the map.
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
3. Give it coordinates with sources to put it on the 3D map; without them it appears in the list only.
4. Write all three languages; mark translations `unreviewed`.

### Design

The home page opens on a full-screen photo hero that moves through the valley one place at a
time (each photo names its place and author; pause, swipe, dots; still with reduced motion). It
ends in the real outline of the peaks around Vusanje: `scripts/skyline.mjs` reads the same
elevation tiles as the 3D map and writes `src/content/skyline.ts` — for each compass direction,
the highest ground (crest behind, nearer ridges in front), with Zla Kolata, Ropojana and
Karanfili named and linked. Below it, "How long do you have?" puts the four trip plans on one
line, each one tap from flying it in 3D.

Open, photo-led pages: a full-screen hero, an intro statement, a photo mosaic of places, a
full-width band where the 3D valley drifts behind the invitation to explore (it loads only
when scrolled near, and never on data saver), "things to do" photo tiles, tours and practical
information. Cards are borderless photos with text below; page headers have a large title and
photo.

**Explore** fills the screen below the header. The legend and filters float top-left (a
"Legend & filters" button on phones), the selected place opens as a card on the right (a sheet
on phones), and a strip along the bottom lists every place the view can show, in order up the
valley. Picking one flies the camera to that place's own view (`fly()` in
`components/map/TerrainMap.tsx` — it follows the ground's real height, so summits are seen from
further back); previous / next (in the strip and on the card) step through them one at a time.
The camera keeps the place centred in the part of the screen the panels leave open. Labels never
overlap: towns and villages win, then the selected place, and a crowded label shows on hover or
focus. Virtual tours and **journeys** (each trip plan, stop by stop) fly the same camera with a
narrator card; `?tour=<slug>` opens either.

**Map tools**: a photo card when hovering a marker, a compass (tap to face north), an orbit
button that circles the view, full screen (where the browser allows it) and, in 3D, a tap on the
ground shows its height from the elevation data (approximate; the ×1.35 drawing exaggeration is
taken out). On phones the place card is a sheet — swipe down to close, up for more — and the
title bar shrinks so the map gets the room.

**Useful services** (`/services`) and **History & culture** (`/about/history`) are sourced pages
like the rest: every entry shows its sources and check date, contested history is marked as such,
and nothing (phone numbers, hours, prices) is shown unless an official page publishes it.

### Phones, slow connections and no signal

- **Photos** come in the width the screen needs: `src/lib/image-loader.ts` asks Wikimedia Commons
  for one of its standard thumbnail sizes (500, 960 or 1280 px) instead of always 1280 px.
- **Fonts**: only the styles in use (upright Fraunces, Manrope) — 163 KB instead of 532 KB.
- **Prefetching**: only the main navigation and calls to action load ahead; cards, footer,
  breadcrumbs, search and My Trip load when tapped.
- **Explore** opens on the map instead of 3D when the phone has data saver on, a 2G connection
  or very little memory (3D is one tap away).
- **Touch targets** are at least 44 px on touch screens (tested).
- **Add to home screen**: `src/app/manifest.ts`, icons in `public/icons/` and
  `src/app/apple-icon.png` (regenerate with `node scripts/icons.mjs`).
- **Offline**: `public/sw.js` keeps the pages a visitor has opened (and the files they need)
  so they work without signal; anything else shows `public/offline.html`, which lists the saved
  pages. Only this site's public pages are stored — never photos, map tiles or anything typed.
  Bump `VERSION` in `sw.js` to drop old copies.
- `node scripts/measure.mjs [paths]` reports page weight on a phone profile (`SAVE_DATA=1` for
  data saver).

| Page (phone, uncompressed, photos excluded) | Before | Now |
| --- | --- | --- |
| Home `/en/` | 1488 KB | 1093 KB (the 3D band loads only when scrolled to) |
| Explore `/en/explore/` | 2013 KB | 1582 KB (1121 KB with data saver) |
| Place `/en/places/grlja/` | — | 907 KB |

### Environment variables

See `.env.example`: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_BASE_PATH` (GitHub Pages: `/<repo>`),
`NEXT_PUBLIC_NOINDEX`, `NEXT_PUBLIC_MAP_STYLE` (base map style URL, default OpenFreeMap "liberty"),
`NEXT_PUBLIC_MAP_TERRAIN` (terrain tiles, default Mapzen terrarium on AWS), and for the no-WebGL
fallback `NEXT_PUBLIC_MAP_TILES`, `NEXT_PUBLIC_MAP_ATTRIBUTION`.

## Deploying (only when approved)

`.github/workflows/pages.yml` builds and publishes to GitHub Pages **only when started by hand**
(Actions → "Deploy preview to GitHub Pages" → Run workflow), with `noindex` on every page.
The repository's Pages source must be set to "GitHub Actions" (Settings → Pages). `ci.yml` lints,
type-checks, builds and tests every push without publishing anything.

## Credits

Landscape photos: Wikimedia Commons contributors under CC licences (listed on `/credits`).
Map data: © OpenStreetMap contributors (via OpenFreeMap). Terrain: Mapzen terrain tiles (SRTM and
others) via AWS Open Data.
