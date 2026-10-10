import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  await request.post('/_test/reset');
});

test('booking from the confirmation modal', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('name').fill('Ana');
  await page.getByTestId('slot-s1').getByRole('button', { name: 'Select' }).click();
  await page.waitForTimeout(450);
  await page.getByTestId('confirm-book').click({ force: true });
  await expect(page.getByTestId('booking-status')).toHaveText(/Booking (pending|confirmed)/);
});
