// @ts-expect-error module has no type declarations
const nextPlugin = require("@next/eslint-plugin-next");

const rules = {
  ...nextPlugin.configs.recommended.rules,
  ...nextPlugin.configs["core-web-vitals"].rules,
};

module.exports = {
  plugins: {
    "@next/next": nextPlugin, // Register the plugin with an alias
  },
  parserOptions: {
    project: "./tsconfig.json", // Adjust if your tsconfig is elsewhere
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json", // Repeat this if you have more complex setup
      },
      node: {
        extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  rules,
  ignorePatterns: ["node_modules/", "dist/"], // Keeping your ignore patterns
};
