import { test, expect } from '@playwright/test';

test('E2E test', async ({ page }) => {
  await page.goto('/');

  // Transactions - create
  await expect(page.getByRole('heading', { name: "Transactions" })).toBeVisible();
  await page.getByLabel('Name').click();
  await page.getByLabel('Name').fill('testname');
  await page.getByLabel('Amount').click();
  await page.getByLabel('Amount').fill('345.67');
  await page.getByRole('combobox').locator('div').filter({ hasText: 'ItemItem' }).locator('div').click();
  await page.getByRole('option', { name: 'Eating out' }).click();
  await page.getByRole('button', { name: 'submit' }).click();
  await expect(page.getByText('testname')).toBeVisible();
  await expect(page.getByText('345.67')).toBeVisible();

  // Category - create
  await page.getByRole('link', { name: 'Categories' }).click();
  await page.getByLabel('Name').click();
  await page.getByLabel('Name').fill('qwertyuiop');
  await page.locator('.v-slider-track__background').click();
  await page.locator('button:nth-child(7)').first().click();
  await page.getByRole('button', { name: 'submit' }).click();
  await expect(page.getByText('qwertyuiop')).toBeVisible();
});