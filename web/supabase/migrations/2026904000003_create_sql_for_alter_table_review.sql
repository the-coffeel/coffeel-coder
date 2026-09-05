select column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name = 'reviews'
order by ordinal_position;

alter table public.reviews
add column improvement_comment text;

ALTER TABLE public.reviews
ADD COLUMN improvement_tags text[] DEFAULT '{}';

ALTER TABLE public.reviews
ADD COLUMN positive_comment text;

ALTER TABLE public.reviews
ADD COLUMN positive_tags text[] DEFAULT '{}';