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
      "bun.lock",
      "CHANGELOG.md",
      "coverage/",
      "playwright-report/",
      "playwright/.cache",
      "chrome",
      ".agents/"
    ]
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      react: pluginReact
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off"
    },
    settings: {
      react: { version: "19.2.4" }
    }
  },
  {
    languageOptions: {
      globals: globals.browser
    },
    plugins: {
      unicorn: eslintPluginUnicorn
    },
    rules: {
      "no-console": "error"
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
