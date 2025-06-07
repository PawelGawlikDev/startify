import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  testMatch: [/.*\.spec\.(ts)/],
  timeout: 10 * 1000,
  snapshotDir: "./__snapshots__",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["github"], ["list"]] : "html",
  use: {
    trace: "retain-on-first-failure",
    screenshot: "on-first-failure"
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
