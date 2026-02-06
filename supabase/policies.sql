begin;

alter table public.profiles enable row level security;
alter table public.lost_items enable row level security;
alter table public.listings enable row level security;
alter table public.trips enable row level security;
alter table public.trip_members enable row level security;
alter table public.classes enable row level security;
alter table public.assignments enable row level security;

create policy "Read for authenticated" on public.profiles
for select
using (auth.uid() is not null);

create policy "Insert for authenticated" on public.profiles
for insert
with check (auth.uid() is not null);

create policy "Read for authenticated" on public.lost_items
for select
using (auth.uid() is not null);

create policy "Insert for authenticated" on public.lost_items
for insert
with check (auth.uid() is not null);

create policy "Read for authenticated" on public.listings
for select
using (auth.uid() is not null);

create policy "Insert for authenticated" on public.listings
for insert
with check (auth.uid() is not null);

create policy "Read for authenticated" on public.trips
for select
using (auth.uid() is not null);

create policy "Insert for authenticated" on public.trips
for insert
with check (auth.uid() is not null);

create policy "Read for authenticated" on public.trip_members
for select
using (auth.uid() is not null);

create policy "Insert for authenticated" on public.trip_members
for insert
with check (auth.uid() is not null);

create policy "Read for authenticated" on public.classes
for select
using (auth.uid() is not null);

create policy "Insert for authenticated" on public.classes
for insert
with check (auth.uid() is not null);

create policy "Read for authenticated" on public.assignments
for select
using (auth.uid() is not null);

create policy "Insert for authenticated" on public.assignments
for insert
with check (auth.uid() is not null);

alter table storage.objects enable row level security;

select storage.create_bucket('public-images', public => true);

create policy "Public read images"
on storage.objects
for select
using (bucket_id = 'public-images');

create policy "Authenticated upload images"
on storage.objects
for insert
with check (bucket_id = 'public-images' and auth.uid() is not null);

commit;
