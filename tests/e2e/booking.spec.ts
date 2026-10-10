import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  await request.post('/_test/reset');
});

test('async confirmation', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('name').fill('Ana');
  await page.getByTestId('slot-s1').getByRole('button', { name: 'Select' }).click();
  await page.getByTestId('confirm-book').click();
  await page.waitForTimeout(600);
  expect(await page.getByTestId('booking-status').textContent()).toBe('Booking confirmed');
});
