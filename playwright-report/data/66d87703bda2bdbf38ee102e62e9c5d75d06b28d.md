# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: universal-store-flow.spec.js >> wizard, sell, and homepage share one localStorage store flow
- Location: tests\universal-store-flow.spec.js:3:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/launch your store/i)
Expected: visible
Error: strict mode violation: getByText(/launch your store/i) resolved to 2 elements:
    1) <h2 class="mb-4 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">Launch your store</h2> aka getByRole('heading', { name: 'Launch your store' })
    2) <a href="/setup-wizard" class="mt-6 inline-flex min-h-[56px] items-center justify-center rounded-full px-8 py-3 text-sm font-semibold tracking-wide text-white">Launch Your Store</a> aka getByRole('link', { name: 'Launch Your Store' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/launch your store/i)

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - navigation [ref=e3]:
      - generic [ref=e5]:
        - link "My Store" [ref=e6] [cursor=pointer]:
          - /url: /
        - generic [ref=e7]:
          - link "Home" [ref=e8] [cursor=pointer]:
            - /url: /
          - link "Categories" [ref=e9] [cursor=pointer]:
            - /url: /categories
          - link "Search" [ref=e10] [cursor=pointer]:
            - /url: /search
          - link "Account" [ref=e11] [cursor=pointer]:
            - /url: /login
          - link "Cart" [ref=e12] [cursor=pointer]:
            - /url: /cart
            - img [ref=e13]
            - generic [ref=e15]: Cart
    - main [ref=e16]:
      - generic [ref=e17]:
        - generic [ref=e21]:
          - paragraph [ref=e22]: Store
          - heading "My Store" [level=1] [ref=e23]
          - paragraph [ref=e24]: Discover unique products from our community.
        - generic [ref=e26]:
          - heading "Launch your store" [level=2] [ref=e27]
          - paragraph [ref=e28]: Set your store name and branding first, then start adding products.
          - link "Launch Your Store" [ref=e29] [cursor=pointer]:
            - /url: /setup-wizard
  - alert [ref=e30]
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test('wizard, sell, and homepage share one localStorage store flow', async ({ page }) => {
  4  |   await page.goto('/');
  5  |   await page.evaluate(() => localStorage.clear());
  6  |   await page.reload();
  7  | 
> 8  |   await expect(page.getByText(/launch your store/i)).toBeVisible();
     |                                                      ^ Error: expect(locator).toBeVisible() failed
  9  | 
  10 |   await page.goto('/setup-wizard');
  11 |   const storeNameInput = page.locator('input[placeholder*="Nova Threads"], input[type="text"]').first();
  12 |   await storeNameInput.fill('Northwind Motors');
  13 |   await storeNameInput.press('Enter');
  14 | 
  15 |   await page.getByRole('button', { name: /next/i }).first().click();
  16 |   await page.getByRole('button', { name: /next/i }).first().click();
  17 |   await page.getByRole('button', { name: /finish setup/i }).click();
  18 | 
  19 |   await expect(page).toHaveURL(/\/$/);
  20 | 
  21 |   const storeData = await page.evaluate(() => JSON.parse(localStorage.getItem('universal_store_data') || '{}'));
  22 |   expect(storeData.settings?.storeName).toBe('Northwind Motors');
  23 | 
  24 |   await page.goto('/sell');
  25 |   const photoInput = page.locator('input[type="file"]');
  26 |   await photoInput.setInputFiles({
  27 |     name: 'photo.png',
  28 |     mimeType: 'image/png',
  29 |     buffer: Buffer.from('fake-image-data'),
  30 |   });
  31 | 
  32 |   const titleInput = page.locator('input[placeholder="What are you selling?"]');
  33 |   await titleInput.fill('Vintage Headlamp');
  34 |   await titleInput.press('Enter');
  35 | 
  36 |   const priceInput = page.locator('input[placeholder="0"]');
  37 |   await priceInput.fill('129');
  38 |   await priceInput.press('Enter');
  39 | 
  40 |   await expect(page).toHaveURL(/\/$/);
  41 | 
  42 |   const updatedStoreData = await page.evaluate(() => JSON.parse(localStorage.getItem('universal_store_data') || '{}'));
  43 |   expect(updatedStoreData.products?.length).toBeGreaterThan(0);
  44 | 
  45 |   await page.goto('/');
  46 |   await expect(page.getByText('Vintage Headlamp')).toBeVisible();
  47 |   await expect(page.getByText('$129')).toBeVisible();
  48 | });
  49 | 
```