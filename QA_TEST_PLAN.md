# QA TEST PLAN — Universal E-Commerce Engine

**Date:** 2026-07-11
**Branch:** `universal-saas-purge`
**Commit:** `35d4413` — fix: surgical strike cleanup based on audit

---

## Pre-Flight Checklist (Before Starting Any Test)

- [ ] Fresh incognito/private browser window opened
- [ ] All cookies and localStorage cleared
- [ ] PostgreSQL database is running and seeded (`schema.sql` applied)
- [ ] `.env.local` exists with valid `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- [ ] Stripe keys are set (test mode keys for Scenarios C/D)
- [ ] `npm run dev` is running on `http://localhost:3000`

---

## SCENARIO A: THE FIRST RUN (Incognito + Setup Wizard)

**Goal:** Simulate a brand-new user who has never seen the application. They must complete the setup wizard, save their store, and land on a functional homepage.

### A.1 — Middleware Redirect
| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| A.1.1 | Open `http://localhost:3000` in incognito | You are **redirected** to `/setup-wizard` | [ ] |
| A.1.2 | Confirm the URL in the address bar | URL ends with `/setup-wizard` | [ ] |

### A.2 — Brand Step (Step 1 of 4)
| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| A.2.1 | Verify step indicator | Progress bar shows "Brand" as active (step 1/4) | [ ] |
| A.2.2 | Read the heading text | Says **"Name your store"** | [ ] |
| A.2.3 | Read the subtext | Says **"This will appear on your storefront and receipts."** | [ ] |
| A.2.4 | Type a store name into the input | Input accepts text; green checkmark appears | [ ] |
| A.2.5 | Click **Continue** | Advances to Step 2 (Theme) | [ ] |

### A.3 — Theme Step (Step 2 of 4)
| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| A.3.1 | Verify **NO hex code input** exists | No "Custom:" label, no `#0F4B5F` text input visible | [ ] |
| A.3.2 | Verify **NO Primary/Soft/Outline boxes** | No colored preview boxes below the bubbles | [ ] |
| A.3.3 | Verify iOS-style color bubbles exist | 8 round tappable color circles visible (Navy, Indigo, Emerald, Rose, Amber, Violet, Slate, Teal) | [ ] |
| A.3.4 | Tap a color bubble | Bubble highlights with ring + checkmark animation | [ ] |
| A.3.5 | Click **Continue** | Advances to Step 3 (Connect Socials) | [ ] |

### A.4 — Connect Socials Step (Step 3 of 4)
| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| A.4.1 | Verify heading | Says **"Connect your socials"** | [ ] |
| A.4.2 | Click **Connect** on Instagram | Shows "Connecting" spinner, then green checkmark "Connected" appears | [ ] |
| A.4.3 | Click **Continue** | Advances to Step 4 (Payments) | [ ] |

### A.5 — Payments Step (Step 4 of 4)
| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| A.5.1 | Verify heading | Says **"Set up payments"** | [ ] |
| A.5.2 | Verify **NO `.env.local` text** anywhere | No "STRIPE_SECRET_KEY", "STRIPE_PUBLISHABLE_KEY", or ".env.local" visible | [ ] |
| A.5.3 | Verify the Stripe connect button | Purple gradient button visible: **"Connect with Stripe"** with lightning bolt icon | [ ] |
| A.5.4 | Verify trust badges exist | 4 badges visible: "Bank-level security", "256-bit encryption", "PCI-DSS compliant", "All major cards" | [ ] |
| A.5.5 | Click **Connect with Stripe** | Purple spinner + "Connecting to Stripe..." for ~2 seconds | [ ] |
| A.5.6 | Wait for animation to finish | Green checkmark circle appears with **"Stripe Connected"** text | [ ] |

