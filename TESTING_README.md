# Testing Documentation Overview

Welcome! This directory contains comprehensive testing and configuration documentation for the E-Commerce Auto Parts application.

## 📁 Documentation Files

### Getting Started
- **[QUICK_START.md](QUICK_START.md)** - Get your app running in 5 minutes
- **[TESTING_SUMMARY.md](TESTING_SUMMARY.md)** - Overview of all testing resources

### Comprehensive Guides
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Complete testing procedures and deployment guide
- **[TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)** - Interactive checklist to track progress
- **[STRIPE_TESTING.md](STRIPE_TESTING.md)** - Stripe payment testing reference

### Setup Resources
- **[setup.ps1](setup.ps1)** - Automated setup script for Windows
- **[generate-secret.ps1](generate-secret.ps1)** - Generate NEXTAUTH_SECRET
- **[seed-database.sql](seed-database.sql)** - Test data for database

## 🚀 Quick Navigation

### I want to...

**Get started quickly**
→ Read [QUICK_START.md](QUICK_START.md)

**Understand the full testing process**
→ Read [TESTING_GUIDE.md](TESTING_GUIDE.md)

**Track my testing progress**
→ Use [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)

**Test Stripe payments**
→ Reference [STRIPE_TESTING.md](STRIPE_TESTING.md)

**Setup my environment**
→ Run `.\setup.ps1`

**Generate a secret key**
→ Run `.\generate-secret.ps1`

**Add test data to database**
→ Run `psql -U postgres -d auto_parts_store -f seed-database.sql`

## 🎯 Recommended Workflow

### First Time Setup
1. Run `.\setup.ps1` to create .env.local
2. Run `.\generate-secret.ps1` to generate NEXTAUTH_SECRET
3. Follow [QUICK_START.md](QUICK_START.md) steps 2-5
4. Verify application runs at http://localhost:3000

### Testing Phase
1. Open [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)
2. Follow [TESTING_GUIDE.md](TESTING_GUIDE.md) procedures
3. Mark items complete in checklist
4. Reference [STRIPE_TESTING.md](STRIPE_TESTING.md) for payment testing

### Deployment Phase
1. Complete all items in [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)
2. Follow deployment section in [TESTING_GUIDE.md](TESTING_GUIDE.md)
3. Configure production environment variables
4. Deploy to Vercel

## 📋 Testing Phases

### Phase 1: Environment Setup (15 min)
- Create .env.local
- Configure environment variables
- Setup database
- Install dependencies

### Phase 2: Basic Functionality (30 min)
- Test homepage and navigation
- Browse products and categories
- Test search and filters
- Add items to cart
- User registration and login

### Phase 3: Checkout Flow (20 min)
- Complete checkout process
- Test Stripe payments
- Verify order creation
- Check email notifications
- Test payment failures

### Phase 4: Admin Panel (30 min)
- Create admin user
- Test product management
- Test order processing
- Test inventory management
- Test user management

### Phase 5: PWA & Mobile (20 min)
- Test PWA installation
- Test offline functionality
- Verify mobile responsiveness
- Test touch interactions

### Phase 6: Performance & Security (15 min)
- Run Lighthouse audit
- Check security best practices
- Test error handling
- Verify data validation

## 🛠️ Helper Scripts

### setup.ps1
Automated setup script that:
- Creates .env.local from example
- Checks for Node.js and PostgreSQL
- Provides next steps guidance

**Usage:**
```powershell
.\setup.ps1
```

### generate-secret.ps1
Generates secure NEXTAUTH_SECRET:
- Uses OpenSSL if available
- Falls back to PowerShell crypto
- Can automatically update .env.local

**Usage:**
```powershell
.\generate-secret.ps1
```

### seed-database.sql
Populates database with test data:
- 3 test users (including admin)
- 6 categories with subcategories
- 16 products across categories
- 5 vehicle models
- Sample orders and reviews

**Usage:**
```bash
psql -U postgres -d auto_parts_store -f seed-database.sql
```

## 🔑 Key Configuration

### Required Environment Variables
```env
NEXTAUTH_SECRET=<generate with generate-secret.ps1>
DATABASE_URL=postgresql://user:pass@localhost:5432/auto_parts_store
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=<from ethereal.email>
EMAIL_PASS=<from ethereal.email>
EMAIL_FROM=noreply@autoparts.com
```

### Test Credentials (after seed-database.sql)
```
Admin:
Email: admin@autoparts.com
Password: password123

Customer:
Email: customer@example.com
Password: password123
```

### Stripe Test Cards
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

## 📊 Testing Checklist Summary

- [ ] Environment configured
- [ ] Database setup complete
- [ ] Application starts successfully
- [ ] Frontend pages load
- [ ] Search and filters work
- [ ] Cart functionality works
- [ ] User authentication works
- [ ] Checkout flow completes
- [ ] Stripe payments process
- [ ] Emails send correctly
- [ ] Admin panel accessible
- [ ] Admin CRUD operations work
- [ ] PWA installs
- [ ] Offline mode works
- [ ] Mobile responsive
- [ ] Performance optimized
- [ ] Security verified
- [ ] Ready for deployment

## 🐛 Troubleshooting

### Common Issues

**Application won't start**
- Check .env.local exists and is configured
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Run `npm install` to install dependencies

**Database connection fails**
- Verify PostgreSQL is running: `pg_ctl status`
- Check database exists: `psql -U postgres -l`
- Verify credentials in DATABASE_URL

**Stripe webhook not working**
- Ensure Stripe CLI is running
- Check webhook secret in .env.local
- Verify forwarding URL is correct

**Email not sending**
- Use Ethereal Email for testing
- Verify EMAIL_* variables
- Check SMTP credentials

For more troubleshooting, see [TESTING_GUIDE.md](TESTING_GUIDE.md) troubleshooting section.

## 📚 Additional Resources

### Application Documentation
- [README.md](README.md) - Main application README
- [docs/developer_guide.md](docs/developer_guide.md) - Developer documentation
- [docs/admin_guide.md](docs/admin_guide.md) - Admin user guide
- [docs/troubleshooting.md](docs/troubleshooting.md) - Troubleshooting guide

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Stripe Testing Docs](https://stripe.com/docs/testing)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [Vercel Deployment](https://vercel.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

## 🎯 Success Criteria

Your application is ready for production when:

✅ All pages load without errors
✅ Complete checkout flow works end-to-end
✅ Payments process successfully with Stripe
✅ Email notifications send correctly
✅ Admin panel is fully functional
✅ PWA installs and works offline
✅ Lighthouse scores are > 90
✅ No security vulnerabilities
✅ Mobile experience is smooth
✅ All items in TESTING_CHECKLIST.md are complete

## 💡 Tips for Success

1. **Start with QUICK_START.md** - Get running first, understand later
2. **Use the checklist** - Track progress systematically
3. **Test incrementally** - Don't wait until the end
4. **Use test data** - Run seed-database.sql for realistic testing
5. **Test failures** - Don't just test happy paths
6. **Check logs** - Review console and server logs regularly
7. **Test on real devices** - Mobile emulation isn't enough
8. **Document issues** - Keep notes in TESTING_CHECKLIST.md
9. **Ask for help** - Review troubleshooting guides
10. **Take breaks** - Testing is intensive work

## 🚀 Ready to Start?

1. Open [QUICK_START.md](QUICK_START.md)
2. Run `.\setup.ps1`
3. Follow the 5-step guide
4. Start testing!

Good luck! 🎉
