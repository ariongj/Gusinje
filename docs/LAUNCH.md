# Launch readiness

Status on 10 October 2026: **not ready for public launch.** The platform works
end to end as a preview, but its content has only been checked against
published sources, translations are unreviewed, and no backend or partnership
exists. A `noindex` preview is published on GitHub Pages
(<https://ariongj.github.io/Gusinje/>, approved by the owner on 10 October 2026);
it has not been announced or submitted anywhere.

## What works now

- Language-prefixed static site (English, Albanian, Montenegrin) — about 200 pages.
- Explore: real-terrain 3D map (elevation data + OpenStreetMap) that also lies flat as a map, plus a list, on the same records, filters, legend, deep links, four themed virtual tours, map/photo fallback without WebGL.
- 11 place pages, 11 listings, 6 walk/hike pages, 9 travel guides, 4 itinerary templates, 4 tours and 80 cited sources — each page with sources, check dates, share link and QR code.
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
- [ ] **Tourism Organisation website option** (proposal on `/partners`): only if the organisation wants it and after a written agreement — then switch the name, logo, colours and domain in `src/config/brand.ts`, give its staff editor/moderator roles, bring across its listings, events and visitor-information details with its permission, and add an events calendar. Until then the guide must not use its name or logo as its own.

## Performance and accessibility notes

- Home and content pages are static HTML; the map engine (MapLibre) loads only on the Explore page and when the home page's 3D band scrolls into view (never on data saver). Leaflet loads only where WebGL is unavailable.
- Photos are Wikimedia thumbnails at the width each screen needs (500/960/1280 px), lazy-loaded below the fold. ROSI's Booking.com photos are still hot-linked at their single size until original files are supplied.
- Page weight on a phone profile (uncompressed, photos excluded): home 1093 KB (was 1488 KB; the 3D band loads only when scrolled to), Explore 1582 KB (was 2013 KB; 1121 KB with data saver). Fonts 163 KB (was 532 KB).
- The service worker stores only this site's public pages and build files on the visitor's device (mentioned in the privacy section of "About this guide"). Bump `VERSION` in `public/sw.js` if a release must drop old copies.
- Automated axe checks pass on the key pages; a manual screen-reader pass (NVDA/VoiceOver) and testing on real phones (iPhone Safari, a budget Android) are still to do — they were not performed. Phone behaviour was tested in emulation (Pixel 7 profile, 320–412 px widths).
