import nextConfig from "eslint-config-next";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";
import pluginUnusedImports from "eslint-plugin-unused-imports";

/** @type {import("eslint").Linter.Config[]} */
const config = [
  {
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      ".next/",
      ".output/",
      ".vinxi/",
      ".vercel/",
      ".tanstack/",
      "coverage/",
      "src/routeTree.gen.ts",
      "src/components/ui/**",
    ],
  },
  ...nextConfig,
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    plugins: {
      "unused-imports": pluginUnusedImports,
    },
    rules: {
      ...prettierConfig.rules,
      "unused-imports/no-unused-imports": "warn",
      "@next/next/no-html-link-for-pages": "off",
      // Next.js-only rules: this is a TanStack Start app, so `next/image` and
      // `next/head` don't exist here. Disabled to avoid inapplicable warnings.
      "@next/next/no-img-element": "off",
      "@next/next/no-head-element": "off",
      "react/react-in-jsx-scope": "off",
    },
    settings: {
      react: { version: "detect" },
    },
  },
];

export default config;
