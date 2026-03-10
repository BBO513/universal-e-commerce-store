
# 🎨 Customization Guide

This guide will help you customize the E-Commerce Automotive Store template to match your brand and business needs.

## 📋 Table of Contents

1. [Branding Customization](#branding-customization)
2. [Color Scheme & Theme](#color-scheme--theme)
3. [Logo & Favicon](#logo--favicon)
4. [Domain Configuration](#domain-configuration)
5. [PWA Icons & Manifest](#pwa-icons--manifest)
6. [Product Categories](#product-categories)
7. [Email Templates](#email-templates)
8. [Homepage Customization](#homepage-customization)
9. [Adding Custom Pages](#adding-custom-pages)
10. [SEO Customization](#seo-customization)

---

## Branding Customization

### Store Name

**Location:** Multiple files need updating

1. **Site Title** (`pages/_app.tsx` or `app/layout.tsx`):
   ```tsx
   export const metadata = {
     title: 'Your Store Name - Automotive Parts',
     description: 'Your store description here',
   }
   ```

2. **Package.json**:
   ```json
   {
     "name": "your-store-name",
     "description": "Your store description"
   }
   ```

3. **PWA Manifest** (`public/manifest.json`):
   ```json
   {
     "name": "Your Store Name",
     "short_name": "YourStore",
     "description": "Your store description"
   }
   ```

### Business Information

Update your business details in multiple locations:

**Footer Component** (`components/Footer.tsx`):
```tsx
<div className="footer-info">
  <h3>Your Store Name</h3>
  <p>Your business address</p>
  <p>Phone: Your phone number</p>
  <p>Email: your@email.com</p>
</div>
```

**About Page** (`pages/about.tsx` or `app/about/page.tsx`):
- Update company history
- Add your team information
- Include your story

---

## Color Scheme & Theme

### Primary Colors

**Tailwind Configuration** (`tailwind.config.js`):

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Main primary color
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Secondary/accent colors
        secondary: {
          500: '#f59e0b', // Main accent color
        },
        // Add your custom colors
        brand: {
          blue: '#1a56db',
          orange: '#ff6b35',
          dark: '#1e293b',
        }
      },
    },
  },
}
```

### Global Styles

**CSS Variables** (`styles/globals.css`):

```css
:root {
  /* Primary colors */
  --color-primary: #0ea5e9;
  --color-primary-dark: #0284c7;
  --color-primary-light: #38bdf8;
  
  /* Secondary colors */
  --color-secondary: #f59e0b;
  --color-accent: #ff6b35;
  
  /* Neutral colors */
  --color-text: #1e293b;
  --color-text-light: #64748b;
  --color-background: #ffffff;
  --color-border: #e2e8f0;
  
  /* Success/Error states */
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
}

/* Dark mode (optional) */
.dark {
  --color-background: #0f172a;
  --color-text: #f1f5f9;
}
```

### Typography

**Font Configuration** (`styles/globals.css` or `app/layout.tsx`):

```css
/* Import custom fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
}
```

**Or use Next.js Font Optimization:**

```tsx
// app/layout.tsx
import { Inter, Roboto } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const roboto = Roboto({ 
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'] 
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

---

## Logo & Favicon

### Logo Replacement

1. **Prepare your logo files:**
   - Main logo: `logo.svg` or `logo.png` (recommended: SVG for scalability)
   - Logo dark mode: `logo-dark.svg` or `logo-dark.png` (if using dark mode)
   - Dimensions: Recommended width 180-250px, height 40-60px

2. **Add logo files to:**
   ```
   public/images/logo.svg
   public/images/logo-dark.svg
   ```

3. **Update Header component** (`components/Header.tsx` or `components/Navbar.tsx`):
   ```tsx
   import Image from 'next/image'
   
   <div className="logo">
     <Image 
       src="/images/logo.svg" 
       alt="Your Store Name"
       width={200}
       height={50}
       priority
     />
   </div>
   ```

### Favicon

1. **Generate favicon files:**
   - Use https://realfavicongenerator.net/
   - Upload your logo/icon
   - Download the generated package

2. **Replace files in `public/` directory:**
   ```
   public/
   ├── favicon.ico
   ├── favicon-16x16.png
   ├── favicon-32x32.png
   ├── apple-touch-icon.png
   └── android-chrome-192x192.png
   ```

3. **Update HTML head** (`pages/_document.tsx` or `app/layout.tsx`):
   ```tsx
   <Head>
     <link rel="icon" href="/favicon.ico" />
     <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
     <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
     <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
   </Head>
   ```

---

## Domain Configuration

Replace all placeholder domains throughout the template:

### 1. Environment Variables (`.env.local`)

```env
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

### 2. Email Templates

Search for `yourdomain.com` and replace in:
- `lib/email.ts` or email template files
- Email footer links
- Terms & Conditions links

```tsx
// Example in lib/email.ts
const emailTemplate = `
  <a href="https://yourdomain.com">Visit our store</a>
  <a href="https://yourdomain.com/terms">Terms & Conditions</a>
`
```

### 3. SEO & Metadata

Update in:
- `next-seo.config.js` (if using next-seo)
- `app/layout.tsx` metadata
- `public/sitemap.xml`
- `public/robots.txt`

```tsx
// app/layout.tsx
export const metadata = {
  metadataBase: new URL('https://yourdomain.com'),
  // ... other metadata
}
```

### 4. Search & Replace

Use your code editor to find and replace all instances:

```bash
# Using command line (Unix/Linux/Mac)
find . -type f -name "*.tsx" -o -name "*.ts" -o -name "*.js" | xargs sed -i '' 's/yourdomain\.com/youractualdom ain.com/g'

# Or use VS Code:
# Cmd/Ctrl + Shift + F → Find: yourdomain.com → Replace with: youractualdomain.com
```

---

## PWA Icons & Manifest

### Generate PWA Icons

1. **Create a master icon:**
   - Minimum size: 512x512px
   - Format: PNG with transparency
   - Design: Simple, recognizable icon

2. **Use PWA Asset Generator:**
   ```bash
   npm install -g pwa-asset-generator
   
   pwa-asset-generator public/images/logo-512.png public/icons \
     --icon-only \
     --favicon \
     --type png
   ```

3. **Or use online tool:**
   - https://www.pwabuilder.com/imageGenerator
   - Upload your icon
   - Download generated package

### Update Manifest

**Edit `public/manifest.json`:**

```json
{
  "name": "Your Store Name - Automotive Parts",
  "short_name": "YourStore",
  "description": "Premium automotive parts and accessories",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0ea5e9",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

---

## Product Categories

### Update Categories in Database

**SQL Script** (`scripts/update-categories.sql`):

```sql
-- Clear existing categories
TRUNCATE TABLE categories CASCADE;

-- Insert your custom categories
INSERT INTO categories (name, slug, description, image_url, parent_id) VALUES
  ('Engine Parts', 'engine-parts', 'Quality engine components', '/images/categories/engine.jpg', NULL),
  ('Brakes', 'brakes', 'Brake pads, rotors, and systems', '/images/categories/brakes.jpg', NULL),
  ('Suspension', 'suspension', 'Shocks, struts, and suspension kits', '/images/categories/suspension.jpg', NULL),
  ('Electrical', 'electrical', 'Batteries, alternators, and electrical parts', '/images/categories/electrical.jpg', NULL),
  ('Filters', 'filters', 'Oil, air, and fuel filters', '/images/categories/filters.jpg', NULL);

-- Add sub-categories (example)
INSERT INTO categories (name, slug, description, parent_id) VALUES
  ('Oil Filters', 'oil-filters', 'Engine oil filters', (SELECT id FROM categories WHERE slug = 'filters')),
  ('Air Filters', 'air-filters', 'Air intake filters', (SELECT id FROM categories WHERE slug = 'filters'));
```

### Update Category Navigation

**Navigation Component** (`components/CategoryNav.tsx`):

```tsx
const categories = [
  { name: 'Engine Parts', slug: 'engine-parts', icon: '🔧' },
  { name: 'Brakes', slug: 'brakes', icon: '🛑' },
  { name: 'Suspension', slug: 'suspension', icon: '🚗' },
  { name: 'Electrical', slug: 'electrical', icon: '⚡' },
  { name: 'Filters', slug: 'filters', icon: '🔍' },
]
```

---

## Email Templates

### Order Confirmation Email

**Location:** `lib/email.ts` or `lib/emailTemplates/orderConfirmation.ts`

```tsx
export function generateOrderConfirmationEmail(order, customer) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        /* Your brand styles */
        .email-container {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
        }
        .header {
          background-color: #0ea5e9; /* Your brand color */
          padding: 20px;
          text-align: center;
        }
        .logo {
          max-width: 200px;
        }
        /* Add more styles */
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <img src="https://i.ytimg.com/vi/p5iiQWkVdac/maxresdefault.jpg" alt="Your Store" class="logo" />
          <h1 style="color: white;">Order Confirmation</h1>
        </div>
        
        <div class="content">
          <h2>Thank you for your order, ${customer.name}!</h2>
          <p>Order number: <strong>#${order.id}</strong></p>
          
          <!-- Order details -->
          <div class="order-items">
            ${order.items.map(item => `
              <div class="item">
                <p>${item.name} × ${item.quantity}</p>
                <p>$${item.price}</p>
              </div>
            `).join('')}
          </div>
          
          <div class="total">
            <h3>Total: $${order.total}</h3>
          </div>
          
          <a href="https://yourdomain.com/orders/${order.id}" class="button">
            View Order Details
          </a>
        </div>
        
        <div class="footer">
          <p>© 2024 Your Store Name. All rights reserved.</p>
          <p>
            <a href="https://yourdomain.com/contact">Contact Us</a> | 
            <a href="https://yourdomain.com/terms">Terms</a> | 
            <a href="https://yourdomain.com/privacy">Privacy</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}
```

### Shipping Confirmation Email

Create similar templates for:
- Order shipped notification
- Order delivered confirmation
- Password reset
- Welcome email

---

## Homepage Customization

### Hero Section

**Location:** `components/Hero.tsx` or `app/page.tsx`

```tsx
export default function Hero() {
  return (
    <section className="hero" style={{backgroundImage: 'url(/images/hero-bg.jpg)'}}>
      <div className="hero-content">
        <h1>Your Custom Headline</h1>
        <p>Your custom subheadline or value proposition</p>
        <button className="cta-button">
          Shop Now
        </button>
      </div>
    </section>
  )
}
```

### Featured Products

Update featured product selection:

```tsx
// pages/index.tsx or app/page.tsx
const featuredProductIds = [1, 5, 12, 18] // Your featured product IDs

const featuredProducts = await db.query(
  'SELECT * FROM products WHERE id = ANY($1)',
  [featuredProductIds]
)
```

### Promotional Banners

Add custom banners:

```tsx
<div className="promo-banner" style={{backgroundColor: '#ff6b35'}}>
  <p>🎉 Free Shipping on orders over $100! Use code: FREESHIP</p>
</div>
```

---

## Adding Custom Pages

### Create a New Page

**Example: Warranty Information Page**

1. **Create page file** (`pages/warranty.tsx` or `app/warranty/page.tsx`):

   ```tsx
   export default function WarrantyPage() {
     return (
       <div className="container">
         <h1>Warranty Information</h1>
         
         <section>
           <h2>Product Warranty</h2>
           <p>All our products come with a comprehensive warranty...</p>
         </section>
         
         <section>
           <h2>Warranty Coverage</h2>
           <ul>
             <li>12-month parts warranty</li>
             <li>Lifetime technical support</li>
             <li>Free replacement for defective items</li>
           </ul>
         </section>
         
         <section>
           <h2>How to Claim</h2>
           <p>To file a warranty claim, please contact our support team...</p>
         </section>
       </div>
     )
   }
   
   export const metadata = {
     title: 'Warranty Information | Your Store Name',
     description: 'Learn about our product warranty and coverage',
   }
   ```

2. **Add to navigation** (`components/Footer.tsx` or `Header.tsx`):

   ```tsx
   <Link href="/warranty">Warranty Information</Link>
   ```

### Custom Legal Pages

Create these important pages:

- **Terms & Conditions** (`pages/terms.tsx`)
- **Privacy Policy** (`pages/privacy.tsx`)
- **Return Policy** (`pages/returns.tsx`)
- **Shipping Information** (`pages/shipping.tsx`)

---

## SEO Customization

### Global SEO Settings

**Create `lib/seo.config.ts`:**

```typescript
export const seoConfig = {
  title: 'Your Store Name - Premium Automotive Parts',
  description: 'Shop high-quality automotive parts and accessories. Fast shipping, competitive prices, and expert support.',
  canonical: 'https://yourdomain.com',
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://yourdomain.com',
    site_name: 'Your Store Name',
    images: [
      {
        url: 'https://kaydee.net/blog/wp-content/uploads/2020/06/open-graph-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Your Store Name',
      },
    ],
  },
  twitter: {
    handle: '@yourhandle',
    site: '@yourhandle',
    cardType: 'summary_large_image',
  },
}
```

### Product Page SEO

```tsx
// app/products/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug)
  
  return {
    title: `${product.name} | Your Store Name`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image_url],
      type: 'product',
      price: {
        amount: product.price,
        currency: 'AUD',
      },
    },
  }
}
```

### Structured Data

Add JSON-LD structured data for better SEO:

```tsx
<script type="application/ld+json">
  {JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.image_url,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "Your Brand"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "AUD",
      "availability": "https://schema.org/InStock"
    }
  })}
</script>
```

---

## Additional Customizations

### Currency

Update currency display throughout:

```tsx
// lib/utils.ts
export function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD', // Change to your currency
  }).format(amount)
}
```

### Timezone

```tsx
// lib/date.ts
export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Sydney', // Your timezone
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}
```

---

## Testing Your Customizations

After making customizations:

1. ✅ Test all pages load correctly
2. ✅ Verify responsive design on mobile
3. ✅ Check all links work
4. ✅ Test checkout flow end-to-end
5. ✅ Verify emails display correctly
6. ✅ Check SEO metadata in browser DevTools
7. ✅ Test PWA installation
8. ✅ Validate color contrast for accessibility

---

**Need help?** Check the [FAQ.md](./FAQ.md) or [developer_guide.md](./developer_guide.md)

**Last Updated:** November 2024
