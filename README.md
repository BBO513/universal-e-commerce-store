# Universal Store Builder — Next.js 14 SaaS Template

> **Premium, production-ready e-commerce foundation. Ship any store, any vertical, any scale.**

A modern, full-stack e-commerce template built with Next.js 14, React 18, TypeScript, PostgreSQL, and Stripe. Purpose-built for agencies, SaaS founders, and developers who need a battle-tested storefront that launches in hours, not weeks.

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-purple?style=flat-square&logo=stripe)](https://stripe.com/)

---

## ✨ Key Features

### 🛒 Complete E-Commerce Engine
- Product catalog with categories, search, and advanced filtering
- Persistent shopping cart with offline resilience
- Multi-step checkout with Stripe integration
- Order management and full history tracking
- Role-based admin panel with real-time dashboard

### 💳 Stripe Payments — Baked In
- Payment Intents API with automatic payment methods
- Credit/debit cards, Apple Pay, and Google Pay
- Secure webhook handling with signature verification
- Order confirmation and payment failure recovery

### 👤 Authentication & Accounts
- Email/password authentication via NextAuth.js
- Social login ready (Google, GitHub)
- Customer profiles, address management, order history
- Route protection and role-based access control

### 🎛️ Admin Dashboard
- KPI widgets — revenue, orders, customers, low-stock alerts
- Full product CRUD with image upload
- Order management and status workflows
- Inventory tracking with change history
- Review moderation queue

### 🔮 Coming Soon

| Feature | Description |
|---------|-------------|
| **Premium Setup Wizard** | Guided onboarding flow — configure branding, payment gateways, and shipping rules in under 5 minutes |
| **Universal JSONB Product Variants** | Store any product shape without schema migrations — sizes, colors, subscriptions, digital goods |
| **One-Click Social Linking** | Auto-generate Open Graph images, meta tags, and social previews for every product and category |

### 📱 Progressive Web App
- Installable on mobile and desktop
- Offline-ready with service worker
- Native app-like experience
- Push notification infrastructure

### 🌐 Internationalization
- Multi-language support via i18next (en, es, fr)
- Per-currency formatting and timezone awareness
- Localized content with RTL layout support

### 🎨 Modern Design System
- Mobile-first responsive layout
- Tailwind CSS with custom design tokens
- Smooth transitions and skeleton loading states
- Dark mode support

### 📧 Transactional Email
- Order confirmations and shipping updates
- Password reset and welcome emails
- Nodemailer-powered, template-ready

### 🔒 Security First
- HTTPS enforcement
- Environment variable isolation
- Parameterized SQL — injection-proof
- CSRF protection, XSS hardening
- Stripe webhook signature verification
- bcrypt password hashing

### ⚡ Performance at Scale
- Server-side rendering and static generation
- Next.js Image optimization
- Code splitting and lazy loading
- Edge caching ready

### 📊 SEO Out of the Box
- Dynamic meta tags and Open Graph
- JSON-LD structured data
- Auto-generated sitemap and robots.txt
- Canonical URLs

---

## 🚀 Quick Start

Go from clone to running store in minutes.

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Stripe account (for payments)
- Git

### Installation

```bash
# 1. Clone the template
git clone https://github.com/BBO513/universal-e-commerce-store.git
cd universal-e-commerce-store

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your configuration

# 4. Set up the database
createdb universal_store
psql -d universal_store -f schema.sql

# 5. Seed sample data (optional)
psql -d universal_store -f seed-database.sql

# 6. Start development server
npm run dev

# 7. Open http://localhost:3000
```

**That's it.** Your store is running locally.

---

## 📚 Documentation

| Guide | Covers |
|-------|--------|
| [Setup Guide](docs/BUYER_SETUP_GUIDE.md) | Installation, env vars, database, troubleshooting |
| [Customization Guide](docs/CUSTOMIZATION_GUIDE.md) | Branding, themes, custom pages, PWA icons |
| [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) | Vercel, Railway, custom domains, SSL, checklist |
| [Stripe Setup Guide](docs/STRIPE_SETUP_GUIDE.md) | API keys, webhooks, test cards, going live |
| [FAQ](docs/FAQ.md) | Common issues, performance, database tuning |
| [Developer Guide](docs/developer_guide.md) | Architecture, extending the codebase |
| [Admin Guide](docs/admin_guide.md) | Dashboard, product management, orders |

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** — React framework with App Router
- **React 18** — UI library
- **TypeScript** — Type safety
- **Tailwind CSS** — Utility-first styling
- **React Icons** — Icon library

### Backend
- **Next.js API Routes** — Serverless functions
- **PostgreSQL** — Relational database
- **NextAuth.js** — Authentication
- **Nodemailer** — Email delivery

### Payments & Services
- **Stripe** — Payment Intents, Checkout, Webhooks

### Tooling
- **Playwright** — End-to-end testing
- **ESLint** — Code quality
- **Concurrently** — Multi-process development

---

## 📁 Project Structure

```
universal-e-commerce-store/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Homepage
│   ├── products/            # Product detail pages
│   ├── search/              # Search interface
│   └── about/               # About page
├── components/              # Reusable React components
│   ├── ProductCard.tsx
│   ├── Filters.tsx
│   ├── Cart.tsx
│   ├── CheckoutForm.tsx
│   └── admin/               # Admin panel components
├── lib/                     # Core utilities
│   ├── db.ts               # Database queries (pg pool)
│   ├── auth.ts             # NextAuth configuration
│   ├── email.ts            # Nodemailer helpers
│   └── utils.ts            # Shared utilities
├── pages/                   # Pages Router (API routes)
│   ├── api/
│   │   ├── checkout/       # Stripe endpoints
│   │   ├── products/       # Product CRUD
│   │   ├── admin/          # Admin endpoints
│   │   └── auth/           # Authentication
│   ├── product/
│   ├── category/
│   └── account/
├── context/                 # React contexts
│   ├── CartContext.tsx
│   ├── CheckoutContext.tsx
│   └── CurrencyContext.tsx
├── config/                  # Store configuration
├── public/                  # Static assets, PWA manifest
├── scripts/                 # Database generation scripts
├── migrations/              # SQL migration files
├── docs/                    # Documentation
├── styles/                  # Global CSS
├── tests/                   # Playwright e2e tests
├── .env.local.example       # Environment template
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🌟 Use Cases

One template, infinite verticals:

- 👕 **Fashion & apparel** — size variants, lookbooks
- 💻 **Electronics** — spec sheets, compatibility filters
- 🏋️ **Fitness & wellness** — subscription products, bundles
- 🏠 **Home goods** — room-by-room collections
- 📦 **Dropshipping** — supplier catalog sync
- 🎨 **Digital products** — license keys, file downloads

Simply add your products, apply your brand, and deploy.

---

## 🎯 What's Included

- Full source code — no locked modules
- PostgreSQL schema and migrations
- Seed data for instant preview
- Stripe integration (test mode ready)
- Admin dashboard and analytics
- Email notification system
- PWA manifest and service worker
- SEO metadata and structured data
- Responsive, production-tested components

---

## 🚀 Deployment

### Recommended: Vercel
Zero-config Next.js deployment with automatic HTTPS, global CDN, and serverless functions.

### Also Compatible
Railway, Netlify, AWS Amplify, DigitalOcean App Platform, Heroku, or any VPS.

**See [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) for walkthroughs.**

---

## 📝 Environment Variables

```env
# Authentication
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:pass@host:5432/universal_store

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@email.com
EMAIL_PASS=your_password
EMAIL_FROM=noreply@yourstore.com
```

---

## 🔒 Security

- HTTPS enforced
- Stripe webhook signature verification
- Parameterized PostgreSQL queries
- bcrypt password hashing
- CSRF and XSS protection
- Environment variable isolation

---

## 📜 License

This template is provided for commercial and personal use.

**Allowed:** use for unlimited projects, modify, customize, use for client work, sell sites built with this template.

**Not allowed:** resell or redistribute as-is, claim as your own creation, share with non-purchasers.

---

## 📊 System Requirements

| | Minimum | Recommended |
|---|---------|-------------|
| Node.js | 18+ | 20+ |
| RAM | 2 GB | 4 GB+ |
| PostgreSQL | 14+ | 15+ |
| Storage | HDD | SSD |

---

## 🚀 Performance Baseline

- **Lighthouse Score:** 90+
- **First Contentful Paint:** <1.5s
- **Time to Interactive:** <4s

---

**Ship your store. Own your stack. Build anything.**

---

**Version:** 2.0.0 — Universal  
**Last Updated:** July 2026  
**Template Type:** Universal E-Commerce — Next.js SaaS Template