### A.6 — Finish Setup + Redirect
| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| A.6.1 | Verify "You're all set!" card | Green summary card shows store name and "Click finish to save" text | [ ] |
| A.6.2 | Click **Finish Setup** | Button shows spinner + "Saving..." | [ ] |
| A.6.3 | Wait for redirect | You land on `/` (homepage) | [ ] |
| A.6.4 | Verify the homepage shows the **empty state for built store** | Heading: **"Your store is live!"**, Subtext: **"Everything is set up. Now let's add your very first product."** | [ ] |
| A.6.5 | Verify button text | Button says **"Add My First Product"** (NOT "List Your Item" or "Launch My Store") | [ ] |
| A.6.6 | Verify store name in hero | PremiumHero shows the store name you entered in the wizard | [ ] |
| A.6.7 | Verify Navbar brand text | Says **"My Store"** (NOT "AutoStore") | [ ] |
| A.6.8 | Verify Footer text | Says **"My Store. All rights reserved."** (NOT "AutoStore") | [ ] |

---

## SCENARIO B: THE MOBILE SELLER (Upload Product via /sell)

**Goal:** Upload a product using the mobile-native sell page and confirm it appears on the homepage.

### B.1 — Navigate to Sell Page
| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| B.1.1 | Click **"Add My First Product"** on the homepage | Navigates to `/sell` | [ ] |
| B.1.2 | Alternatively, navigate directly to `http://localhost:3000/sell` | Mobile-native camera-viewfinder UI loads | [ ] |
| B.1.3 | Verify bottom navigation bar | 4 icons visible: Home, Sell (active), Orders, Profile | [ ] |

### B.2 — Upload Photo
| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| B.2.1 | Tap the photo area (or drag-drop an image) | File picker opens, or image preview appears | [ ] |
| B.2.2 | After selecting an image | Image fills the top 60% of the screen with gradient overlay | [ ] |
| B.2.3 | Verify the X button exists | Small X button in top-right corner to remove the photo | [ ] |

### B.3 — Enter Product Details
| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| B.3.1 | Type a product title in the "What did you make?" field | Text appears, placeholder disappears | [ ] |
| B.3.2 | Type a price in the `$0` field | Price shows with `$` prefix, only numbers allowed | [ ] |

### B.4 — List the Item
| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| B.4.1 | Tap **"List My Item"** button (white) | Button text changes to **"Listing..."** with grey background | [ ] |
| B.4.2 | Wait for the success animation | Full-screen overlay with animated green checkmark circle | [ ] |
| B.4.3 | Read the success text | Says **"Boom!"** and **"You're live."** | [ ] |
| B.4.4 | Wait for redirect (~2.8 seconds) | You are redirected to `/` (homepage) | [ ] |

### B.5 — Verify Product on Homepage
| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| B.5.1 | Check the homepage | Product appears in the product grid with the photo, title, and price | [ ] |
| B.5.2 | Verify the empty state is **gone** | "Your store is live!" message is no longer visible | [ ] |
| B.5.3 | Click the product card | Navigates to the product detail page | [ ] |
| B.5.4 | Verify product detail page loads | Shows product title, price, image, and "Add to Cart" button | [ ] |

---

## SCENARIO C: THE CUSTOMER CHECKOUT (Cart → Address → Shipping → Review → Payment)

**Goal:** Add the new product to the cart, go through the full checkout pipeline, and ensure the review page does NOT crash.

### C.1 — Add to Cart
| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| C.1.1 | From the product detail page, click **"Add to Cart"** | Cart badge increments in Navbar | [ ] |
| C.1.2 | Navigate to `/cart` (via Navbar cart icon) | Cart page loads with the product listed | [ ] |
| C.1.3 | Verify product details in cart | Title, quantity, price are correct | [ ] |

### C.2 — Address Step
| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| C.2.1 | Click "Proceed to Checkout" or navigate to `/checkout/address` | Address form loads with no console errors | [ ] |
| C.2.2 | Fill in street, city, state, postcode | Fields accept input | [ ] |
| C.2.3 | Submit the address form | Redirect to `/checkout/shipping` | [ ] |

### C.3 — Shipping Step
| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| C.3.1 | Verify shipping methods are listed | At least one option visible (Standard, Express, etc.) | [ ] |
| C.3.2 | Select a shipping method | Method is highlighted/selected | [ ] |
| C.3.3 | Click continue | Redirect to `/checkout/review` | [ ] |

