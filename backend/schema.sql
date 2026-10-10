-- ===========================================================================
-- Valley Guide — contributions backend (Phase 3). NOT DEPLOYED.
--
-- Written for Supabase (Postgres + Auth + Storage). It assumes Supabase's
-- `auth.users` table and `auth.uid()` function and the `anon` /
-- `authenticated` roles. Nothing here is connected to the site yet: the
-- forms on the site run in preview mode until a project is approved and
-- created (see backend/README.md).
--
-- Principles encoded below:
--   * Visitors sign in with a verified email; one review per place/listing.
--   * Everything visitors write starts as `pending` and is published only by
--     a moderator. Authors can edit (back to pending) or remove their own.
--   * Businesses can reply to reviews of their own verified listings, but
--     can never change or delete a review.
--   * Ratings are a plain average of published reviews, shown only from 3.
--   * Safety-related corrections and reports are prioritised.
--   * Every moderation decision is logged.
-- ===========================================================================

-- gen_random_uuid() is built into Postgres 13+ (no extension needed).

-- ------------------------------------------------------------------ types

create type public.app_role as enum ('visitor', 'business_owner', 'editor', 'moderator', 'admin');
create type public.target_kind as enum ('place', 'business', 'route');
create type public.item_status as enum ('pending', 'published', 'rejected', 'removed_by_author');
create type public.request_status as enum ('pending', 'approved', 'rejected', 'needs_info');
create type public.report_reason as enum ('spam', 'fake_or_paid', 'impersonation', 'personal_information', 'abuse', 'safety', 'conflict_of_interest', 'other');

-- ------------------------------------------------------------- people

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 60),
  role public.app_role not null default 'visitor',
  created_at timestamptz not null default now()
);

-- Verified owners of directory listings (slugs from src/content/businesses.ts).
create table public.business_owners (
  user_id uuid not null references public.profiles (id) on delete cascade,
  business_slug text not null check (business_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  verified_by uuid not null references public.profiles (id),
  verified_at timestamptz not null default now(),
  method text not null check (method in ('phone_callback', 'registration_document', 'in_person', 'official_listing_contact')),
  primary key (user_id, business_slug)
);

-- ------------------------------------------------------------ helpers

create or replace function public.has_role(wanted public.app_role[])
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = any (wanted));
$$;

create or replace function public.is_moderator() returns boolean language sql stable as $$
  select public.has_role(array['moderator', 'admin']::public.app_role[]);
$$;

create or replace function public.is_editor() returns boolean language sql stable as $$
  select public.has_role(array['editor', 'admin']::public.app_role[]);
$$;

create or replace function public.owns_business(slug text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.business_owners o where o.user_id = auth.uid() and o.business_slug = slug);
$$;

-- --------------------------------------------------------------- reviews

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  target_kind public.target_kind not null,
  target_slug text not null check (target_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  author_id uuid not null references public.profiles (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  body text not null check (char_length(body) between 30 and 2000),
  -- Month of the visit; never in the future. No "verified visit" flag exists.
  visit_month date not null check (visit_month = date_trunc('month', visit_month) and visit_month <= current_date),
  language text not null default 'en' check (language in ('en', 'sq', 'cnr')),
  status public.item_status not null default 'pending',
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  moderated_by uuid references public.profiles (id),
  moderated_at timestamptz,
  moderation_note text,
  -- One review per visitor per place/listing/route; edit it instead.
  unique (author_id, target_kind, target_slug)
);

create index reviews_target_idx on public.reviews (target_kind, target_slug) where status = 'published';
create index reviews_queue_idx on public.reviews (created_at) where status = 'pending';

create table public.review_photos (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews (id) on delete cascade,
  -- Path in the private Storage bucket `review-photos`; published copies are served after moderation.
  storage_path text not null,
  status public.item_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- A business's public reply: one per review, never able to touch the review itself.
create table public.review_responses (
  review_id uuid primary key references public.reviews (id) on delete cascade,
  business_slug text not null,
  author_id uuid not null references public.profiles (id),
  body text not null check (char_length(body) between 10 and 1500),
  status public.item_status not null default 'pending',
  created_at timestamptz not null default now(),
  edited_at timestamptz
);

-- ---------------------------------------------------------- community tips

create table public.tips (
  id uuid primary key default gen_random_uuid(),
  target_kind public.target_kind,
  target_slug text,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 30 and 1500),
  language text not null default 'en' check (language in ('en', 'sq', 'cnr')),
  status public.item_status not null default 'pending',
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  moderated_by uuid references public.profiles (id),
  moderated_at timestamptz
);

-- ---------------------------------------------------------------- reports

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  review_id uuid references public.reviews (id) on delete cascade,
  tip_id uuid references public.tips (id) on delete cascade,
  response_review_id uuid references public.review_responses (review_id) on delete cascade,
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  reason public.report_reason not null,
  details text check (char_length(details) <= 1000),
  status public.request_status not null default 'pending',
  created_at timestamptz not null default now(),
  check (num_nonnulls(review_id, tip_id, response_review_id) = 1)
);

