# Sandy Creates

Source repository: https://github.com/gerdy6shot/sandy-creates

**Deployment target: Cloudflare Pages.** The existing Sites URL is an earlier review preview, not the deployment target for future releases. No GitHub-to-Cloudflare automatic deployment has been configured.

A NEW, standalone Sandy Creates application. No code, assets, credentials, database project or deployment from the earlier Cynthia Horner project is reused.

## Current release

Presentation demo: complete public routes, Spice Gurl product showcase with supplied photographs, persistent demo bag, culinary inquiry pathways, experiences empty states, contact validation, policy drafts and an editable local demo studio. The shipped UI ALWAYS uses synthetic demo data. It does not take payments, save inquiries, subscribe emails or access live customer records. The persistent preview banner makes this explicit.

React 19, TypeScript, Vite 7, React Router, Tailwind 4, custom editorial design tokens, and Lucide icons. npm and package-lock.json. Node 22.17+ recommended (tests use Node's experimental TypeScript stripping).

## Local setup

```sh
npm ci
npm run dev
```

No environment variables are needed for the demo. `.env.example` lists future browser publishable configuration and server-only secret names, with no credentials.

```sh
npm run typecheck   # browser + prepared server adapter
npm run lint
npm test           # unit, API gates and local Postgres/RLS tests
npm run build
npm run preview
```

## Source map

- `src/pages/` — public pages and local demo studio.
- `src/components/` — navigation, footer, image treatments, shared controls.
- `src/lib/models.ts` — typed products, variants, culinary offerings, events, settings and demo records.
- `src/data/demo.ts` — isolated sample content, products/prices and a fictional inquiry. No production seed is automatically inserted.
- `src/lib/store.tsx` — browser-only demo storage. Real inquiries are NEVER stored in browser storage.
- `src/lib/cart.ts` — integer-money calculations, quantities and stock clamps. Browser totals are never authoritative for payment.
- `src/lib/live-adapter.ts` — prepared Supabase client, authenticated-admin check and saved-inquiry response contract; not enabled in UI.
- `server/api.ts`, `server/security.ts`, `functions/api/[[path]].ts` — prepared Cloudflare Pages Functions integration, server validation, origin checks, Turnstile verification, DB-backed throttling, verified Stripe webhook, notification queue runner and reservation cleanup.
- `supabase/migrations/` — versioned schema prepared with the official CLI, verified in local PGlite only. NOT applied to Supabase.
- `tests/` — meaningful invariant and permission checks. PGlite tests stub Supabase's auth/storage schemas; they do not replace staging Auth/Storage tests.
- `docs/assets.json` — stock-photo source/license credits. Stock is mood imagery, not Sandy's work.
- `docs/ADMIN-GUIDE.md` — demo workflows and live-admin limitations.
- `docs/LAUNCH-REVIEW.md` — explicit remaining integrations and owner approvals.
- `docs/VERIFICATION.md` — actual checks and limits.

## Content and assets

All copy is editable draft, not Sandy's approved quotations. SofriDOBO, Sol Shine and Yardie Glaze use the supplied packaging photographs and readable label names. Their prices, sizes, ingredients and availability remain unconfirmed; buying controls are disabled and no sample prices are attached to these products. No invented reviews, credentials, discounts or business address. Portrait is an intentional replacement slot. Spice Gurl uses a temporary text treatment; no official logo/packaging is fabricated.

Replace stock images in `public/images/` with approved images and update meaningful alt text. Product photo previews in the demo studio accept JPEG/PNG/WebP under 2 MB; production bucket restrictions are also prepared. Never upload private images to the proposed public product-image bucket.

## Supabase and server deployment

Use a **dedicated Sandy Creates** project; none is configured or assumed. Review migration against existing schema before applying. The proposed schema separates products/variants, orders/items, stock reservations, private admin membership, availability, inquiries, jobs and processed payment events. Public grants/RLS expose only published catalog/content and availability; private records remain admin-only. No public role assignment. Payment state cannot be manually changed by admin clients.

Provision a specific admin user's UUID into `private.admin_roles` using trusted SQL only after the user exists. Service-role keys belong only in server secrets. The single security-definer helper reads explicit admin membership with fixed search_path; public mutation functions are security invoker and service-role only.

`server/api.ts` is prepared but not deployed by the static Sites preview. `POST /api/inquiries` saves only after server validation, origin/Turnstile verification, rate-limit RPC and a successful DB transaction; it returns saved:false on failure. The frontend widget and live wiring remain launch gates. The demo form only validates locally and states nothing was sent.

Retail reservation RPC locks variants in deterministic order, snapshots trusted prices, deducts stock atomically and holds for 35 minutes. The draft Stripe helper creates card-only sessions lasting 30 minutes with order-based idempotency. A webhook commits reservations and deduplicates events in one DB transaction; late payment after released stock becomes paid/needs_review and must be manually resolved/refunded. Inventory is not deducted twice. Checkout remains disabled until fulfillment, taxes and lookup rules are complete. Culinary capacity checkout is intentionally unimplemented/disabled.

Notification jobs are saved transactionally with inquiries or payments. `runMaintenance` claims jobs with leases, uses provider idempotency and records failures without deleting business records; at most three attempts. Wire it to a protected scheduled Worker in staging. No remote schedule exists. Idempotency depends on provider retention windows and must be verified before launch.

## Hosting

The private Sites preview serves only the built static demo (`.openai/hosting.json`). Sites handles owner access separately from future customer/admin authentication. No custom domain has been connected.

For a future Cloudflare Pages deployment: build command `npm run build`, output `dist`, npm lockfile, Node 22. Deploy from this project root so `functions/` is included if approved. Nested routes use `public/_redirects`; `_headers` supplies baseline headers. Configure server secrets in Pages, not VITE_ variables. Provider runtime and Pages Functions behavior require staging verification.

Before enabling a live service, implement its UI integration, review operating rules, apply schema in staging, test RLS/Auth/Storage/provider webhooks, then approve launch. The preview's `robots.txt`, robots meta and X-Robots-Tag deliberately disable indexing. Production sitemap/canonical and social image require approved live routing/domain/assets; the supplied primary domain is sandycreates.com but is not connected by this release.

## Product photography update

The three supplied product images replace the original fictional catalog in the homepage collection, shop and detail pages. Catalog version 2 replaces retired starter products for returning browsers while preserving unrelated local content/events/settings/custom-product edits. Prior starter variants are removed from the demo bag. Individual original image files live in `public/images/products/`. Public product details intentionally withhold unapproved sale information.

## Pie accomplishment

`src/data/accomplishments.ts` contains typed, source-attributed content for Sandy’s second-place result in her first Blue Ribbon Contest, reported in the supplied @spicegurlofficial post. The reusable feature appears on About and Culinary with her ribbon portrait and both pie photographs. Exact contest identity/date and pie name remain unset. Source images are preserved in `public/images/accomplishments/`; CSS crops the social-interface edges. The feature is editorial, not an orderable menu item.

## Confirmed profile and education

`src/data/profile.ts` is the reusable profile source. The owner confirmed a bachelor’s degree in Culinary Arts from Johnson & Wales University. It appears once in the About narrative and once briefly in the Home introduction; there are no credential badges or sitewide repetitions. No BS/BA designation, graduation date, coursework or academic achievements are inferred. The same source contains a reusable professional bio, also supplied in `docs/PROFESSIONAL-BIO.md`. The new portrait comes from IMG_6734.jpg, preserved in `public/images/sandy/profile.jpg`, and replaces the Home/About placeholder artwork.
