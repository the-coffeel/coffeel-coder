create table posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  title text not null,
  content text not null,
  excerpt text,
  cover_image_url text,

  published boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index posts_user_id_idx on posts (user_id);
create index posts_published_idx on posts (published, created_at desc);

create function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger posts_updated_at
  before update on posts
  for each row execute function set_updated_at();

alter table posts enable row level security;

create policy "Published posts are viewable by everyone"
on posts for select using (published = true);

create policy "Users can view their own posts"
on posts for select using (auth.uid() = user_id);

create policy "Users can insert their own posts"
on posts for insert with check (auth.uid() = user_id);

create policy "Users can update their own posts"
on posts for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete their own posts"
on posts for delete using (auth.uid() = user_id);