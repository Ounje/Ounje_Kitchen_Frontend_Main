import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettierConfig,
  {
    rules: {
      // Downgraded to warn — widespread pre-existing usage across service layer;
      // proper typing is tracked as a separate refactor.
      "@typescript-eslint/no-explicit-any": "warn",
      // Downgraded to warn — pre-existing setState-in-effect patterns that need
      // careful refactoring to avoid breaking component behaviour.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
