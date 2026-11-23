/** Smoke test of the built app: the home page is server-rendered. Run: npm run -s e2e:app */
import { expect, test } from '@playwright/test';

test('home renders server-side', async ({ request }) => {
  const res = await request.get('/');
  expect(res.ok()).toBe(true);
  expect(await res.text()).toContain('<h1>Fantasy Basketball XYZ</h1>');
});
