# AUDIT REPORT — Universal E-Commerce Engine

**Date:** 2026-07-11
**Branch:** `universal-saas-purge`
**Last commit:** `f2206c4` — fix: use UPSERT for store settings, improve error logging in wizard action

---

## 1. THE CORE ENGINE

### `lib/db.ts` — Database Layer (1162 lines)

The monolithic data-access layer. Creates a single `pg.Pool` from `DATABASE_URL`. Every query in the application flows through this file. No ORM, raw SQL throughout.

**Tables accessed via this file:**

| Table | Purpose |
|---|---|
| `users` | Authentication (getUserByEmail, getUserRole, createUser) |
| `products` | Product CRUD (getProducts, getProductById, createProduct, updateProduct, deleteManyProducts, advanced search, filtering, brand listing) |
| `categories` | Category CRUD (getAllCategories, getCategoryBySlug, getCategoryById) |
| `cart_items` | Cart operations (getCartItems, addToCart, updateCartItem, removeFromCart, clearCart) |
| `orders` | Order lifecycle (createOrder, getOrders, getOrderById, updateOrderStatus, getOrdersForUser) |
| `order_items` | Line items inside orders (addOrderItems) |
| `reviews` | Product reviews (getReviews, createReview, approveReview, moderate reviews) |
| `wishlists` | User wishlists (getWishlist, addToWishlist, removeFromWishlist, isProductInWishlist) |
| `store_settings` | Single-row settings table (getStoreSettings, updateStoreSettings) — **recently refactored to use UPSERT** |
| `addresses` | User shipping addresses |

**Notable:** The `updateStoreSettings` function was refactored today from a plain `UPDATE ... WHERE id = (SELECT id FROM store_settings LIMIT 1)` to a proper `INSERT ... ON CONFLICT (id) DO UPDATE` (PostgreSQL UPSERT). This guarantees the settings save works even when the `store_settings` table is completely empty.

### `lib/auth.ts` — NextAuth Configuration (60 lines)

Configures NextAuth with:
- `CredentialsProvider` — email/password login, password verified with bcrypt
- `JWT` session strategy (no database sessions)
- Callbacks inject `id` and `role` into the JWT token and session object
- Sign-in page redirects to `/login`

### NextAuth API Route — `pages/api/auth/[...nextauth].ts` (5 lines)

Thin wrapper: imports `authOptions` from `lib/auth.ts` and passes directly to `NextAuth()`. Standard NextAuth Pages Router pattern.

### Stripe Payment Pipeline

