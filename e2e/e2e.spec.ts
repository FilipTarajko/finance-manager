import { test, expect } from '@playwright/test';

test('E2E test', async ({ page }) => {
  await page.goto('/');

  // Transactions - create
  await expect(page.getByRole('heading', { name: "Transactions" })).toBeVisible();
  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill('qwe');
  await page.getByRole('spinbutton').click();
  await page.getByRole('spinbutton').fill('345.57');
  await page.getByRole('combobox').selectOption('[object Object]');
  await page.getByRole('button', { name: 'add' }).click();
  await expect(page.getByText('qwe: 345.57')).toBeVisible();

  // Category - create
  await page.getByRole('link', { name: 'Categories' }).click();
  await page.locator('input[type="text"]').click();
  await page.locator('input[type="text"]').fill('qwerrtty');
  await page.locator('input[type="color"]').fill('#aa0909');
  await page.getByRole('button', { name: 'add' }).click();
  await expect(page.getByText('qwerrtty')).toBeVisible();
});