# Launch readiness

Status on 10 October 2026: **not ready for public launch.** The platform works
end to end as a preview, but its content has only been checked against
published sources, translations are unreviewed, and no backend or partnership
exists. A `noindex` preview is published on GitHub Pages
(<https://ariongj.github.io/Gusinje/>, approved by the owner on 10 October 2026);
it has not been announced or submitted anywhere.

## What works now

- Language-prefixed static site (English, Albanian, Montenegrin) — about 220 pages.
- Explore: real-terrain 3D map (elevation data + OpenStreetMap) that also lies flat as a map, plus a list, on the same records, filters, legend, deep links, four themed virtual tours and four journeys (the trip plans flown stop by stop), map/photo fallback without WebGL.
- 18 place pages (10 on the map; 7 marked as hidden gems further afield), 11 listings, 6 walk/hike pages, 9 travel guides, 4 itinerary templates, 4 tours and 129 cited sources — each page with sources, check dates, share link and QR code.
- Useful services (13 entries: emergency numbers, mountain rescue, police, tourist office, national park, health, pharmacy, hospital, cash, buses, guides) and a history & culture page (timeline of 7 periods, 6 culture notes).
- My Trip planner (local only), search across languages, editorial dashboard.
- Reviews, submissions, claims, corrections and moderation **in preview mode** (nothing is sent or stored); backend schema ready and tested.
- Design: open, photo-led pages; full-screen Explore with a place strip, a card per place and previous / next through every place.
- Phones: responsive photo sizes, trimmed fonts, limited prefetching, map-first Explore on data saver / 2G, 44 px touch targets, add-to-home-screen, offline copies of visited pages.
- Tests: content integrity, desktop and phone end-to-end, no-WebGL, offline, touch targets, axe accessibility scan, schema permissions.

## Blocking before a public launch

### Content verification (editorial team / local partners)

- [ ] **Open every source** in `src/content/sources.ts` and confirm the cited fact. Desk research was done through web search from a restricted environment — figures and wording were read in search results quoting the pages. Update `accessed`.
- [ ] **Field-check the pilot places** (positions, access, accessibility, warnings, seasonal notes) and set `status: "field-verified"` with the date and partner.
- [ ] Record coordinates on site for **Volušnica** — no reliable published coordinates were found, so it is not on the map. Confirm **Grlja** (canyon entrance, from OpenCanyon/Evendo) and **Karanfili** (Veliki vrh, from German Wikipedia/PeakVisor) on site.
- [ ] Confirm **Vusanje's** centre point (Wikipedia and Wikidata differ by ~570 m) and **Ropojana** (single source).
- [ ] Confirm **emergency numbers** (112/122/123/124) and the **Mountain Rescue (GSS)** contact against official Montenegrin sources.
- [ ] Confirm **Peaks of the Balkans border-permit** procedure and lead time with the border police; confirm whether the **Grnčar–Vermosh** crossing is open, to whom and when.
- [ ] Confirm the **national park day-ticket price**, children's entry and visitor-centre locations/hours (only the 2026 annual pass, €13.50, is confirmed).
- [ ] Confirm park rules on **drones** (only a news headline was read) and **waste**.
- [ ] Resolve disputed facts: **Vizier's Mosque** founding date (1626 / 17th c. / 1765), **Grlja** fall height (12–30 m in sources), elevations of Gusinje/Vusanje.
- [ ] Have a licensed guide or the park review every **route page**; only then mark a route `published`.
- [ ] Review all sections marked "General advice — awaiting local review".
- [ ] **Useful services** (`src/content/services.ts`): call or visit each service and confirm address, hours, phone and email. Facts were read from search excerpts of the official pages; the tourist office's phone is left out because its pages give two different numbers. Bus operators are named from booking sites only — confirm timetables are not shown and operators are current.
- [ ] **History & culture** (`src/content/history.ts`): a local historian reviews every entry. Dates come from encyclopaedia and research-institute summaries; the 1912–1913 entry is marked contested and must stay balanced; the Second World War is deliberately not covered until a historian writes it.
- [ ] **Hidden gems** (Lake Plav, Hridsko Lake, Lake Visitor, Kusija waterfall, Rosni vrh, Talijanka/Popadija, Grnčar valley): confirm access and add sourced coordinates — they are listed but not on the map.
- [ ] Three more Commons photos were added in this round (Prokletije near Vusanje — Ivan25, CC BY-SA 3.0; upper Grbaja from Talijanka and Hridsko Lake — Bruno Rijsman, CC BY 2.0), read from search excerpts of their file pages; check each file page. Strong Vusanje candidates whose licence could not be read from here — "Peaks of the Balkans" 218–230 in Category:Vusanje (three of them portrait, good for phones), Prokletije2/4/5/6/7/9, Vuthajt.jpg — should be checked on Commons and added if their licence is free.
- [ ] Four photos were added from Wikimedia Commons (Zla Kolata ×2, Lake Plav, Karanfili); check each file page's licence once more before launch. A further 25 candidate photos were found but not used because their licence or subject could not be confirmed.

### Translations

- [ ] A fluent Albanian editor reviews `src/i18n/messages/sq.ts` and all `sq` content fields; then set `meta.status` and each record's `translations.sq` to `"reviewed"`.
- [ ] Same for Montenegrin (`cnr.ts`, `cnr` fields).
- [ ] Decide the Albanian/Montenegrin names you want for the guide itself (`src/config/brand.ts`).

### Listings and media

- [ ] ROSI: confirm details (name variant, phone per property, WhatsApp yes/no, hours) and send **original photo files with written permission**; move them into `public/` and stop hot-linking Booking.com.
- [ ] Other listings come from the Gusinje Tourism Organisation's public pages (name and type only). Invite each business to claim and complete its listing — or remove listings a business does not want.
- [ ] Decide whether to list restaurants shown only on the tourism organisation's index page (Restaurant-Guest House "Grlja", MountainView Resort, Restaurant „Napolis") — they were not added because no individual listing page was found.
- [ ] Add licensed mountain guides only after checking their licences.

### Approvals and services (yours to decide)

- [x] **Preview deployment** on GitHub Pages with `noindex` (manual workflow only).
- [ ] **Public launch**: domain, and when to drop `noindex` (remove `NEXT_PUBLIC_NOINDEX` from `pages.yml`).
- [ ] **Map services**: the 3D map uses free, keyless public services — OpenFreeMap (base map, OpenStreetMap data) and Mapzen terrain tiles on AWS Open Data. Both are fine for a pilot; for heavy public traffic, review their terms or pick a provider (`NEXT_PUBLIC_MAP_STYLE`, `NEXT_PUBLIC_MAP_TERRAIN`). The no-WebGL fallback still uses OpenStreetMap's tile servers (`NEXT_PUBLIC_MAP_TILES`).
- [ ] **Backend** for reviews, submissions and enquiries (see `backend/README.md`): approve a provider, create the account, appoint moderators.
- [ ] **Privacy notice and moderation policy**: publish final versions with a named data controller.
- [ ] **Analytics**: none today. If wanted, a cookie-free, aggregate tool — only with a published notice.
- [ ] **Partnership**: any approach to the Gusinje Tourism Organisation or the national park, any use of their logos, sponsorship or data sharing — all still proposals.
- [ ] **Demo content off at launch**: the preview builds with `NEXT_PUBLIC_DEMO=true` (`.github/workflows/pages.yml`) — 18 invented listings, example events, the "taste" and "what's on" sections and illustration placeholders, all labelled "Demo". Remove that line before any public launch; a build without it contains none of the demo content (checked by the content tests). Replace demo listings with real businesses as they join.
- [ ] **Food and culture texts** (home "A taste of the valley", demo only for now): have a local editor check the descriptions of flija, burek and pite, trout, cheese, kajmak and honey before they appear outside the demo.
- [ ] **Businesses from open map data** (50 listings, `src/content/openData.ts`): imported from Overture Maps on 10 October 2026 — name, type, position and own website/Facebook only, all marked "not checked". Before launch: check each one (open? right place? right type?), remove what's closed or wrong, and invite the rest to claim their listing. Positions shared by several records were dropped (31 listings have no pin).
- [ ] **Photo quality**: Commons photos are now served up to 1920/3840 px where the original allows (`src/lib/image-loader.ts`, `photos.ts`). Several originals are small (Vuthaj 1440 px, Karanfili 1600 px, Krojet 1440 px) — replace them when better free or permitted photos are found. A professional shoot of Vusanje, Grlja and Oko Skakavice (with written permission) would lift the site most.
- [ ] **Tourism Organisation brand and photos**: requested by the owner on 10 October 2026, not done. Needs (1) the organisation's written permission to use its name, logo and photos on this site, and (2) the files themselves — logo (SVG), colours and typefaces, and original photos with the photographers' names. Their website and files could not be reached from the build environment. Once both arrive: name, wordmark and colours in `src/config/brand.ts` and `src/app/globals.css`, logo in `public/`, photos in `src/content/photos.ts` with credits; the "independent guide" disclosures then change to say whose site it is.
- [ ] **Tourism Organisation website option** (proposal on `/partners`): only if the organisation wants it and after a written agreement — then switch the name, logo, colours and domain in `src/config/brand.ts`, give its staff editor/moderator roles, bring across its listings, events and visitor-information details with its permission, and add an events calendar. Until then the guide must not use its name or logo as its own.

## Performance and accessibility notes

- Home and content pages are static HTML; the map engine (MapLibre) loads only on the Explore page and when the home page's 3D band scrolls into view (never on data saver). Leaflet loads only where WebGL is unavailable.
- Photos are Wikimedia thumbnails at the width each screen needs (500/960/1280 px), lazy-loaded below the fold. ROSI's Booking.com photos are still hot-linked at their single size until original files are supplied.
- Page weight on a phone profile (uncompressed, photos excluded): home 1093 KB (was 1488 KB; the 3D band loads only when scrolled to), Explore 1582 KB (was 2013 KB; 1121 KB with data saver). Fonts 163 KB (was 532 KB).
- The service worker stores only this site's public pages and build files on the visitor's device (mentioned in the privacy section of "About this guide"). Bump `VERSION` in `public/sw.js` if a release must drop old copies.
- The production base map (OpenFreeMap) could not be loaded from the build environment, so it has only been checked in code: screenshots and tests show the built-in relief style over the real elevation data. Open the preview on a normal connection to see the full map.
- Automated axe checks pass on the key pages (including Services and History); a manual screen-reader pass (NVDA/VoiceOver) and testing on real phones (iPhone Safari, a budget Android) are still to do — they were not performed. Phone behaviour was tested in emulation (Pixel 7 profile, 320–412 px widths).
