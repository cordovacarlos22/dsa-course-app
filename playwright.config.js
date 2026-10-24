import { defineConfig } from '@playwright/test'

// End-to-end tests (e2e/*.e2e.js) run against the production build served
// with vercel.json's headers, so they catch Content-Security-Policy problems
// too. Run `npm run build` first. Each project is one way students use the app.
const PORT = 4174
// Locally, the Chromium projects use the installed Chrome; CI installs
// Playwright's Chromium. The WebKit project needs Playwright's WebKit
// (`npx playwright install webkit`).
const chrome = process.env.CI ? {} : { channel: 'chrome' }
// E2E_BASE_URL tests an app that's already running (the Docker `preview`
// container, later staging) instead of starting the local preview server.
const runningApp = process.env.E2E_BASE_URL

export default defineConfig({
  testDir: 'e2e',
  testMatch: '**/*.e2e.js',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  timeout: 120_000,
  use: {
    baseURL: runningApp ?? `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop-en',
      use: {
        ...chrome,
        viewport: { width: 1280, height: 900 },
        language: 'en',
      },
    },
    {
      name: 'phone-es',
      use: { ...chrome, viewport: { width: 375, height: 900 }, language: 'es' },
    },
    {
      name: 'small-en-reduced-motion',
      use: {
        ...chrome,
        viewport: { width: 320, height: 900 },
        language: 'en',
        reducedMotion: 'reduce',
      },
    },
    {
      // Safari's engine: every browser on an iPhone runs on it.
      name: 'phone-es-webkit',
      use: {
        browserName: 'webkit',
        viewport: { width: 375, height: 900 },
        language: 'es',
      },
    },
  ],
  webServer: runningApp
    ? undefined
    : {
        command: `node scripts/serve-preview.mjs ${PORT}`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
      },
})
