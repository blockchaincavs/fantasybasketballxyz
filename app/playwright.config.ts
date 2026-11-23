import { defineConfig } from '@playwright/test';

/**
 * Smoke test of the built app. Every Appwrite call is mocked in the spec (page.route), so the
 * endpoint below is never contacted. Run: npm run -s e2e:app
 */
const PORT = 3100;

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  workers: 1,
  use: { baseURL: `http://localhost:${PORT}` },
  webServer: {
    command: `npm run -s build && npx next start -p ${PORT}`,
    cwd: __dirname,
    url: `http://localhost:${PORT}`,
    timeout: 180_000,
    reuseExistingServer: false,
    stdout: 'ignore',
    stderr: 'pipe',
    env: {
      NEXT_TELEMETRY_DISABLED: '1',
      NEXT_PUBLIC_APPWRITE_ENDPOINT: 'https://appwrite.mock.invalid/v1',
      NEXT_PUBLIC_APPWRITE_PROJECT_ID: 'fbx-dev',
      NEXT_PUBLIC_APPWRITE_DATABASE_ID: 'fbx_dev',
      NEXT_PUBLIC_SITE_URL: `http://localhost:${PORT}`,
    },
  },
});
