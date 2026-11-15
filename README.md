# Sandy Creates

Source repository: https://github.com/gerdy6shot/sandy-creates

**Deployment target: Cloudflare Pages.** The existing Sites URL is an earlier review preview, not the deployment target for future releases. Cloudflare Pages project `sandy-creates` deploys automatically from GitHub `main` at https://sandy-creates.pages.dev.

A NEW, standalone Sandy Creates application. No code, assets, credentials, database project or deployment from the earlier Cynthia Horner project is reused.

## Current release (live on sandcreates.com)

Cloudflare Pages publishes the React 19 / TypeScript / Vite storefront from `main`. Public product catalog, featured prices, published website copy and published events are read from the dedicated Supabase project `ncphseqscanghqdgzetf`. The secured `/admin` routes use Supabase Auth with private owner authorization in the database. The old demo studio is retired. Existing approved Sandy photographs and editorial styling are unchanged.

**Not launched:** public contact inquiries, payment checkout, inventory reservation/fulfillment, notification emails and scheduler. The public preorder flow is email-draft only. Do not enable live payments from the website without the operations and security checks.

The owner must complete the first verified Supabase Auth sign-in before access is usable; an empty Auth Users list is not a working owner login.

## Local setup

```sh
npm ci
npm run dev
```

The required public Supabase URL and publishable key are supplied at build time by `.env.production` (public values only). `.env.example` documents the required names and server-only settings. Never expose server secrets through `VITE_`.

```sh
npm run typecheck   # browser + prepared server adapter
npm run lint
npm test           # unit, API gates and local Postgres/RLS tests
npm run build
npm run preview
```

## Source map

- `src/pages/OwnerAdmin.tsx` — active protected owner studio and email-link sign-in.
- `src/lib/sandy-supabase.ts` — public Supabase client with required build-time configuration.
- `src/lib/store.tsx` — published database catalog/content/events; bag remains browser-local.
- `src/data/demo.ts` — historical presentation reference data, **not** the live catalog.
- `src/lib/preorder-request.ts` — builds email-only preorder drafts; does not create orders.
- `server/api.ts`, `functions/api/` — prepared gated functions; inquiries, notifications, and checkout are **not enabled**.
- `supabase/migrations/` — original schema source; **remote migrations were applied** and are separately tracked by Supabase. The historical SQL is a one-time baseline, not safely re-runnable.
- `docs/ADMIN-GUIDE.md` — real owner portal behavior and remaining limitations.
- `.github/workflows/verify-owner-portal.yml` — typecheck, lint, tests and build on main/PRs.

## Content and assets

All copy is editable draft, not Sandy's approved quotations. SofriDOBO, Sol Shine and Yardie Glaze use the supplied packaging photographs and readable label names. Their prices, sizes, ingredients and availability remain unconfirmed; buying controls are disabled and no sample prices are attached to these products. No invented reviews, credentials, discounts or business address. Portrait is an intentional replacement slot. Spice Gurl uses a temporary text treatment; no official logo/packaging is fabricated.

Replace stock images in `public/images/` with approved images and update meaningful alt text. Product photo previews in the demo studio accept JPEG/PNG/WebP under 2 MB; production bucket restrictions are also prepared. Never upload private images to the proposed public product-image bucket.

## Supabase and operational status

**Connected project:** `ncphseqscanghqdgzetf` — https://supabase.com/dashboard/project/ncphseqscanghqdgzetf

Applied remote migrations include `sandy_creates_core`, `sandy_creates_verified_owner_bootstrap`, `sandy_creates_existing_catalog_seed`, and `sandy_creates_published_events_access`. The storefront reads published products, product variants, product photos, site copy, availability and approved public event fields. RLS protects private orders, inquiries, admin roles and storage modifications. Event locations are private.

The owner sign-in sends a Supabase email OTP/magic link. Only a verified Auth user matching the server-side authorized owner identity can be provisioned an admin role. Sign-up restrictions should be tightened **after** the first owner account has been provisioned and tested; public sign-ups still require review. MFA for the owner is recommended.

**Disabled:** checkout, payment capture and inquiry submission. The maintenance runner is *defined but not scheduled*. Configure and test a dedicated protected schedule only when email/checkout go live. The remote baseline migration is not idempotent: do not rerun it against an existing project. Commit additive forward-only migrations, test in staging, and capture rollback guidance for each new migration. Production deployments use GitHub `main` and Cloudflare Pages.

**Search indexing:** noindex remains intentional before launch. Review canonical metadata, policies and business details before opening indexing.

## Product photography update

The three supplied product images replace the original fictional catalog in the homepage collection, shop and detail pages. Catalog version 2 replaces retired starter products for returning browsers while preserving unrelated local content/events/settings/custom-product edits. Prior starter variants are removed from the demo bag. Individual original image files live in `public/images/products/`. Public product details intentionally withhold unapproved sale information.

## Pie accomplishment

`src/data/accomplishments.ts` contains typed, source-attributed content for Sandy’s second-place result in her first Blue Ribbon Contest, reported in the supplied @spicegurlofficial post. The reusable feature appears on About and Culinary with her ribbon portrait and both pie photographs. Exact contest identity/date and pie name remain unset. Source images are preserved in `public/images/accomplishments/`; CSS crops the social-interface edges. The feature is editorial, not an orderable menu item.

## Confirmed profile and education

`src/data/profile.ts` is the reusable profile source. The owner confirmed a bachelor’s degree in Culinary Arts from Johnson & Wales University. It appears once in the About narrative and once briefly in the Home introduction; there are no credential badges or sitewide repetitions. No BS/BA designation, graduation date, coursework or academic achievements are inferred. The same source contains a reusable professional bio, also supplied in `docs/PROFESSIONAL-BIO.md`. The new portrait comes from IMG_6734.jpg, preserved in `public/images/sandy/profile.jpg`, and replaces the Home/About placeholder artwork.
