import { defineConfig } from '@playwright/test'
import { env } from 'node:process'

const baseURL = env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 3,
  timeout: 60000,
  use: {
    baseURL,
    browserName: 'chromium',
    launchOptions: { executablePath: env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH },
    trace: 'retain-on-failure',
  },
  webServer: env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
    url: baseURL,
    timeout: 120000,
  },
})
