# Spice Gurl — Email Preorder (customer ordering path)

**Production:** https://sandcreates.com/spice-gurl#preorder-storefront  
**Recipient:** `info@spicegurl.store` (from Sandy's published business card)

There is **no regular online checkout**. The website lets visitors select currently published products and quantities, review an estimated subtotal, then **open their own email application with a prepared preorder request addressed to Sandy**. The customer must click Send in their email app. The website does not deliver email automatically, process payment, store customer details, create an order record, or reserve stock.

## Customer journey

1. Choose **Email Preorder** in the header or **Preorder** from Spice Gurl product links.
2. Select products and quantities. Products with published positive prices appear in the selector.
3. Review quantities and estimated product subtotal.
4. Choose **Email preorder to Sandy** to open an editable email with the products, prices, quantities, total and confirmation request.
5. Send the message from the customer's email account. Sandy replies to confirm sizes, availability, actual cost, taxes, delivery/pickup or shipping terms, and acceptance. A sent email is **not** a confirmed order.

A copy-request fallback is available if the customer lacks a configured email app. No success screen or confirmation is shown by the website. Preorder selections are in page memory and reset on reload.

Legacy `/cart`, `/checkout/success` and `/checkout/cancel` routes redirect to the email preorder collection. Product detail buttons preselect the selected product in the same collection. The old demonstration shopping bag and its disabled checkout are no longer shown to visitors.

## Data and limitations

Published price estimates come from the Supabase product variants rather than legacy hardcoded demo data. Email draft prices are calculated in integer cents. Website checkout/payment acceptance, public inquiry submission, inventory reservations, automated emails, and the background job scheduler remain disabled.

**Verification still needed:** Send a real test email from a customer mailbox to `info@spicegurl.store` and confirm its receipt, reply workflow and fulfillment instructions. Mailto behavior depends on the visitor's device/email application, so retain the visible recipient and copy-request fallback. The customer should verify receipt and agreed details directly with Sandy.

Product photos and approved website design have not changed for this update.
