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
  await expect(page.getByText('testname')).toBeVisible();
  await expect(page.getByText('345.67')).toBeVisible();

  // // Transactions - delete

  await page.locator('div:nth-child(10) > div > div:nth-child(5) > .mdi-delete').click();
  await expect(page.getByText('testname')).toBeHidden();
  await expect(page.getByText('345.67')).toBeHidden();


  // Category - create
  await page.getByRole('banner').getByRole('link', { name: 'Categories' }).click();
  await page.getByLabel('Name').click();
  await page.getByLabel('Name').fill('qwertyuiop');
  await page.locator('.v-slider-track__background').click();
  await page.getByLabel('select icon: gift').click();
  await page.getByRole('button', { name: 'add' }).click();
  await expect(page.getByText('qwertyuiop')).toBeVisible();
  // expect(await page.locator('li').filter({ hasText: 'qwertyuiop' }).innerHTML()).toContain('mdi-gift');

  // // Category - update


  await page.locator('div:nth-child(13) > div > div:nth-child(2) > .mdi-pencil').click();
  // await page.locator('li').filter({ hasText: 'qwertyuiop' }).getByLabel('edit category').click();
  await page.locator('#editedCategoryNameTextField').click();
  await page.locator('#editedCategoryNameTextField').fill('editedname');
  await page.getByRole('dialog').getByLabel('select icon: school').click();
  await page.getByRole('button', { name: 'update' }).click();
  await page.waitForTimeout(500)
  await expect(page.getByText('editedname')).toBeVisible();
  // expect(await page.locator('li').filter({ hasText: 'editedname' }).innerHTML()).toContain('mdi-school');

  // // Category - delete
  await page.locator('div:nth-child(13) > div > div:nth-child(2) > .mdi-delete').click();
  await expect(page.getByText('editedname')).toBeHidden();

  // await page.locator('li').filter({ hasText: 'editedname' }).getByLabel('delete category').click();
  // await expect(page.getByText('qwertyuiop')).toBeHidden();
});