begin;
alter publication supabase_realtime add table public.lost_items;
alter publication supabase_realtime add table public.listings;
alter publication supabase_realtime add table public.trip_members;
alter publication supabase_realtime add table public.assignments;
commit;
