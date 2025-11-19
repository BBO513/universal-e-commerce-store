# Quick Start Guide

Get your e-commerce application running in 5 minutes!

## Prerequisites

- Node.js 16+ installed
- PostgreSQL installed and running
- Stripe account (free test mode)

## Step 1: Clone and Setup (2 minutes)

```bash
# Run setup script
.\setup.ps1

# Or manually:
copy .env.local.example .env.local
```

## Step 2: Configure Environment (2 minutes)

Edit `.env.local` and add:

```env
# Generate this: openssl rand -base64 32
NEXTAUTH_SECRET=your_generated_secret_here

# Your local database
DATABASE_URL=postgresql://postgres:password@localhost:5432/auto_parts_store

# Get from https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

# Get from Stripe CLI: stripe listen --forward-to localhost:3000/api/checkout/webhook
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here

# Email (use Ethereal for testing: https://ethereal.email/)
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your_ethereal_user
EMAIL_PASS=your_ethereal_pass
EMAIL_FROM=noreply@autoparts.com
```

## Step 3: Setup Database (1 minute)

```bash
# Create database
psql -U postgres -c "CREATE DATABASE auto_parts_store;"

# Apply schema
psql -U postgres -d auto_parts_store -f schema.sql

# (Optional) Add test data
psql -U postgres -d auto_parts_store -f seed-database.sql
```

## Step 4: Install and Run (30 seconds)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Step 5: Test It Out!

Open http://localhost:3000

### Quick Test Checklist:
- [ ] Homepage loads
- [ ] Can browse products
- [ ] Can add to cart
- [ ] Can register/login
- [ ] Can checkout with test card: 4242 4242 4242 4242

## Common Commands

```bash
# Development
npm run dev              # Start dev server

# Database
psql -U postgres -d auto_parts_store    # Connect to database
psql -U postgres -d auto_parts_store -c "\dt"  # List tables

# Stripe
stripe login             # Login to Stripe CLI
stripe listen --forward-to localhost:3000/api/checkout/webhook  # Forward webhooks

# Build
npm run build            # Build for production
npm start                # Start production server
```

## Troubleshooting

### "Cannot connect to database"
- Check PostgreSQL is running: `pg_ctl status`
- Verify DATABASE_URL in .env.local
- Test connection: `psql -U postgres`

### "Stripe webhook not working"
- Make sure Stripe CLI is running
- Check STRIPE_WEBHOOK_SECRET in .env.local
- Verify webhook forwarding URL

### "Email not sending"
- Use Ethereal Email for testing (free)
- Check EMAIL_* variables in .env.local
- View emails at https://ethereal.email/messages

### "Port 3000 already in use"
- Kill existing process: `netstat -ano | findstr :3000`
- Or use different port: `PORT=3001 npm run dev`

## Next Steps

1. **Read Full Documentation**: Open `TESTING_GUIDE.md`
2. **Follow Testing Checklist**: Open `TESTING_CHECKLIST.md`
3. **Learn Stripe Testing**: Open `STRIPE_TESTING.md`
4. **Create Admin User**: Register at `/register` then update role in database
5. **Add Products**: Login to admin panel at `/admin`

## Admin Access

To create an admin user:

```sql
-- Connect to database
psql -U postgres -d auto_parts_store

-- Update user role
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

Then login and access admin panel at: http://localhost:3000/admin

## Test Credentials

After running `seed-database.sql`:

```
Admin:
Email: admin@autoparts.com
Password: password123

Customer:
Email: customer@example.com
Password: password123
```

## Production Deployment

When ready to deploy:

1. Read `TESTING_GUIDE.md` - Deployment section
2. Setup Vercel account
3. Configure production database
4. Add environment variables to Vercel
5. Deploy: `vercel`

## Support

- Check `TESTING_GUIDE.md` for detailed instructions
- Review `docs/troubleshooting.md` for common issues
- Check `docs/developer_guide.md` for development info

---

**Ready to build something awesome! 🚀**
