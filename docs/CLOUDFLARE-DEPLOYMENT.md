# Cloudflare Pages — Sandy Creates

**Production**: https://sandcreates.com
**Project**: `sandy-creates` in Cloudflare Pages
**Source**: `gerdy6shot/sandy-creates`, production branch `main`
**Build**: Node 22, `npm ci` and `npm run build`; output `dist`

The production build includes Vite's **public** Supabase configuration from `.env.production`. Do not commit service-role, SMTP, payment or private secrets. The protected OWNER portal uses Supabase Auth and database RLS; a successful build does not establish a working first owner session.

CI runs on pull requests and pushes to `main`: typecheck, lint, tests and build. Cloudflare's direct Git deployment is still separate from required merge checks; branch protections must be configured in GitHub to make passing CI mandatory *before* a merge.

Payment checkout, public contact submission and scheduled notification delivery are **not enabled**. Keep private server configuration in Cloudflare Pages secrets and do not flip live flags without staging acceptance tests.

The site intentionally retains noindex settings before launch. Before enabling search indexing, review canonical URLs, privacy policies, public ordering, and real business contact details.
