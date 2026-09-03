// vite.config.ts
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const preset = process.env.NITRO_PRESET || "vercel";
const buildSourcemap = process.env.BUILD_SOURCEMAP === "true";
const CLIENT_SENSITIVE_ENV_PATTERN = /^VITE_.*(KEY|SECRET|TOKEN|PASSWORD)/i;

function preventSensitiveClientEnvLeak() {
  return {
    configResolved() {
      const leakedClientSecrets = Object.keys(process.env).filter((envName) =>
        CLIENT_SENSITIVE_ENV_PATTERN.test(envName),
      );

      if (leakedClientSecrets.length === 0) {
        return;
      }

      throw new Error(
        `Sensitive env vars cannot use VITE_ prefix: ${leakedClientSecrets.join(", ")}`,
      );
    },
    name: "prevent-sensitive-client-env-leak",
  };
}

export default defineConfig({
  build: {
    minify: "esbuild",
    sourcemap: buildSourcemap,
  },
  nitro: {},
  optimizeDeps: {
    exclude: ["@prisma/client", "prisma"],
  },
  plugins: [
    preventSensitiveClientEnvLeak(),
    tailwindcss(),
    tanstackStart(),
    nitro({ preset }),
    viteReact(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 3000,
  },
  ssr: {
    external: ["@prisma/client", "prisma"],
    noExternal: ["recharts"],
    target: "node",
  },
});
