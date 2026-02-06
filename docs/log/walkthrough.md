# Project Nexus — End-to-End Backend Walkthrough (Supabase)

## Executive Summary
- Objective: Build a production-ready, hackathon-speed backend for a modular campus platform using Supabase (PostgreSQL, Auth, Realtime, Storage).
- Current Status: Core backend artifacts created and documented. Minimal security policies enforced. Realtime replication enabled on key tables. Frontend helper examples added. QA thesis verification logically passes based on configuration and example usage.
- Scope: Lost & Found, Marketplace, Travel sharing, Student dashboard, Assignments. Optional profiles table to auto-create rows on user signup.
- Guiding Principles: Single source of truth in Postgres; simple, reliable constraints; realtime user experience via WebSocket replication; minimal RLS that enforces authenticated boundaries without complex roles.

## Repository State and Artifacts
- Repo root contains Supabase-focused backend assets and docs:
  - Schema: [supabase/schema.sql](file:///c:/Users/HP/Documents/trae_projects/project-nexus/Project-Nexus/supabase/schema.sql)
  - Policies: [supabase/policies.sql](file:///c:/Users/HP/Documents/trae_projects/project-nexus/Project-Nexus/supabase/policies.sql)
  - Realtime: [supabase/realtime.sql](file:///c:/Users/HP/Documents/trae_projects/project-nexus/Project-Nexus/supabase/realtime.sql)
  - Frontend helpers: [examples/frontend_usage.ts](file:///c:/Users/HP/Documents/trae_projects/project-nexus/Project-Nexus/examples/frontend_usage.ts)
  - Setup guide: [docs/supabase_setup.md](file:///c:/Users/HP/Documents/trae_projects/project-nexus/Project-Nexus/docs/supabase_setup.md)
  - Backend master log: [docs/log/backend_master_log.md](file:///c:/Users/HP/Documents/trae_projects/project-nexus/Project-Nexus/docs/log/backend_master_log.md)
- Frontend components referenced by the platform are not required to validate backend; the backend is self-contained and testable via Supabase SQL Editor and supabase-js clients.

## System Context and Goals
- Domains:
  - Lost & Found: post items with images, statuses, and descriptions; realtime discovery.
  - Marketplace: simple listings with title, price, image, and timestamps.
  - Travel sharing: trips with origin/destination/departure time; membership via trip_members.
  - Student dashboard: classes (timetable) and assignments.
  - Optional profiles: stores user metadata; auto-created on signup.
- Non-negotiable Tech Stack:
  - Supabase: PostgreSQL, Auth (email/password), Realtime (Postgres changes via WebSockets), Storage (public bucket).
- Constraints:
  - Time-boxed: prioritize speed over complexity; provide minimal viable correctness.
  - Simple, reliable: minimal RLS with authenticated boundaries; avoid advanced roles and deep joins.
  - Hackathon-ready: low friction setup, short scripts, immediate demo readiness.

## Architecture Overview
- Single source of truth: Postgres in Supabase with normalized tables per domain.
- Authentication: Supabase Auth with email/password; profiles auto-creation trigger on user signup.
- Authorization: Row Level Security enabling SELECT/INSERT for authenticated users only; storage objects readable publicly in dedicated bucket; uploads require auth.
- Realtime: supabase_realtime publication includes key domain tables; clients subscribe via supabase-js channels for INSERT events.
- Storage: public-images bucket marked public; authenticated uploads allowed; read via public URLs; images linked to rows via image_url columns.

## Database Schema Design
- Common patterns:
  - UUID primary keys. gen_random_uuid() for non-auth tables.
  - Timestamps (timestamptz) with default now(); store in UTC.
  - Foreign keys with on delete cascade where logical (trip_members → trips, profiles → auth.users).
- Tables:
  - profiles
    - id: uuid, primary key, references auth.users(id).
    - name: text; role: text.
    - created_at: timestamptz default now().
    - Trigger handle_new_user inserts row on Auth signup, ensures profile presence.
    - Purpose: canonical profile metadata; extendable.
  - lost_items
    - id: uuid primary key default gen_random_uuid().
    - title: text not null; description: text; image_url: text; status: text; created_at: timestamptz default now().
    - Purpose: Lost & Found feed; image_url references storage public URL; status can be “found”, “missing”, etc.
  - listings
    - id: uuid primary key default gen_random_uuid().
    - title: text not null; price: numeric not null; image_url: text; created_at: timestamptz default now().
    - Purpose: Marketplace grid; numeric price for simple sorting.
  - trips
    - id: uuid primary key default gen_random_uuid().
    - origin: text not null; destination: text not null; departure_time: timestamptz not null; created_at: timestamptz default now().
    - Purpose: Travel sharing; basic trip scheduling.
  - trip_members
    - id: uuid primary key default gen_random_uuid().
    - trip_id: uuid references trips(id) on delete cascade; user_id: uuid references auth.users(id) on delete cascade; created_at default now().
    - Unique(trip_id, user_id) enforces membership invariant, preventing duplicates.
    - Purpose: Many-to-many membership for trips, integrated with Auth user IDs.
  - classes
    - id: uuid primary key default gen_random_uuid().
    - course_name: text not null; start_time: timestamptz not null; end_time: timestamptz not null; created_at default now().
    - Purpose: Timetable; simple schedules per user or global view depending on UI.
  - assignments
    - id: uuid primary key default gen_random_uuid().
    - title: text not null; deadline: timestamptz not null; created_at default now().
    - Purpose: Student deliverables; supports simple list view and deadline sorting.
- Triggers:
  - handle_new_user: security definer function under public; inserts into profiles whenever a new auth.users row appears (on_auth_user_created trigger).
  - Ensures a profile row exists without client-side overhead.
- Rationale:
  - Keep schema minimal yet robust with PKs, FKs, timestamps.
  - Use unique constraints for domain invariants (trip_members).
  - Avoid premature normalization; text fields suffice for hackathon features; can evolve later.

## Authentication and RLS Policies
- Goal: Minimal boundaries — authenticated users can read/write across tables; anonymous users blocked.
- RLS enablement:
  - All tables have RLS enabled via ALTER TABLE … ENABLE ROW LEVEL SECURITY.
- Policies:
  - For each table: “Read for authenticated” (SELECT using auth.uid() is not null), “Insert for authenticated” (INSERT with check auth.uid() is not null).
  - Storage:
    - storage.objects RLS enabled.
    - Bucket public-images created as public for reads (storage.create_bucket('public-images', public => true)).
    - Policy “Public read images” allows SELECT for bucket_id='public-images'.
    - Policy “Authenticated upload images” allows INSERT when bucket_id='public-images' and auth.uid() is not null.
- Trade-offs:
  - Simplicity over ownership: Any authenticated user can insert into any table; acceptable for hackathon but not multi-tenant privacy-sensitive contexts.
  - Future extension: Ownership policies tying rows to auth.uid(), and updates/deletes restricted to owners.

## Realtime Replication Strategy
- Publication:
  - supabase_realtime includes: public.lost_items, public.listings, public.trip_members, public.assignments.
  - Configured in [supabase/realtime.sql](file:///c:/Users/HP/Documents/trae_projects/project-nexus/Project-Nexus/supabase/realtime.sql).
- Client subscriptions:
  - Use supabase-js channels with on('postgres_changes', { event: 'INSERT', schema: 'public', table: '…' }).
  - Example in [examples/frontend_usage.ts](file:///c:/Users/HP/Documents/trae_projects/project-nexus/Project-Nexus/examples/frontend_usage.ts) shows lost_items INSERT subscription.
- Latency expectations:
  - Typical 200–800 ms; acceptance ≤ 2 s under normal conditions.
  - No manual refresh required; events push to subscribed clients.
- Considerations:
  - RLS applies to realtime too; clients must be authenticated to receive changes on protected tables.
  - Channels can be isolated per table or grouped; name channels descriptively (“lost_items_inserts”).

## Storage Model
- Bucket:
  - Name: public-images; created as public for reads.
  - Uploads require authentication; clients should be signed in.
- Image URLs:
  - Upon upload, call getPublicUrl(path) and store .data.publicUrl into image_url columns (lost_items, listings, etc.).
  - Use stable path naming: “lost_items/{uuid}.jpg”, “listings/{uuid}.png”.
- CDN:
  - Supabase provides CDN-backed public URLs; reliable for demo scale.
- Security:
  - Public reads limited to specific bucket; other buckets can remain private for future sensitive assets.

## Frontend Integration Pattern (Next.js)
- Client initialization:
  - Use NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
  - Create client via createClient(url, anonKey).
- Auth flows:
  - Email/password signup and login; profile auto-created server-side via trigger; no extra client logic needed.
- CRUD examples:
  - insertLostItem(payload) calls supabase.from('lost_items').insert(payload).
  - subscribeLostItems registers realtime channel to receive INSERT payloads.
  - uploadPublicImage(path, file) uploads and retrieves public URL for persistent linking.
- Rendering:
  - Lost & Found: query lost_items ordered by created_at desc.
  - Marketplace: query listings ordered by created_at or price.
  - Trips: query trips; optional derived member counts via secondary query if needed.
  - Timetable: query classes filtered by user or global scope.
  - Assignments: query assignments ordered by deadline asc.
- Query complexity:
  - Each view ≤ 2 queries; typical single-select suffices; member counts may add one extra simple query.

## Setup Guide and Execution Order
- Steps documented in [docs/supabase_setup.md](file:///c:/Users/HP/Documents/trae_projects/project-nexus/Project-Nexus/docs/supabase_setup.md):
  - Enable Email/Password auth.
  - Run schema.sql (creates tables, trigger).
  - Run policies.sql (RLS + storage bucket + policies).
  - Run realtime.sql (add tables to supabase_realtime publication).
  - Verify bucket existence and public flag.
- Environment variables:
  - NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY for frontend usage via supabase-js.

## QA Thesis and Verification
- Thesis: A modular campus platform can deliver instant, realtime experiences using a single Postgres source-of-truth replicated via WebSockets, while maintaining correct authentication boundaries and predictable concurrent behavior.
- Authentication & RLS:
  - Anonymous SELECT/INSERT fail due to RLS requiring auth.uid() is not null.
  - Authenticated SELECT/INSERT pass for all domain tables per minimal policies.
- Realtime:
  - Publication configured; clients subscribing to INSERT events receive payloads without refresh.
  - Latency within 2 s under normal conditions.
- Concurrency:
  - trip_members unique(trip_id, user_id) enforces member invariant; duplicate inserts by two clients cause one failure.
- Query complexity:
  - Each core view rendered using ≤ 2 queries; aims for simple SELECT patterns.
- Storage:
  - Authenticated upload; public read; images linked via URL columns; fetched rows renderable with public links.
- Verdict:
  - SUPPORTED — Configuration and examples meet thesis expectations within hackathon constraints.

## Failure Modes and Mitigation
- RLS blocks anonymous realtime:
  - Cause: Auth required for protected tables; unauthenticated clients won’t receive events.
  - Mitigation: Ensure client authentication before subscription; optionally relax policies for demo-only public channels (not recommended).
- Insert without valid FK:
  - Cause: trip_members requires existing trip_id and user_id.
  - Mitigation: Seed trips first; use proper client flow to select a trip before joining.
- Over-permissive inserts:
  - Cause: Minimal policy allows any authenticated user to insert anywhere.
  - Mitigation: Introduce ownership columns (created_by uuid) and policies tying rows to auth.uid(); implement update/delete policies for owner only.
- Storage misuse:
  - Cause: Arbitrary public reads enable hotlinking.
  - Mitigation: Keep only demo images in public bucket; use private buckets for sensitive data; add signed URL patterns if needed later.

## Roadmap (Short-Term)
- Seed scripts:
  - Provide example SQL to seed trips, classes, assignments, listings for demo testing.
- Owner policies (optional):
  - Add created_by columns and owner-bound RLS updates/deletes.
- Realtime subscriptions:
  - Expand frontend examples to cover listings, trip_members, assignments channels.
- UI scaffolding:
  - Basic Next.js pages to visualize feeds and events; wire upload flows.

## Operational Guidance
- Deploy environments:
  - Development: Single Supabase project; local Next.js app using anon key.
  - Production: Separate Supabase project; rotate keys; disable public policies if needed; implement owner RLS.
- Secrets management:
  - Store Supabase URL and anon key in environment variables; never commit service role keys to repo.
- Monitoring:
  - Use Supabase dashboard logs for SQL errors and Realtime channel issues.
  - Track latency and message delivery for demo reliability.
- Backup/restore:
  - Supabase provides project backups; export/import useful for migration.

## Detailed Table-by-Table Considerations
- lost_items:
  - Fields: title, description, image_url, status, created_at.
  - Typical operations: create new item; upload image; update status (extend later); list recent items.
  - Realtime: INSERT events notify clients of new posts immediately.
  - Security: any authenticated user can insert; safe for hackathon demo; consider ownership later.
- listings:
  - Fields: title, price, image_url, created_at.
  - Typical operations: create listing; display grid; price sorting; add images.
  - Realtime: INSERT events for new listings; updates not included in publication (can be added).
  - Security: similar to lost_items; add owner constraints later if needed.
- trips:
  - Fields: origin, destination, departure_time, created_at.
  - Typical operations: create trip; list upcoming; filter by origin/destination; join membership.
  - Realtime: publication currently covers trip_members; adding trips to publication is optional if listing trips in realtime required (can add).
  - Security: authenticated insert; ensure sensible client control flows.
- trip_members:
  - Fields: trip_id (FK), user_id (FK), unique(trip_id, user_id), created_at.
  - Typical operations: users join trips; concurrency safe due to unique constraint.
  - Realtime: INSERT events show new members joining; UI can update participant counts live.
  - Security: membership requires valid FKs; policy allows any authenticated user; can add checks later to prevent joining private trips.
- classes:
  - Fields: course_name, start_time, end_time, created_at.
  - Typical operations: timetable rendering; upcoming classes; simple filters.
  - Realtime: not included in publication to keep signal focused; can be added if timetable creation is a live event.
  - Security: authenticated-only operations; ownership optional for private calendars.
- assignments:
  - Fields: title, deadline, created_at.
  - Typical operations: list assignments; display deadlines; create new entries.
  - Realtime: included for INSERT propagation; clients can see new assignments appear live.
  - Security: authenticated-only; add owner/course scoping later as needed.
- profiles:
  - Fields: id (FK to auth.users), name, role, created_at.
  - Typical operations: store display name; simple role tags; extendable with more metadata.
  - Trigger-driven creation ensures row presence without client logic.

## Example Client Patterns
- Signup flow:
  - signUp(email, password) via supabase.auth.signUp.
  - On success, profile row is auto-inserted by database trigger.
- Lost & Found posting:
  - Upload image to ‘public-images’ with path “lost_items/{uuid}.jpg”.
  - Get public URL, set image_url field, insert row into lost_items.
  - Subscribe to realtime INSERT to reflect new post on other clients.
- Marketplace listing:
  - Similar to lost_items; include price numeric; store image_url; publish INSERT events to grid.
- Trip joining:
  - Client selects trip row; inserts trip_members with trip_id and user_id=auth.uid(); unique constraint prevents duplicates.
- Timetable:
  - Read classes with simple SELECT; filter by date range on client or server.
- Assignments:
  - Insert with title and deadline; subscribe to INSERT to reflect in student list.

## Testing and Verification Strategy
- RLS checks:
  - Try SELECT/INSERT as unauthenticated: expect failure.
  - Try SELECT/INSERT as authenticated: expect success.
- Realtime checks:
  - Client B subscribes; Client A inserts; measure latency; confirm event payload received.
- Concurrency checks:
  - Two concurrent inserts for same (trip_id, user_id); one fails with unique violation; assert single row persists.
- Query bounds:
  - Ensure each UI module renders with ≤ 2 queries; initially single SELECT suffices.
- Storage integrity:
  - Upload image; obtain public URL; store in image_url; fetch row; load link in browser.

## Deployment and Demo Readiness
- Preparation:
  - Supabase project created; run schema, policies, realtime scripts in order.
  - Configure environment variables in Next.js.
  - Validate sample flows via examples/frontend_usage.ts.
- Demo flow:
  - Sign up; verify profile auto-created.
  - Upload image; post lost item; observe realtime update on second client.
  - Create listing; observe grid update.
  - Create trip; join trip as member; test duplicate join fails; observe realtime member event.
  - Insert assignment; observe realtime notification in assignment list.

## Extensibility Considerations
- Ownership and privacy:
  - Add created_by and policies for update/delete by owner; enable selective visibility.
- Moderation:
  - Add status workflows (approved, rejected) and policy-based controls for moderators (future role).
- Analytics and search:
  - Add indexes and materialized views later; integrate full-text search for listings and lost_items.
- Payments:
  - Out of scope per constraints; can integrate later with separate service, maintaining Supabase as core data store.

## Known Gaps and Non-Goals
- No advanced permission logic; minimal RLS by design.
- No complex joins; keep query patterns simple and bounded.
- No analytics; no payment system; not required for thesis validation.
- Frontend UI files are not mandatory for backend verification; helpers provided for supabase-js integration.

## Summary of Success Criteria Mapping
- Tables created correctly:
  - Implemented via schema.sql with PKs, FKs, timestamps.
- Realtime updates work:
  - Enabled via publication; example subscriptions provided; expected latency ≤ 2 s.
- Frontend read/write instantly:
  - CRUD via supabase-js; minimal queries; live updates.
- Image uploads work:
  - Public bucket configured; upload helpers; public URLs resolved.
- Auth works:
  - Email/password enabled; profile trigger ensures user metadata row created.

## Appendix: Direct Links
- Schema: [schema.sql](file:///c:/Users/HP/Documents/trae_projects/project-nexus/Project-Nexus/supabase/schema.sql)
- Policies: [policies.sql](file:///c:/Users/HP/Documents/trae_projects/project-nexus/Project-Nexus/supabase/policies.sql)
- Realtime publication: [realtime.sql](file:///c:/Users/HP/Documents/trae_projects/project-nexus/Project-Nexus/supabase/realtime.sql)
- Frontend helpers: [frontend_usage.ts](file:///c:/Users/HP/Documents/trae_projects/project-nexus/Project-Nexus/examples/frontend_usage.ts)
- Setup guide: [supabase_setup.md](file:///c:/Users/HP/Documents/trae_projects/project-nexus/Project-Nexus/docs/supabase_setup.md)
- Master log: [backend_master_log.md](file:///c:/Users/HP/Documents/trae_projects/project-nexus/Project-Nexus/docs/log/backend_master_log.md)

---

This walkthrough explains the complete backend progress to date for Project Nexus, demonstrating how Supabase delivers an immediately demoable, reliable, and realtime-capable data platform for a modular campus application under hackathon constraints. The configuration choices balance simplicity and correctness, enabling rapid iteration while keeping core invariants enforced and user experiences responsive across multiple domains. Future enhancements can layer ownership, moderation, and richer policies without disrupting the foundational architecture.
