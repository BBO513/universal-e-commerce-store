# Configuration Guide

This guide details the various configuration aspects of the e-commerce platform, including environment variables, external services, and PWA specifics.

## Environment Variables

Environment variables are crucial for configuring the application for different environments (development, production). They should be set securely and not committed to version control.

| Variable Name         | Description                                                                  | Example Value                                  |
| :-------------------- | :--------------------------------------------------------------------------- | :--------------------------------------------- |
| `DATABASE_URL`        | Connection string for your PostgreSQL database.                              | `postgresql://user:pass@host:port/database`    |
| `NEXTAUTH_SECRET`     | A random string used by NextAuth.js to hash tokens, sign/encrypt cookies.    | `openssl rand -base64 32` output                 |
| `NEXTAUTH_URL`        | The canonical URL of your application (e.g., for Vercel deployment).         | `http://localhost:3000` or `https://yourdomain.com` |
| `STRIPE_SECRET_KEY`   | Your Stripe secret key (test or live).                                       | `sk_test_...` or `sk_live_...`               |
| `STRIPE_WEBHOOK_SECRET`| The secret for verifying Stripe webhook events.                             | `whsec_...`                                    |
| `CLOUDINARY_API_KEY`  | Your Cloudinary API Key for image uploads. (If used)                        | `1234567890`                                   |
| `CLOUDINARY_API_SECRET`| Your Cloudinary API Secret for image uploads. (If used)                     | `abcdefgHIJKLMNO`                              |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`| Your Stripe publishable key (used in frontend).          | `pk_test_...` or `pk_live_...`               |

**Local Development:**
Create a `.env.local` file in the root of your project and add these variables.

**Vercel Deployment:**
Configure these variables in your Vercel project settings under "Environment Variables".

## External Services Setup

### Stripe

Stripe is used for payment processing.

1.  **Account Setup:** Create a Stripe account at [stripe.com](https://stripe.com/).
2.  **API Keys:** Obtain your publishable (`pk_...`) and secret (`sk_...`) API keys from your Stripe Dashboard (Developers -> API keys).
3.  **Webhooks:** Configure a webhook endpoint in your Stripe Dashboard (Developers -> Webhooks).
    *   Endpoint URL: `https://yourdomain.com/api/checkout/webhook` (replace `yourdomain.com` with your actual domain).
    *   Events to send: Select `checkout.session.completed`, `payment_intent.succeeded` (and any others you need to handle).
    *   Generate a webhook secret for this endpoint and save it as `STRIPE_WEBHOOK_SECRET`.

### Cloudinary (If Used for Image Storage)

Cloudinary is used for cloud-based image management.

1.  **Account Setup:** Create a Cloudinary account at [cloudinary.com](https://cloudinary.com/).
2.  **API Credentials:** From your Cloudinary Dashboard, note down your Cloud Name, API Key, and API Secret.
3.  **Environment Variables:** Set `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` as environment variables.

## PWA Specifics

The application is configured as a Progressive Web App (PWA) to provide an enhanced user experience, including offline capabilities and installability.

-   **`public/manifest.json`**:
    This file defines the PWA's metadata, such as its name, icons, start URL, display mode, and theme colors. Customize this file to match your application's branding.
    *   `name`, `short_name`: Displayed on splash screen and home screen.
    *   `icons`: Array of icon objects for various sizes.
    *   `start_url`: The URL that is loaded when the PWA is launched.
    *   `display`: `standalone` for app-like experience.
    *   `background_color`, `theme_color`: Used for splash screen and browser UI.

-   **`public/sw.js`**:
    This is the service worker file, responsible for caching assets, enabling offline functionality, and handling push notifications. This project typically uses `next-pwa` or a similar tool to generate and manage this file.
    *   Ensure proper caching strategies for different asset types (e.g., `stale-while-revalidate` for static assets, `network-first` for API calls).
    *   Test offline functionality by going offline in browser developer tools and navigating your app.

-   **`next.config.js`**:
    PWA configuration might also be present in `next.config.js` if `next-pwa` is used, enabling service worker registration and other PWA features during the build process.
