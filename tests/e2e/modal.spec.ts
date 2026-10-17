import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  await request.post('/_test/reset');
});

test('booking from the confirmation modal', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('name').fill('Ana');
  await page.getByTestId('slot-s3').getByRole('button', { name: 'Select' }).click();
  const confirm = page.getByTestId('confirm-book');
  await expect(confirm).toBeEnabled();
  await confirm.click();
  await expect(page.getByTestId('booking-status')).toHaveText(/Booking (pending|confirmed)/);
});
