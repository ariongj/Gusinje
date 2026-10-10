# Hotel & Eko Katun ROSI — website

Website for the family-run **Hotel & Eko Katun ROSI** at the foot of the Prokletije ("Accursed Mountains") in north-eastern Montenegro:

- **Eko Katun ROSI** in Vusanje (Vuthaj) — wooden bungalows, family rooms and camping on a working mountain farm, with Restaurant ROSI Tradicional and the family's stone tower (kula), kept as a small living museum. Listed on Booking.com as "Ethno Katun ROSI Agrotourism".
- **Hotel ROSI** in Gusinje — a family-run 3-star hotel on the road into town, with Restaurant Rosi (pizza, Italian and local dishes).

**Bookings are requests.** Guests pick a place, dates and the number of guests, and the family replies with availability and the price; live prices and instant booking are one click away on Booking.com, with the dates filled in. The site never shows invented prices, room counts or availability.

**Look — "Lakeside modern":** deep teal `#0F3B3F`, glacier `#CFE3E6`, stone `#F2EFE9` and brass `#B8894A`; Fraunces for headlines and Manrope for text; rounded, frosted-glass surfaces and pill buttons.

Built with **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript**, **CSS Modules** and **three.js**. An earlier design handoff for a different property is kept in [`design/`](design/README.md) for reference only; none of its names or copy are used on the site.

## Quick start

Requires Node.js 20.9 or newer (24 LTS recommended).

```bash
npm install
npm run dev
```

Open http://localhost:3000.

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build (type-checks too) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript only |

## Live preview (GitHub Pages)

Every push to `main` publishes a preview to **https://ariongj.github.io/hotelplav/** through `.github/workflows/pages.yml`. The preview is marked `noindex` so search engines skip it.

