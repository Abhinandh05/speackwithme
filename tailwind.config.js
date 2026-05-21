const colors = require("./theme/colors");
const typography = require("./theme/typography");
const borderRadius = require("./theme/borderRadius");
const spacing = require("./theme/spacing");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: colors,
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      borderRadius: borderRadius,
      spacing: spacing,
    },
  },
  plugins: [],
};
