// vite.config.ts
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

const preset = process.env.NITRO_PRESET || "vercel";
const buildSourcemap = process.env.BUILD_SOURCEMAP === "true";
const CLIENT_SENSITIVE_ENV_PATTERN = /^VITE_.*(KEY|SECRET|TOKEN|PASSWORD)/i;

function preventSensitiveClientEnvLeak() {
  return {
    name: "prevent-sensitive-client-env-leak",
    configResolved() {
      const leakedClientSecrets = Object.keys(process.env).filter((envName) =>
        CLIENT_SENSITIVE_ENV_PATTERN.test(envName)
      );

      if (leakedClientSecrets.length === 0) {
        return;
      }

      throw new Error(
        `Sensitive env vars cannot use VITE_ prefix: ${leakedClientSecrets.join(", ")}`
      );
    },
  };
}

export default defineConfig({
  optimizeDeps: {
    exclude: ["@prisma/client", "prisma"],
  },
  resolve: {
    alias: {
      lodash: "lodash-es",
    },
  },
  ssr: {
    external: ["@prisma/client", "prisma"],
    noExternal: ["lodash", "lodash-es", "recharts"],
    target: "node",
  },
  server: {
    port: 3000,
  },
  build: {
    sourcemap: buildSourcemap,
    minify: "esbuild",
  },
  plugins: [
    preventSensitiveClientEnvLeak(),
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart(),
    nitro({ preset }),
    viteReact(),
  ],
  nitro: {},
});
