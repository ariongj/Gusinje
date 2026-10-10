# Launch readiness

Status on 10 October 2026: **not ready for public launch.** The platform works
end to end as a preview, but its content has only been checked against
published sources, translations are unreviewed, and no backend or partnership
exists. Nothing has been deployed or announced.

## What works now

- Language-prefixed static site (English, Albanian, Montenegrin) — about 200 pages.
- Explore: illustrative 3D model + map + list on the same records, filters, legend, deep links, four themed virtual tours, map/photo fallback without WebGL.
- 11 place pages, 11 listings, 6 walk/hike pages, 9 travel guides, 4 itinerary templates, 4 tours and 80 cited sources — each page with sources, check dates, share link and QR code.
- My Trip planner (local only), search across languages, editorial dashboard.
- Reviews, submissions, claims, corrections and moderation **in preview mode** (nothing is sent or stored); backend schema ready and tested.
- Tests: content integrity, desktop and phone end-to-end, no-WebGL, axe accessibility scan, schema permissions.

## Blocking before a public launch

### Content verification (editorial team / local partners)

- [ ] **Open every source** in `src/content/sources.ts` and confirm the cited fact. Desk research was done through web search from a restricted environment — figures and wording were read in search results quoting the pages. Update `accessed`.
- [ ] **Field-check the pilot places** (positions, access, accessibility, warnings, seasonal notes) and set `status: "field-verified"` with the date and partner.
- [ ] Record coordinates on site for **Grlja waterfall, Karanfili (main summit), Volušnica** — no reliable published coordinates were found, so they are not on the map.
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

- [ ] **Public deployment**: domain, hosting (GitHub Pages works), and when to drop `noindex`. The Pages workflow is manual-only.
- [ ] **Map tiles**: OpenStreetMap's tile servers are acceptable for a small pilot; for public traffic choose a provider (set `NEXT_PUBLIC_MAP_TILES` / `NEXT_PUBLIC_MAP_ATTRIBUTION`).
- [ ] **Backend** for reviews, submissions and enquiries (see `backend/README.md`): approve a provider, create the account, appoint moderators.
- [ ] **Privacy notice and moderation policy**: publish final versions with a named data controller.
- [ ] **Analytics**: none today. If wanted, a cookie-free, aggregate tool — only with a published notice.
- [ ] **Partnership**: any approach to the Gusinje Tourism Organisation or the national park, any use of their logos, sponsorship or data sharing — all still proposals.

## Performance and accessibility notes

- Home and content pages are static HTML; three.js (~600 KB) loads only on the Explore page, and not at all where WebGL is unavailable. Leaflet loads only when the map is shown.
- Photos are 1280px Wikimedia thumbnails, lazy-loaded below the fold; the build does not optimise images (static hosting). Consider self-hosting resized copies for slow connections.
- Automated axe checks pass on the key pages; a manual screen-reader pass (NVDA/VoiceOver) and testing on real phones are still to do — they were not performed.
