create table public.reviews (
    id uuid primary key default gen_random_uuid(),

    -- Coffee shop post
    post_id uuid not null
        references public.posts (id)
        on delete cascade,

    -- Reviewer
    user_id uuid not null
        references auth.users (id)
        on delete cascade,

    -- 1–5 star rating
    rating smallint not null
        check (rating between 1 and 5),

    -- Review content
    comment text not null,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    -- One review per user per coffee shop
    unique (post_id, user_id)
);

create index reviews_post_id_created_at_idx
    on public.reviews (post_id, created_at desc);

create index reviews_user_id_idx
    on public.reviews (user_id);

alter table public.reviews enable row level security;

-- Anyone can read reviews
create policy "Reviews are viewable by everyone"
on public.reviews
for select
using (true);

-- Authenticated users can create only their own reviews
create policy "Users can create their own reviews"
on public.reviews
for insert
to authenticated
with check (auth.uid() = user_id);

-- Users can update only their own reviews
create policy "Users can update their own reviews"
on public.reviews
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Users can delete only their own reviews
create policy "Users can delete their own reviews"
on public.reviews
for delete
to authenticated
using (auth.uid() = user_id);