import { defineConfig } from '@playwright/test'

// End-to-end tests (e2e/*.e2e.js) run against the production build served
// with vercel.json's headers, so they catch Content-Security-Policy problems
// too. Run `npm run build` first. Each project is one way students use the app.
const PORT = 4174

export default defineConfig({
  testDir: 'e2e',
  testMatch: '**/*.e2e.js',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  timeout: 120_000,
  use: {
    baseURL: `http://localhost:${PORT}`,
    // Locally, use the installed Chrome; CI installs Playwright's Chromium.
    channel: process.env.CI ? undefined : 'chrome',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop-en',
      use: { viewport: { width: 1280, height: 900 }, language: 'en' },
    },
    {
      name: 'phone-es',
      use: { viewport: { width: 375, height: 900 }, language: 'es' },
    },
    {
      name: 'small-en-reduced-motion',
      use: {
        viewport: { width: 320, height: 900 },
        language: 'en',
        reducedMotion: 'reduce',
      },
    },
  ],
  webServer: {
    command: `node scripts/serve-preview.mjs ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
})
