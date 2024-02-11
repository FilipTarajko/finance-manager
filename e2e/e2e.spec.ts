import { test, expect } from '@playwright/test';

test('E2E test', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: "Transactions" })).toBeVisible();
  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill('qwe');
  await page.getByRole('spinbutton').click();
  await page.getByRole('spinbutton').fill('345.57');
  await page.getByRole('combobox').selectOption('[object Object]');
  await page.getByRole('button', { name: 'add' }).click();
  await expect(page.getByText('qwe: 345.57')).toBeVisible();
});