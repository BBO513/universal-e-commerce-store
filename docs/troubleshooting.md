# Troubleshooting Guide

This guide provides solutions for common issues encountered during development and deployment.

## Common Build Errors

### "Module not found: Can't resolve '...' "

**Cause:** A required module or package is missing.
**Solution:**
1.  Ensure all dependencies are installed: `npm install` or `yarn install`.
2.  Check the import path in your code; it might be incorrect.
3.  Verify the package name in `package.json` and that it's correctly spelled.

### "TypeError: Cannot read properties of undefined (reading '...') "

**Cause:** Attempting to access a property of an `undefined` or `null` object.
**Solution:**
1.  Add null/undefined checks before accessing properties (e.g., `myObject?.property`).
2.  Ensure data is properly fetched and available before rendering components that rely on it.
3.  Check API responses for unexpected `null` or `undefined` values.

### ESLint/TypeScript Errors

**Cause:** Code does not conform to linting rules or TypeScript type definitions.
**Solution:**
1.  Read the error message carefully; it usually points to the exact line and rule violated.
2.  Fix the code to comply with the rules.
3.  Run `npm run lint` or `yarn lint` to identify and fix issues before building.
4.  For TypeScript errors, ensure types are correctly defined and used.

## Stripe Webhook Issues

### Webhook Not Receiving Events

**Cause:**
1.  Incorrect webhook URL configured in Stripe.
2.  Firewall blocking incoming requests to your server.
3.  Webhook secret mismatch.
4.  Stripe event not enabled for the webhook.
**Solution:**
1.  Verify the webhook URL in your Stripe Dashboard matches your deployed application's webhook endpoint (e.g., `https://your-domain.com/api/checkout/webhook`).
2.  Ensure your server is publicly accessible and not blocked by a firewall.
3.  Double-check that the `STRIPE_WEBHOOK_SECRET` environment variable matches the secret provided by Stripe for that webhook.
4.  In the Stripe Dashboard, ensure the specific events you need (e.g., `checkout.session.completed`) are selected for your webhook endpoint.

### Webhook Signature Verification Failed

**Cause:** The webhook payload was tampered with, or the `STRIPE_WEBHOOK_SECRET` is incorrect.
**Solution:**
1.  Ensure `STRIPE_WEBHOOK_SECRET` environment variable is exactly as provided by Stripe.
2.  Verify that the raw request body is being used for signature verification, not a parsed JSON body.

## Database Connection Errors

### "Connection refused" or "Authentication failed"

**Cause:**
1.  Incorrect database credentials (username, password, host, port).
2.  Database server not running or not accessible.
3.  Firewall blocking database port.
**Solution:**
1.  Verify your `DATABASE_URL` environment variable has the correct credentials and connection details.
2.  Ensure your PostgreSQL (or other database) server is running and accessible from where your application is deployed (e.g., Vercel).
3.  Check any cloud provider security groups or local firewalls that might be blocking the database port (default 5432 for PostgreSQL).

### "Table '...' does not exist"

**Cause:** Database schema is not up-to-date with the application's requirements.
**Solution:**
1.  Run database migrations to apply the latest schema changes.
2.  Verify that the `schema.sql` file has been correctly applied to your database.

## PWA Caching Mismatch

### Old Content or Assets Loading After Update

**Cause:** The Progressive Web App (PWA) service worker is serving cached old content.
**Solution:**
1.  **Hard Refresh:** Advise users to perform a hard refresh (Ctrl+Shift+R or Cmd+Shift+R) or clear their browser cache.
2.  **Service Worker Update:** Ensure your service worker (e.g., `public/sw.js`) is configured to update and activate new versions automatically. Next.js with `next-pwa` typically handles this, but check its configuration.
3.  **Version Bumping:** For critical updates, consider bumping the version in your `manifest.json` or service worker to force an update.

## 404/500 Debugging Steps

### 404 Not Found

**Cause:**
1.  Incorrect URL path.
2.  Page or API route file missing or incorrectly named.
3.  Dynamic routes (`[id].tsx`) not catching the correct parameters.
**Solution:**
1.  Double-check the URL in the browser.
2.  Verify the existence and correct naming of the page or API route file (e.g., `pages/product/[id].tsx`).
3.  For dynamic routes, ensure the parameter is being passed correctly and the `getServerSideProps` or `getStaticProps` logic handles it.

### 500 Internal Server Error

**Cause:** An unhandled error occurred on the server-side (e.g., in `getServerSideProps`, API routes).
**Solution:**
1.  **Check Server Logs:** The most important step. Access the server logs (e.g., Vercel deployment logs, local console) to find the exact error message and stack trace.
2.  **Isolate the Issue:** Comment out recent changes or parts of the code to pinpoint the source of the error.
3.  **Error Handling:** Implement robust error handling (`try...catch`) in API routes and `getServerSideProps` to catch and log errors gracefully.
4.  **Environment Variables:** Ensure all necessary environment variables are correctly set in the deployment environment.
