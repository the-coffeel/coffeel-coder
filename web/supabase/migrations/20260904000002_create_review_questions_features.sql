-- =========================================================
-- REVIEW QUESTIONS
-- =========================================================

create table public.review_questions (
    id uuid primary key default gen_random_uuid(),

    title text not null,
    slug text not null unique,
    description text,

    is_active boolean not null default true,
    sort_order integer not null default 0,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);


-- =========================================================
-- REVIEW FEATURES
-- =========================================================

create table public.features (
    id uuid primary key default gen_random_uuid(),

    question_id uuid not null
        references public.review_questions (id)
        on delete cascade,

    name text not null,
    slug text not null,

    icon text,

    is_active boolean not null default true,
    sort_order integer not null default 0,

    created_at timestamptz not null default now(),

    unique (question_id, slug)
);


-- =========================================================
-- REVIEW <-> FEATURE
-- =========================================================

create table public.review_features (
    review_id uuid not null
        references public.reviews (id)
        on delete cascade,

    feature_id uuid not null
        references public.features (id)
        on delete cascade,

    created_at timestamptz not null default now(),

    primary key (review_id, feature_id)
);


-- =========================================================
-- INDEXES
-- =========================================================

create index features_question_id_idx
    on public.features (question_id, sort_order);

create index review_features_feature_id_idx
    on public.review_features (feature_id);

create index review_features_review_id_idx
    on public.review_features (review_id);


-- =========================================================
-- UPDATED_AT TRIGGER
-- =========================================================

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger review_questions_updated_at
before update on public.review_questions
for each row
execute function public.handle_updated_at();


-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table public.review_questions enable row level security;
alter table public.features enable row level security;
alter table public.review_features enable row level security;


-- =========================================================
-- REVIEW QUESTIONS POLICIES
-- =========================================================

create policy "Active review questions are viewable by everyone"
on public.review_questions
for select
using (
    is_active = true
);


-- =========================================================
-- FEATURES POLICIES
-- =========================================================

create policy "Active features are viewable by everyone"
on public.features
for select
using (
    is_active = true
);


-- =========================================================
-- REVIEW FEATURES - SELECT
-- =========================================================

create policy "Review feature selections are viewable by everyone"
on public.review_features
for select
using (
    true
);


-- =========================================================
-- REVIEW FEATURES - INSERT
-- =========================================================

create policy "Users can add features to their own reviews"
on public.review_features
for insert
to authenticated
with check (
    exists (
        select 1
        from public.reviews r
        where r.id = review_features.review_id
          and r.user_id = auth.uid()
    )
    and exists (
        select 1
        from public.features f
        where f.id = review_features.feature_id
          and f.is_active = true
    )
);


-- =========================================================
-- REVIEW FEATURES - DELETE
-- =========================================================

create policy "Users can remove features from their own reviews"
on public.review_features
for delete
to authenticated
using (
    exists (
        select 1
        from public.reviews r
        where r.id = review_features.review_id
          and r.user_id = auth.uid()
    )
);


-- =========================================================
-- REVIEW QUESTIONS
-- =========================================================

insert into public.review_questions (
    title,
    slug,
    description,
    sort_order
)
values
(
    'Why is it fantastic?',
    'why-is-it-fantastic',
    'Choose the things this place does well.',
    10
),
(
    'What could be improved?',
    'what-could-be-improved',
    'Choose helpful suggestions for improvement.',
    20
),
(
    'Who is this place good for?',
    'who-is-this-place-good-for',
    'Choose who would enjoy this place.',
    30
)
on conflict (slug) do nothing;


-- =========================================================
-- POSITIVE FEATURES
-- =========================================================

insert into public.features (
    question_id,
    name,
    slug,
    sort_order
)
select
    q.id,
    feature.name,
    feature.slug,
    feature.sort_order
from public.review_questions q
cross join lateral (
    values
        ('Fast Wi-Fi', 'fast-wi-fi', 10),
        ('Power outlets', 'power-outlets', 20),
        ('Quiet environment', 'quiet-environment', 30),
        ('Good for coding', 'good-for-coding', 40),
        ('Comfortable chairs', 'comfortable-chairs', 50)
) as feature(name, slug, sort_order)
where q.slug = 'why-is-it-fantastic'
on conflict (question_id, slug) do nothing;


-- =========================================================
-- IMPROVEMENT FEATURES
-- =========================================================

insert into public.features (
    question_id,
    name,
    slug,
    sort_order
)
select
    q.id,
    feature.name,
    feature.slug,
    feature.sort_order
from public.review_questions q
cross join lateral (
    values
        ('More accurate answers', 'more-accurate-answers', 10),
        ('Lower pricing', 'lower-pricing', 20),
        ('Better accessibility', 'better-accessibility', 30),
        ('More natural light', 'more-natural-light', 40),
        ('More seating', 'more-seating', 50)
) as feature(name, slug, sort_order)
where q.slug = 'what-could-be-improved'
on conflict (question_id, slug) do nothing;


-- =========================================================
-- AUDIENCE FEATURES
-- =========================================================

insert into public.features (
    question_id,
    name,
    slug,
    sort_order
)
select
    q.id,
    feature.name,
    feature.slug,
    feature.sort_order
from public.review_questions q
cross join lateral (
    values
        ('Remote workers', 'remote-workers', 10),
        ('Students', 'students', 20),
        ('Developers', 'developers', 30),
        ('Small meetings', 'small-meetings', 40),
        ('Coffee dates', 'coffee-dates', 50)
) as feature(name, slug, sort_order)
where q.slug = 'who-is-this-place-good-for'
on conflict (question_id, slug) do nothing;