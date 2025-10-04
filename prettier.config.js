/** @type {import("prettier").Config} */
const prettierConfig = {
  plugins: [
    // "prettier-plugin-jsdoc",
    "prettier-plugin-tailwindcss",
  ],
  tailwindFunctions: ["cn"],
};

export default prettierConfig;
