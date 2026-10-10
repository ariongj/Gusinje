// Loads backend/schema.sql into PGlite (Postgres in WebAssembly) with a small
// stand-in for Supabase's auth schema, then checks the permission rules as
// different users. Run: npm run test:schema
import { readFileSync } from "node:fs";

import { PGlite } from "@electric-sql/pglite";

const db = new PGlite();
let failures = 0;
const ok = (name) => console.log(`  ✓ ${name}`);
const fail = (name, detail) => {
  failures += 1;
  console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
};
const check = (name, passed, detail) => (passed ? ok(name) : fail(name, detail));

// Supabase stand-ins: roles, auth.users and auth.uid() reading the JWT subject.
await db.exec(`
  create role anon nologin;
  create role authenticated nologin;
  create schema auth;
  create table auth.users (id uuid primary key, email text not null);
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
  $$;
  grant usage on schema auth to anon, authenticated;
  grant execute on function auth.uid() to anon, authenticated;
`);
await db.exec(readFileSync(new URL("./schema.sql", import.meta.url), "utf8"));

const users = {
  alice: "00000000-0000-0000-0000-00000000000a",
  bob: "00000000-0000-0000-0000-00000000000b",
  owner: "00000000-0000-0000-0000-00000000000c",
  mod: "00000000-0000-0000-0000-00000000000d",
  editor: "00000000-0000-0000-0000-00000000000e",
};
for (const [name, id] of Object.entries(users)) {
  await db.query("insert into auth.users (id, email) values ($1, $2)", [id, `${name}@example.test`]);
  const role = name === "mod" ? "moderator" : name === "editor" ? "editor" : name === "owner" ? "business_owner" : "visitor";
  await db.query("insert into public.profiles (id, display_name, role) values ($1, $2, $3)", [id, name, role]);
}
await db.query("insert into public.business_owners (user_id, business_slug, verified_by, method) values ($1, 'hotel-rosi', $2, 'phone_callback')", [users.owner, users.editor]);

/** Run SQL as a user (or anonymously), inside a transaction, like a PostgREST request. */
async function as(user, sql, params = []) {
  return db.transaction(async (tx) => {
    await tx.exec(user ? "set local role authenticated" : "set local role anon");
    await tx.query("select set_config('request.jwt.claim.sub', $1, true)", [user ? users[user] : ""]);
    return tx.query(sql, params);
  });
}
async function expectError(name, fn) {
  try {
    await fn();
    fail(name, "no error");
  } catch {
    ok(name);
  }
}

const review = (target, rating = 4) =>
  as("alice", "insert into public.reviews (target_kind, target_slug, author_id, rating, body, visit_month) values ('business', $1, $2, $3, $4, date '2026-08-01') returning id", [
    target,
    users.alice,
    rating,
    "A clear, friendly place with a good breakfast and helpful advice on the walks.",
  ]);

console.log("Reviews");
const { rows } = await review("hotel-rosi", 5);
const reviewId = rows[0].id;
ok("a signed-in visitor can write a review (pending)");
check("pending reviews are hidden from the public", (await as(null, "select count(*)::int as n from public.reviews")).rows[0].n === 0);
check("the author sees their own pending review", (await as("alice", "select count(*)::int as n from public.reviews")).rows[0].n === 1);
await expectError("one review per visitor per listing", () => review("hotel-rosi"));
await expectError("a visitor cannot self-publish", () =>
  as("bob", "insert into public.reviews (target_kind, target_slug, author_id, rating, body, visit_month, status) values ('place','grlja',$1,5,$2,date '2026-08-01','published')", [
    users.bob,
    "Lovely waterfall, easy to see from near the parking area by the road.",
  ]),
);
await expectError("no visit dates in the future", () =>
  as("bob", "insert into public.reviews (target_kind, target_slug, author_id, rating, body, visit_month) values ('place','grlja',$1,5,$2,date '2099-01-01')", [
    users.bob,
    "Lovely waterfall, easy to see from near the parking area by the road.",
  ]),
);
await as("mod", "update public.reviews set status = 'published', moderation_note = 'ok' where id = $1", [reviewId]);
check("a moderator publishes; the public sees it", (await as(null, "select count(*)::int as n from public.reviews")).rows[0].n === 1);
check("the decision is logged", (await as("mod", "select count(*)::int as n from public.moderation_log where item_id = $1", [reviewId])).rows[0].n === 1);
await expectError("moderators cannot rewrite a review", () => as("mod", "update public.reviews set body = body || ' (edited)' where id = $1", [reviewId]));
await expectError("another visitor cannot edit it", async () => {
  const res = await as("bob", "update public.reviews set rating = 1 where id = $1 returning id", [reviewId]);
  if (res.rows.length === 0) throw new Error("no rows (blocked by RLS)");
});
await expectError("the business owner cannot edit it", async () => {
  const res = await as("owner", "update public.reviews set rating = 1 where id = $1 returning id", [reviewId]);
  if (res.rows.length === 0) throw new Error("no rows (blocked by RLS)");
});

