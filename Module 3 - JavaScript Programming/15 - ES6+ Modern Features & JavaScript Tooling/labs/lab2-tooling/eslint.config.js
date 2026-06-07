// Lab 2: ESLint 9 Flat Config
import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // TODO: Configure rules as specified in the lecture:
      // - no-unused-vars as "warn"
      // - eqeqeq as ["error", "always"]
      // - no-var as "error"
      // - prefer-const as "warn"
      // - no-console as "off"
    },
  },
];
