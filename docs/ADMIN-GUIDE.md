# Sandy Creates — demo studio guide

Open `/admin/login`, then **Explore the demo studio**. This is an intentionally public demonstration workspace with fictional records, not a protected production account. Never enter customer data. Edits stay in this browser and are isolated from production.

- **Products:** create a sample, edit descriptions, ingredients, allergens and storage, add size variants, change whole-cent sample prices and stock, publish/unpublish, feature, and preview images. Only JPEG/PNG/WebP under 2 MB are accepted. Demo fulfillment toggles never enable checkout.
- **Orders:** the empty state reflects no connected order data. There is no manual “mark paid” control.
- **Availability:** pause demo bag additions, configure provisional timezone, capacity, lead time, blocked dates, pickup-window notes and the public culinary message. Culinary checkout stays closed.
- **Inquiries:** filter the fictional record, change its status, and add demo notes. Public contact forms do not create records.
- **Events:** create, edit and publish clearly marked sample experiences. Leave dates empty rather than inventing real events. No paid reservations.
- **Website content:** edit draft homepage headline, introduction, story and philosophy. All are editable concepts, not approved Sandy quotations.
- **Settings:** edit the response message and reset the demo, clearing local changes and bag items.

When live administration is implemented, use Supabase Auth with explicit admin UUID provisioning. Authentication alone is insufficient: database RLS checks `private.admin_roles`. The adapter includes an explicit authorization RPC. Do not connect the demo workspace directly to customer records. Production admin data loading, saves, error handling and session expiry remain integration work.
