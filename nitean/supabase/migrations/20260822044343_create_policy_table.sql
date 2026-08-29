create policy "Public posts are viewable"
on posts for select
using (true);

create policy "Public profiles are viewable"
on profiles for select
using (true);