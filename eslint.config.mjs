import { defineConfig } from "eslint/config";
import expoConfig from "eslint-config-expo/flat.js";

export default defineConfig([
  expoConfig,

  {
    ignores: ["dist/"],

    rules: {
      // JSX text like "you're", "don't", etc.
      "react/no-unescaped-entities": "off",

      // Still useful, but shouldn't block builds
      "react-hooks/exhaustive-deps": "warn",

      // Optional sanity for TS-heavy apps
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);
