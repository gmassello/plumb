import { test, expect } from '@playwright/test';

test('a visitor books the last slot of the day @quarantine', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('name').fill('Carla');
  await page.getByTestId('slot-s3').getByRole('button', { name: 'Select' }).click();
  await page.getByTestId('confirm-book').click();
  await expect(page.getByTestId('booking-status')).toHaveText(/Booking (pending|confirmed)/);
});
