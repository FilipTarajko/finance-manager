import { test, expect } from '@playwright/test';

test('E2E test', async ({ page }) => {
  await page.goto('/transactions');

  // Transactions - create
  await expect(page.getByRole('heading', { name: "Transactions" })).toBeVisible();
  await page.getByLabel('Name').click();
  await page.getByLabel('Name').fill('testname');
  await page.getByLabel('Amount').click();
  await page.getByLabel('Amount').fill('345.67');
  await page.getByRole('combobox').locator('div').filter({ hasText: 'Category' }).locator('div').click();
  await page.getByRole('option', { name: 'Eating out' }).click();
  await page.getByRole('button', { name: 'add' }).click();
  await expect(page.getByText('testname: 345.67')).toBeVisible();

  // Transactions - delete
  await page.getByText('testname: 345.67').getByRole('button').nth(1).click();
  await expect(page.getByText('testname: 345.67')).toBeHidden();

  // Category - create
  await page.getByRole('link', { name: 'Categories' }).click();
  await page.getByLabel('Name').click();
  await page.getByLabel('Name').fill('qwertyuiop');
  await page.locator('.v-slider-track__background').click();
  await page.getByLabel('select icon: gift').click();
  await page.getByRole('button', { name: 'add' }).click();
  await expect(page.getByText('qwertyuiop')).toBeVisible();
});