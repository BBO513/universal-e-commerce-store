# E-commerce Auto Store Directory Structure

This document outlines the directory structure of the E-commerce Auto Store project.

```
C:\Users\works\e-commers_auto_store\
├───.env.local.example
├───DIRECTORY_CONTENTS.md
├───ecommerce_project_breakdown.pdf
├───middleware.ts
├───next-i18next.config.js
├───next.config.js
├───package.json
├───postcss.config.js
├───progress_report.md
├───README.md
├───schema.sql
├───tailwind.config.js
├───client\
│   ├───.gitkeep
│   ├───index.html
│   └───package.json
├───components\
│   ├───AddressForm.tsx
│   ├───CheckoutForm.tsx
│   ├───Filters.tsx
│   ├───Footer.tsx
│   ├───Header.tsx
│   ├───Layout.tsx
│   ├───MobileNavBar.tsx
│   ├───ProductCard.tsx
│   ├───ProductGridSkeleton.tsx
│   ├───PWAInstallPrompt.tsx
│   ├───StarRating.tsx
│   ├───VehicleSelector.tsx
│   ├───admin\
│   │   ├───AdminHeader.tsx
│   │   ├───AdminLayout.tsx
│   │   ├───AdminSidebar.tsx
│   │   ├───ConfirmationModal.tsx
│   │   └───ProductForm.tsx
│   └───reviews\
│       ├───ReviewForm.tsx
│       └───ReviewList.tsx
├───context\
│   ├───CartContext.tsx
│   ├───CheckoutContext.tsx
│   └───CurrencyContext.tsx
├───lib\
│   ├───auth.ts
│   ├───db.ts
│   ├───email.ts
│   ├───registerServiceWorker.ts
│   └───utils.ts
├───pages\
│   ├───_app.tsx
│   ├───cart.tsx
│   ├───index.tsx
│   ├───login.tsx
│   ├───offline.tsx
│   ├───register.tsx
│   ├───search.tsx
│   ├───sitemap.xml.ts
│   ├───unauthorized.tsx
│   ├───account\
│   │   ├───index.tsx
│   │   ├───orders.tsx
│   │   ├───settings.tsx
│   │   ├───wishlist.tsx
│   │   └───orders\
│   │       └───[id].tsx
│   ├───admin\
│   │   ├───dashboard.tsx
│   │   ├───index.tsx
│   │   ├───settings.tsx
│   │   ├───inventory\
│   │   │   └───index.tsx
│   │   ├───orders\
│   │   │   ├───[id].tsx
│   │   │   └───index.tsx
│   │   ├───products\
│   │   │   ├───[id].tsx
│   │   │   ├───index.tsx
│   │   │   ├───new.tsx
│   │   │   └───[id]\
│   │   │       └───vehicles.tsx
│   │   ├───reviews\
│   │   │   └───index.tsx
│   │   └───users\
│   │       └───index.tsx
│   ├───api\
│   │   ├───categories.ts
│   │   ├───register.ts
│   │   ├───sitemap.ts
│   │   ├───account\
│   │   │   ├───change-password.ts
│   │   │   ├───profile.ts
│   │   │   ├───update-info.ts
│   │   │   └───orders\
│   │   │       ├───[id].ts
│   │   │       ├───index.ts
│   │   │       └───has-purchased\
│   │   │           └───[productId].ts
│   │   ├───address\
│   │   │   ├───delete.ts
│   │   │   ├───index.ts
│   │   │   └───update.ts
│   │   ├───admin\
│   │   │   ├───upload-image.ts
│   │   │   ├───inventory\
│   │   │   │   ├───index.ts
│   │   │   │   ├───update.ts
│   │   │   │   └───history\
│   │   │   │       └───[productId].ts
│   │   │   ├───orders\
│   │   │   │   ├───[id].ts
│   │   │   │   └───index.ts
│   │   │   ├───products\
│   │   │   │   ├───[id].ts
│   │   │   │   ├───bulk.ts
│   │   │   │   └───index.ts
│   │   │   ├───reviews\
│   │   │   │   └───index.ts
│   │   │   └───users\
│   │   │       ├───[id].ts
│   │   │       └───index.ts
│   │   ├───auth\
│   │   │   └───[...nextauth].ts
│   │   ├───cart\
│   │   │   ├───clear.ts
│   │   │   ├───index.ts
│   │   │   ├───remove.ts
│   │   │   └───update.ts
│   │   ├───categories\
│   │   │   ├───[id].ts
│   │   │   ├───[slug].ts
│   │   │   └───index.ts
│   │   ├───checkout\
│   │   │   ├───create-payment-intent.ts
│   │   │   └───webhook.ts
│   │   ├───orders\
│   │   │   └───[id].ts
│   │   ├───products\
│   │   │   ├───[id].ts
│   │   │   ├───advanced-search.ts
│   │   │   ├───brands.ts
│   │   │   ├───filter.ts
│   │   │   ├───index.ts
│   │   │   ├───search.ts
│   │   │   ├───[id]\
│   │   │   │   ├───reviews.ts
│   │   │   │   └───reviews\
│   │   │   │       └───submit.ts
│   │   │   └───[productId]\
│   │   │       └───vehicles.ts
│   │   ├───reviews\
│   │   │   └───moderate.ts
│   │   ├───vehicles\
│   │   │   ├───index.ts
│   │   │   ├───makes.ts
│   │   │   ├───map.ts
│   │   │   ├───models.ts
│   │   │   ├───search.ts
│   │   │   └───years.ts
│   │   └───wishlist\
│   │       ├───index.ts
│   │       ├───remove.ts
│   │       └───status.ts
│   ├───category\
│   │   └───[slug].tsx
│   ├───checkout\
│   │   ├───address.tsx
│   │   ├───payment.tsx
│   │   ├───review.tsx
│   │   ├───shipping.tsx
│   │   └───success.tsx
│   └───product\
│       └───[id].tsx
├───public\
│   ├───manifest.json
│   ├───robots.txt
│   ├───sw.js
│   ├───icons\
│   │   ├───icon-192x192.png
│   │   ├───icon-512x512.png
│   │   ├───icon-maskable-192x192.png
│   │   └───icon-maskable-512x512.png
│   └───locales\
│       ├───en\
│       │   └───common.json
│       ├───es\
│       │   └───common.json
│       └───fr\
│           └───common.json
├───server\
│   ├───.gitkeep
│   ├───db.json
│   ├───index.js
│   ├───package.json
│   ├───tsconfig.json
│   └───src\
│       └───index.ts
└───styles\
    └───globals.css
```