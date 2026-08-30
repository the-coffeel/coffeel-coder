create table public.media (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  -- Cloudinary
  cloudinary_public_id text not null unique,
  cloudinary_secure_url text not null,

  -- File information
  file_name text,
  file_size bigint,
  mime_type text,
  format text,

  -- Image information
  width integer,
  height integer,

  -- Optional organization
  folder text,

  created_at timestamptz not null default now()
);



alter table public.media enable row level security;

create policy "Users can view their own media"
on public.media
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can upload their own media"
on public.media
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can delete their own media"
on public.media
for delete
to authenticated
using (auth.uid() = user_id);