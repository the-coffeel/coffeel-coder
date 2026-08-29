alter table posts
add constraint posts_user_id_profiles_fkey
foreign key (user_id) references profiles(id)
on delete cascade;