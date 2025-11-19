# Testing Checklist

Use this checklist to track your testing progress. Mark items with [x] when completed.

## Environment Setup
- [ ] Created .env.local file
- [ ] Generated NEXTAUTH_SECRET
- [ ] Configured DATABASE_URL
- [ ] Added Stripe test keys
- [ ] Configured email settings
- [ ] (Optional) Added Cloudinary keys

## Database Setup
- [ ] PostgreSQL installed and running
- [ ] Database created
- [ ] Schema applied successfully
- [ ] All tables created (verified with \dt)

## Application Startup
- [ ] Dependencies installed (npm install)
- [ ] Development server starts without errors
- [ ] Application accessible at http://localhost:3000
- [ ] No console errors on homepage

## Frontend Testing

### Home Page
- [ ] Page loads correctly
- [ ] Featured products display
- [ ] Navigation works
- [ ] Search bar functional
- [ ] Mobile menu works

### Category Pages
- [ ] Categories load with products
- [ ] Filters work (price, condition, brand)
- [ ] Sorting functions
- [ ] Pagination works
- [ ] Vehicle selector filters

### Product Pages
- [ ] Product details display
- [ ] Images load and gallery works
- [ ] Add to cart works
- [ ] Add to wishlist works
- [ ] Reviews display
- [ ] Related products show

### Search
- [ ] Search returns results
- [ ] Filters apply
- [ ] Empty state shows
- [ ] Suggestions work

## Cart & Checkout

### Cart
- [ ] Items display correctly
- [ ] Quantity updates work
- [ ] Remove item works
- [ ] Total calculates correctly
- [ ] Proceed to checkout works

### Checkout Flow
- [ ] Address selection/creation works
- [ ] Shipping options display
- [ ] Order review shows all details
- [ ] Payment page loads Stripe Elements
- [ ] Test payment succeeds (4242 4242 4242 4242)
- [ ] Success page displays
- [ ] Order saved to database

## User Account

### Authentication
- [ ] Registration works
- [ ] Login works
- [ ] Logout works
- [ ] Session persists

### Account Pages
- [ ] Profile displays
- [ ] Order history shows
- [ ] Order details accurate
- [ ] Wishlist displays
- [ ] Settings update works

## Admin Panel

### Access
- [ ] Admin login works
- [ ] Admin routes protected
- [ ] Non-admin users blocked

### Dashboard
- [ ] Statistics display
- [ ] Recent orders show
- [ ] Low stock alerts work
- [ ] Charts render

### Products Management
- [ ] Product list displays
- [ ] Search/filter works
- [ ] Create product works
- [ ] Edit product works
- [ ] Delete product works
- [ ] Image upload works

### Orders Management
- [ ] Orders list displays
- [ ] Filter by status works
- [ ] View order details
- [ ] Update status works

### Inventory
- [ ] Stock levels display
- [ ] Adjust inventory works
- [ ] History logs correctly

### Users Management
- [ ] User list displays
- [ ] Search works
- [ ] Ban/unban works
- [ ] Role change works

### Reviews Management
- [ ] Pending reviews show
- [ ] Approve works
- [ ] Delete works

## PWA Testing

### Installation
- [ ] Install prompt appears
- [ ] App installs successfully
- [ ] Icon appears on home screen
- [ ] Opens in standalone mode

### Offline
- [ ] Service worker registers
- [ ] Offline page displays
- [ ] Previously viewed pages cache
- [ ] Status indicator works

### Mobile
- [ ] Touch interactions smooth
- [ ] Responsive design works
- [ ] Navigation thumb-friendly
- [ ] Forms mobile-optimized

## Email Testing
- [ ] Order confirmation sends
- [ ] Email contains order details
- [ ] Email formatting correct
- [ ] Links work

## Stripe Configuration

### Test Mode
- [ ] Test API keys configured
- [ ] Webhook setup (local)
- [ ] Test payment succeeds
- [ ] Webhook receives events
- [ ] Order status updates

### Production (When Ready)
- [ ] Live keys configured
- [ ] Production webhook setup
- [ ] Webhook endpoint verified
- [ ] Test live payment

## Performance

### Lighthouse Audit
- [ ] Performance > 90
- [ ] Accessibility > 95
- [ ] Best Practices > 90
- [ ] SEO > 90
- [ ] PWA checks pass

### Optimization
- [ ] Images optimized
- [ ] Code splitting works
- [ ] Lazy loading implemented
- [ ] Database queries optimized
- [ ] API caching configured

## Security
- [ ] NEXTAUTH_SECRET is strong
- [ ] Database credentials secure
- [ ] API keys not exposed
- [ ] CORS configured
- [ ] SQL injection prevented
- [ ] XSS prevention in place
- [ ] CSRF protection enabled
- [ ] Admin routes protected
- [ ] Input validated
- [ ] Passwords hashed

## Deployment (Vercel)

### Pre-Deployment
- [ ] next.config.js updated (image domains)
- [ ] All tests passing
- [ ] No console errors
- [ ] Build succeeds locally

### Deployment
- [ ] Vercel project created
- [ ] Repository connected
- [ ] Environment variables set
- [ ] Production database configured
- [ ] Initial deployment successful

### Post-Deployment
- [ ] Application loads at production URL
- [ ] All pages accessible
- [ ] Database connection works
- [ ] Stripe payments work
- [ ] Emails send
- [ ] Images load
- [ ] PWA installs

## Final Checks
- [ ] All critical bugs fixed
- [ ] Documentation complete
- [ ] Admin user created
- [ ] Test data seeded
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] Analytics setup
- [ ] Legal pages added (privacy, terms)

---

## Notes

Use this section to track issues, bugs, or observations during testing:

```
Date: ___________
Issue: 
Status: 
Resolution:

---

Date: ___________
Issue: 
Status: 
Resolution:
```
