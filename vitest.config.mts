import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@/constants": path.resolve(__dirname, "src/constants")
    }
  },
  test: {
    include: ["src/utils/tests/*.test.ts"],
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "v8",
      include: ["src/utils/*.ts"],
      exclude: ["src/utils/getMessage.ts"]
    },
    maxConcurrency: 1,
    reporters: process.env.GITHUB_ACTIONS
      ? ["default", "github-actions"]
      : ["default"]
  }
});
