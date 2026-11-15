# Sandy Creates — OWNER portal

Production URL: https://sandcreates.com/admin/login
Supabase project: ncphseqscanghqdgzetf

This is the protected **live OWNER** portal, not the historical Demo Studio. A verified Supabase Auth email-link login is required. Database-side private membership is also required before any administrative data can be read or changed.

**As of November 15, there are zero Supabase Auth users.** The owner must first be provisioned through the Supabase dashboard **Authentication → Users → Add user** using the intended owner email. The website now sends magic links to **existing users only** (`shouldCreateUser: false`); it cannot create new users through the public login. The first authorized owner sign-in must be completed in the email inbox; deployment alone does **not** create an Auth user. An authorized owner email is checked server-side and must be verified before a private admin-role row is automatically provisioned. Never commit credentials, manually mark email verification without proof, or grant an owner role to an arbitrary user.

Sections:
- **Products:** edit names, descriptions, prices, inventory, published/featured state and original photo uploads. Changes live in Supabase. Image and variant operations are currently multi-step, not transactional; verify the result if any operation errors.
- **Orders and inquiries:** show only real rows. Public submissions and checkout are not enabled; empty lists are expected. Payment status is not directly editable.
- **Events:** manage owner records, publish when content is approved. The public site requests only the published event fields and never exposes private location.
- **Content / Availability:** manage published copy, dates and catalog pauses. Turning off a pause does not turn on checkout.
- **Settings:** authenticated session info and sign-out.

**Authentication release gate:** (1) Create the correct owner Auth user using an authenticated Supabase administrative action and an invitation/verification flow; (2) verify email ownership and redirect to `https://sandcreates.com/admin`; (3) confirm `private.admin_roles` has the verified owner's UID; (4) disable general public account registration under Supabase Auth settings and test direct public signup API denial; (5) test a non-owner email, sessions, RLS and upload/CRUD. Client-side `shouldCreateUser:false` reduces signup via the web login but **does not close the public Auth API**. Review MFA options before launch. Authentication, upload, CRUD, and RLS still require a live owner-session acceptance test.

**Operations:** No scheduler is connected to `runMaintenance`; no payment or customer notification should be considered active. Do not use demo data as customer records.
