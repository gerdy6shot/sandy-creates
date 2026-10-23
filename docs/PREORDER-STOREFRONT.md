# Spice Gurl paid preorder storefront review

The user requested paid preorders. The existing supplied SofriDOBO, Sol Shine and Yardie Glaze photographs are reused without asset edits. New storefront UI is scoped to the Spice Gurl shop and its product detail entry points. It inherits Sandy Creates typography, rust/cream colors and the parent-brand navigation. The prior About business-card feature remains on the branch.

## Verified product prices

Source: https://www.spicegurl.store/, inspected October 23, 2026. Published product data confirms USD prices and no size options:

- SofriDOBO: $12.00.
- Sol Shine Sauce (displayed as Sol Shine in this repository): $10.00.
- Yardie Glaze: $14.00.

The landing page and inspected product descriptions do not specify net weights, bottle volumes or preorder fulfillment dates. Do not infer sizes from the photographs. The public retail stock flags are not preorder capacity commitments and are not reused as such.

## Implemented preview

- Product photographs, prices, category filters, quantity controls, selection/removal and subtotal calculation in integer cents.
- Mobile selection shortcut and desktop summary.
- Selection persists through category filtering, but resets on page reload. It is separate from the existing demo bag.
- Review step displays outstanding size, pickup/shipping and fulfillment-date details.
- Product detail pages display the same published price and link back to the storefront.
- Payment button is explicitly disabled. No email request, payment collection, stock reservation or order confirmation is represented as completed.

## Needed to enable real paid preorders

Confirm the three product sizes, preorder availability/capacity and fulfillment date, pickup or shipping options and costs, and the merchant/payment provider to use. Refund/cancellation and tax treatment must accompany the paid offer. No payment account belonging to another project has been reused.

Existing backend checkout deliberately remains unavailable. A real integration must create the order and hosted payment session server-side using trusted prices, verify paid webhook events and persist order status. Those changes and provider configuration require the missing commercial details; this commit does not enable checkout by toggling a browser flag.

No server, authentication, database, checkout-result or existing cart source changes were made. No secrets or customer data are added.

## Validation

- Typecheck, lint, build passed; existing suite: 20 tests passed.
- Browser: all three original photographs loaded; no horizontal overflow at 1440, 390 and 320 px.
- Two SofriDOBO plus one Sol Shine correctly totals $34.00. Filtering retains both selections.
- Quantity decrement/removal clears selections. Review is disabled when empty.
- Review step renders with payment explicitly disabled.

Branch: `feature/spice-gurl-preorders`. Commit prefix `[CF-Pages-Skip]` preserves review-before-deployment. No merge or deployment has been performed.
