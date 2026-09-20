alter table public.posts
  add column if not exists gallery text[] not null default '{}'::text[];