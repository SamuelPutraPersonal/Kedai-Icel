const { test, expect } = require('@playwright/test');

test.describe('Kedai Icel homepage', () => {
  test('renders title and core layout', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Kedai Icel/);
    await expect(page.locator('header.site')).toBeVisible();
    await expect(page.locator('.hero h1')).toHaveText('Catering Cita Rasa Khas Nusantara');
    await expect(page.locator('#menu-detail')).toBeVisible();
    await expect(page.locator('#kontak')).toBeVisible();
  });

  test('menu category filters show/hide the right dishes', async ({ page }) => {
    await page.goto('/');
    const nasiDish = page.locator('.menu-item[data-category="nasibox"]').first();
    const laukDish = page.locator('.menu-item[data-category="lauk"]').first();

    // "Semua" is active by default: every dish is visible
    await expect(nasiDish).toBeVisible();
    await expect(laukDish).toBeVisible();

    // Switch to "Nasi Box": only nasibox dishes remain
    await page.locator('.menu-filter[data-filter="nasibox"]').click();
    await expect(nasiDish).toBeVisible();
    await expect(laukDish).toBeHidden();

    // Switch to "Lauk Pauk": the reverse
    await page.locator('.menu-filter[data-filter="lauk"]').click();
    await expect(laukDish).toBeVisible();
    await expect(nasiDish).toBeHidden();

    // Back to "Semua": everything visible again
    await page.locator('.menu-filter[data-filter="semua"]').click();
    await expect(nasiDish).toBeVisible();
    await expect(laukDish).toBeVisible();
  });

  test('"+ Pilih Menu" opens the WhatsApp quote builder modal', async ({ page }) => {
    await page.goto('/');
    const modal = page.locator('#quote-modal');
    await expect(modal).toBeHidden();

    const firstSelectBtn = page.locator('.menu-select-btn').first();
    const dishName = await firstSelectBtn.getAttribute('data-dish');
    await firstSelectBtn.click();

    await expect(modal).toBeVisible();
    const checkbox = page.locator('.quote-dish-check[value="' + dishName + '"]');
    await expect(checkbox).toBeChecked();
  });
});
