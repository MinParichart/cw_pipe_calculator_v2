import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,          // รัน sequential เพราะ share state (auth session)
  retries: 1,
  workers: 1,
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],
  timeout: 30000,

  use: {
    baseURL: 'http://localhost:3002',   // Frontend v2 port
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // รัน dev server ก่อนเทส (ถ้าต้องการ)
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3002',
  //   reuseExistingServer: true,
  // },
})
