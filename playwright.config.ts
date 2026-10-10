import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  workers: 1,
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: "sh -c 'PORT=8080 node src/server.js > server.log 2>&1'",
    url: 'http://localhost:8080/health',
    timeout: 30_000,
    reuseExistingServer: !process.env.CI,
  },
});