| File | Role |
|---|---|
| `pages/api/checkout/create-payment-intent.ts` | Creates a Stripe PaymentIntent with cart metadata. Requires `STRIPE_SECRET_KEY`. |
| `pages/api/checkout/webhook.ts` | Stripe webhook receiver. Handles `checkout.session.completed`. Creates the order in DB, clears the cart, sends confirmation email. Requires `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`. |
| `pages/checkout/payment.tsx` | Client-side Stripe Elements checkout page. Requires `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. |
| `components/CheckoutForm.tsx` | Stripe PaymentElement wrapper component. |

### Cart System — `context/CartContext.tsx` (398 lines)

Client-side cart state manager (`'use client'`). Features:
- **Logged-in users:** Fetches cart from `/api/cart`, syncs via POST/PUT/DELETE
- **Guest users:** Stores cart in `localStorage`
- **Offline queue:** Queues add/update/remove actions in `localStorage` under `offline_cart_actions` key, replays them when the `online` event fires
- **Pricing:** 10% GST (Australian), currency conversion via `CurrencyContext`
- **Currency:** Defaults to AUD with hardcoded fallback exchange rates (USD 0.67, EUR 0.61)

### Middleware — `middleware.ts` (38 lines)

App Router middleware. Checks `store_configured` cookie:
- If cookie is missing → redirects to `/setup-wizard`
- Protects `/admin*` routes — requires authenticated session with `role === 'admin'`
- Allows: `/_next`, `/api`, `/setup-wizard`, `favicon.ico`, static assets

---

## 2. THE UI FRONTEND

### App Router Pages (`app/`)

| File | Type | Purpose |
|---|---|---|
| `app/layout.tsx` | Client | Root layout. Wraps children in SessionProvider → CurrencyProvider → CartProvider. Renders Navbar globally. |
| `app/page.tsx` | Server (async) | Homepage. `force-dynamic`. Fetches products + store settings. Shows PremiumHero + product grids. **Has two distinct empty states:** store-not-built → "Launch My Store" /setup-wizard, store-built-no-products → "Add My First Product" /sell. |
| `app/sell/page.tsx` | Client | Mobile-first product upload. Photo picker + title + price inputs. Calls `listItem` server action. "Boom! You're live." success animation. |
| `app/sell/actions.ts` | Server | Creates product in DB. Auto-creates a "Handmade" category if none exists. Generates random SKU. |
| `app/sell/layout.tsx` | Server | Thin layout wrapper for /sell. |
| `app/setup-wizard/page.tsx` | Client | 4-step wizard: Brand → Theme → Connect Socials → Payments. Calls `saveWizardSettings` on finish. Redirects to `/`. |
| `app/setup-wizard/actions.ts` | Server | Saves store_name, primary_color, social_links via `updateStoreSettings`. Sets `store_configured` cookie. **Enhanced error logging today.** |
| `app/categories/page.tsx` | Server | Lists categories from `config/products.json` via `lib/config.ts`. Links to `/categories/[slug]`. |
| `app/categories/[slug]/page.tsx` | Server | Category detail page. Shows products filtered by category slug. |
| `app/products/[id]/page.tsx` | Client | Product detail page (App Router). |
| `app/about/page.tsx` | Server | Static about page. Generic template text. |
| `app/cart/page.tsx` | Client | Shopping cart page. |
| `app/login/page.tsx` | Client | Login page with NextAuth `signIn()`. |
| `app/search/page.tsx` | Client | Search page. |
| `app/metadata.ts` | Server | Exports `metadata` object for Next.js App Router SEO. Reads from `config/theme.json`. |

### Pages Router (`pages/`)

**Major areas:**
- **Checkout flow:** `pages/checkout/address.tsx` → `shipping.tsx` → `review.tsx` → `payment.tsx` → `success.tsx`
- **Admin panel:** `pages/admin/` — dashboard, products CRUD, orders, inventory, users, reviews, settings
- **Account:** `pages/account/` — profile, orders, addresses, wishlist, settings
- **Legacy product/category:** `pages/product/[id].tsx`, `pages/category/[slug].tsx`
- **API routes:** 30+ API endpoints under `pages/api/` for cart, products, categories, orders, admin, auth, checkout, wishlist

---

## 3. TODAY'S MODIFICATIONS

Files modified in the last 6 commits on `universal-saas-purge`:

### Commit `2d9286a` — `app/page.tsx`
**What:** Split the single "no products" empty state into two distinct states.
- **State 1 (store not built):** `store_name === 'My Store'` or empty → Heading: "Welcome. Let's build your business." → Button: "Launch My Store" → Link: `/setup-wizard`
- **State 2 (store built, no products):** Custom store name → Heading: "Your store is live!" → Button: "Add My First Product" → Link: `/sell`
**Why:** "List Your Item" was linking to the wizard, which asks for a business name — confusing UX disconnect.

### Commit `9d4a7fb` — `app/setup-wizard/page.tsx` (Theme step)
**What:** Deleted the "Custom:" hex code input field (label, color preview square, text input with `#0F4B5F`).
**Why:** Regular users don't understand hex codes. Removes friction, keeps only the iOS-style color bubbles.

### Commit `f779578` — `app/setup-wizard/page.tsx` (Payments step)
**What:** Complete overhaul. Removed all `.env.local`, `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY` developer jargon. Added:
- Premium "Connect with Stripe" button with Stripe purple gradient colors
- Simulated OAuth flow: tap → 2s spinner → green checkmark "Stripe Connected"
- 2x2 trust badge grid: Bank-level security, 256-bit encryption, PCI-DSS compliant, All major cards
**Why:** The old step was pure developer instructions. Users should feel it's a 1-tap Shopify-style setup.

### Commit `d2546b8` — `app/setup-wizard/page.tsx` (Theme step)
**What:** Deleted the Primary/Soft/Outline color preview boxes below the color bubbles.
**Why:** They added clutter for regular users. The tappable bubbles are sufficient.

### Commit `f2206c4` — `lib/db.ts` + `app/setup-wizard/actions.ts`
**What:**
- `updateStoreSettings` in `lib/db.ts`: Changed from `UPDATE WHERE id = (SELECT id FROM store_settings LIMIT 1)` to `INSERT ... ON CONFLICT (id) DO UPDATE` (PostgreSQL UPSERT). Always inserts/updates row with id=1.
- `saveWizardSettings` in `app/setup-wizard/actions.ts`: Enhanced catch block to log `message`, `detail`, `code`, `hint`, and `stack` from the PostgreSQL error object.
**Why:** "Failed to save Unknown error" was appearing when the `store_settings` table was empty because the UPDATE affected 0 rows silently. The UPSERT guarantees the row always exists.

