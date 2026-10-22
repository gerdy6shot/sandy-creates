# Owner decisions and launch gates

## Brand and content
- Three Spice Gurl product photographs are supplied and integrated. Supply standalone mortar-and-pestle logo, exact green and original packaging files. Current text treatment and concept bowls are placeholders, not official brand artwork.
- Instagram screenshots were referenced in the brief but not attached in this session. Stock photographs are labeled and attributed in assets.json.
- Approve homepage/About copy. No education, heritage, family anecdotes, founding dates, awards or catering credentials have been invented.
- Confirm product names, recipes, SKUs, sizes, integer prices, ingredients, allergens, storage, legal sale eligibility and approved image rights.
- Confirm biography, event descriptions and personal portrait. No family photographs used.

## Operations
- Confirm business identity and contact address. Gainesville, Georgia is not published as a fulfillment promise.
- Approve pickup location, windows, timezone, lead times, cutoff, minimums, capacity rules, blocked dates, tax treatment and customer response expectations.
- Approve retail shipping eligibility, service area, packaging and rates; no prepared-food shipping or delivery enabled.
- Approve refunds, cancellations, no-show and allergy-request process. Review all policy drafts.

## Services and release
- Create/select a dedicated Sandy Creates Supabase staging project. No project from another website is used.
- Review/apply the migration in staging; provision admin UUIDs through trusted SQL. Configure Auth redirect URLs and account recovery.
- Implement live admin CRUD against RLS, replacing the synthetic demo store. Test session expiry and non-admin denial with real JWTs.
- Connect Turnstile frontend widget and secrets, then live inquiry adapter. Verify hostname/action, bounded input and database rate limiting. Public preview remains non-submitting.
- Configure email provider sender/domain and admin recipient; schedule `runMaintenance` and monitor failed jobs. Actual provider acceptance/delivery is not verified.
- Complete retail fulfillment/tax rules and wire the reservation RPC to Stripe session creation. The live checkout endpoint is deliberately 503 until this is complete.
- Add a safe order-lookup endpoint authorized by a short-lived checkout-specific capability, never just a guessed order ID. Success redirect alone must not confirm payment.
- Test distinct database connections competing for the final unit and verify webhook replay, cancellation and late payments using Stripe test mode. Local tests cover transaction invariants but are not a multi-connection load test.
- Culinary transactional capacity reservations and paid event reservations are NOT implemented; keep disabled until approved operating rules exist.
- Schedule expired-reservation release and notification retries with server-only credentials; no scheduler has been provisioned.
- Confirm rights, policies and business rules before indexing or public launch. Set canonical/sitemap to sandycreates.com only when that domain serves the approved live site.
