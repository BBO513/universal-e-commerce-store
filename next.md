Continue Phase 7.

Task:
Prepare app for production deployment.

Requirements:

Vercel:
- Ensure next.config.js is optimized for production
- Set proper image domains for Next/Image
- Configure build settings
- Add environment variables:
  - DATABASE_URL
  - NEXTAUTH_SECRET
  - NEXTAUTH_URL
  - STRIPE_SECRET_KEY
  - STRIPE_WEBHOOK_SECRET
  - CLOUDINARY_API_KEY / SECRET (if used)

Database Migration:
- Run migrations on production database
- Ensure schema.sql matches deployed PostgreSQL instance

Stripe:
- Switch to live keys
- Verify webhook endpoint in Stripe dashboard

Deliverables:
- Deployment configuration complete.

STOP.