console.log("Business responses");
await as("owner", "insert into public.review_responses (review_id, business_slug, author_id, body) values ($1, 'hotel-rosi', $2, 'Thank you for staying with us!')", [reviewId, users.owner]);
ok("a verified owner can reply to a review of their listing");
const other = (await review("eko-katun-rosi")).rows[0].id;
await as("mod", "update public.reviews set status = 'published' where id = $1", [other]);
await expectError("an owner cannot reply about a listing they don't own", () =>
  as("owner", "insert into public.review_responses (review_id, business_slug, author_id, body) values ($1, 'eko-katun-rosi', $2, 'Thanks a lot!')", [other, users.owner]),
);
await expectError("an owner cannot attach a reply to another listing's review by naming their own", () =>
  as("owner", "insert into public.review_responses (review_id, business_slug, author_id, body) values ($1, 'hotel-rosi', $2, 'Thanks a lot!')", [other, users.owner]),
);

console.log("Author edits and removal");
await as("alice", "update public.reviews set body = $2 where id = $1", [reviewId, "Edited: still a clear, friendly place with a good breakfast and great walking advice."]);
check("an edit sends the review back to moderation", (await as("mod", "select status from public.reviews where id = $1", [reviewId])).rows[0].status === "pending");
await as("alice", "update public.reviews set status = 'removed_by_author' where id = $1", [reviewId]);
check("the author can remove their review", (await as("mod", "select status from public.reviews where id = $1", [reviewId])).rows[0].status === "removed_by_author");

console.log("Ratings");
for (const [i, who] of ["alice", "bob", "editor"].entries()) {
  await as(who, "insert into public.reviews (target_kind, target_slug, author_id, rating, body, visit_month) values ('place','ali-pashas-springs',$1,$2,$3,date '2026-07-01')", [
    users[who],
    3 + i,
    "Clear cold water and an easy walk from the town; quiet early in the morning.",
  ]);
  await as("mod", "update public.reviews set status = 'published' where target_slug = 'ali-pashas-springs' and author_id = $1", [users[who]]);
  const r = await as(null, "select review_count, average::float as average from public.ratings where target_slug = 'ali-pashas-springs'");
  if (i < 2) check(`no rating shown with ${i + 1} review(s)`, r.rows.length === 0);
  else check("rating = plain average once there are 3 reviews", r.rows[0]?.review_count === 3 && r.rows[0]?.average === 4, JSON.stringify(r.rows));
}

console.log("Rate limits, reports and the queue");
// Alice has written 3 reviews so far today; two more are allowed, the sixth is refused.
for (const slug of ["grlja", "oko-skakavice"]) await review(slug);
await expectError("at most 5 reviews per account per 24 hours", () => review("vusanje"));
await as("bob", "insert into public.reports (review_id, reporter_id, reason, details) select id, $1, 'personal_information', 'Names a staff member' from public.reviews where target_slug = 'grlja'", [users.bob]);
check("reports are not public", (await as(null, "select count(*)::int as n from public.reports").catch(() => ({ rows: [{ n: 0 }] }))).rows[0].n === 0);
await as("bob", "insert into public.corrections (page_path, body, affects_safety, submitter_id) values ('/places/grlja', 'The path to the viewpoint is closed after a rockfall.', true, $1)", [users.bob]);
const queue = await as("mod", "select kind, safety from public.moderation_queue");
check("safety corrections come first in the queue", queue.rows[0]?.safety === true && queue.rows[0]?.kind === "correction", JSON.stringify(queue.rows.slice(0, 2)));

console.log("Claims");
await as("bob", "insert into public.ownership_claims (business_slug, claimant_id, claimant_role, evidence) values ('metro-hotel', $1, 'owner', 'I can take a call on the number in the tourism organisation listing.')", [users.bob]);
check("claims are private to the claimant and editors", (await as("alice", "select count(*)::int as n from public.ownership_claims")).rows[0].n === 0);
await expectError("a visitor cannot make themselves an owner", () =>
  as("bob", "insert into public.business_owners (user_id, business_slug, verified_by, method) values ($1, 'metro-hotel', $1, 'phone_callback')", [users.bob]),
);
await expectError("a visitor cannot promote themselves", async () => {
  const res = await as("bob", "update public.profiles set role = 'admin' where id = $1 returning id", [users.bob]);
  if (res.rows.length === 0) throw new Error("blocked");
});

console.log(failures ? `\n${failures} check(s) failed` : "\nAll schema checks passed");
process.exit(failures ? 1 : 0);
