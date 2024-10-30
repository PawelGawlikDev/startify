import pluginJs from "@eslint/js"
import nextPlugin from "@next/eslint-plugin-next"
import vitest from "@vitest/eslint-plugin"
import playwright from "eslint-plugin-playwright"
import pluginReact from "eslint-plugin-react"
import globals from "globals"
import tseslint from "typescript-eslint"

export default [
  {
    ignores: [
      ".next/",
      "build/",
      ".plasmo/",
      "node_modules/",
      "pnpm-lock.yaml",
      "storybook/",
      "coverage/",
      "playwright-report/"
    ]
  },
  { files: ["**/*.{ts,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "no-console": "error",
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "import", next: "*" },
        { blankLine: "any", prev: "import", next: "import" },
        { blankLine: "always", prev: "*", next: ["const", "let", "var"] },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        {
          blankLine: "any",
          prev: ["const", "let", "var"],
          next: ["const", "let", "var"]
        },
        {
          blankLine: "always",
          prev: "*",
          next: ["class", "if", "while", "switch", "try"]
        },
        {
          blankLine: "always",
          prev: ["class", "if", "while", "switch", "try"],
          next: "*"
        },
        { blankLine: "always", prev: "*", next: "return" }
      ]
    }
  },
  {
    plugins: {
      "@next/next": nextPlugin
    }
  },
  {
    settings: {
      react: {
        version: "detect"
      }
    }
  },
  {
    files: ["**/*.test.ts"],
    plugins: {
      vitest
    },
    rules: {
      ...vitest.configs.recommended.rules,
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "import", next: "*" },
        { blankLine: "any", prev: "import", next: "import" },
        { blankLine: "always", prev: "*", next: ["const", "let", "var"] },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        {
          blankLine: "any",
          prev: ["const", "let", "var"],
          next: ["const", "let", "var"]
        },
        {
          blankLine: "always",
          prev: "*",
          next: ["class", "if", "while", "switch", "try"]
        },
        {
          blankLine: "always",
          prev: ["class", "if", "while", "switch", "try"],
          next: "*"
        },
        { blankLine: "always", prev: "*", next: "return" }
      ]
    },
    ...vitest.configs.recommended
  },
  {
    ...playwright.configs["flat/recommended"],
    files: ["tests/**/*.ts"],
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "import", next: "*" },
        { blankLine: "any", prev: "import", next: "import" },
        { blankLine: "always", prev: "*", next: ["const", "let", "var"] },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        {
          blankLine: "any",
          prev: ["const", "let", "var"],
          next: ["const", "let", "var"]
        },
        {
          blankLine: "always",
          prev: "*",
          next: ["class", "if", "while", "switch", "try"]
        },
        {
          blankLine: "always",
          prev: ["class", "if", "while", "switch", "try"],
          next: "*"
        },
        { blankLine: "always", prev: "*", next: "return" }
      ]
    }
  }
]