### C.4 — Review Step (CRITICAL — was broken before cleanup)
| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| C.4.1 | **Verify the review page loads without crashing** | Page renders fully — no white screen, no Next.js error overlay | [ ] |
| C.4.2 | Verify order items are listed | Product image, title, quantity, condition, and price visible | [ ] |
| C.4.3 | Verify shipping address is displayed | Street, city, state, postcode visible in summary section | [ ] |
| C.4.4 | Verify shipping method is displayed | Method name and price visible | [ ] |
| C.4.5 | Verify order totals | Subtotal, GST (10%), Shipping, and Order Total all calculated correctly | [ ] |
| C.4.6 | Check browser console | **Zero errors** in the DevTools Console | [ ] |
| C.4.7 | Verify page title / meta | No "Auto Parts" or "Australian Automotive" in the page title | [ ] |

### C.5 — Payment Step (requires valid Stripe test keys)
| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| C.5.1 | Click **"Proceed to Payment"** | Redirect to `/checkout/payment` | [ ] |
| C.5.2 | Verify Stripe Elements load | Stripe card input form renders | [ ] |
| C.5.3 | Fill in test card: `4242 4242 4242 4242` with any future date and any CVC | Card details accepted | [ ] |
| C.5.4 | Click Pay | Payment processes | [ ] |
| C.5.5 | Verify success redirect | Redirect to `/checkout/success` with order confirmation | [ ] |

---

## SCENARIO D: THE ADMIN (Login + Dashboard)

**Goal:** Log in as an admin user and verify the admin dashboard loads without errors.

### D.1 — Admin Login
| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| D.1.1 | Navigate to `/admin` | Redirected to `/login` (middleware enforces auth for `/admin*`) | [ ] |
| D.1.2 | Verify the login page renders | Email and password fields visible | [ ] |
| D.1.3 | Enter admin email and password | Input accepted | [ ] |
| D.1.4 | Click Sign In | Redirected to `/admin` (or `/admin/dashboard`) | [ ] |

### D.2 — Admin Dashboard
| Step | Action | Expected Result | Pass? |
|---|---|---|---|
| D.2.1 | Verify dashboard loads | Admin header, sidebar, and dashboard content render without crash | [ ] |
| D.2.2 | Check browser console | **Zero errors** in DevTools Console | [ ] |
| D.2.3 | Navigate to Products (`/admin/products`) | Product list loads — the item you uploaded in Scenario B appears | [ ] |
| D.2.4 | Navigate to Orders (`/admin/orders`) | Orders page loads (may be empty — that's OK) | [ ] |
| D.2.5 | Navigate to Settings (`/admin/settings`) | Settings page loads without errors | [ ] |

---

## POST-TEST VERIFICATION: BRANDING CLEANUP AUDIT

Open each of these pages and scan visually for leftover automotive text:

| Page | What to Look For | Pass? |
|---|---|---|
| `/` (homepage) | No "Auto Parts", "AutoStore", "automotive", "curated", "premium" text | [ ] |
| `/categories` | Heading says "Browse all categories" (NOT "curated collections") | [ ] |
| `/cart` | No automotive branding in header/footer | [ ] |
| `/login` | No "AutoStore" in page | [ ] |
| `/about` | No automotive references | [ ] |
| Navbar (all pages) | Brand text says "My Store" | [ ] |
| Footer (all pages) | Text says "My Store. All rights reserved." Only "About" link exists | [ ] |
| PWA manifest (install prompt) | App name is "Universal Store" | [ ] |
| Browser tab title (homepage) | Title is from `config/theme.json` ("Universal E-Commerce Engine") | [ ] |

---

## RESULTS SUMMARY

| Scenario | Description | Pass/Fail |
|---|---|---|
| A | First Run — Setup Wizard → Homepage | [ ] |
| B | Mobile Seller — Upload Product via /sell | [ ] |
| C | Customer Checkout — Cart through Payment | [ ] |
| D | Admin Login + Dashboard | [ ] |
| Post-Test | Branding Cleanup Audit | [ ] |

**Tester Name:** __________________

**Date:** __________________

**Notes / Bugs Found:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
