import { test, expect, type Browser } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  await request.post('/_test/reset');
});

async function visitorBooks(browser: Browser, name: string) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('/');
  await page.getByTestId('name').fill(name);
  await page.getByTestId('slot-s2').getByRole('button', { name: 'Select' }).click();
  await page.getByTestId('confirm-book').click();
  const status = page.getByTestId('booking-status');
  await expect(status).toHaveText(/^(Booking (pending|confirmed)|Slot s2 is already booked)$/);
  const text = await status.textContent();
  await context.close();
  return text;
}

test('two visitors book the same slot at the same time', async ({ browser }) => {
  const results = await Promise.all([visitorBooks(browser, 'Ana'), visitorBooks(browser, 'Bruno')]);
  const won = results.filter((t) => t?.startsWith('Booking '));
  const lost = results.filter((t) => t === 'Slot s2 is already booked');
  expect({ won: won.length, lost: lost.length }).toEqual({ won: 1, lost: 1 });
});