-- ------------------------------------------- submissions, claims, corrections

create table public.business_submissions (
  id uuid primary key default gen_random_uuid(),
  submitter_id uuid not null references public.profiles (id) on delete cascade,
  business_name text not null check (char_length(business_name) between 2 and 120),
  category text not null,
  area text,
  description text not null check (char_length(description) between 40 and 2000),
  website text check (website ~ '^https://'),
  public_phone text,
  public_email text,
  whatsapp_approved boolean not null default false,
  submitter_role text not null check (submitter_role in ('owner', 'manager', 'staff', 'other')),
  status public.request_status not null default 'pending',
  reviewed_by uuid references public.profiles (id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.ownership_claims (
  id uuid primary key default gen_random_uuid(),
  business_slug text not null,
  claimant_id uuid not null references public.profiles (id) on delete cascade,
  claimant_role text not null check (claimant_role in ('owner', 'manager', 'staff', 'other')),
  evidence text not null check (char_length(evidence) between 30 and 2000),
  status public.request_status not null default 'pending',
  reviewed_by uuid references public.profiles (id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (business_slug, claimant_id)
);

create table public.corrections (
  id uuid primary key default gen_random_uuid(),
  page_path text not null check (page_path ~ '^/[a-z0-9/-]*$'),
  body text not null check (char_length(body) between 20 and 3000),
  source_url text check (source_url ~ '^https://'),
  affects_safety boolean not null default false,
  submitter_id uuid references public.profiles (id) on delete set null,
  status public.request_status not null default 'pending',
  reviewed_by uuid references public.profiles (id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------------- audit log

create table public.moderation_log (
  id bigint generated always as identity primary key,
  actor_id uuid not null references public.profiles (id),
  item_table text not null,
  item_id text not null,
  from_status text,
  to_status text not null,
  note text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------ rate limits

-- At most 5 reviews and 10 tips/corrections/reports per account per 24 hours.
create or replace function public.enforce_rate_limit()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  author_column text := case tg_table_name when 'reports' then 'reporter_id' when 'corrections' then 'submitter_id' else 'author_id' end;
  author uuid := (to_jsonb(new) ->> author_column)::uuid;
  max_per_day integer := case tg_table_name when 'reviews' then 5 else 10 end;
  recent integer;
begin
  if author is null then return new; end if;
  execute format('select count(*) from public.%I where %I = $1 and created_at > now() - interval ''24 hours''', tg_table_name, author_column)
    into recent using author;
  if recent >= max_per_day then
    raise exception 'rate limit: too many submissions in 24 hours' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

create trigger reviews_rate_limit before insert on public.reviews for each row execute function public.enforce_rate_limit();
create trigger tips_rate_limit before insert on public.tips for each row execute function public.enforce_rate_limit();
create trigger reports_rate_limit before insert on public.reports for each row execute function public.enforce_rate_limit();
create trigger corrections_rate_limit before insert on public.corrections for each row execute function public.enforce_rate_limit();

-- ------------------------------------------------- author & moderator rules

-- Authors may change only the text, rating and visit month of their own
-- review; any edit sends it back to moderation. Status changes (other than
-- removing their own) belong to moderators. Nobody else may edit a review.
create or replace function public.guard_review_update()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if public.is_moderator() then
    if new.status is distinct from old.status then
      new.moderated_by := auth.uid();
      new.moderated_at := now();
      insert into public.moderation_log (actor_id, item_table, item_id, from_status, to_status, note)
      values (auth.uid(), 'reviews', old.id::text, old.status::text, new.status::text, new.moderation_note);
    end if;
    -- Moderators decide on publication; they never rewrite what visitors wrote.
    if new.body is distinct from old.body or new.rating is distinct from old.rating then
      raise exception 'moderators cannot edit review content';
    end if;
    return new;
  end if;

  if old.author_id is distinct from auth.uid() then
    raise exception 'only the author can change a review';
  end if;
  if new.author_id is distinct from old.author_id or new.target_kind is distinct from old.target_kind or new.target_slug is distinct from old.target_slug then
    raise exception 'author and target cannot change';
  end if;
  if new.status = 'removed_by_author' then
    return new;
  end if;
  new.status := 'pending';
  new.edited_at := now();
  new.moderated_by := null;
  new.moderated_at := null;
  return new;
end;
$$;

create trigger reviews_guard before update on public.reviews for each row execute function public.guard_review_update();

-- Same rules for tips.
create or replace function public.guard_tip_update()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if public.is_moderator() then
    if new.body is distinct from old.body then raise exception 'moderators cannot edit tip content'; end if;
    if new.status is distinct from old.status then
      new.moderated_by := auth.uid();
      new.moderated_at := now();
      insert into public.moderation_log (actor_id, item_table, item_id, from_status, to_status)
      values (auth.uid(), 'tips', old.id::text, old.status::text, new.status::text);
    end if;
    return new;
  end if;
  if old.author_id is distinct from auth.uid() then raise exception 'only the author can change a tip'; end if;
  if new.status <> 'removed_by_author' then
    new.status := 'pending';
    new.edited_at := now();
  end if;
  return new;
end;
$$;

create trigger tips_guard before update on public.tips for each row execute function public.guard_tip_update();

-- --------------------------------------------------------------- ratings

-- The published rating: a plain average of published reviews, only once a
-- page has at least three. Nothing else (no imported scores) feeds it.
create or replace view public.ratings with (security_invoker = true) as
  select target_kind, target_slug, count(*)::int as review_count, round(avg(rating)::numeric, 1) as average
  from public.reviews
  where status = 'published'
  group by target_kind, target_slug
  having count(*) >= 3;

-- ----------------------------------------------------- row-level security

alter table public.profiles enable row level security;
alter table public.business_owners enable row level security;
alter table public.reviews enable row level security;
alter table public.review_photos enable row level security;
alter table public.review_responses enable row level security;
alter table public.tips enable row level security;
alter table public.reports enable row level security;
alter table public.business_submissions enable row level security;
alter table public.ownership_claims enable row level security;
alter table public.corrections enable row level security;
alter table public.moderation_log enable row level security;

-- profiles: everyone sees display names; you edit your own name; only admins change roles.
create policy profiles_read on public.profiles for select using (true);
create policy profiles_insert_self on public.profiles for insert to authenticated with check (id = auth.uid() and role = 'visitor');
create policy profiles_update_self on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid() and role = (select p.role from public.profiles p where p.id = auth.uid()));
create policy profiles_admin on public.profiles for update to authenticated using (public.has_role(array['admin']::public.app_role[]));

-- business owners: owners see their own links; editors manage verification.
create policy owners_read_own on public.business_owners for select to authenticated using (user_id = auth.uid() or public.is_editor());
create policy owners_editor_write on public.business_owners for all to authenticated using (public.is_editor()) with check (public.is_editor());

-- reviews
create policy reviews_public_read on public.reviews for select using (status = 'published');
create policy reviews_author_read on public.reviews for select to authenticated using (author_id = auth.uid());
create policy reviews_moderator_read on public.reviews for select to authenticated using (public.is_moderator());
create policy reviews_insert on public.reviews for insert to authenticated
  with check (author_id = auth.uid() and status = 'pending' and moderated_by is null);
create policy reviews_author_update on public.reviews for update to authenticated using (author_id = auth.uid());
create policy reviews_moderator_update on public.reviews for update to authenticated using (public.is_moderator());
-- No delete policy: authors remove their review by setting status = 'removed_by_author' (kept for the audit trail).

-- review photos follow their review
create policy photos_public_read on public.review_photos for select
  using (status = 'published' and exists (select 1 from public.reviews r where r.id = review_id and r.status = 'published'));
create policy photos_author on public.review_photos for all to authenticated
  using (exists (select 1 from public.reviews r where r.id = review_id and r.author_id = auth.uid()))
  with check (status = 'pending' and exists (select 1 from public.reviews r where r.id = review_id and r.author_id = auth.uid()));
create policy photos_moderator on public.review_photos for all to authenticated using (public.is_moderator()) with check (public.is_moderator());

-- business responses: only verified owners of the reviewed listing
create policy responses_public_read on public.review_responses for select using (status = 'published');
create policy responses_owner_read on public.review_responses for select to authenticated using (author_id = auth.uid() or public.is_moderator());
create policy responses_owner_insert on public.review_responses for insert to authenticated
  with check (
    author_id = auth.uid()
    and status = 'pending'
    and public.owns_business(business_slug)
    and exists (select 1 from public.reviews r where r.id = review_id and r.target_kind = 'business' and r.target_slug = business_slug and r.status = 'published')
  );
create policy responses_owner_update on public.review_responses for update to authenticated
  using (author_id = auth.uid() and public.owns_business(business_slug)) with check (status = 'pending');
create policy responses_moderator on public.review_responses for update to authenticated using (public.is_moderator());

-- tips
create policy tips_public_read on public.tips for select using (status = 'published');
create policy tips_author_read on public.tips for select to authenticated using (author_id = auth.uid() or public.is_moderator());
create policy tips_insert on public.tips for insert to authenticated with check (author_id = auth.uid() and status = 'pending');
create policy tips_author_update on public.tips for update to authenticated using (author_id = auth.uid());
create policy tips_moderator_update on public.tips for update to authenticated using (public.is_moderator());

-- reports: anyone signed in can report; only moderators read them
create policy reports_insert on public.reports for insert to authenticated with check (reporter_id = auth.uid() and status = 'pending');
create policy reports_read on public.reports for select to authenticated using (reporter_id = auth.uid() or public.is_moderator());
create policy reports_moderate on public.reports for update to authenticated using (public.is_moderator());

-- submissions, claims, corrections: submit your own; editors review
create policy submissions_insert on public.business_submissions for insert to authenticated with check (submitter_id = auth.uid() and status = 'pending');
create policy submissions_read on public.business_submissions for select to authenticated using (submitter_id = auth.uid() or public.is_editor());
create policy submissions_review on public.business_submissions for update to authenticated using (public.is_editor());

create policy claims_insert on public.ownership_claims for insert to authenticated with check (claimant_id = auth.uid() and status = 'pending');
create policy claims_read on public.ownership_claims for select to authenticated using (claimant_id = auth.uid() or public.is_editor());
create policy claims_review on public.ownership_claims for update to authenticated using (public.is_editor());

create policy corrections_insert on public.corrections for insert to authenticated with check (submitter_id = auth.uid() and status = 'pending');
create policy corrections_read on public.corrections for select to authenticated using (submitter_id = auth.uid() or public.is_editor() or public.is_moderator());
create policy corrections_review on public.corrections for update to authenticated using (public.is_editor());

-- moderation log: moderators and admins only
create policy log_read on public.moderation_log for select to authenticated using (public.is_moderator() or public.is_editor());

-- Moderation queue for the dashboard: safety first, then oldest.
create or replace view public.moderation_queue with (security_invoker = true) as
  select 'correction' as kind, id::text as id, affects_safety as safety, created_at from public.corrections where status = 'pending'
  union all
  select 'report', id::text, reason = 'safety', created_at from public.reports where status = 'pending'
  union all
  select 'review', id::text, false, created_at from public.reviews where status = 'pending'
  union all
  select 'tip', id::text, false, created_at from public.tips where status = 'pending'
  union all
  select 'claim', id::text, false, created_at from public.ownership_claims where status = 'pending'
  union all
  select 'submission', id::text, false, created_at from public.business_submissions where status = 'pending'
  order by safety desc, created_at asc;

grant usage on schema public to anon, authenticated;
grant select on public.reviews, public.review_photos, public.review_responses, public.tips, public.profiles, public.ratings to anon;
grant select, insert, update on all tables in schema public to authenticated;
grant select on public.ratings, public.moderation_queue to authenticated;
grant usage on all sequences in schema public to authenticated;
