import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  await request.post('/_test/reset');
});

test('a visitor books the last slot of the day', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('name').fill('Carla');
  // After the reset, s3 holds the seeded sample booking; s2 is the last slot still free.
  await page.getByTestId('slot-s2').getByRole('button', { name: 'Select' }).click();
  await page.getByTestId('confirm-book').click();
  await expect(page.getByTestId('booking-status')).toHaveText(/Booking (pending|confirmed)/);
});
