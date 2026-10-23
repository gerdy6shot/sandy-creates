# About-page digital business card review

Source: https://dot.cards/gurlbites, checked October 23, 2026. Existing About implementation: `src/pages/About.tsx`, corresponding to https://sandy-creates.pages.dev/about. This update adds a scoped contact section to About only. Sandy Creates remains the parent brand, and Spice Gurl its featured product brand. The existing narrative, confirmed Johnson & Wales University bachelor's degree in Culinary Arts, accomplishment, portrait component and shared responsive styling are preserved.

## Verified public business details

| Field | Value |
| --- | --- |
| Name | Sandy Dz |
| Product brand | Spice Gurl |
| Specialties | Tapas • Sauces • Spices |
| Location | Georgia, USA |
| Phone | +1 (470) 738-6533 |
| Email | info@spicegurl.store |
| Product website | https://spicegurl.store/ |
| Instagram | https://www.instagram.com/spicegurlofficial/ |
| TikTok | https://www.tiktok.com/@spicegurl.official |

Phone and email use `tel:` and `mailto:`. Website and social links use HTTPS and open in a new tab with `noopener noreferrer`. Link targets were checked in the rendered DOM; no phone call or email was sent, and no social account login was required. These are source-verified destinations, not a guarantee of third-party service availability.

## Original portrait unavailable

The public digital-card HTML exposes processed image variants. Its displayed profile image is a 512 × 512 thumbnail. The explicit `storage_url_full` points to `ProfileImages/thumb@full_1462992a-766b-4e2f-8441-9e31042b34a8.jpeg`, a 1254 × 1254 JPEG. That full-size export was inspected without re-encoding; it contains no EXIF APP1 segment. The public source does not provide a verifiable original upload URL. No private storage or authenticated account access was attempted.

As requested, the existing `public/images/sandy/profile.jpg` is retained byte-for-byte, including its existing EXIF and other embedded metadata. No substitute, screenshot, generated portrait, retouching, cropping or metadata rewrite was introduced. Original-upload asset from Sandy remains outstanding.

Retained portrait SHA-256: `46a7e5f16b47149887fc0db18837c6efd43b92eac816cf7f0bd0b5acceba7ae5`.

## Validation and release boundary

- `npm run typecheck`, `npm run lint`, `npm test`: passed (20 tests).
- `npm run build`: passed.
- Local About preview returned HTTP 200. Rendered biography and education remain present; original portrait loads.
- Browser review at 1440 px (three columns), 861 px (two columns), 390 px and 320 px (one column): no horizontal overflow; mobile link rows are 82 px tall.
- Phone, email, website, Instagram, TikTok and digital-card anchor targets inspected in the browser.
- No checkout, authentication, database, navigation or unrelated page source changes.

Feature branch: `feature/sandy-digital-business-card`. The commit uses `[CF-Pages-Skip]` to prevent automatic deployment while review is pending, per https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/#skipping-a-build-via-a-commit-message. No merge or deployment is requested at this stage. After approval, choose the merge/deployment action explicitly; a squash merge intended to deploy should use an ordinary commit message without the skip prefix.
