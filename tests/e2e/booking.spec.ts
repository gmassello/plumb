import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  await request.post('/_test/reset');
});

test('async confirmation @quarantine', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('name').fill('Ana');
  await page.getByTestId('slot-s1').getByRole('button', { name: 'Select' }).click();
  await page.getByRole('button', { name: 'Book', exact: true }).click();
  await expect(page.getByTestId('booking-status')).toHaveText('Booking confirmed');
});
