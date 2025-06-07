import pluginJs from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import playwright from "eslint-plugin-playwright";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintPluginUnicorn from "eslint-plugin-unicorn";

export default [
  {
    ignores: [
      ".wxt/",
      ".output/",
      "node_modules/",
      "pnpm-lock.yaml",
      "CHANGELOG.md",
      "coverage/",
      "playwright-report/",
      "playwright/.cache",
      "chrome"
    ]
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    languageOptions: {
      globals: globals.browser
    },
    plugins: {
      unicorn: eslintPluginUnicorn
    },
    rules: {
      "no-console": "error",
      "react/react-in-jsx-scope": "off"
    },
    settings: {
      react: { version: "detect" }
    }
  },
  {
    files: ["**/*.test.ts"],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules
    }
  },
  {
    ...playwright.configs["flat/recommended"],
    files: ["tests/**/*.ts", "tests/**/*.tsx"],
    rules: {
      ...playwright.configs["flat/recommended"].rules
    }
  }
];
