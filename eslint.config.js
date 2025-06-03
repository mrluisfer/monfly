import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import("eslint").Linter.Config} */
export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    env: {
      browser: true,
      node: true,
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        typescript: { project: "./tsconfig.json" },
        node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
      },
    },
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      ".next/",
      "src/routeTree.gen.ts",
      "src/components/ui/**",
    ],
    plugins: [
      "@typescript-eslint",
      "react",
      "react-hooks",
      "unused-imports",
      "import",
      "tailwindcss",
      "prisma",
      "jsx-a11y",
      "prettier",
    ],
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended-type-checked",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:import/recommended",
      "plugin:import/typescript",
      "plugin:tailwindcss/recommended",
      "plugin:prisma/recommended",
      "plugin:jsx-a11y/recommended",
      "plugin:prettier/recommended",
    ],
  },
]);
