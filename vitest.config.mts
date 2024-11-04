import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "~utils": path.resolve(__dirname, "src/utils"),
      "~components": path.resolve(__dirname, "src/components"),
      "~indexdb": path.resolve(__dirname, "src/indexdb"),
      "~types": path.resolve(__dirname, "src/types.d.ts")
    }
  },
  test: {
    include: ["src/utils/tests/*.test.ts"],
    globals: true,
    coverage: {
      provider: "v8",
      include: ["src/utils/*.ts"]
    },
    maxConcurrency: 1,
    reporters: process.env.GITHUB_ACTIONS
      ? ["default", "github-actions"]
      : ["default"]
  }
});
