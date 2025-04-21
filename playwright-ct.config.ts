import path from "path";
import { defineConfig, devices } from "@playwright/experimental-ct-react";

export default defineConfig({
  testDir: "./tests/components",
  snapshotDir: "./__snapshots__",
  timeout: 10 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 1,
  reporter: process.env.CI ? [["github"], ["list"]] : "html",

  use: {
    trace: "on-first-retry",
    ctViteConfig: {
      resolve: {
        alias: {
          "@/context": path.resolve(__dirname, "src/context"),
          "@/utils": path.resolve(__dirname, "src/utils"),
          "@/components": path.resolve(__dirname, "src/components"),
          "@/indexdb": path.resolve(__dirname, "src/indexdb"),
          "@/types": path.resolve(__dirname, "src/types.d.ts"),
          "@/constants": path.resolve(__dirname, "src/constants"),
          "@/config": path.resolve(__dirname, "src/config.ts")
        }
      }
    },
    ctPort: 3100
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] }
    }
  ]
});
