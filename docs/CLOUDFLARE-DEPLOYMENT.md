# Cloudflare deployment handoff

The approved source is `gerdy6shot/sandy-creates` on GitHub. Deploy with Cloudflare Pages; no further Sites publication is requested.

## Git-connected project

In Cloudflare Pages, connect the GitHub repository and select `main` as the production branch. Use repository root, build command `npm run build`, output `dist`, and Node 22. The npm lockfile is committed. The `_redirects` file supports nested client routes; `_headers` supplies the current preview headers.

No Cloudflare project, account binding, custom domain, or automatic deployment has been configured by this GitHub push. Add sandycreates.com only after verifying ownership and the selected Cloudflare project.

The code remains a demonstration: ordering, live admin, inquiry delivery, newsletter and payment processing are not activated. The prepared `functions/api/` directory is Cloudflare Pages Functions source, but its real-provider behavior needs staging verification and the documented server secrets. Do not set live flags simply to launch the visual demo.

Review README.md, ADMIN-GUIDE.md and LAUNCH-REVIEW.md before enabling business operations. Keep service-role/payment/email secrets server-side. No secrets are needed for the visual demo. Preview robots settings intentionally prevent indexing until launch content and policies are approved.
