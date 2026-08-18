import path from "path";
import { defineConfig } from "vitest/config";

const rootDir = import.meta.dirname;

export default defineConfig({
  resolve: {
    alias: {
      "@/constants": path.resolve(rootDir, "src/constants")
    }
  },
  test: {
    include: ["src/utils/tests/*.test.ts"],
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "v8",
      include: ["src/utils/*.ts"],
      exclude: ["src/utils/getMessage.ts", "src/utils/getRandomKey.ts"]
    },
    maxConcurrency: 1,
    reporters: process.env.GITHUB_ACTIONS
      ? ["default", "github-actions"]
      : ["default"]
  }
});
