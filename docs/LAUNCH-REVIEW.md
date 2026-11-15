# Owner decisions and launch gates

> **Current production:** https://sandcreates.com. Supabase project `ncphseqscanghqdgzetf` is connected; the website and public catalog are live but owner login is not yet activated (zero Auth users at the November 15 audit). Checkout, inquiries, notifications, and maintenance scheduling remain disabled. Earlier checklist items below describe prelaunch tasks, not necessarily missing code.


## Brand and content
- Three Spice Gurl product photographs are supplied and integrated. Supply standalone mortar-and-pestle logo, exact green and original packaging files. Current text treatment and concept bowls are placeholders, not official brand artwork.
- Instagram screenshots were referenced in the brief but not attached in this session. Stock photographs are labeled and attributed in assets.json.
- Approve homepage/About copy. Education wording is owner-confirmed: bachelor’s degree in Culinary Arts from Johnson & Wales University. No additional degree designation, graduation date, coursework or honors inferred. Heritage, family anecdotes, founding dates and catering credentials remain unverified.
- Confirm product names, recipes, SKUs, sizes, integer prices, ingredients, allergens, storage, legal sale eligibility and approved image rights.
- Confirm remaining biography and event descriptions. The supplied IMG_6734.jpg is now used as Sandy’s Home/About portrait. No family photographs used.

## Operations
- Confirm business identity and contact address. Gainesville, Georgia is not published as a fulfillment promise.
- Approve pickup location, windows, timezone, lead times, cutoff, minimums, capacity rules, blocked dates, tax treatment and customer response expectations.
- Approve retail shipping eligibility, service area, packaging and rates; no prepared-food shipping or delivery enabled.
- Approve refunds, cancellations, no-show and allergy-request process. Review all policy drafts.

## Services and release
- A dedicated Sandy Creates **production** Supabase project is now connected. Create a separate staging project before further risky database changes.
- The six applied remote migrations are mirrored in `supabase/migrations/`. Do not rerun them on production. Create and verify the first owner Auth user, then disable general public signup and test account recovery.
- Owner dashboard code is deployed with RLS, but end-to-end owner session/CRUD, expired-session, and non-admin denial still require real-browser verification.
- Connect Turnstile frontend widget and secrets, then live inquiry adapter. Verify hostname/action, bounded input and database rate limiting. Public preview remains non-submitting.
- Configure email provider sender/domain and admin recipient; schedule `runMaintenance` and monitor failed jobs. Actual provider acceptance/delivery is not verified.
- Complete retail fulfillment/tax rules and wire the reservation RPC to Stripe session creation. The live checkout endpoint is deliberately 503 until this is complete.
- Add a safe order-lookup endpoint authorized by a short-lived checkout-specific capability, never just a guessed order ID. Success redirect alone must not confirm payment.
- Test distinct database connections competing for the final unit and verify webhook replay, cancellation and late payments using Stripe test mode. Local tests cover transaction invariants but are not a multi-connection load test.
- Culinary transactional capacity reservations and paid event reservations are NOT implemented; keep disabled until approved operating rules exist.
- Schedule expired-reservation release and notification retries with server-only credentials; no scheduler has been provisioned.
- Confirm rights, policies and business rules before indexing or public launch. Set canonical/sitemap to **sandcreates.com** only when ready; `sandycreates.com` is not the production domain.

## Pie accomplishment supplied by owner
- IMG_6730.jpg includes Sandy with a second-place ribbon and the @spicegurlofficial caption reporting second place in her first-ever Blue Ribbon Contest. IMG_6731.jpg and IMG_6732.jpg show the accompanying pie.
- This supplied account supports the limited accomplishment wording on About and Culinary. No contest date, specific organizer/official event name or pie name is published. Confirm those details before expanding the story. No recipe/ingredient/allergen or ordering claims inferred from the photographs.