GitHub Pages only serves static files, so the preview is a static export without the `/api/enquiry` route. Until a form service is connected, the request form writes the request out as an email for the guest to send from their own mail app (to the family's address), with the phone number beside it — nothing is lost. To deliver requests directly, create a form endpoint that accepts JSON (e.g. Formspree) and add it as the repository variable `NEXT_PUBLIC_ENQUIRY_ENDPOINT` (Settings → Secrets and variables → Actions → Variables).

To build the same export locally: move `src/app/api` out of the way, delete `.next`, then run `npm run build` with `NEXT_PUBLIC_STATIC_EXPORT=true` and `NEXT_PUBLIC_BASE_PATH=/hotelplav`; the site is written to `out/`. Internal links must use `next/link` so they pick up the base path.

## Deploy

- **Vercel** (recommended for the live site): import the GitHub repository, keep the detected Next.js settings, add the environment variables below, deploy.
- **Netlify** supports Next.js the same way.
- **Any Node.js host**: `npm ci && npm run build && npm start` (port 3000, or set `PORT`).

The pages are prerendered as static HTML; only `/api/enquiry` runs on the server.

## Environment variables

Copy `.env.example` to `.env.local` for local work, or set these in the hosting dashboard.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public origin of the site (canonical URLs, sitemap, structured data). Defaults to the GitHub Pages preview; set it to the real domain once there is one. |
| `ENQUIRY_WEBHOOK_URL` | Where requests are delivered (JSON POST) — e.g. a Zapier or Make webhook that emails the family. **Without it, the form falls back to "send it by email" on the server too.** |

## Pages

| Route | What's there |
| --- | --- |
| `/` | Live 3D valley hero with a request bar (place, dates, guests), the matching rooms and bungalows, both places, life at the katun, the stay rail, things nearby, both restaurants, the 3D valley teaser, gallery, guest scores, location and getting here |
| `/katun` | Eko Katun ROSI: units, the stone tower, the animals, facilities, camping, distances, house rules, gallery |
| `/hotel` | Hotel ROSI: rooms, Restaurant Rosi, the view, facilities, distances, house rules, gallery |
| `/rooms` | Every room, bungalow and the camping meadow, filterable by place, guests and dates; each with "Request dates" and Booking.com |
| `/dining` | Restaurant ROSI Tradicional and Restaurant Rosi, breakfast, the food of the region (not a menu), groups |
| `/experiences` | Grlja and the Blue Eye, Ali Pasha's Springs, the Ropojana, Grbaja and Karanfili, Zla Kolata, the Peaks of the Balkans, Lake Plav; summer and winter |
| `/tour` | The 3D valley (three.js) with ten places, a narrated guided tour (optional voice) and the places as cards; deep links `/tour#katun`, `/tour#grlja` … and `/tour#guided-tour` |
| `/contact` | Request form (pre-filled from "Request these dates" links via the URL), phones, email, social, getting here, both places on the valley map |
| `/credits` | Every Wikimedia Commons photo with its author, licence and the pages it appears on — collected from the content data |

## Project structure

```
src/
  app/                 routes, the enquiry API route, sitemap/robots, favicon, global styles and design tokens
  components/
    layout/            nav + mobile menu, footer
    ui/                PageHero, Photo (next/image wrapper), PhotoCredit, ValleyMap (2D), scroll-reveal observer
    property/          sections shared by the katun and hotel pages
    stay/              the room / bungalow card
    resort3d/          the 3D valley (three.js, loaded on demand), its terrain and its places
    home/ rooms/ dining/ tour/ experiences/ contact/   page sections and their content
  config/site.ts       name, phones, email, social links, navigation
  lib/stay/            the two properties, their units, photos, dates, Booking.com and request links, travel facts
  lib/contact-link.ts  request links into the contact form
  lib/enquiry*.ts      form validation and delivery
  styles/ui.module.css shared type and button primitives
design/                earlier design handoff for a different property (reference only)
```

Conventions: colours, fonts and spacing are CSS variables in `src/app/globals.css`; each component has a CSS Module next to it. Add `data-reveal="up|left|right"` (and optionally `data-delay="80"`) to elements below the fold to fade them in on scroll — keep it off above-the-fold headings and buttons. Facts about the properties live once in `src/lib/stay/` and are read from there everywhere else.

## Facts and sources

Everything about the two places comes from their own listings and pages (Booking.com, Google, the Gusinje Tourism Organisation, the family's Instagram and Facebook); facts about the valley from the Gusinje municipality, Prokletije National Park, montenegro.travel, the Peaks of the Balkans and Wikipedia. Distances and driving times are approximate. Guest scores are shown with their source and date (`scoresDate` in `src/lib/stay/properties.ts`) — update them when they change.

Deliberately left out until the family confirms them: prices, room and bungalow counts, sizes not on the listings, and anything a source didn't back up.

## Photography

- **The family's photos** are hot-linked from their Booking.com listings (`cf.bstatic.com`) as a stopgap. Before launch, ask the family for the original files (and confirm they own the rights), put them in `public/`, update `src/lib/stay/photos.ts`, and remove `cf.bstatic.com` from `images.remotePatterns` in `next.config.ts`.
- **Wikimedia Commons** — the valley and mountain photos are used under their free licences (CC BY, CC BY-SA, CC0). Each carries a `credit` (author, licence, file page); `<PhotoCredit>` prints it next to the image and `/credits` lists them all. Keep the credit for as long as a photo is used.
- Gaps: no photos yet of the restaurant interiors, the hotel's breakfast or bar, or the deluxe family room.

## 3D valley

`src/components/resort3d/` is a stylised, procedurally generated model of the valley — illustrative, not a survey: Gusinje and Hotel ROSI at the north end, the road up past Ali Pasha's Springs to Eko Katun ROSI (bungalows, the restaurant, the kula, the stone house, tents, sheep and ponies) and Vusanje, the Grlja waterfall and Oko Skakavice, the Ropojana, Karanfili to the west and Zla Kolata on the border to the south-east. Autumn colours in October and November, snow in winter.

- `terrain.ts` — the valley floor, peaks, the Grlja rock step, pools and building plots (+x is west, +z is north).
- `resortEngine.ts` — buildings, water, trees, lights and the camera views for every place.
- `pois.ts` — the places, their text and photos (shared by the map, the guided tour and the cards).

The same engine drives the home-page hero (`<ResortMap variant="hero" />`: no controls, a slow drift). three.js is downloaded only on the home and tour pages; phones get a lighter scene, and motion respects `prefers-reduced-motion`. The guided tour's stops and narration are in `src/components/tour/guide.ts`.

## Forms

The request form posts to `/api/enquiry` (type `contact`), validated and delivered by `src/lib/enquiry.ts`. It carries the topic (katun, hotel, camping, restaurant, transfer, other), room, dates, nights, guests and an email or phone number. A honeypot field stops simple bots; add rate limiting or a CAPTCHA if spam becomes a problem.

## Before launch

To confirm with the family:

- [ ] The name: "Eko Katun ROSI" (Instagram, Facebook) or "Ethno Katun ROSI" (Booking.com).
- [ ] Which phone number belongs to which place or person, and whether they use WhatsApp or Viber.
- [ ] Rates, how many of each room and bungalow there are, sizes, and the deluxe family room's photos.
- [ ] The original photo files and permission to use them (see Photography).
- [ ] A domain for the site (then set `NEXT_PUBLIC_SITE_URL` on the live host, and leave `NEXT_PUBLIC_NOINDEX` unset there so search engines can index it).

Wiring:

- [ ] Set `ENQUIRY_WEBHOOK_URL` (or `NEXT_PUBLIC_ENQUIRY_ENDPOINT` on static hosting) and send a test request.
- [ ] Replace the favicon (`src/app/icon.svg`) with the family's logo if they have one.
