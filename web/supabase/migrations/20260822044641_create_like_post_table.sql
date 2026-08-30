create table public.post_likes (
  id uuid primary key default gen_random_uuid(),

  post_id uuid not null
    references public.posts(id)
    on delete cascade,

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  created_at timestamptz not null default now(),

  constraint post_likes_unique_user_post
    unique (post_id, user_id)
);

create index post_likes_post_id_idx
  on public.post_likes (post_id);

create index post_likes_user_id_idx
  on public.post_likes (user_id);

alter table public.post_likes enable row level security;

create policy "Likes are viewable by everyone"
on public.post_likes
for select
using (true);

create policy "Users can like posts"
on public.post_likes
for insert
with check (
  auth.uid() = user_id
);

create policy "Users can unlike posts"
on public.post_likes
for delete
using (
  auth.uid() = user_id
);