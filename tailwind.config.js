/* eslint-disable */
const {
  default: flattenColorPalette
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  theme: {
    extend: {
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
