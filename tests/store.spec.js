const { test, expect } = require('@playwright/test');

test('store loads and can add a product to cart', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/AutoStore|Automotive|Store/i);

  // Ensure the homepage loads and the product grid exists
  const productCard = page.locator('a[href*="/product/"] .group');
  await expect(productCard.first()).toBeVisible({ timeout: 10000 });

  // Click the first available Add to Cart button or go to product details
  const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
  if (await addToCartButton.count() > 0) {
    await addToCartButton.click();
  } else {
    await page.locator('a[href*="/product/"]').first().click();
    await expect(page).toHaveURL(/\/product\//);
    await page.locator('button:has-text("Add to Cart")').first().click();
  }

  // Validate cart update by checking for cart badge or cart item count
  const cartBadge = page.locator('[href="/cart"] .rounded-full, [href="/cart"] span');
  await expect(cartBadge.first()).toBeVisible({ timeout: 10000 });

  // Optionally navigate to cart and confirm item presence
  await page.goto('/cart');
  await expect(page).toHaveURL(/\/cart$/);
  await expect(page.locator('text=Your Shopping Cart')).toBeVisible();
  await expect(page.locator('text=Quantity').first()).toBeVisible();
});