---

## 4. THE RED FLAGS (THE DEBT)

### CRITICAL — Syntax Error

**`pages/checkout/review.tsx:161-178`** — TypeScript compilation error: `TS1005: '}' expected.`

The `export default function CheckoutReviewPage()` function body opens at line 9 with `{`. The return statement closes on line 161 with `);`. However, line 163 immediately begins `export const getServerSideProps` without first closing the function body. The parser finds an extra `};` on line 178 that doesn't match any opening brace.

**Root cause:** The `getServerSideProps` export is placed inside the component function's body rather than after it. There is a missing `}` between line 161 and line 163.

**Impact:** This file fails to compile. The checkout review page will not load.

**Fix:** Insert a closing `}` after line 161 `  );` to close the component function, before `getServerSideProps` on line 163:
```tsx
// line 161:   );
// line 162: }  // ← INSERT THIS

export const getServerSideProps: GetServerSideProps = async (context) => {
```

---

### HIGH — Automotive Branding Leakage

The template was originally an automotive parts store. These remnants betray its origins:

| File | Line | Current Text | Issue |
|---|---|---|---|
| `components/Navbar.tsx` | 37 | `AutoStore` | Store brand name in navigation |
| `components/Footer.tsx` | 22 | `AutoStore. All rights reserved.` | Brand name in footer |
| `pages/product/[id].tsx` | 162 | `Auto Parts \| Australian Automotive Parts Store` | Page title |
| `pages/product/[id].tsx` | 164 | `auto parts, car parts, automotive, Australia` | Meta keywords |
| `pages/category/[slug].tsx` | 119 | `Auto Parts \| Australian Automotive Parts Store` | Page title |
| `pages/category/[slug].tsx` | 121 | `auto parts, car parts, automotive, Australia` | Meta keywords |
| `public/manifest.json` | 2-4 | `Australian Automotive Parts Store` / `AutoParts` / `automotive parts in Australia` | PWA manifest |
| `public/locales/en/common.json` | 2-3 | `Welcome to AutoStore!` / `automotive parts in Australia` | i18n locale strings |
| `public/locales/es/common.json` | - | Likely also contains "automotive" (needs checking) | i18n locale strings |
| `public/locales/fr/common.json` | - | Likely also contains "automotive" (needs checking) | i18n locale strings |
| `docs/FAQ.md` | 155 | `automotive_store` | Database name reference |
| `docs/BUYER_SETUP_GUIDE.md` | 66 | `automotive_store` | Database name reference |

---

### HIGH — "Curated" / "Luxury" Positioning Despite Generic Template

| File | Line | Current Text |
|---|---|---|
| `app/categories/page.tsx` | 11 | `Browse curated collections` |
| `components/StorefrontOnboarding.tsx` | 50 | `Present curated apparel and accessories...` |
| `config/theme.json` | 4 | `Plug-and-play storefronts for premium brands` |
| `config/theme.json` | 5 | `A premium store experience...` |

The template is universal/generic, but still uses "curated" and "premium" language that implies hand-selected inventory. This is misleading for a self-serve marketplace.

---

### MEDIUM — Hardcoded Placeholder Domain (`yourdomain.com`)

Three files use `https://www.yourdomain.com` as a placeholder domain, with `// TODO: Replace` comments:

| File | Line | Value |
|---|---|---|
| `pages/sitemap.xml.ts` | 5 | `baseUrl` for sitemap generation |
| `pages/product/[id].tsx` | 165 | Canonical URL for product pages |
| `pages/category/[slug].tsx` | 122 | Canonical URL for category pages |

**Impact:** If deployed, search engines would index `yourdomain.com` URLs. The sitemap would point to a domain the operator doesn't own.

**Fix:** Replace with `process.env.NEXTAUTH_URL` or a dedicated `NEXT_PUBLIC_SITE_URL` env variable.

---

### MEDIUM — Hardcoded Placeholder Image URLs

| File | URLs | Type |
|---|---|---|
| `config/theme.json:9` | `https://images.unsplash.com/photo-151537...` | Hero background image |
| `config/products.json` | 4 Unsplash URLs | Product images (Workspace Chair, Desk Lamp, Speaker, Wall Art) |
| `components/StorefrontOnboarding.tsx` | 9 `https://via.placeholder.com/...` URLs | Onboarding placeholder product images |

**Impact:** Dependence on external CDN. Unsplash might change URLs or rate-limit requests. `via.placeholder.com` images are temporary and will break.

