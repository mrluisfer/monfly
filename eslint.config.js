import nextConfig from "eslint-config-next";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";
import pluginPrisma from "eslint-plugin-prisma";
import pluginUnusedImports from "eslint-plugin-unused-imports";

/** @type {import("eslint").Linter.Config[]} */
export default [
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
      prisma: pluginPrisma,
      "unused-imports": pluginUnusedImports,
    },
    rules: {
      ...prettierConfig.rules,
      "unused-imports/no-unused-imports": "warn",
      "@next/next/no-html-link-for-pages": "off",
      "react/react-in-jsx-scope": "off",
    },
    settings: {
      react: { version: "detect" },
    },
  },
];
