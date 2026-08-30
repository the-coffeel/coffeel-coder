create policy "Users can update their own media"
on public.media
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
