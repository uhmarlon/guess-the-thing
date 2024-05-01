// First, require the Next.js ESLint plugin
const nextPlugin = require("@next/eslint-plugin-next");

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@next/next/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  ignorePatterns: [".eslintrc.js", "node_modules/"],
  plugins: ["react", "@next/next", "react-hooks", "@typescript-eslint"],
  rules: {
    ...nextPlugin.configs.recommended.rules, // Spread the recommended rules from the Next.js plugin
    ...nextPlugin.configs["core-web-vitals"].rules, // Spread the core-web-vitals rules from the Next.js plugin
    "max-statements-per-line": ["error", { max: 2 }],
    "react/react-in-jsx-scope": "off", // Next.js does not require React to be in scope
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
  },
  settings: {
    react: {
      version: "detect", // Automatically detect the React version
    },
  },
};
