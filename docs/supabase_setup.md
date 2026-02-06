## Setup
1. Create a Supabase project. Enable Email/Password auth in Authentication settings.
2. Open SQL editor and run files in order:
   - supabase/schema.sql
   - supabase/policies.sql
   - supabase/realtime.sql
3. In Storage, verify bucket `public-images` exists and is public.

## Frontend Client
Install `@supabase/supabase-js` and set environment variables for URL and anon key.

## Realtime
Replicated tables: lost_items, listings, trip_members, assignments. Clients subscribe to INSERT events.

## Verification
- Sign up via email/password; profile row appears.
- Insert rows into each table; reads work for authenticated users.
- Realtime INSERT events received by subscribed clients.
- Upload an image to `public-images` and access via public URL.*** End Patch  />,
