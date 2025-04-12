/* eslint-disable */
const {
  default: flattenColorPalette
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  theme: {
    extend: {
      colors: {
        on: {
          primary: "rgb(var(--on-primary))",
          secondary: "rgb(var(--on-secondary))",
          tertiary: "rgb(var(--on-tertiary))",
          success: "rgb(var(--on-success))",
          warning: "rgb(var(--on-warning))",
          error: "rgb(var(--on-error))",
          surface: "rgb(var(--on-surface))"
        },
        primary: {
          50: "rgb(var(--color-primary-50))",
          100: "rgb(var(--color-primary-100))",
          200: "rgb(var(--color-primary-200))",
          300: "rgb(var(--color-primary-300))",
          400: "rgb(var(--color-primary-400))",
          500: "rgb(var(--color-primary-500))",
          600: "rgb(var(--color-primary-600))",
          700: "rgb(var(--color-primary-700))",
          800: "rgb(var(--color-primary-800))",
          900: "rgb(var(--color-primary-900))"
        },
        secondary: {
          50: "rgb(var(--color-secondary-50))",
          100: "rgb(var(--color-secondary-100))",
          200: "rgb(var(--color-secondary-200))",
          300: "rgb(var(--color-secondary-300))",
          400: "rgb(var(--color-secondary-400))",
          500: "rgb(var(--color-secondary-500))",
          600: "rgb(var(--color-secondary-600))",
          700: "rgb(var(--color-secondary-700))",
          800: "rgb(var(--color-secondary-800))",
          900: "rgb(var(--color-secondary-900))"
        },
        tertiary: {
          50: "rgb(var(--color-tertiary-50))",
          100: "rgb(var(--color-tertiary-100))",
          200: "rgb(var(--color-tertiary-200))",
          300: "rgb(var(--color-tertiary-300))",
          400: "rgb(var(--color-tertiary-400))",
          500: "rgb(var(--color-tertiary-500))",
          600: "rgb(var(--color-tertiary-600))",
          700: "rgb(var(--color-tertiary-700))",
          800: "rgb(var(--color-tertiary-800))",
          900: "rgb(var(--color-tertiary-900))"
        },
        success: {
          50: "rgb(var(--color-success-50))",
          100: "rgb(var(--color-success-100))",
          200: "rgb(var(--color-success-200))",
          300: "rgb(var(--color-success-300))",
          400: "rgb(var(--color-success-400))",
          500: "rgb(var(--color-success-500))",
          600: "rgb(var(--color-success-600))",
          700: "rgb(var(--color-success-700))",
          800: "rgb(var(--color-success-800))",
          900: "rgb(var(--color-success-900))"
        },
        warning: {
          50: "rgb(var(--color-warning-50))",
          100: "rgb(var(--color-warning-100))",
          200: "rgb(var(--color-warning-200))",
          300: "rgb(var(--color-warning-300))",
          400: "rgb(var(--color-warning-400))",
          500: "rgb(var(--color-warning-500))",
          600: "rgb(var(--color-warning-600))",
          700: "rgb(var(--color-warning-700))",
          800: "rgb(var(--color-warning-800))",
          900: "rgb(var(--color-warning-900))"
        },
        error: {
          50: "rgb(var(--color-error-50))",
          100: "rgb(var(--color-error-100))",
          200: "rgb(var(--color-error-200))",
          300: "rgb(var(--color-error-300))",
          400: "rgb(var(--color-error-400))",
          500: "rgb(var(--color-error-500))",
          600: "rgb(var(--color-error-600))",
          700: "rgb(var(--color-error-700))",
          800: "rgb(var(--color-error-800))",
          900: "rgb(var(--color-error-900))"
        },
        surface: {
          50: "rgb(var(--color-surface-50))",
          100: "rgb(var(--color-surface-100))",
          200: "rgb(var(--color-surface-200))",
          300: "rgb(var(--color-surface-300))",
          400: "rgb(var(--color-surface-400))",
          500: "rgb(var(--color-surface-500))",
          600: "rgb(var(--color-surface-600))",
          700: "rgb(var(--color-surface-700))",
          800: "rgb(var(--color-surface-800))",
          900: "rgb(var(--color-surface-900))"
        }
      },
      animation: {
        aurora: "aurora 60s linear infinite"
      },
      boxShadow: {
        input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`
      },
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%"
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%"
          }
        }
      }
    }
  },
  darkMode: "class",
  content: ["./src/**/*.tsx"],
  plugins: [addVariablesForColors]
};
/* eslint-enable */

function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars
  });
}