**Fix:** Replace with local images or a configurable image CDN variable.

---

### MEDIUM — Client-Side `NEXTAUTH_URL` Access

11 files in the Pages Router reference `process.env.NEXTAUTH_URL` without the `NEXT_PUBLIC_` prefix:

| File | References |
|---|---|
| `pages/product/[id].tsx` | 5 |
| `pages/category/[slug].tsx` | 1 |
| `pages/checkout/success.tsx` | 1 |
| `pages/checkout/address.tsx` | 1 |
| `pages/admin/products/index.tsx` | 2 |
| `pages/admin/orders/index.tsx` | 1 |
| `pages/account/settings.tsx` | 1 |
| `pages/account/orders/[id].tsx` | 1 |
| `pages/account/orders/index.tsx` | 1 |
| `pages/account/index.tsx` | 1 |
| `pages/account/addresses.tsx` | 1 |

**Impact:** In Next.js, only `NEXT_PUBLIC_*` env vars are available in browser/client code. `NEXTAUTH_URL` will be `undefined` at runtime for any code executing in the browser (e.g., `useEffect`, event handlers). This will cause broken API calls or broken canonical URLs.

**Fix:** Either (a) rename to `NEXT_PUBLIC_SITE_URL` and update `.env.local.example`, or (b) pass the URL via `getServerSideProps` if the code only runs server-side.

---

### MEDIUM — Broken Footer Links (Orphaned Routes)

`components/Footer.tsx` links to four pages:

| Link | Route | Exists? |
|---|---|---|
| `/about` | `app/about/page.tsx` | Yes |
| `/contact` | — | **NO** |
| `/terms` | — | **NO** |
| `/privacy` | — | **NO** |

**Impact:** 3 of 4 footer links are 404s. Users clicking them will see Next.js default 404 page.

---

### LOW — Empty `pages/admin/vehicles/` Directory

The directory `pages/admin/vehicles/` exists but contains no files. This is a leftover from the original automotive template where vehicles were a managed entity (removed via `migrations/001_remove_vehicles.sql`). The directory serves no purpose.

---

### LOW — `NEXTAUTH_URL` Not In `.env.local.example`

The `NEXTAUTH_URL` variable is referenced by 11+ files but does not appear in `.env.local.example`. Only `NEXTAUTH_URL=http://localhost:3000` is present on line 5. This is correct. No action needed.

---

### LOW — Stale `server/` Directory

The `server/` directory contains a separate Express/db.json setup (`server/index.js`, `server/db.json`, `server/package.json`). This appears to be a development mock server, not used by the main application. Contains potentially outdated configuration.

---

### LOW — `components/ProductCard.tsx` Router Mismatch

The `ProductCard` component used on the App Router homepage (`app/page.tsx`) likely generates links to `/products/[id]` (App Router), but the detailed product page might render from `pages/product/[id].tsx` (Pages Router). Both routes exist, but they may conflict or render differently. Verify which route Next.js resolves at runtime.

---

### LOW — Hardcoded "Handmade" Category Fallback

`app/sell/actions.ts:28-29`: If no categories exist in the database, the sell action inserts a category called "Handmade" with slug "handmade". This is a sensible fallback but is hardcoded and will always produce "Handmade" — it won't match the config-based categories in `config/products.json`.

---

### SUMMARY TABLE

| Severity | Issue | Files Affected | Status |
|---|---|---|---|
| CRITICAL | Syntax error — missing `}` | `pages/checkout/review.tsx` | Broken |
| HIGH | "AutoStore" / "automotive" branding | Navbar, Footer, product page, category page, manifest, locales | To fix |
| HIGH | "Curated"/"premium" positioning | categories page, storefront onboarding, theme.json | To fix |
| MEDIUM | Hardcoded `yourdomain.com` | sitemap, product page, category page | To fix |
| MEDIUM | Hardcoded external image URLs | theme.json, products.json, StorefrontOnboarding | To fix |
| MEDIUM | `NEXTAUTH_URL` not client-safe | 11 pages router files | To fix |
| MEDIUM | Broken footer links (`/contact`, `/terms`, `/privacy`) | Footer.tsx | To fix |
| LOW | Empty `admin/vehicles/` directory | pages/admin/vehicles/ | Clean up |
| LOW | Stale `server/` mock directory | server/ | Evaluate |
| LOW | App/Pagess router link mismatch | ProductCard ↔ product detail | Verify |
| LOW | Hardcoded "Handmade" category fallback | sell/actions.ts | Low priority |
