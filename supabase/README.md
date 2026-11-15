# Supabase migration history — Sandy Creates

**Project:** `ncphseqscanghqdgzetf` — [Supabase dashboard](https://supabase.com/dashboard/project/ncphseqscanghqdgzetf)

The six timestamped SQL files in `supabase/migrations/` are **exact copies of the statement text recorded by the live project's `supabase_migrations.schema_migrations` table** as of November 15, 2026. Versions and applied order are preserved:

| Version | Migration |
| --- | --- |
| 20261109214341 | sandy_creates_core |
| 20261109214417 | sandy_creates_verified_owner_bootstrap |
| 20261109214711 | sandy_creates_existing_catalog_seed |
| 20261109215143 | sandy_creates_published_events_access |
| 20261115191746 | sandy_creates_anon_catalog_column_minimization |
| 20261115191835 | sandy_creates_public_catalog_sort_permission |

The previous `20261022162859_sandy_creates_core.sql` file represented the **original local proposal, not an applied remote version**. It has been removed from the active migration directory to prevent applying the core tables twice. Its source remains available in Git history.

**Important:** The original core migration is a one-time baseline; do not rerun any of these migrations against the existing production project. The files were mirrored from production; **replay in a clean local/staging database and schema diff are not yet verified**. Future migrations must be additive, tested in staging, committed before production application, and accompanied by rollback or forward-recovery notes.

**Verified live checks on November 15:** anonymous `SELECT` on approved public event columns is allowed, `SELECT` on private event `location` is denied. Private `admin_roles` and `rate_limits` have RLS enabled and no direct end-user policies by design (service-side mechanisms). Zero Auth users and zero admin roles at time of verification; owner sign-in cannot be claimed operational yet.

**Still pending:** owner account creation via verified Supabase Auth, site-wide public signup restrictions in Auth provider configuration, owner-session end-to-end tests, and appropriate video-caption/transcript content. No checkout/email/maintenance jobs are live.
