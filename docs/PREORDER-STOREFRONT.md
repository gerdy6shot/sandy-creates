# Spice Gurl email preorder storefront

The storefront reuses the supplied SofriDOBO, Sol Shine and Yardie Glaze photographs. Customers select quantities, review an email draft, and send their preorder request to info@spicegurl.store from their own email app. A copy-request fallback supports customers without a configured email app. Nothing is submitted automatically by the website.

## Published prices

Source: https://www.spicegurl.store/, inspected October 23, 2026. Published USD prices:

- SofriDOBO: $12.00.
- Sol Shine Sauce (Sol Shine in this repository): $10.00.
- Yardie Glaze: $14.00.

Net weights/bottle sizes and preorder fulfillment dates were not specified in the inspected landing page or product descriptions. Sandy confirms those details, availability, final price and pickup/shipping arrangements directly. Product subtotals are explicitly estimates, excluding taxes and fulfillment costs. No sizes are inferred from photographs.

## Behavior

- Original product imagery, category filters, quantities from 1–99, removal, and integer-cent subtotal calculations.
- Desktop selection summary and mobile shortcut to the preorder summary.
- Selections survive category filtering and reset on reload. They remain separate from the demo shopping bag.
- Review opens a read-only draft containing canonical product names, selected quantities, published unit prices, estimated subtotal and a request for Sandy to confirm the remaining details. No website customer-data form or browser persistence is introduced.
- “Open email draft” opens a `mailto:` link. The customer adds their name/notes and sends it themselves. The UI does not claim the message was sent or the order was accepted.
- The storefront banner and product detail entry points explain email preorders. Other pages retain their existing preview behavior.
- Sandy Creates remains the parent brand and Spice Gurl its featured product brand.

## Payment boundary

Payment collection is deferred at the user's request. No Stripe setup, server endpoint, authentication, database, live checkout, stock reservation or order-confirmation changes are included. Emailing a request does not confirm an order or reserve inventory.

## Verification

Typecheck, lint, production build and all 22 tests passed. The email-specific tests check canonical quantities/prices, estimated totals, encoding and invalid selections. Browser review checks original images, filters, $34.00 for two SofriDOBO plus one Sol Shine, the recipient and encoded email body, empty-selection behavior and mobile overflow. No test email was sent.

Branch: `feature/spice-gurl-preorders`. Commits use `[CF-Pages-Skip]` to preserve review before deployment. No merge or deployment has been performed.
