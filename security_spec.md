# Security Specification: Keripik Bawang Snack Asik

## 1. Data Invariants
- **Admin Only Writes**: Only the authenticated user with email `rofiadrjt@gmail.com` (or listed in `/admins` collection) can create, update, or delete content.
- **Email Verification**: All administrative writes require a verified email.
- **ID Integrity**: Document IDs must be alphanumeric and under 128 characters.
- **Schema Strictness**: All writes must conform to the defined schemas (SiteSettings, Product, Testimonial, FAQ, Article) with mandatory fields and size limits.
- **Public Read**: All content (products, testimonials, FAQs, articles, settings) is publicly readable.

## 2. The "Dirty Dozen" Payloads (Anti-Patterns)
The following payloads should be REJECTED by `firestore.rules`:

1.  **Identity Spoofing (Non-Admin Write)**:
    - Target: `/products/test-id`
    - Payload: `{ "name": "Hack", "price": "0", "imageUrl": "..." }`
    - Context: Auth user is NOT `rofiadrjt@gmail.com`.
2.  **Unverified Email Write**:
    - Target: `/articles/test-article`
    - Context: User is `rofiadrjt@gmail.com` but `email_verified` is `false`.
3.  **Ghost Field Injection**:
    - Target: `/products/p1`
    - Payload: `{ "name": "Bawang", "price": "10k", "imageUrl": "...", "isAdmin": true }`
    - Context: Adding a field not in the schema.
4.  **Resource Poisoning (Large ID)**:
    - Target: `/products/[1KB_STRING]`
    - Context: Document ID exceeds 128 characters.
5.  **Type Mismatch (Price as Number)**:
    - Target: `/products/p1`
    - Payload: `{ "name": "Bawang", "price": 10000, "imageUrl": "..." }`
    - Context: `price` must be a string.
6.  **Missing Mandatory Field**:
    - Target: `/articles/a1`
    - Payload: `{ "title": "No Slug", "content": "..." }`
    - Context: Missing `slug`.
7.  **Oversized Content**:
    - Target: `/articles/a1`
    - Payload: `{ "title": "...", "slug": "...", "content": "[10MB_STRING]" }`
    - Context: Content exceeds 50,000 characters.
8.  **ID Poisoning (Special Characters)**:
    - Target: `/faqs/q!!1`
    - Context: ID matches invalid regex.
9.  **Site Settings Mutation (Non-Admin)**:
    - Target: `/settings/general`
    - Payload: `{ "headline": "New Headline", ... }`
    - Context: Unauthenticated user.
10. **Article Date Spoofing (String instead of Number)**:
    - Target: `/articles/a1`
    - Payload: `{ "title": "A", "slug": "a", "content": "...", "createdAt": "2024-01-01" }`
11. **Testimonial Role Overlong**:
    - Target: `/testimonials/t1`
    - Payload: `{ "name": "A", "text": "...", "role": "[1000_CHAR_STRING]" }`
12. **FAQ Question Empty**:
    - Target: `/faqs/f1`
    - Payload: `{ "question": "", "answer": "..." }`
    - Context: (Rules should ideally check size > 0, but basic string check is present).

## 3. Test Runner (Description)
A standard `firestore.rules.test.ts` using `@firebase/rules-unit-testing` would:
- Initialize a test environment.
- Create contexts for `unauthenticated`, `authenticated_user`, and `admin_user` (`rofiadrjt@gmail.com`).
- Iterate through the Dirty Dozen payloads and assert `assertFails()`.
- Assert `assertSucceeds()` for valid admin operations.
- Assert `assertSucceeds()` for any public read operations.
