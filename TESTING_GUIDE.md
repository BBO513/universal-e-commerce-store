# E-Commerce Application Testing & Configuration Guide

## Quick Start Checklist

### 1. Environment Setup

#### Step 1.1: Create .env.local File
Copy `.env.local.example` to `.env.local` and fill in the values:

```bash
copy .env.local.example .env.local
```

#### Step 1.2: Required Environment Variables

**Critical Variables (Must Configure):**
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `DATABASE_URL` - Your PostgreSQL connection string
- `STRIPE_SECRET_KEY` - From Stripe Dashboard (test mode: sk_test_...)
- `STRIPE_WEBHOOK_SECRET` - From Stripe Webhook settings (whsec_...)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - From Stripe Dashboard (test mode: pk_test_...)

**Email Configuration:**
- `EMAIL_HOST` - SMTP server (e.g., smtp.gmail.com, smtp.sendgrid.net)
- `EMAIL_PORT` - Usually 587 for TLS
- `EMAIL_USER` - Your email username
- `EMAIL_PASS` - Your email password or app-specific password
- `EMAIL_FROM` - Sender email address

**Optional (for image uploads):**
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### 2. Database Setup

#### Step 2.1: Install PostgreSQL
Ensure PostgreSQL is installed and running on your system.

#### Step 2.2: Create Database
```bash
psql -U postgres
CREATE DATABASE auto_parts_store;
\q
```

#### Step 2.3: Run Schema
```bash
psql -U postgres -d auto_parts_store -f schema.sql
```

#### Step 2.4: Verify Tables
```bash
psql -U postgres -d auto_parts_store -c "\dt"
```

Expected tables:
- users, categories, products, cart_items, orders, order_items
- addresses, inventory_history, reviews, wishlists
- vehicles, product_vehicle_map

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

The application should start on `http://localhost:3000`

---

## Testing Procedures

### 3.1 Frontend Testing

#### Home Page (/)
- [ ] Page loads without errors
- [ ] Featured products display correctly
- [ ] Navigation menu works
- [ ] Search bar is functional
- [ ] Mobile menu toggles properly

#### Category Pages (/category/[slug])
- [ ] Categories load with correct products
- [ ] Filters work (price, condition, brand)
- [ ] Sorting works (price, name, newest)
- [ ] Pagination functions correctly
- [ ] Vehicle selector filters products

#### Product Detail Page (/product/[id])
- [ ] Product information displays correctly
- [ ] Images load and gallery works
- [ ] Add to cart button functions
- [ ] Add to wishlist works (when logged in)
- [ ] Reviews section displays
- [ ] Related products show

#### Search (/search)
- [ ] Search returns relevant results
- [ ] Filters apply correctly
- [ ] Empty state shows when no results
- [ ] Search suggestions work

### 3.2 Cart & Checkout Testing

#### Cart Page (/cart)
- [ ] Cart items display correctly
- [ ] Quantity updates work
- [ ] Remove item functions
- [ ] Total calculates correctly
- [ ] Proceed to checkout button works

#### Checkout Flow
**Address Selection (/checkout/address)**
- [ ] Existing addresses load
- [ ] Add new address works
- [ ] Address validation functions
- [ ] Continue to shipping works

**Shipping Selection (/checkout/shipping)**
- [ ] Shipping options display
- [ ] Selection updates total
- [ ] Continue to review works

**Order Review (/checkout/review)**
- [ ] All order details display correctly
- [ ] Edit links work
- [ ] Total is accurate
- [ ] Place order button functions

**Payment (/checkout/payment)**
- [ ] Stripe Elements load correctly
- [ ] Test card works: 4242 4242 4242 4242
- [ ] Payment processing shows loading state
- [ ] Success redirects to success page

**Success Page (/checkout/success)**
- [ ] Order confirmation displays
- [ ] Order number shows
- [ ] Email confirmation sent

### 3.3 User Account Testing

#### Registration (/register)
- [ ] Form validation works
- [ ] User can register successfully
- [ ] Duplicate email shows error
- [ ] Auto-login after registration

#### Login (/login)
- [ ] Login with valid credentials works
- [ ] Invalid credentials show error
- [ ] Redirect to intended page after login

#### Account Pages (/account/*)
- [ ] Profile information displays
- [ ] Order history shows past orders
- [ ] Order details are accurate
- [ ] Wishlist displays saved items
- [ ] Settings page allows updates

### 3.4 Admin Panel Testing

**Access:** Login with admin role user, navigate to `/admin`

#### Dashboard (/admin/dashboard)
- [ ] Statistics display correctly
- [ ] Recent orders show
- [ ] Low stock alerts work
- [ ] Charts render properly

#### Products Management (/admin/products)
- [ ] Product list displays
- [ ] Search/filter products works
- [ ] Create new product functions
- [ ] Edit product updates correctly
- [ ] Delete product works (with confirmation)
- [ ] Image upload works (if Cloudinary configured)
- [ ] Bulk actions function

#### Orders Management (/admin/orders)
- [ ] Orders list displays
- [ ] Filter by status works
- [ ] View order details
- [ ] Update order status
- [ ] Print/export order

#### Inventory Management (/admin/inventory)
- [ ] Stock levels display
- [ ] Adjust inventory works
- [ ] History logs correctly
- [ ] Low stock warnings show

#### Users Management (/admin/users)
- [ ] User list displays
- [ ] Search users works
- [ ] View user details
- [ ] Ban/unban user functions
- [ ] Change user role works

