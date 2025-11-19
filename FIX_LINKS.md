# Link Component Fixes Required

## Files that need Link component fixes:

### Critical (Blocking homepage):
- [x] pages/index.tsx - FIXED
- [ ] pages/cart.tsx
- [ ] pages/unauthorized.tsx  
- [ ] pages/checkout/success.tsx

### Account Pages:
- [ ] pages/account/index.tsx
- [ ] pages/account/settings.tsx
- [ ] pages/account/orders/index.tsx
- [ ] pages/account/orders/[id].tsx

### Admin Pages:
- [ ] pages/admin/products/index.tsx
- [ ] pages/admin/orders/index.tsx

## Pattern to Replace:

```tsx
// OLD (Next.js 12 style):
<Link href="/path">
  <a className="styles">Text</a>
</Link>

// NEW (Next.js 13+ style):
<Link href="/path" className="styles">
  Text
</Link>
```

## Files Fixed:
- ✅ components/ProductCard.tsx
- ✅ components/Header.tsx
- ✅ components/Footer.tsx
- ✅ components/MobileNavBar.tsx
- ✅ components/admin/AdminSidebar.tsx
- ✅ pages/account/settings.tsx (partial)
- ✅ pages/index.tsx
