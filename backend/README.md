# Contributions backend (Phase 3) — designed, tested, not deployed

The site is a static export. A static site cannot keep accounts, store
reviews or private enquiries, or moderate anything, so those features run in
**preview mode** today: the forms validate, but nothing is sent or stored.

This folder holds what is needed to switch them on once a backend is approved:

| File | What it is |
| --- | --- |
| `schema.sql` | Postgres schema with row-level security, written for Supabase: profiles and roles, verified business owners, reviews (+ photos, business replies), community tips, reports, business submissions, ownership claims, corrections, a moderation log, rate limits, a ratings view and a moderation queue |
| `test-schema.mjs` | Loads the schema into PGlite (Postgres in WebAssembly) with a stand-in for Supabase Auth and checks the rules as different users — `npm run test:schema` |

No project, keys or credentials exist. Nothing was purchased or created.

## Roles and permissions

| Action | Visitor (signed in, verified email) | Business owner (verified) | Editor | Moderator | Admin |
| --- | --- | --- | --- | --- | --- |
| Read published reviews, tips, replies | ✓ (also signed out) | ✓ | ✓ | ✓ | ✓ |
| Write a review (one per place/listing/route) | ✓ → pending | ✓ → pending | ✓ → pending | ✓ → pending | ✓ |
| Edit own review | ✓ → back to pending | own only | own only | own only | own only |
| Remove own review | ✓ (kept for the audit trail) | own only | own only | own only | own only |
| Edit or delete someone else's review | ✗ | ✗ | ✗ | ✗ (publish/reject only) | ✗ (publish/reject only) |
| Publish / reject reviews, tips, replies | ✗ | ✗ | ✗ | ✓ (logged) | ✓ (logged) |
| Reply publicly to a review | ✗ | own listings only → pending | ✗ | ✗ | ✗ |
| Report a review, tip or reply | ✓ | ✓ | ✓ | ✓ | ✓ |
| Read reports | own only | own only | ✗ | ✓ | ✓ |
| Submit a business / claim a listing / suggest a correction | ✓ | ✓ | ✓ | ✓ | ✓ |
| Approve submissions, claims, corrections; edit listings | ✗ | ✗ (later: own listing fields) | ✓ | corrections | ✓ |
| Verify an owner (grant listing access) | ✗ | ✗ | ✓ | ✗ | ✓ |
| Change roles | ✗ | ✗ | ✗ | ✗ | ✓ |

Listing content itself stays in the repository (`src/content/`), edited through
pull requests, so every change is reviewed and versioned. When owners start
editing their own listings, the plan is a small editor that opens a pull
request (or a `listing_edits` table moderated by editors) — never direct
writes to the published site.

## Rules the schema enforces (and the tests check)

- New reviews, tips and replies are `pending`; only moderators publish.
- One review per visitor per place/listing/route; visit month can't be in the future.
- Authors can edit (which sends it back to moderation) or remove their own; nobody else can change it — not moderators (they publish or reject), not businesses.
- Businesses reply only to published reviews of listings they are verified owners of.
- Ratings: plain average of published reviews, shown only from three reviews. Nothing else feeds it — no imported scores, no "verified visit" flag.
- Rate limits: 5 reviews and 10 tips/corrections/reports per account per 24 hours.
- Reports, claims and submissions are private to the submitter and the reviewing role.
- Moderation queue sorts safety-related corrections and reports first. Every decision is logged.

Not in SQL, to set up with the service:

- **Verified email** sign-in (Supabase Auth magic link or OTP), and a CAPTCHA on sign-up (hCaptcha/Turnstile).
- **Photos**: private Storage bucket `review-photos`, size/type limits, EXIF location stripped, published copies only after moderation.
- **Notifications** to moderators (e.g. a daily digest) and to submitters on decisions.
- **Data protection**: privacy notice, retention periods, account deletion (cascade is in the schema), a named data controller.

## Options and costs (indicative — check current pricing before deciding)

| Option | Fits | Cost | What you would need to provide |
| --- | --- | --- | --- |
| **Supabase** (recommended) | Everything above: auth, Postgres + RLS, storage | Free tier is enough for a pilot; the paid plan is needed for daily backups and production use | A Supabase organisation you own; the project URL and the public anon key go into the site's build variables; the service-role key stays out of the site and out of the repository |
| Cloudflare Workers + D1 + Turnstile | Same features, more code to write (auth via a third party) | Generous free tier | Cloudflare account; API token kept in CI secrets |
| Form service only (e.g. Formspree) | Business submissions and corrections by email; **no** reviews or accounts | Free/low tier | A form endpoint URL |

Moderation also needs people: at least one moderator with local knowledge,
and an editor to verify owners. Budget their time before switching reviews on.

## Turning it on (after approval)

1. Create the Supabase project (EU region), enable email sign-in and CAPTCHA.
2. Run `schema.sql` in the SQL editor; create the `review-photos` bucket (private).
3. Make yourself `admin` in `profiles`; add moderators and editors.
4. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as build variables.
5. Replace the preview forms (`ReviewFormPreview`, `ContributeForms`, `ModerationPreview`) with ones that call Supabase, behind the same validation; keep the preview fallback when the variables are missing.
6. Publish the privacy notice and moderation policy (drafts are on the "About this guide" page).