#### Reviews Management (/admin/reviews)
- [ ] Pending reviews show
- [ ] Approve review works
- [ ] Reject/delete review functions
- [ ] View review details

### 3.5 PWA Testing

#### Installation
- [ ] Install prompt appears (on supported browsers)
- [ ] App installs successfully
- [ ] App icon appears on home screen/desktop
- [ ] App opens in standalone mode

#### Offline Functionality
- [ ] Service worker registers
- [ ] Offline page displays when disconnected
- [ ] Previously viewed pages cache
- [ ] Online/offline status indicator works

#### Mobile Experience
- [ ] Touch interactions work smoothly
- [ ] Responsive design adapts to screen size
- [ ] Navigation is thumb-friendly
- [ ] Forms are mobile-optimized

### 3.6 Email Testing

#### Order Confirmation
- [ ] Email sends after successful order
- [ ] Email contains order details
- [ ] Email formatting is correct
- [ ] Links in email work

**Test Email Services:**
- Development: Use [Ethereal Email](https://ethereal.email/) for testing
- Production: Use SendGrid, Mailgun, or AWS SES

---

## Stripe Configuration

### Development (Test Mode)

#### Step 1: Get Test API Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy "Publishable key" (pk_test_...)
3. Copy "Secret key" (sk_test_...)
4. Add to `.env.local`

#### Step 2: Setup Webhook (Local Testing)
1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/checkout/webhook`
4. Copy webhook secret (whsec_...) to `.env.local`

#### Step 3: Test Cards
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002
- 3D Secure: 4000 0025 0000 3155

### Production (Live Mode)

#### Step 1: Switch to Live Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Toggle to "Live mode"
3. Copy live keys (pk_live_..., sk_live_...)
4. Update in Vercel environment variables

#### Step 2: Configure Production Webhook
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/checkout/webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy webhook secret
5. Update `STRIPE_WEBHOOK_SECRET` in Vercel

---

## Deployment to Vercel

### Step 1: Prepare for Deployment

#### Update next.config.js
Update image domains with your actual CDN:
```javascript
images: {
  domains: ['res.cloudinary.com', 'your-s3-bucket.s3.amazonaws.com'],
}
```

### Step 2: Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

### Step 3: Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

**Production Variables:**
- `NEXTAUTH_SECRET` (generate new one for production)
- `NEXTAUTH_URL` (https://your-domain.com)
- `DATABASE_URL` (production database)
- `STRIPE_SECRET_KEY` (live key)
- `STRIPE_WEBHOOK_SECRET` (production webhook)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (live key)
- Email configuration variables
- Cloudinary variables (if used)

### Step 4: Setup Production Database

**Option 1: Vercel Postgres**
1. Go to Vercel Dashboard → Storage → Create Database
2. Select Postgres
3. Copy connection string
4. Run schema using Vercel CLI or direct connection

**Option 2: Supabase**
1. Create project at [Supabase](https://supabase.com)
2. Go to Settings → Database
3. Copy connection string
4. Run schema in SQL Editor

**Option 3: Railway/Render**
Similar process - create database, get connection string, run schema

### Step 5: Verify Deployment

- [ ] Application loads at production URL
- [ ] All pages accessible
- [ ] Database connection works
- [ ] Stripe payments process
- [ ] Emails send correctly
- [ ] Images load (if using CDN)
- [ ] PWA installs from production

---

## Performance Optimization

### Lighthouse Audit
Run Lighthouse in Chrome DevTools:
```
Target Scores:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90
- PWA: All checks pass
```

### Optimization Checklist
- [ ] Images optimized (WebP format, proper sizing)
- [ ] Code splitting implemented
- [ ] Lazy loading for images
- [ ] Database queries optimized (indexes)
- [ ] API routes cached where appropriate
- [ ] Static pages pre-rendered
- [ ] CDN configured for assets

---

## Troubleshooting

### Common Issues

**Database Connection Fails**
- Verify DATABASE_URL format
- Check PostgreSQL is running
- Verify database exists
- Check firewall/network settings

**Stripe Webhook Not Working**
- Verify webhook secret is correct
- Check webhook endpoint is accessible
- Review Stripe Dashboard logs
- Ensure raw body parsing is enabled

**Email Not Sending**
- Verify SMTP credentials
- Check email service is not blocking
- Review email logs
- Test with Ethereal Email first

**Images Not Loading**
- Update next.config.js domains
- Verify Cloudinary/S3 credentials
- Check CORS settings
- Ensure images are publicly accessible

**Build Fails on Vercel**
- Check for TypeScript errors
- Verify all dependencies installed
- Review build logs
- Ensure environment variables set

---

## Security Checklist

- [ ] NEXTAUTH_SECRET is strong and unique
- [ ] Database credentials are secure
- [ ] API keys are not exposed in client code
- [ ] CORS is properly configured
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (input sanitization)
- [ ] CSRF protection enabled
- [ ] Rate limiting on API routes
- [ ] Admin routes protected
- [ ] User input validated
- [ ] Passwords hashed (bcrypt)
- [ ] HTTPS enforced in production

---

## Next Steps After Testing

1. **Seed Database** - Add initial categories, products, and test users
2. **Configure Analytics** - Add Google Analytics or similar
3. **Setup Monitoring** - Configure error tracking (Sentry)
4. **Backup Strategy** - Setup automated database backups
5. **Documentation** - Document custom features and workflows
6. **User Training** - Create admin user guide
7. **Marketing** - Setup SEO, social media integration
8. **Legal** - Add privacy policy, terms of service

---

## Support Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Vercel Documentation](https://vercel.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
