const { test, expect } = require('@playwright/test');

test('wizard, sell, and homepage share one localStorage store flow', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await expect(page.getByText(/launch your store/i)).toBeVisible();

  await page.goto('/setup-wizard');
  const storeNameInput = page.locator('input[placeholder*="Nova Threads"], input[type="text"]').first();
  await storeNameInput.fill('Northwind Motors');
  await storeNameInput.press('Enter');

  await page.getByRole('button', { name: /next/i }).first().click();
  await page.getByRole('button', { name: /next/i }).first().click();
  await page.getByRole('button', { name: /finish setup/i }).click();

  await expect(page).toHaveURL(/\/$/);

  const storeData = await page.evaluate(() => JSON.parse(localStorage.getItem('universal_store_data') || '{}'));
  expect(storeData.settings?.storeName).toBe('Northwind Motors');

  await page.goto('/sell');
  const photoInput = page.locator('input[type="file"]');
  await photoInput.setInputFiles({
    name: 'photo.png',
    mimeType: 'image/png',
    buffer: Buffer.from('fake-image-data'),
  });

  const titleInput = page.locator('input[placeholder="What are you selling?"]');
  await titleInput.fill('Vintage Headlamp');
  await titleInput.press('Enter');

  const priceInput = page.locator('input[placeholder="0"]');
  await priceInput.fill('129');
  await priceInput.press('Enter');

  await expect(page).toHaveURL(/\/$/);

  const updatedStoreData = await page.evaluate(() => JSON.parse(localStorage.getItem('universal_store_data') || '{}'));
  expect(updatedStoreData.products?.length).toBeGreaterThan(0);

  await page.goto('/');
  await expect(page.getByText('Vintage Headlamp')).toBeVisible();
  await expect(page.getByText('$129')).toBeVisible();
});
