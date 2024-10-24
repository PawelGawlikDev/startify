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
      "padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          prev: "multiline-expression",
          next: "multiline-expression"
        }
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
        {
          blankLine: "always",
          prev: "multiline-expression",
          next: "multiline-expression"
        }
      ]
    },
    ...vitest.configs.recommended
  },
  {
    ...playwright.configs["flat/recommended"],
    files: ["tests/**"],
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      "padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          prev: "multiline-expression",
          next: "multiline-expression"
        }
      ]
    }
  }
]
