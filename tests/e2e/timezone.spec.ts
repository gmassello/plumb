import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  await request.post('/_test/reset');
});

test('late slot is listed with its local date and time', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('slot-s3')).toContainText('2026-11-03 01:30');
});
